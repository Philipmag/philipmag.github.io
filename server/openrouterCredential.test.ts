import { describe, expect, it } from "vitest";

// Opt-in only: normal CI never requires credentials or makes a paid request.
describe.skipIf(process.env.RUN_LIVE_OPENROUTER_TESTS !== "1")("OpenRouter credential", () => {
  it("is accepted by OpenRouter's lightweight key endpoint", async () => {
    const key = process.env.OPENROUTER_API_KEY;
    expect(Boolean(key)).toBe(true);
    const response = await fetch("https://openrouter.ai/api/v1/key", {
      headers: { Authorization: `Bearer ${key}` },
      redirect: "error",
      signal: AbortSignal.timeout(10000),
    });
    expect(response.status).toBe(200);
    const body = await response.json();
    expect(body.data).toBeDefined();
  }, 15000);
});
