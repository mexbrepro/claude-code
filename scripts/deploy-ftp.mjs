#!/usr/bin/env node
// Deploy the standalone Next.js build to a remote host over FTP/FTPS.
//
// Prerequisites:
//   1. Build first:  npm run build   (next.config.ts uses output: "standalone")
//   2. Set the FTP_* variables (see .env.example). They can live in .env /
//      .env.local, or be exported in the shell / CI environment.
//
// Run:  npm run deploy:ftp
//
// What gets uploaded (the three pieces a standalone build needs at runtime):
//   .next/standalone/*  -> <remoteDir>/         (server.js, trimmed node_modules)
//   .next/static/*      -> <remoteDir>/.next/static
//   public/*            -> <remoteDir>/public
//
// On the host, start the app with:  node server.js   (listens on $PORT, default 3000)

import { Client } from "basic-ftp";
import { readFileSync, existsSync } from "node:fs";
import { join, resolve } from "node:path";

const ROOT = resolve(import.meta.dirname, "..");

// --- Minimal .env loader (no dependency). Real env vars always win. ---
function loadEnvFile(file) {
  const path = join(ROOT, file);
  if (!existsSync(path)) return;
  for (const raw of readFileSync(path, "utf8").split("\n")) {
    const line = raw.trim();
    if (!line || line.startsWith("#")) continue;
    const eq = line.indexOf("=");
    if (eq === -1) continue;
    const key = line.slice(0, eq).trim();
    if (process.env[key] !== undefined) continue;
    let val = line.slice(eq + 1).trim();
    if (
      (val.startsWith('"') && val.endsWith('"')) ||
      (val.startsWith("'") && val.endsWith("'"))
    ) {
      val = val.slice(1, -1);
    }
    process.env[key] = val;
  }
}
loadEnvFile(".env");
loadEnvFile(".env.local");

// --- Config ---
const {
  FTP_HOST,
  FTP_USER,
  FTP_PASSWORD,
  FTP_PORT = "21",
  // "true" (explicit FTPS / AUTH TLS, the default), "implicit", or "false".
  FTP_SECURE = "true",
  FTP_REMOTE_DIR = "/",
  FTP_VERBOSE = "false",
} = process.env;

const missing = ["FTP_HOST", "FTP_USER", "FTP_PASSWORD"].filter(
  (k) => !process.env[k],
);
if (missing.length) {
  console.error(`Missing required env var(s): ${missing.join(", ")}`);
  console.error("Set them in .env / .env.local or your CI environment. See .env.example.");
  process.exit(1);
}

function parseSecure(v) {
  if (v === "implicit") return "implicit";
  return v !== "false"; // default to secure FTPS unless explicitly disabled
}

const STANDALONE = join(ROOT, ".next", "standalone");
const STATIC = join(ROOT, ".next", "static");
const PUBLIC = join(ROOT, "public");

if (!existsSync(STANDALONE)) {
  console.error(
    "No standalone build found at .next/standalone.\n" +
      "Run `npm run build` first (next.config.ts must set output: \"standalone\").",
  );
  process.exit(1);
}

async function main() {
  const client = new Client(30_000);
  client.ftp.verbose = FTP_VERBOSE === "true";

  const secure = parseSecure(FTP_SECURE);
  try {
    console.log(
      `Connecting to ${FTP_HOST}:${FTP_PORT} (secure=${String(secure)}) as ${FTP_USER}...`,
    );
    await client.access({
      host: FTP_HOST,
      port: Number(FTP_PORT),
      user: FTP_USER,
      password: FTP_PASSWORD,
      secure,
      // Many hosts use certs that don't match the FTP hostname; allow the
      // connection but keep TLS encryption. Tighten if your host has a
      // matching certificate.
      secureOptions: { rejectUnauthorized: false },
    });

    await client.ensureDir(FTP_REMOTE_DIR);

    console.log(`Uploading standalone server -> ${FTP_REMOTE_DIR}`);
    await client.uploadFromDir(STANDALONE, FTP_REMOTE_DIR);

    if (existsSync(STATIC)) {
      const remoteStatic = posixJoin(FTP_REMOTE_DIR, ".next/static");
      console.log(`Uploading static assets -> ${remoteStatic}`);
      await client.uploadFromDir(STATIC, remoteStatic);
    }

    if (existsSync(PUBLIC)) {
      const remotePublic = posixJoin(FTP_REMOTE_DIR, "public");
      console.log(`Uploading public assets -> ${remotePublic}`);
      await client.uploadFromDir(PUBLIC, remotePublic);
    }

    console.log("\nDeploy complete. On the host, (re)start the app with: node server.js");
  } finally {
    client.close();
  }
}

function posixJoin(...parts) {
  return parts
    .join("/")
    .replace(/\/+/g, "/");
}

main().catch((err) => {
  console.error("\nDeploy failed:", err.message);
  process.exit(1);
});
