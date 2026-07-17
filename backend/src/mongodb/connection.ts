import mongoose from "mongoose";
import { z } from "zod";

const mongoEnvironmentSchema = z.object({
  MONGODB_URI: z.string().min(1),
  MONGODB_DB_NAME: z.string().min(1).default("autoforge"),
});

export type MongoEnvironment = z.infer<typeof mongoEnvironmentSchema>;

export function readMongoEnvironment(): MongoEnvironment {
  return mongoEnvironmentSchema.parse(process.env);
}

export async function connectMongoDB(): Promise<typeof mongoose> {
  const environment = readMongoEnvironment();
  mongoose.set("strictQuery", true);
  return mongoose.connect(environment.MONGODB_URI, {
    dbName: environment.MONGODB_DB_NAME,
    autoIndex: process.env.NODE_ENV !== "production",
  });
}

export async function disconnectMongoDB(): Promise<void> {
  await mongoose.disconnect();
}
