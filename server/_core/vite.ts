import type { Express } from "express";
import fs from "node:fs";
import type { Server } from "node:http";
import path from "node:path";

export async function setupVite(app: Express, server: Server) {
  // Variable dynamic import prevents the production bundle from eagerly loading Vite.
  const moduleName = "vite";
  const { createServer: createViteServer } = await import(moduleName) as typeof import("vite");
  const root = process.cwd();
  const vite = await createViteServer({
    configFile: path.resolve(root, "vite.config.ts"),
    // Development-only reverse-proxy support. This bridge is never loaded in
    // production; the root config denies dotfiles, config and server sources.
    // Use the production build for any publicly hosted deployment.
    server: { middlewareMode: true, allowedHosts: true, hmr: { server } },
    appType: "custom",
  });
  app.use(vite.middlewares);
  app.get("*", async (req, res, next) => {
    if (req.path.startsWith("/api/")) { res.status(404).json({ error: "API route not found" }); return; }
    try {
      const template = await fs.promises.readFile(path.resolve(root, "index.html"), "utf8");
      const page = await vite.transformIndexHtml(req.originalUrl, template);
      res.status(200).set({ "Content-Type": "text/html", "Cache-Control": "no-store" }).end(page);
    } catch (error) { vite.ssrFixStacktrace(error as Error); next(error); }
  });
}
