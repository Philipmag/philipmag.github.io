import express from "express";
import { describe, expect, it, vi } from "vitest";

vi.mock("./env", () => ({
  ENV: {
    forgeApiUrl: "https://forge.example/",
    forgeApiKey: "test-key",
  },
}));

import { registerStorageProxy } from "./storageProxy";

async function createTestServer() {
  const app = express();
  registerStorageProxy(app);

  return await new Promise<ReturnType<typeof app.listen>>((resolve) => {
    const server = app.listen(0, "127.0.0.1", () => resolve(server));
  });
}

describe("registerStorageProxy", () => {
  it("redirects a same-origin storage request to its signed asset URL", async () => {
    const originalFetch = globalThis.fetch;
    const forgeFetch = vi.fn().mockResolvedValue(
      new Response(
        JSON.stringify({ url: "https://cdn.example/assets/guardian.webp" }),
        { status: 200, headers: { "content-type": "application/json" } }
      )
    );

    globalThis.fetch = forgeFetch as typeof fetch;
    const server = await createTestServer();
    const address = server.address();

    try {
      if (!address || typeof address === "string") {
        throw new Error("Expected a TCP test server address");
      }

      const response = await originalFetch(
        `http://127.0.0.1:${address.port}/manus-storage/guardian.webp`,
        { redirect: "manual" }
      );

      expect(response.status).toBe(307);
      expect(response.headers.get("location")).toBe(
        "https://cdn.example/assets/guardian.webp"
      );
      expect(response.headers.get("cache-control")).toBe("private, max-age=300");
      expect(forgeFetch).toHaveBeenCalledWith(
        expect.objectContaining({
          href: expect.stringContaining(
            "v1/storage/presign/get?path=guardian.webp"
          ),
        }),
        expect.objectContaining({
          headers: { Authorization: "Bearer test-key" },
        })
      );
    } finally {
      globalThis.fetch = originalFetch;
      await new Promise<void>((resolve, reject) =>
        server.close((error) => (error ? reject(error) : resolve()))
      );
    }
  });
});
