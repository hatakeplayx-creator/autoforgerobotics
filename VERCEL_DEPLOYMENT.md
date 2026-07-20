# AutoForge Vercel deployment

## Architecture

AutoForge deploys as one Vercel project. TanStack Start and Nitro produce the
frontend/SSR Vercel output. `server/api/[...path].ts` adapts the existing Express
application into Nitro's `/api/**` handler, so the browser and API share one
HTTPS origin. Local development remains split between Vite on port 8080 and the
Express server entry on port 4000.

Do not set `VITE_API_URL` in Preview or Production. A missing value intentionally
selects same-origin `/api` requests.

## Vercel project settings

- Root directory: repository root
- Framework preset: Other (configuration is produced by Nitro)
- Install command: `npm install`
- Build command: `npm run build`
- Output directory: leave unset; Nitro writes Vercel Build Output API files
- Node.js runtime: 24.x (matches Nitro's generated `nodejs24.x` function)
- Production branch: keep the existing client-selected production branch
- Preview deployments: enabled for the dedicated deployment branch

Environment changes only affect new deployments. Redeploy after changing any
value.

## Environment matrix

| Variable | Development | Preview | Production |
| --- | --- | --- | --- |
| `NODE_ENV` | `development` | Vercel supplies `production` | Vercel supplies `production` |
| `MONGODB_URI` | local MongoDB URI | hosted Atlas URI | hosted Atlas URI |
| `MONGODB_DB_NAME` | `autoforge` | preview database name | production database name |
| `MONGODB_TRANSACTIONS` | `false` for standalone Mongo | `true` | `true` |
| `MONGODB_AUTO_INDEX` | optional, defaults on | `false` | `false` |
| `JWT_SECRET` | unique 32+ character local secret | unique Preview secret | unique Production secret |
| `CORS_ORIGIN` | `http://localhost:8080` | leave empty for same-origin | leave empty for same-origin |
| `ACCESS_TOKEN_TTL` | optional, default `15m` | `15m` | `15m` |
| `REFRESH_TOKEN_DAYS` | optional, default `7` | `7` | `7` |
| `REMEMBER_ME_REFRESH_TOKEN_DAYS` | optional, default `30` | `30` | `30` |
| `AUTH_COOKIE_NAME` | optional default | optional default | optional default |
| `AUTH_COOKIE_SAMESITE` | `lax` | `lax` | `lax` |
| `AUTH_COOKIE_SECURE` | `false` | omit or `true` | omit or `true` |
| `AUTH_COOKIE_DOMAIN` | unset | unset | unset |
| `MEDIA_STORAGE_DRIVER` | `local` | `vercel-blob` | `vercel-blob` |
| `BLOB_READ_WRITE_TOKEN` | optional | project secret | project secret |
| `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `MAIL_FROM` | optional | Preview/test credentials | production credentials |
| `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET` | optional | test keys | live keys |
| `GSTIN` | optional | business value | business value |

`PORT` and `UPLOAD_DIR` are local-server settings and should not be configured on
Vercel. `VITE_API_URL`, `FRONTEND_URL`, `BACKEND_URL`, `MEDIA_BASE_URL`, and a
separate refresh JWT secret are not used by this application and must not be
invented as deployment secrets. Refresh tokens are opaque random values stored
only as hashes in MongoDB.

## Database and media preparation

Use a hosted MongoDB deployment with transactions enabled. Never use a local
address or `replicaSet=rs0` in Vercel. Runtime startup never seeds data and does
not build indexes in Production unless `MONGODB_AUTO_INDEX=true` is explicitly
set. Apply indexes as a controlled maintenance operation.

Create and connect a **public Vercel Blob store**. Before the first Preview,
migrate any records whose URL begins with `/uploads/` from the machine that still
contains the source files:

```sh
npm run media:migrate:blob
```

The command is explicit, never runs during startup, and reports missing source
files without silently replacing URLs. Existing HTTPS image URLs remain valid.

## Preview release sequence

1. Create the dedicated deployment branch and commit the verified changes.
2. Push the branch without rebasing or force-pushing Lovable history.
3. Import/link the repository in Vercel without assigning the production domain.
4. Add Preview environment values and connect the Blob store.
5. Deploy Preview and verify `/api/health`, `/api/ready`, deep links, cookies,
   roles, CRUD, media persistence, checkout, responsive layout, and sanitized
   error responses.
6. Request explicit approval before promoting or attaching the client domain.

## Rollback

Vercel deployments are immutable: promote the last known-good deployment or
revert the deployment commit with a new commit. Never force-push, amend, squash,
or rebase already-published history. Database and Blob data are not deleted by a
code rollback. If the media migration has run, its durable HTTPS URLs remain
compatible with both the new and previous frontend media resolver.
