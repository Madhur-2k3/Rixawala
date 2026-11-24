import { createServer } from "node:http";
import { env } from "./config/env";
import { connectDB, disconnectDB } from "./db/connect";
import { createApp } from "./app";

async function main() {
  await connectDB();

  const app = createApp();
  // We create the HTTP server ourselves (instead of app.listen) because
  // Socket.IO will attach to this same server in Weekend 4.
  const server = createServer(app);

  server.listen(env.PORT, () => {
    console.log(`API running on http://localhost:${env.PORT}`);
  });

  // Close connections cleanly on Ctrl+C / container stop.
  const shutdown = async (signal: string) => {
    console.log(`${signal} received, shutting down...`);
    server.close();
    await disconnectDB();
    process.exit(0);
  };
  process.on("SIGINT", () => void shutdown("SIGINT"));
  process.on("SIGTERM", () => void shutdown("SIGTERM"));
}

main().catch((err) => {
  console.error("Failed to start server:", err);
  process.exit(1);
});
