import "dotenv/config";
import type { Server } from "node:http";
import app, { initializeAppServices } from "./app.js";
import { connectMongoDB, disconnectMongoDB } from "./mongodb/connection.js";

const port = Number(process.env.PORT || 4000);
let server: Server | undefined;
let shuttingDown = false;

async function start(): Promise<void> {
  await initializeAppServices();
  await connectMongoDB();
  server = app.listen(port, () => console.log(`AutoForge API listening on http://localhost:${port}`));
  server.requestTimeout = 30_000;
  server.headersTimeout = 35_000;
  server.keepAliveTimeout = 5_000;
}

async function shutdown(signal: string): Promise<void> {
  if (shuttingDown) return;
  shuttingDown = true;
  console.log(`${signal} received; shutting down AutoForge API`);
  if (server) {
    await Promise.race([
      new Promise<void>((resolve, reject) => server!.close((error) => error ? reject(error) : resolve())),
      new Promise<void>((resolve) => setTimeout(() => { server?.closeAllConnections(); resolve(); }, 10_000)),
    ]);
  }
  await disconnectMongoDB();
}

for (const signal of ["SIGINT", "SIGTERM"] as const) {
  process.once(signal, () => void shutdown(signal).then(() => { process.exitCode = 0; }).catch((error) => {
    console.error("Graceful shutdown failed", error);
    process.exitCode = 1;
  }));
}

void start().catch((error: unknown) => {
  console.error("Failed to start AutoForge API", error instanceof Error ? error.message : error);
  process.exitCode = 1;
});

process.on("unhandledRejection", (reason) => {
  console.error("Unhandled promise rejection", reason);
  void shutdown("unhandledRejection").finally(() => { process.exitCode = 1; });
});

process.on("uncaughtException", (error) => {
  console.error("Uncaught exception", error);
  void shutdown("uncaughtException").finally(() => { process.exitCode = 1; });
});
