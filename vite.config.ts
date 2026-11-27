import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import fs from "node:fs";
import path from "node:path";
import { defineConfig, type Plugin } from "vite";

const root = import.meta.dirname;
// Media lives outside public/src so source and build artefacts remain separate.
// The repository owns these files; no CDN, signing service or platform proxy is required.
function portableMedia(): Plugin {
  const media = path.resolve(root, "media");
  return {
    name: "portable-media",
    configureServer(server) {
      server.middlewares.use("/media", (req, res, next) => {
        let filename: string;
        try { filename = decodeURIComponent((req.url || "").split("?")[0]).replace(/^\/+/, ""); }
        catch { res.statusCode = 400; res.end(); return; }
        if (!filename || filename.includes("/") || filename.includes("\\") || filename.startsWith(".")) { res.statusCode = 404; res.end(); return; }
        const target = path.join(media, filename);
        if (!fs.existsSync(target) || !fs.statSync(target).isFile()) { res.statusCode = 404; res.end(); return; }
        const mime: Record<string, string> = { ".webp": "image/webp", ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".woff2": "font/woff2", ".pptx": "application/vnd.openxmlformats-officedocument.presentationml.presentation" };
        res.setHeader("Content-Type", mime[path.extname(target)] || "application/octet-stream");
        res.setHeader("Cache-Control", "public, max-age=86400");
        res.setHeader("X-Content-Type-Options", "nosniff");
        if (req.method === "HEAD") { res.end(); return; }
        fs.createReadStream(target).pipe(res);
      });
    },
    closeBundle() {
      if (fs.existsSync(media)) fs.cpSync(media, path.resolve(root, "dist/public/media"), { recursive: true });
    },
  };
}

export default defineConfig({
  plugins: [react(), tailwindcss(), portableMedia()],
  resolve: { alias: { "@": path.resolve(root, "src"), "@shared": path.resolve(root, "shared") } },
  root,
  publicDir: path.resolve(root, "public"),
  base: "/",
  build: { outDir: path.resolve(root, "dist/public"), emptyOutDir: true, chunkSizeWarningLimit: 600 },
  server: {
    host: true,
    allowedHosts: ["localhost", "127.0.0.1", ...(process.env.DEV_ALLOWED_HOST ? [process.env.DEV_ALLOWED_HOST] : [])],
    fs: { strict: true, deny: ["**/.*", "**/config/**", "**/server/**"] },
  },
});
