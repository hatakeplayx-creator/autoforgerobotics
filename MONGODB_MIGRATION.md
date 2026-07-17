# PostgreSQL to MongoDB Migration Runbook

## Safety position

MongoDB/Mongoose is the active API persistence layer. PostgreSQL/Prisma is kept
only for the one-time copy, verification, and rollback reference. The migration
never deletes or mutates PostgreSQL source data. Prisma migrations, uploads,
assets, and environment examples remain in place.

## Required environment

```text
DATABASE_URL=postgresql://...
MONGODB_URI=mongodb+srv://...
MONGODB_DB_NAME=autoforge
MIGRATION_BATCH_SIZE=200
```

## Commands

Preview source counts and relationship checks without writing:

```bash
npm run mongodb:migrate:dry-run
```

Copy and verify every module:

```bash
npm run mongodb:migrate
```

Verify a previously copied database without writing:

```bash
npm run mongodb:verify
```

The script processes modules sequentially and verifies every source identifier
after each module. It exits immediately on duplicate PostgreSQL identifiers,
missing MongoDB records, connection errors, or validation errors.

## Idempotency

Each MongoDB document uses the existing PostgreSQL `id` as `_id` (or the setting
key for key-based records). Re-running the migration performs upsert/replace
operations, so it does not create duplicate records. Source records are never
deleted.

## Data representation

- PostgreSQL `Decimal` values are stored as strings to preserve precision and
  current JSON response compatibility.
- Dates remain BSON dates.
- JSON/CMS/settings/webhook payloads retain their nested structure.
- Relational foreign keys remain stable string identifiers.
- Uploaded files remain in the existing upload store; media documents retain
  their existing keys and URLs.

## Cutover checklist

1. Run the migration against a staging Atlas cluster.
2. Run `npm run mongodb:verify` and retain the per-module counts.
3. Exercise every existing API route against the MongoDB-backed repository.
4. Compare response-contract snapshots with the PostgreSQL API.
5. Verify authentication, cart, wishlist, checkout, payment webhook idempotency,
   invoices, inventory, reviews, CMS, settings, media, and admin operations.
6. Keep PostgreSQL available as the rollback source until production sign-off.
7. Only then schedule deployment; this branch does not deploy automatically.
