import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import * as db from "./db";
beforeEach(() => { vi.stubEnv("DATABASE_URL", ""); });
afterEach(() => { vi.unstubAllEnvs(); });
describe("optional standalone MySQL", () => {
  it("does not return fake empty events or zero counts when unconfigured", async () => {
    await expect(db.getAllEvents()).rejects.toMatchObject({ code: "SERVICE_UNAVAILABLE" });
    await expect(db.getUpcomingEvents()).rejects.toMatchObject({ code: "SERVICE_UNAVAILABLE" });
    await expect(db.getEventById(1)).rejects.toMatchObject({ code: "SERVICE_UNAVAILABLE" });
    await expect(db.countSignupsByEventId(1)).rejects.toMatchObject({ code: "SERVICE_UNAVAILABLE" });
  });
  it("does not accept training requests or event signups without persistence", async () => {
    await expect(db.createTrainingRequest({ name: "Test", email: "test@example.com" })).rejects.toMatchObject({ code: "SERVICE_UNAVAILABLE" });
    await expect(db.createEventSignup({ eventId: 1, name: "Test", email: "test@example.com" })).rejects.toMatchObject({ code: "SERVICE_UNAVAILABLE" });
  });
});
