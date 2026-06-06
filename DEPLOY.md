# Deploying over FTP / FTPS

This app is server-rendered (API routes, server actions, Postgres), so it needs
a **Node.js host** — plain static FTP hosting will not run it. The build is
configured for [standalone output](https://nextjs.org/docs/app/api-reference/config/next-config-js/output),
which produces a self-contained server with a trimmed `node_modules`, so the
upload stays small.

## One-time setup

1. Copy `.env.example` to `.env.local` and fill in the `FTP_*` values:

   | Variable          | Default | Notes                                                        |
   | ----------------- | ------- | ------------------------------------------------------------ |
   | `FTP_HOST`        | —       | Required. Hostname of the FTP server.                        |
   | `FTP_USER`        | —       | Required.                                                    |
   | `FTP_PASSWORD`    | —       | Required.                                                    |
   | `FTP_PORT`        | `21`    | 990 for implicit FTPS.                                        |
   | `FTP_SECURE`      | `true`  | `true` = explicit FTPS (TLS), `implicit`, or `false` (plain).|
   | `FTP_REMOTE_DIR`  | `/`     | Target directory on the host.                                |
   | `FTP_VERBOSE`     | `false` | `true` logs the raw FTP exchange for debugging.              |

   These can also come from the shell or CI environment instead of `.env.local`.
   Real environment variables take precedence over the file.

## Deploy

```bash
npm install --legacy-peer-deps   # if dependencies aren't installed yet
npm run build               # produces .next/standalone
npm run deploy:ftp          # uploads it over FTP/FTPS
```

The script uploads the three pieces a standalone build needs:

- `.next/standalone/*` → `<FTP_REMOTE_DIR>/` (includes `server.js`)
- `.next/static/*` → `<FTP_REMOTE_DIR>/.next/static`
- `public/*` → `<FTP_REMOTE_DIR>/public`

## On the host

Provide the runtime env vars the app needs (`DATABASE_URL`, `ANTHROPIC_API_KEY`,
etc. — see `.env.example`) and start, or restart, the server:

```bash
node server.js   # listens on $PORT (default 3000)
```

## Security note

FTPS (`FTP_SECURE=true`) keeps credentials and data encrypted in transit — keep
it on unless the host genuinely only supports plain FTP. The script currently
sets `rejectUnauthorized: false` so it tolerates hosts whose TLS certificate
doesn't match the FTP hostname; if your host has a valid matching certificate,
tighten this in `scripts/deploy-ftp.mjs` for full verification. If your host
supports SSH, prefer **SFTP** over FTPS (a different protocol/library —
`ssh2-sftp-client`).
