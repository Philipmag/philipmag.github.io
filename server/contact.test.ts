import { describe, expect, it, vi } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

// Mock the notification module
vi.mock("./mail", () => ({
  sendNotification: vi.fn().mockResolvedValue({ delivered: true }),
}));

function createPublicContext(): TrpcContext {
  return {
    user: null,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: vi.fn(),
    } as unknown as TrpcContext["res"],
  };
}

describe("contact.submit", () => {
  it("accepts a valid contact form submission", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.contact.submit({
      name: "John Smith",
      email: "john@example.com",
      subject: "Question about scam protection",
      message: "I received a suspicious email and would like some guidance on what to do.",
      category: "general",
    });

    expect(result.success).toBe(true);
    expect(result.message).toBeTruthy();
    expect(typeof result.notified).toBe("boolean");
  });

  it("accepts a scam report submission", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.contact.submit({
      name: "Jane Doe",
      email: "jane@example.com",
      subject: "Reporting a phone scam",
      message: "I received a call from someone claiming to be from the IRS demanding payment via gift cards.",
      category: "scam-report",
    });

    expect(result.success).toBe(true);
  });

  it("accepts a tech help request", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.contact.submit({
      name: "Bob Wilson",
      email: "bob@example.com",
      subject: "Help with Zoom",
      message: "I need help learning how to use Zoom for my family video calls. Can someone walk me through it?",
      category: "tech-help",
    });

    expect(result.success).toBe(true);
  });

  it("rejects a submission with an empty name", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    await expect(
      caller.contact.submit({
        name: "",
        email: "test@example.com",
        subject: "Test",
        message: "This is a test message with enough characters.",
        category: "general",
      })
    ).rejects.toThrow();
  });

  it("rejects a submission with an invalid email", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    await expect(
      caller.contact.submit({
        name: "Test User",
        email: "not-an-email",
        subject: "Test",
        message: "This is a test message with enough characters.",
        category: "general",
      })
    ).rejects.toThrow();
  });

  it("rejects a submission with a message that is too short", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    await expect(
      caller.contact.submit({
        name: "Test User",
        email: "test@example.com",
        subject: "Test",
        message: "Short",
        category: "general",
      })
    ).rejects.toThrow();
  });

  it("accepts all valid category types", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const validCategories = ["general", "scam-report", "tech-help", "feedback", "other"] as const;

    for (const category of validCategories) {
      const result = await caller.contact.submit({
        name: "Test User",
        email: "test@example.com",
        subject: `Testing ${category}`,
        message: "This is a test message to verify the category works correctly.",
        category,
      });
      expect(result.success).toBe(true);
    }
  });
});
