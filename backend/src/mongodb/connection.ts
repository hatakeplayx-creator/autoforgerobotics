import mongoose from "mongoose";
import { z } from "zod";
import { mongoModels } from "./models.js";

const mongoEnvironmentSchema = z.object({
  MONGODB_URI: z.string().min(1).default("mongodb://127.0.0.1:27017"),
  MONGODB_DB_NAME: z.string().min(1).default("autoforge"),
  MONGODB_AUTO_INDEX: z.enum(["true", "false"]).optional(),
});

export type MongoEnvironment = z.infer<typeof mongoEnvironmentSchema>;

export function readMongoEnvironment(): MongoEnvironment {
  return mongoEnvironmentSchema.parse(process.env);
}

let connectionPromise: Promise<typeof mongoose> | undefined;
let listenersInstalled = false;

function installConnectionListeners(): void {
  if (listenersInstalled) return;
  listenersInstalled = true;
  mongoose.connection.on("connected",()=>console.info(JSON.stringify({event:"mongodb_connected"})));
  mongoose.connection.on("reconnected",()=>console.info(JSON.stringify({event:"mongodb_reconnected"})));
  mongoose.connection.on("disconnected",()=>console.warn(JSON.stringify({event:"mongodb_disconnected"})));
  mongoose.connection.on("error",error=>console.error(JSON.stringify({event:"mongodb_error",message:error.message})));
}

export async function connectMongoDB(): Promise<typeof mongoose> {
  if (mongoose.connection.readyState === 1) return mongoose;
  if (connectionPromise) return connectionPromise;
  const environment = readMongoEnvironment();
  mongoose.set("strictQuery", true);
  installConnectionListeners();
  connectionPromise = mongoose.connect(environment.MONGODB_URI, {
    dbName: environment.MONGODB_DB_NAME,
    autoIndex: false,
    serverSelectionTimeoutMS: 10_000,
    connectTimeoutMS:10_000,
    socketTimeoutMS:45_000,
    maxPoolSize:10,
    minPoolSize:0,
    maxIdleTimeMS:30_000,
  }).then(async (connection) => {
    const shouldCreateIndexes = environment.MONGODB_AUTO_INDEX === "true" ||
      (environment.MONGODB_AUTO_INDEX === undefined && process.env.NODE_ENV !== "production");
    if (shouldCreateIndexes) {
      await Promise.all(Object.values(mongoModels).map((model) => model.createIndexes()));
    }
    return connection;
  }).catch((error: unknown) => {
    connectionPromise = undefined;
    throw error;
  });
  return connectionPromise;
}

export async function disconnectMongoDB(): Promise<void> {
  await mongoose.disconnect();
  connectionPromise = undefined;
}
