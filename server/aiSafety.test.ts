import { beforeEach, describe, expect, it } from "vitest";
import {
  enforcePublicAiRateLimit,
  minimizeSensitiveInput,
  resetPublicAiRateLimitForTests,
} from "./aiSafety";

describe("AI safety controls", () => {
  beforeEach(() => {
    resetPublicAiRateLimitForTests();
  });

  it("redacts credentials and financial identifiers before an external model call", () => {
    const result = minimizeSensitiveInput(
      "Password: hunter2. Verification code: 123456. Card 4111 1111 1111 1111. SIN 123-456-789."
    );

    expect(result.redactionCount).toBe(4);
    expect(result.value).toContain("Password: [REDACTED]");
    expect(result.value).toContain("Verification code: [REDACTED]");
    expect(result.value).toContain("[CARD NUMBER REDACTED]");
    expect(result.value).toContain("[SIN REDACTED]");
    expect(result.value).not.toContain("hunter2");
    expect(result.value).not.toContain("123456");
    expect(result.value).not.toContain("4111");
  });

  it("allows a bounded number of public AI requests and then blocks further requests", () => {
    const request = { ip: "203.0.113.55" };

    for (let requestNumber = 0; requestNumber < 8; requestNumber += 1) {
      expect(() => enforcePublicAiRateLimit(request)).not.toThrow();
    }

    expect(() => enforcePublicAiRateLimit(request)).toThrow(
      "For everyone’s safety"
    );
  });
});
