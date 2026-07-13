# Admin API

Copy `.env.example` to `.env`, configure PostgreSQL and a 32+ character JWT secret, then run:

`npm install && npm run prisma:generate && npm run prisma:migrate && npm run prisma:seed && npm run api:dev`

Uploads are stored under `UPLOAD_DIR` for local/self-hosted deployments and served at `/uploads`. Use a shared object storage volume or replace the storage adapter with S3/R2 for horizontally scaled hosting. SMTP variables enable transactional notifications.
