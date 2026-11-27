import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock the db module
vi.mock("./db", () => ({
  getUpcomingEvents: vi.fn(),
  getAllEvents: vi.fn(),
  getEventById: vi.fn(),
  createTrainingRequest: vi.fn(),
  createEventSignup: vi.fn(),
  countSignupsByEventId: vi.fn(),
}));

// Mock the notification module
vi.mock("./mail", () => ({
  sendNotification: vi.fn().mockResolvedValue({ delivered: true }),
}));

import * as db from "./db";
import { calendarRouter } from "./calendar";
import { createCallerFactory } from "./_core/trpc";

const createCaller = createCallerFactory(calendarRouter);
const caller = createCaller({ req: {} as any, res: {} as any, user: null });

const mockEvent = {
  id: 1,
  title: "Online Safety Workshop",
  description: "Learn to spot scams",
  eventDate: Date.now() + 86400000, // tomorrow
  eventEndDate: null,
  location: "Online",
  eventType: "online" as const,
  capacity: 20,
  dateConfirmed: true,
  sessionSlot: "full-day" as const,
  isActive: true,
  createdAt: new Date(),
};

describe("calendarRouter", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("listUpcoming", () => {
    it("returns upcoming events from db", async () => {
      vi.mocked(db.getUpcomingEvents).mockResolvedValue([mockEvent]);
      const result = await caller.listUpcoming();
      expect(result).toHaveLength(1);
      expect(result[0].title).toBe("Online Safety Workshop");
      expect(db.getUpcomingEvents).toHaveBeenCalledOnce();
    });

    it("returns empty array when no upcoming events", async () => {
      vi.mocked(db.getUpcomingEvents).mockResolvedValue([]);
      const result = await caller.listUpcoming();
      expect(result).toEqual([]);
    });
  });

  describe("listAll", () => {
    it("returns all events from db", async () => {
      vi.mocked(db.getAllEvents).mockResolvedValue([mockEvent]);
      const result = await caller.listAll();
      expect(result).toHaveLength(1);
      expect(db.getAllEvents).toHaveBeenCalledOnce();
    });
  });

  describe("getEvent", () => {
    it("returns an event by id", async () => {
      vi.mocked(db.getEventById).mockResolvedValue(mockEvent);
      const result = await caller.getEvent({ id: 1 });
      expect(result.title).toBe("Online Safety Workshop");
      expect(db.getEventById).toHaveBeenCalledWith(1);
    });

    it("throws when event not found", async () => {
      vi.mocked(db.getEventById).mockResolvedValue(undefined);
      await expect(caller.getEvent({ id: 999 })).rejects.toThrow("Event not found");
    });

    it("rejects invalid id (0)", async () => {
      await expect(caller.getEvent({ id: 0 })).rejects.toThrow();
    });
  });

  describe("requestTraining", () => {
    it("creates a training request with required fields", async () => {
      vi.mocked(db.createTrainingRequest).mockResolvedValue(undefined as any);
      const result = await caller.requestTraining({
        name: "Margaret Smith",
        email: "margaret@example.com",
      });
      expect(result).toEqual({ success: true });
      expect(db.createTrainingRequest).toHaveBeenCalledWith(
        expect.objectContaining({
          name: "Margaret Smith",
          email: "margaret@example.com",
          status: "pending",
        })
      );
    });

    it("creates a training request with all optional fields", async () => {
      vi.mocked(db.createTrainingRequest).mockResolvedValue(undefined as any);
      const preferredDate = Date.now() + 7 * 86400000;
      const result = await caller.requestTraining({
        name: "John Doe",
        email: "john@example.com",
        phone: "+1 705 555 0100",
        preferredDate,
        topics: "Email safety, passwords",
        message: "Please call me first",
      });
      expect(result).toEqual({ success: true });
      expect(db.createTrainingRequest).toHaveBeenCalledWith(
        expect.objectContaining({
          name: "John Doe",
          email: "john@example.com",
          phone: "+1 705 555 0100",
          preferredDate,
          topics: "Email safety, passwords",
          message: "Please call me first",
        })
      );
    });

    it("rejects missing name", async () => {
      await expect(
        caller.requestTraining({ name: "", email: "test@example.com" })
      ).rejects.toThrow();
    });

    it("rejects invalid email", async () => {
      await expect(
        caller.requestTraining({ name: "Test User", email: "not-an-email" })
      ).rejects.toThrow();
    });

    it("sends owner notification on success", async () => {
      const { sendNotification } = await import("./mail");
      vi.mocked(db.createTrainingRequest).mockResolvedValue(undefined as any);
      await caller.requestTraining({
        name: "Alice",
        email: "alice@example.com",
      });
      expect(sendNotification).toHaveBeenCalledWith(
        expect.objectContaining({
          title: "New Training Request from Alice",
        })
      );
    });
  });
});
