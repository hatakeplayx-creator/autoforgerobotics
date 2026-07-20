import { fromNodeMiddleware } from "h3";
import app, { initializeAppServices } from "../../backend/src/app.js";
import { connectMongoDB } from "../../backend/src/mongodb/connection.js";

let serviceInitialization: Promise<void> | undefined;
let databaseInitialization: Promise<void> | undefined;

function ensureServicesInitialized(): Promise<void> {
  serviceInitialization ??= initializeAppServices().catch((error: unknown) => {
    serviceInitialization = undefined;
    throw error;
  });
  return serviceInitialization;
}

function ensureDatabaseInitialized(): Promise<void> {
  databaseInitialization ??= connectMongoDB().then(() => undefined).catch((error: unknown) => {
    databaseInitialization = undefined;
    throw error;
  });
  return databaseInitialization;
}

export default fromNodeMiddleware(async (request, response, next) => {
  try {
    await ensureServicesInitialized();
    const pathname = new URL(request.url || "/", "http://internal.invalid").pathname;
    if (pathname !== "/api/health" && pathname !== "/api/v1/health") await ensureDatabaseInitialized();
    app(
      request as unknown as Parameters<typeof app>[0],
      response as unknown as Parameters<typeof app>[1],
      next as unknown as Parameters<typeof app>[2],
    );
  } catch (error) {
    console.error(JSON.stringify({
      event: "serverless_initialization_failed",
      message: error instanceof Error ? error.message : "Unknown initialization error",
    }));
    if (!response.headersSent) {
      response.statusCode = 503;
      response.setHeader("Content-Type", "application/json; charset=utf-8");
      response.end(JSON.stringify({ message: "Service temporarily unavailable", code: "SERVICE_UNAVAILABLE" }));
    }
  }
});
