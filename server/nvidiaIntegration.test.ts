import { afterEach, describe, expect, it } from "vitest";
import { invokeLLM } from "./_core/llm";

const originalForgeApiKey = process.env.BUILT_IN_FORGE_API_KEY;

describe("NVIDIA NIM fallback", () => {
  afterEach(() => {
    if (originalForgeApiKey === undefined) {
      delete process.env.BUILT_IN_FORGE_API_KEY;
    } else {
      process.env.BUILT_IN_FORGE_API_KEY = originalForgeApiKey;
    }
  });

  it(
    "returns a live server-side completion when the primary provider is unavailable",
    async () => {
      const apiKey = process.env.NVIDIA_API_KEY;
      expect(apiKey, "NVIDIA_API_KEY must be configured for fallback AI").toBeTruthy();

      // An empty string takes precedence over the managed default and prevents
      // invokeLLM from selecting the primary provider for this live failover test.
      process.env.BUILT_IN_FORGE_API_KEY = "";

      const result = await invokeLLM({
        messages: [{ role: "user", content: "Reply with exactly: OK" }],
        maxTokens: 3,
      });

      const content = result.choices?.[0]?.message?.content;
      expect(typeof content).toBe("string");
      expect(String(content).trim()).toBeTruthy();
    },
    35_000
  );
});
