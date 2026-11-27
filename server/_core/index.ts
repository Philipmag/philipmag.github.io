import "dotenv/config";
import { createServer } from "node:http";
import { createApp } from "../app";
import { serveStatic } from "./static";

async function startServer() {
  const app = createApp();
  const server = createServer(app);
  if (process.env.NODE_ENV === "development") {
    const { setupVite } = await import("./vite");
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }
  const port = Number(process.env.PORT || "3000");
  if (!Number.isInteger(port) || port < 1 || port > 65535) throw new Error("PORT must be a valid port number");
  server.requestTimeout = 30_000;
  server.headersTimeout = 35_000;
  server.on("error", () => { console.error("[server] listen_failed; check PORT availability"); process.exitCode = 1; });
  server.listen(port, "0.0.0.0", () => { console.info(`Server running on port ${port}`); });
}
startServer().catch(() => { console.error("[server] startup_failed; run pnpm build and verify configuration"); process.exitCode = 1; });
