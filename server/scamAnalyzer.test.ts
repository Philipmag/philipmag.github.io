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

/* ═══════════════════════════════════════════════════════════
   Scam Analyzer Tests
   ═══════════════════════════════════════════════════════════ */
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

/* ═══════════════════════════════════════════════════════════
   Tech Help Tests
   ═══════════════════════════════════════════════════════════ */
describe("scamAnalyzer.techHelp", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return a step-by-step guide for a Zoom question", async () => {
    mockedInvokeLLM.mockResolvedValueOnce({
      id: "tech-1",
      created: Date.now(),
      model: "test",
      choices: [
        {
          index: 0,
          message: {
            role: "assistant",
            content: JSON.stringify({
              title: "How to Mute Yourself in a Zoom Meeting",
              difficulty: "beginner",
              estimatedTime: "1-2 minutes",
              overview:
                "We'll show you how to mute and unmute your microphone during a Zoom meeting so others can't hear background noise.",
              steps: [
                {
                  stepNumber: 1,
                  title: "Find the Mute Button",
                  instruction:
                    "Look at the bottom-left corner of your Zoom window. You'll see a microphone icon.",
                  tip: "If the microphone has a red line through it, you're already muted.",
                },
                {
                  stepNumber: 2,
                  title: "Click to Mute",
                  instruction:
                    "Click the microphone icon once. A red line will appear over it, meaning you are now muted.",
                  tip: "You can also press the space bar to temporarily unmute while holding it down.",
                },
              ],
              troubleshooting: [
                {
                  problem: "I can't find the mute button",
                  solution:
                    "Move your mouse to the bottom of the Zoom window. The toolbar may be hidden and will appear when you hover.",
                },
              ],
              safetyNote:
                "Always be careful about what you share on screen during Zoom meetings.",
            }),
          },
          finish_reason: "stop",
        },
      ],
    });

    const caller = getCaller();
    const result = await caller.scamAnalyzer.techHelp({
      question: "How do I mute myself in a Zoom meeting?",
    });

    expect(result.title).toBe("How to Mute Yourself in a Zoom Meeting");
    expect(result.difficulty).toBe("beginner");
    expect(result.estimatedTime).toBe("1-2 minutes");
    expect(result.overview).toBeTruthy();
    expect(result.steps.length).toBeGreaterThan(0);
    expect(result.steps[0].stepNumber).toBe(1);
    expect(result.steps[0].title).toBeTruthy();
    expect(result.steps[0].instruction).toBeTruthy();
    expect(result.troubleshooting.length).toBeGreaterThan(0);
    expect(result.safetyNote).toBeTruthy();
    expect(mockedInvokeLLM).toHaveBeenCalledOnce();
  });

  it("should return a guide for a web browsing question", async () => {
    mockedInvokeLLM.mockResolvedValueOnce({
      id: "tech-2",
      created: Date.now(),
      model: "test",
      choices: [
        {
          index: 0,
          message: {
            role: "assistant",
            content: JSON.stringify({
              title: "How to Search for Something on Google",
              difficulty: "beginner",
              estimatedTime: "2-3 minutes",
              overview:
                "We'll walk you through how to use Google to find information on the internet.",
              steps: [
                {
                  stepNumber: 1,
                  title: "Open Your Web Browser",
                  instruction:
                    "Find the browser icon on your desktop or taskbar. It might look like a blue 'e' (Edge), a colorful circle (Chrome), or an orange fox (Firefox). Double-click it.",
                  tip: null,
                },
                {
                  stepNumber: 2,
                  title: "Go to Google",
                  instruction:
                    "Click the long white bar at the top of the browser window (called the address bar). Type 'google.com' and press the Enter key on your keyboard.",
                  tip: "The address bar is usually at the very top of the window.",
                },
              ],
              troubleshooting: [
                {
                  problem: "The page won't load",
                  solution:
                    "Check that your internet is working. Try clicking the refresh button (a circular arrow) near the address bar.",
                },
              ],
              safetyNote:
                "Be cautious of search results marked as 'Ad' — these are paid advertisements and may not always be the most relevant or trustworthy results.",
            }),
          },
          finish_reason: "stop",
        },
      ],
    });

    const caller = getCaller();
    const result = await caller.scamAnalyzer.techHelp({
      question: "How do I search for something on Google?",
    });

    expect(result.title).toBe("How to Search for Something on Google");
    expect(result.difficulty).toBe("beginner");
    expect(result.steps.length).toBe(2);
    expect(result.steps[1].tip).toBe("The address bar is usually at the very top of the window.");
    expect(result.troubleshooting.length).toBeGreaterThan(0);
  });

  it("should handle LLM errors gracefully with a fallback guide", async () => {
    mockedInvokeLLM.mockRejectedValueOnce(new Error("LLM service unavailable"));

    const caller = getCaller();
    const result = await caller.scamAnalyzer.techHelp({
      question: "How do I send an email?",
    });

    expect(result.title).toBe("We're Having Trouble");
    expect(result.difficulty).toBe("beginner");
    expect(result.steps.length).toBeGreaterThan(0);
    expect(result.steps[0].title).toBe("Try Again");
    expect(result.overview).toContain("couldn't generate");
  });

  it("should reject empty questions", async () => {
    const caller = getCaller();

    await expect(
      caller.scamAnalyzer.techHelp({ question: "" })
    ).rejects.toThrow();
  });

  it("should reject questions that are too long", async () => {
    const caller = getCaller();
    const longQuestion = "a".repeat(5001);

    await expect(
      caller.scamAnalyzer.techHelp({ question: longQuestion })
    ).rejects.toThrow();
  });

  it("should normalize invalid difficulty levels to beginner", async () => {
    mockedInvokeLLM.mockResolvedValueOnce({
      id: "tech-3",
      created: Date.now(),
      model: "test",
      choices: [
        {
          index: 0,
          message: {
            role: "assistant",
            content: JSON.stringify({
              title: "Test Guide",
              difficulty: "expert",
              estimatedTime: "5 minutes",
              overview: "Test overview",
              steps: [
                {
                  stepNumber: 1,
                  title: "Step 1",
                  instruction: "Do something",
                  tip: null,
                },
              ],
              troubleshooting: [],
              safetyNote: "Be safe.",
            }),
          },
          finish_reason: "stop",
        },
      ],
    });

    const caller = getCaller();
    const result = await caller.scamAnalyzer.techHelp({
      question: "Test question for difficulty normalization",
    });

    expect(result.difficulty).toBe("beginner");
  });

  it("should handle missing optional fields gracefully", async () => {
    mockedInvokeLLM.mockResolvedValueOnce({
      id: "tech-4",
      created: Date.now(),
      model: "test",
      choices: [
        {
          index: 0,
          message: {
            role: "assistant",
            content: JSON.stringify({
              title: "Minimal Guide",
              steps: [
                {
                  stepNumber: 1,
                  instruction: "Do the thing",
                },
              ],
            }),
          },
          finish_reason: "stop",
        },
      ],
    });

    const caller = getCaller();
    const result = await caller.scamAnalyzer.techHelp({
      question: "Test question with minimal response",
    });

    expect(result.title).toBe("Minimal Guide");
    expect(result.difficulty).toBe("beginner");
    expect(result.estimatedTime).toBeTruthy();
    expect(result.overview).toBeTruthy();
    expect(result.steps.length).toBe(1);
    expect(result.steps[0].title).toBe("Step 1");
    expect(result.troubleshooting).toEqual([]);
    expect(result.safetyNote).toBeTruthy();
  });
});
