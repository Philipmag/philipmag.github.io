import express, { type Express } from "express";
import fs from "node:fs";
import path from "node:path";

export function serveStatic(app: Express, directory?: string) {
  const distPath = directory ?? path.resolve(import.meta.dirname, "public");
  const index = path.join(distPath, "index.html");
  if (!fs.existsSync(index)) throw new Error("Build missing: run pnpm build before pnpm start");
  app.use("/assets", express.static(path.join(distPath, "assets"), { maxAge: "1y", immutable: true }));
  app.use("/media", express.static(path.join(distPath, "media"), { maxAge: "1d", etag: true }));
  app.use(express.static(distPath, {
    maxAge: "1h",
    setHeaders(res, file) { if (file.endsWith(".html")) res.setHeader("Cache-Control", "no-store"); },
  }));
  app.get("*", (req, res) => {
    if (req.path.startsWith("/api") || req.path.startsWith("/assets/") || req.path.startsWith("/media/") || path.extname(req.path)) { res.status(404).type("text").send("Not found"); return; }
    res.setHeader("Cache-Control", "no-store");
    res.sendFile(index);
  });
}
