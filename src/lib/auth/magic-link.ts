// Magic-link auth (spec §8: "Passwordless email magic links").
//
// Token format: opaque 32-byte URL-safe random. Stored hashed.
// TTL: 15 minutes. Single-use.

import { createHash, randomBytes } from "node:crypto";

const TTL_MS = 15 * 60 * 1000;

export function newToken(): { token: string; tokenHash: string; expiresAt: Date } {
  const token = randomBytes(32).toString("base64url");
  const tokenHash = hashToken(token);
  return {
    token,
    tokenHash,
    expiresAt: new Date(Date.now() + TTL_MS),
  };
}

export function hashToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

export function buildVerifyUrl(token: string, locale: "en" | "de"): string {
  const base = process.env.APP_URL ?? "http://localhost:3000";
  const params = new URLSearchParams({ token, locale });
  return `${base}/api/auth/verify?${params.toString()}`;
}
