import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { appRouter } from "./routers";
import { resetPublicAiRateLimitForTests } from "./aiSafety";
const caller = appRouter.createCaller({ req: { ip: "203.0.113.19" } as any, res: {} as any, user: null });
beforeEach(() => {
  vi.stubEnv("OPENROUTER_API_KEY", ""); vi.stubEnv("DATABASE_URL", ""); vi.stubGlobal("fetch", vi.fn());
  vi.spyOn(console, "warn").mockImplementation(() => {}); resetPublicAiRateLimitForTests();
});
afterEach(() => { vi.unstubAllGlobals(); vi.unstubAllEnvs(); vi.restoreAllMocks(); });
describe("credential-free standalone local modes", () => {
  it("returns a specific scam safety-check without provider or database access", async () => {
    const output = await caller.scamAnalyzer.analyze({ message: "URGENT! Send gift cards to unlock your bank account" });
    expect(output).toMatchObject({ source: "safety-check", riskLevel: "dangerous", privacyProtected: false }); expect(output.redFlags.length).toBeGreaterThan(0); expect(fetch).not.toHaveBeenCalled();
  });
  it("returns a topic-aware quick-guide without provider or database access", async () => {
    const output = await caller.scamAnalyzer.techHelp({ question: "How do I join a Zoom meeting? Verification code: 123456" });
    expect(output).toMatchObject({ source: "quick-guide", title: "How to join a Zoom meeting", privacyProtected: true }); expect(JSON.stringify(output)).not.toContain("123456"); expect(fetch).not.toHaveBeenCalled();
  });
});
