-- The original storefront catalog has no product descriptions.
ALTER TABLE "Product" ALTER COLUMN "description" DROP NOT NULL;
