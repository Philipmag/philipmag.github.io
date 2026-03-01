import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock the LLM module before importing the router
vi.mock("./_core/llm", () => ({
  invokeLLM: vi.fn(),
}));

import { invokeLLM } from "./_core/llm";
import { scamAnalyzerRouter } from "./scamAnalyzer";
import { router, createCallerFactory } from "./_core/trpc";

const mockedInvokeLLM = vi.mocked(invokeLLM);

// Create a test caller using tRPC v11 pattern
const appRouter = router({
  scamAnalyzer: scamAnalyzerRouter,
});

const createCaller = createCallerFactory(appRouter);

function getCaller() {
  return createCaller({
    req: {} as any,
    res: {} as any,
    user: null,
  });
}

describe("scamAnalyzer.analyze", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return a dangerous result for a phishing message", async () => {
    mockedInvokeLLM.mockResolvedValueOnce({
      id: "test-1",
      created: Date.now(),
      model: "test",
      choices: [
        {
          index: 0,
          message: {
            role: "assistant",
            content: JSON.stringify({
              riskLevel: "dangerous",
              confidence: 95,
              summary:
                "This message is a phishing attempt trying to steal your bank credentials.",
              redFlags: [
                "Urgent language demanding immediate action",
                "Request for bank account credentials",
                "Suspicious link to an unfamiliar website",
              ],
              advice:
                "Do not click any links in this message. Your bank will never ask for your password via email. Delete this message.",
              scamType: "phishing",
            }),
          },
          finish_reason: "stop",
        },
      ],
    });

    const caller = getCaller();
    const result = await caller.scamAnalyzer.analyze({
      message:
        "URGENT: Your bank account has been suspended. Click here to verify your identity immediately or your account will be permanently closed. Enter your password and SSN to continue.",
    });

    expect(result.riskLevel).toBe("dangerous");
    expect(result.confidence).toBe(95);
    expect(result.scamType).toBe("phishing");
    expect(result.redFlags.length).toBeGreaterThan(0);
    expect(result.summary).toBeTruthy();
    expect(result.advice).toBeTruthy();
    expect(mockedInvokeLLM).toHaveBeenCalledOnce();
  });

  it("should return a safe result for a legitimate message", async () => {
    mockedInvokeLLM.mockResolvedValueOnce({
      id: "test-2",
      created: Date.now(),
      model: "test",
      choices: [
        {
          index: 0,
          message: {
            role: "assistant",
            content: JSON.stringify({
              riskLevel: "safe",
              confidence: 85,
              summary:
                "This appears to be a normal message from a friend with no suspicious elements.",
              redFlags: [],
              advice:
                "This message looks fine. It's always good to verify unexpected messages, but this one appears legitimate.",
              scamType: "none",
            }),
          },
          finish_reason: "stop",
        },
      ],
    });

    const caller = getCaller();
    const result = await caller.scamAnalyzer.analyze({
      message: "Hey! Just wanted to check in and see how you're doing. Want to grab coffee this weekend?",
    });

    expect(result.riskLevel).toBe("safe");
    expect(result.confidence).toBe(85);
    expect(result.scamType).toBe("none");
    expect(result.redFlags).toEqual([]);
  });

  it("should handle LLM errors gracefully with a fallback response", async () => {
    mockedInvokeLLM.mockRejectedValueOnce(new Error("LLM service unavailable"));

    const caller = getCaller();
    const result = await caller.scamAnalyzer.analyze({
      message: "Some test message",
    });

    // Should return a cautious fallback
    expect(result.riskLevel).toBe("suspicious");
    expect(result.confidence).toBe(0);
    expect(result.summary).toContain("unable to fully analyze");
    expect(result.advice).toBeTruthy();
  });

  it("should reject empty messages", async () => {
    const caller = getCaller();

    await expect(
      caller.scamAnalyzer.analyze({ message: "" })
    ).rejects.toThrow();
  });

  it("should reject messages that are too long", async () => {
    const caller = getCaller();
    const longMessage = "a".repeat(10001);

    await expect(
      caller.scamAnalyzer.analyze({ message: longMessage })
    ).rejects.toThrow();
  });

  it("should normalize invalid risk levels to suspicious", async () => {
    mockedInvokeLLM.mockResolvedValueOnce({
      id: "test-3",
      created: Date.now(),
      model: "test",
      choices: [
        {
          index: 0,
          message: {
            role: "assistant",
            content: JSON.stringify({
              riskLevel: "invalid_level",
              confidence: 50,
              summary: "Test summary",
              redFlags: [],
              advice: "Test advice",
              scamType: "none",
            }),
          },
          finish_reason: "stop",
        },
      ],
    });

    const caller = getCaller();
    const result = await caller.scamAnalyzer.analyze({
      message: "Test message for normalization",
    });

    expect(result.riskLevel).toBe("suspicious");
  });

  it("should clamp confidence to 0-100 range", async () => {
    mockedInvokeLLM.mockResolvedValueOnce({
      id: "test-4",
      created: Date.now(),
      model: "test",
      choices: [
        {
          index: 0,
          message: {
            role: "assistant",
            content: JSON.stringify({
              riskLevel: "safe",
              confidence: 150,
              summary: "Test summary",
              redFlags: [],
              advice: "Test advice",
              scamType: "none",
            }),
          },
          finish_reason: "stop",
        },
      ],
    });

    const caller = getCaller();
    const result = await caller.scamAnalyzer.analyze({
      message: "Test message for confidence clamping",
    });

    expect(result.confidence).toBe(100);
  });
});
