import { afterAll, afterEach, beforeAll, describe, expect, it, vi } from "vitest";
import { createServer, type Server } from "node:http";
import { createApp } from "./app";
let server: Server;
let base: string;
afterEach(() => vi.unstubAllEnvs());
beforeAll(async () => {
  server = createServer(createApp());
  await new Promise<void>(resolve => server.listen(0, "127.0.0.1", resolve));
  base = `http://127.0.0.1:${(server.address() as any).port}`;
});
afterAll(async () => { await new Promise<void>((resolve, reject) => server.close(error => error ? reject(error) : resolve())); });
describe("standalone HTTP API", () => {
  it("returns a minimal secret-free health response", async () => {
    const response = await fetch(`${base}/api/health`);
    expect(response.status).toBe(200); expect(await response.json()).toEqual({ ok: true }); expect(response.headers.get("cache-control")).toBe("no-store"); expect(response.headers.get("x-powered-by")).toBeNull(); expect(response.headers.get("x-content-type-options")).toBe("nosniff");
  });
  it.each(["/api/unknown", "/api/oauth/callback", "/api/trpc/notAProcedure"])("never returns the SPA shell for %s", async route => {
    const response = await fetch(`${base}${route}`); expect(response.status).toBe(404); expect(response.headers.get("content-type")).toContain("application/json");
  });
  it("rejects browser cross-site requests", async () => {
    expect((await fetch(`${base}/api/health`, { headers: { origin: "https://attacker.example", "sec-fetch-site": "cross-site" } })).status).toBe(403);
  });
  it("accepts the local same-origin request", async () => {
    expect((await fetch(`${base}/api/health`, { headers: { origin: base } })).status).toBe(200);
  });
  it("accepts only the exact same host for HTTPS development previews", async () => {
    vi.stubEnv("NODE_ENV", "development"); vi.stubEnv("APP_ORIGIN", "");
    expect((await fetch(`${base}/api/health`, { headers: { origin: base.replace("http:", "https:") } })).status).toBe(200);
    expect((await fetch(`${base}/api/health`, { headers: { origin: "https://attacker.example" } })).status).toBe(403);
  });
  it("does not weaken explicit development or production origin configuration", async () => {
    vi.stubEnv("NODE_ENV", "development"); vi.stubEnv("APP_ORIGIN", "https://configured.example");
    expect((await fetch(`${base}/api/health`, { headers: { origin: base.replace("http:", "https:") } })).status).toBe(403);
    vi.stubEnv("NODE_ENV", "production"); vi.stubEnv("APP_ORIGIN", "");
    expect((await fetch(`${base}/api/health`, { headers: { origin: base.replace("http:", "https:") } })).status).toBe(403);
    vi.stubEnv("APP_ORIGIN", "https://configured.example");
    expect((await fetch(`${base}/api/health`, { headers: { origin: "https://configured.example" } })).status).toBe(200);
  });
  it("rejects form POSTs", async () => {
    expect((await fetch(`${base}/api/trpc/contact.submit`, { method: "POST", headers: { "content-type": "application/x-www-form-urlencoded" }, body: "name=test" })).status).toBe(415);
  });
  it("rejects invalid JSON without reflecting request contents", async () => {
    const response = await fetch(`${base}/api/trpc/contact.submit`, { method: "POST", headers: { "content-type": "application/json" }, body: "private-not-json" });
    expect(response.status).toBe(400); expect(await response.text()).not.toContain("private");
  });
  it("caps request bodies", async () => {
    const response = await fetch(`${base}/api/trpc/contact.submit`, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ message: "a".repeat(70000) }) });
    expect(response.status).toBe(413);
  });
});
