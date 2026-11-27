import { beforeEach, describe, expect, it, vi } from "vitest";
vi.mock("./mail", () => ({ sendNotification: vi.fn() }));
vi.mock("./db", () => ({ getAllEvents: vi.fn(), getUpcomingEvents: vi.fn(), getEventById: vi.fn(), createTrainingRequest: vi.fn(), createEventSignup: vi.fn(), countSignupsByEventId: vi.fn() }));
import { sendNotification } from "./mail";
import * as db from "./db";
import { appRouter } from "./routers";
const caller = appRouter.createCaller({ req: {} as any, res: {} as any, user: null });
const contact = { name: "Example User", email: "test@example.com", subject: "Question", message: "Please help with my device.", category: "general" as const };
const event = { id: 1, title: "Workshop", description: null, eventDate: Date.now() + 86400000, eventEndDate: null, location: null, eventType: "online" as const, capacity: 10, dateConfirmed: true, sessionSlot: "full-day" as const, isActive: true, createdAt: new Date() };
beforeEach(() => { vi.resetAllMocks(); vi.mocked(sendNotification).mockResolvedValue({ delivered: true }); });
describe("standalone submission honesty", () => {
  it.each(["not_configured", "delivery_failed"] as const)("rejects contact when SMTP is %s", async reason => {
    vi.mocked(sendNotification).mockResolvedValue({ delivered: false, reason });
    await expect(caller.contact.submit(contact)).rejects.toMatchObject({ code: "SERVICE_UNAVAILABLE", message: expect.stringContaining("has not been saved") });
  });
  it("does not notify or claim success when a training write fails", async () => {
    vi.mocked(db.createTrainingRequest).mockRejectedValue(new Error("Database unavailable"));
    await expect(caller.calendar.requestTraining({ name: "Example User", email: "test@example.com" })).rejects.toThrow();
    expect(sendNotification).not.toHaveBeenCalled();
  });
  it("keeps a confirmed training write successful when optional SMTP is absent", async () => {
    vi.mocked(db.createTrainingRequest).mockResolvedValue(undefined); vi.mocked(sendNotification).mockResolvedValue({ delivered: false, reason: "not_configured" });
    expect(await caller.calendar.requestTraining({ name: "Example User", email: "test@example.com" })).toEqual({ success: true });
    expect(db.createTrainingRequest).toHaveBeenCalledOnce();
  });
  it("does not claim signup success or notify on failed DB writes", async () => {
    vi.mocked(db.getEventById).mockResolvedValue(event); vi.mocked(db.countSignupsByEventId).mockResolvedValue(0); vi.mocked(db.createEventSignup).mockRejectedValue(new Error("Database unavailable"));
    await expect(caller.calendar.signUpForEvent({ eventId: 1, name: "Example User", email: "test@example.com" })).rejects.toThrow();
    expect(sendNotification).not.toHaveBeenCalled();
  });
  it("keeps a confirmed signup successful when optional SMTP fails", async () => {
    vi.mocked(db.getEventById).mockResolvedValue(event); vi.mocked(db.countSignupsByEventId).mockResolvedValue(0); vi.mocked(db.createEventSignup).mockResolvedValue(undefined); vi.mocked(sendNotification).mockResolvedValue({ delivered: false, reason: "delivery_failed" });
    expect(await caller.calendar.signUpForEvent({ eventId: 1, name: "Example User", email: "test@example.com" })).toEqual({ success: true });
  });
  it("rejects full and inactive sessions before writes", async () => {
    vi.mocked(db.getEventById).mockResolvedValue(event); vi.mocked(db.countSignupsByEventId).mockResolvedValue(10);
    await expect(caller.calendar.signUpForEvent({ eventId: 1, name: "Example User", email: "test@example.com" })).rejects.toThrow("full");
    vi.mocked(db.getEventById).mockResolvedValue({ ...event, isActive: false });
    await expect(caller.calendar.signUpForEvent({ eventId: 1, name: "Example User", email: "test@example.com" })).rejects.toThrow("no longer"); expect(db.createEventSignup).not.toHaveBeenCalled();
  });
});
