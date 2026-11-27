import "dotenv/config";
import { describe, expect, it } from "vitest";
import { invokeLLM } from "./_core/llm";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

// Never contacts a provider in default CI, even if a developer has credentials set.
describe.skipIf(process.env.RUN_LIVE_OPENROUTER_TESTS !== "1")("OpenRouter live opt-in", () => {
  it("returns validated structured JSON through the fixed server-side endpoint", async () => {
    expect(Boolean(process.env.OPENROUTER_API_KEY?.trim()), "Set OPENROUTER_API_KEY to run this opt-in test").toBe(true);
    const result = await invokeLLM({
      messages: [{ role: "user", content: 'Return JSON with answer set to "OK".' }],
      outputSchema: { name: "live_check", strict: true, schema: { type: "object", properties: { answer: { type: "string", enum: ["OK"] } }, required: ["answer"], additionalProperties: false } },
      maxTokens: 128,
      timeoutMs: 20_000,
      maxAttempts: 1,
    });
    expect(JSON.parse(String(result.choices[0].message.content))).toEqual({ answer: "OK" });
  }, 25_000);

  const caller = () => appRouter.createCaller({ user: null, req: { headers: {}, socket: { remoteAddress: "live-test" } } as TrpcContext["req"], res: {} as TrpcContext["res"] });
  it("returns a real AI assessment for a synthetic scam through the application route", async () => {
    const result = await caller().scamAnalyzer.analyze({ message: "Urgent: your bank account is locked. Send $500 in gift cards to unlock it. Do not call your bank." });
    expect(result.source, "Live provider output was unavailable or rejected; local fallback is not AI success").toBe("ai");
    expect(result.riskLevel).toBe("dangerous");
    expect(result.redFlags.length).toBeGreaterThan(0);
    expect(result.advice.length).toBeGreaterThan(20);
  }, 25_000);
  it("returns a substantive real technology guide through the application route", async () => {
    const result = await caller().scamAnalyzer.techHelp({ question: "How do I make the text bigger on my iPhone? Give me a short beginner guide." });
    expect(result.source, "Live provider output was unavailable or rejected; local fallback is not AI success").toBe("ai");
    expect(result.steps.length).toBeGreaterThan(0);
    expect(result.steps[0].instruction.length).toBeGreaterThan(20);
    expect(result.troubleshooting.length).toBeGreaterThan(0);
  }, 25_000);
});
