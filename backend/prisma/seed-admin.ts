import "dotenv/config";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { connectMongoDB, disconnectMongoDB } from "../src/mongodb/connection.js";
import { mongo, Role } from "../src/mongodb/database.js";

const input = z.object({
  ADMIN_EMAIL: z.string().email().default("admin@autoforge.com"),
  ADMIN_PASSWORD: z.string().min(8, "ADMIN_PASSWORD must contain at least 8 characters"),
  ADMIN_NAME: z.string().min(2).default("Store Administrator"),
}).parse(process.env);

async function main() {
  await connectMongoDB();
  const email = input.ADMIN_EMAIL.toLowerCase();
  const passwordHash = await bcrypt.hash(input.ADMIN_PASSWORD, 12);

  await mongo.user.upsert({
    where: { email },
    update: {
      passwordHash,
      role: Role.ADMIN,
    },
    create: {
      email,
      name: input.ADMIN_NAME,
      passwordHash,
      role: Role.ADMIN,
    },
  });

  console.log(`MongoDB admin account ${email} is ready.`);
}

main()
  .catch((error) => {
    console.error("Failed to seed the MongoDB admin account.");
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await disconnectMongoDB();
  });
