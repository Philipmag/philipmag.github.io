import compression from "compression";
import express from "express";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { appRouter } from "./routers";
import { createContext } from "./_core/context";

/** API middleware is independent of Vite and safe to exercise in default CI. */
export function createApp() {
  const app = express();
  app.disable("x-powered-by");
  // Do not trust arbitrary X-Forwarded-For. Opt in only behind a known reverse proxy.
  if (process.env.TRUST_PROXY === "1") app.set("trust proxy", 1);
  app.use(compression());
  app.use((_req, res, next) => {
    res.set({ "X-Content-Type-Options": "nosniff", "Referrer-Policy": "strict-origin-when-cross-origin", "X-Frame-Options": "DENY", "Permissions-Policy": "camera=(), microphone=(), geolocation=()" });
    next();
  });
  app.use("/api", (req, res, next) => {
    res.setHeader("Cache-Control", "no-store");
    if (!["GET", "HEAD", "POST", "OPTIONS"].includes(req.method)) { res.status(405).json({ error: "Method not allowed" }); return; }
    const origin = req.get("origin");
    const allowed = process.env.APP_ORIGIN?.trim();
    if (req.get("sec-fetch-site") === "cross-site") { res.status(403).json({ error: "Cross-origin requests are not allowed" }); return; }
    if (origin) {
      try {
        const expected = allowed ? new URL(allowed).origin : `${req.protocol}://${req.get("host")}`;
        const incoming = new URL(origin);
        // Local development may be viewed through a TLS-terminating preview proxy.
        // Permit only a scheme change for the exact same host, never in production
        // and never when an explicit APP_ORIGIN has been configured.
        const developmentTlsPreview = process.env.NODE_ENV === "development" && !allowed &&
          incoming.protocol === "https:" && incoming.host === req.get("host");
        if (incoming.origin !== expected && !developmentTlsPreview) { res.status(403).json({ error: "Cross-origin requests are not allowed" }); return; }
      } catch { res.status(403).json({ error: "Invalid request origin" }); return; }
    }
    if (req.method === "POST" && !req.is("application/json")) { res.status(415).json({ error: "Use application/json" }); return; }
    next();
  });
  app.use("/api", express.json({ limit: "64kb" }));
  app.get("/api/health", (_req, res) => { res.json({ ok: true }); });
  app.use("/api/trpc", createExpressMiddleware({ router: appRouter, createContext }));
  // Unknown API paths must NEVER receive the SPA shell or a cached HTML success.
  app.use("/api", (_req, res) => { res.status(404).json({ error: "API route not found" }); });
  app.use(((error: { type?: string }, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
    const status = error?.type === "entity.too.large" ? 413 : error?.type === "entity.parse.failed" ? 400 : 500;
    res.status(status).json({ error: status === 413 ? "Request too large" : status === 400 ? "Invalid JSON" : "Request failed" });
  }) as express.ErrorRequestHandler);
  return app;
}
