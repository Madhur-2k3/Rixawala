import express from "express";
import cors from "cors";
import { env } from "./config/env";
import "./models"; // registers all Mongoose models (needed for populate)
import healthRoutes from "./routes/health.routes";
import routeRoutes from "./routes/route.routes";
import stopRoutes from "./routes/stop.routes";
import { errorHandler, notFound } from "./middleware/errorHandler";

// The app is built separately from index.ts (which starts the server)
// so tests can import it without opening a port or a DB connection.
export function createApp() {
  const app = express();

  app.use(cors({ origin: env.CORS_ORIGIN }));
  app.use(express.json());

  app.use("/api/health", healthRoutes);
  app.use("/api/routes", routeRoutes);
  app.use("/api/stops", stopRoutes);
  // Weekend 2: app.use("/api/trips", tripRoutes);

  app.use(notFound);
  app.use(errorHandler);

  return app;
}
