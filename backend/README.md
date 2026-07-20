# AutoForge API

From the repository root, copy `.env.example` to `.env`, replace `JWT_SECRET`,
and ensure a normal MongoDB service is listening on `127.0.0.1:27017`. No
replica set is required for local development.

```powershell
Copy-Item .env.example .env
npm install
npm run mongodb:seed
npm run api:dev
```

`npm run mongodb:seed` creates baseline local catalog/CMS data and also creates
an admin account when `ADMIN_PASSWORD` is set in `.env`. It upserts records and
does not delete existing products, categories, or media.

Run the frontend separately with `npm run dev`; it listens on
`http://localhost:8080` and the API listens on `http://localhost:4000`.

Set `MONGODB_TRANSACTIONS=true` only when the database is Atlas or a configured
replica set. `JWT_SECRET` is the only value required for ordinary local API
startup; the root example documents every optional integration.

Uploads are stored under `UPLOAD_DIR` for local/self-hosted deployments and served at `/uploads`. Use a shared object storage volume or replace the storage adapter with S3/R2 for horizontally scaled hosting. SMTP variables enable transactional notifications.
