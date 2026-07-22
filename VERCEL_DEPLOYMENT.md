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
| `MEDIA_STORAGE_DRIVER` | explicit `local` or `cloudinary` | `cloudinary` | `cloudinary` |
| `CLOUDINARY_CLOUD_NAME` | required for Cloudinary | project secret | project secret |
| `CLOUDINARY_API_KEY` | required for Cloudinary | project secret | project secret |
| `CLOUDINARY_API_SECRET` | required for Cloudinary | project secret | project secret |
| `CLOUDINARY_ROOT_FOLDER` | `autoforge` | `autoforge` | `autoforge` |
| `CLOUDINARY_UPLOAD_TIMEOUT_MS` | `30000` | `30000` | `30000` |
| `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `MAIL_FROM` | optional | Preview/test credentials | production credentials |
| `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET` | optional | test keys | live keys |
| `GSTIN` | optional | business value | business value |

`PORT` and `UPLOAD_DIR` are local-server settings and should not be configured on
Vercel. `VITE_API_URL`, `FRONTEND_URL`, `BACKEND_URL`, `MEDIA_BASE_URL`, a
separate refresh JWT secret, `BLOB_READ_WRITE_TOKEN`, and any `VITE_CLOUDINARY_*`
variables are not used by this application and must not be
invented as deployment secrets. Refresh tokens are opaque random values stored
only as hashes in MongoDB.

## Database and media preparation

Use a hosted MongoDB deployment with transactions enabled. Never use a local
address or `replicaSet=rs0` in Vercel. Runtime startup never seeds data and does
not build indexes in Production unless `MONGODB_AUTO_INDEX=true` is explicitly
set. Apply indexes as a controlled maintenance operation.

Create a Cloudinary product environment and add its credentials only to the
backend Vercel environment. Before the first Preview, inventory records and then
migrate from the machine that still contains local source files:

```sh
npm run media:migrate:cloudinary -- --dry-run --batch-size=50
npm run media:migrate:cloudinary -- --batch-size=50
npm run media:verify:cloudinary
```

The explicit migration never runs during startup. It supports bounded batches,
keeps source assets, preserves a rollback manifest at
`backend/cloudinary-migration-manifest.json`, resumes completed records, and
reports item failures without replacing valid URLs. The source scan includes
local `/uploads` records, legacy Vercel Blob URLs, and reachable HTTPS images.
No Vercel Blob URLs existed in the repository at implementation time.

Uploads pass through authenticated admin API routes and use bounded in-memory
buffers. Vercel Functions enforce a 4.5 MB request/response payload ceiling, so
the API caps each image at 4 MB. For larger future assets, add an authenticated
endpoint that issues a short-lived, parameter-restricted Cloudinary signed upload
signature after the same database user and ADMIN checks. Do not use an
unrestricted unsigned preset.

## Preview release sequence

1. Create the dedicated deployment branch and commit the verified changes.
2. Push the branch without rebasing or force-pushing Lovable history.
3. Import/link the repository in Vercel without assigning the production domain.
4. Add Preview environment values, including all three Cloudinary credentials.
5. Deploy Preview and verify `/api/health`, `/api/ready`, deep links, cookies,
   roles, CRUD, media persistence, checkout, responsive layout, and sanitized
   error responses.
6. Request explicit approval before promoting or attaching the client domain.

## Rollback

Vercel deployments are immutable: promote the last known-good deployment or
revert the deployment commit with a new commit. Never force-push, amend, squash,
or rebase already-published history. Database and Cloudinary data are not deleted
by a code rollback. Use the migration manifest's `old` values to restore Media
rows if database rollback is required; do not delete verified source files until
the rollback window closes. Cloudinary delivery URLs and legacy HTTPS URLs remain
compatible with the frontend media resolver.
