import { z } from "zod";
import { publicProcedure, router } from "./_core/trpc";
import {
  getAllEvents,
  getUpcomingEvents,
  getEventById,
  createTrainingRequest,
  createEventSignup,
  countSignupsByEventId,
} from "./db";
import { sendNotification } from "./mail";

export const calendarRouter = router({
  /** List all upcoming confirmed events + TBD events. */
  listUpcoming: publicProcedure.query(async () => {
    return getUpcomingEvents();
  }),

  /** List all events including past ones. */
  listAll: publicProcedure.query(async () => {
    return getAllEvents();
  }),

  /** Get a single event by id. */
  getEvent: publicProcedure
    .input(z.object({ id: z.number().int().positive() }))
    .query(async ({ input }) => {
      const event = await getEventById(input.id);
      if (!event) throw new Error("Event not found");
      return event;
    }),

  /** Get signup count for an event. */
  getSignupCount: publicProcedure
    .input(z.object({ eventId: z.number().int().positive() }))
    .query(async ({ input }) => {
      const count = await countSignupsByEventId(input.eventId);
      return { count };
    }),

  /** Sign up for a specific confirmed event session. */
  signUpForEvent: publicProcedure
    .input(
      z.object({
        eventId: z.number().int().positive(),
        name: z.string().min(2, "Name is required").max(255),
        email: z.string().email("Valid email is required"),
        phone: z.string().max(30).optional(),
        notes: z.string().max(1000).optional(),
      })
    )
    .mutation(async ({ input }) => {
      // Verify event exists and is confirmed
      const event = await getEventById(input.eventId);
      if (!event) throw new Error("Event not found");
      if (!event.dateConfirmed) throw new Error("This event date is not yet confirmed");
      if (!event.isActive) throw new Error("This event is no longer accepting registrations");

      // Check capacity
      if (event.capacity) {
        const currentCount = await countSignupsByEventId(input.eventId);
        if (currentCount >= event.capacity) {
          throw new Error("This session is full. Please contact us to be added to the waitlist.");
        }
      }

      await createEventSignup({
        eventId: input.eventId,
        name: input.name,
        email: input.email,
        phone: input.phone ?? null,
        notes: input.notes ?? null,
      });

      // Format event time for notification
      const eventTime = event.eventDate
        ? new Date(event.eventDate).toLocaleString("en-CA", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            timeZone: "America/Toronto",
          })
        : "TBD";

      // The confirmed DB write above is durable even when optional SMTP is unavailable.
      await sendNotification({
        title: `New Sign-Up: ${event.title}`,
        replyTo: input.email,
        content: `
**Session:** ${event.title}
**Date/Time:** ${eventTime}
**Name:** ${input.name}
**Email:** ${input.email}
**Phone:** ${input.phone ?? "Not provided"}
**Notes:** ${input.notes ?? "None"}

Please confirm their registration by replying to their email.
        `.trim(),
      });

      return { success: true };
    }),

  /** Submit a personal training session request. */
  requestTraining: publicProcedure
    .input(
      z.object({
        name: z.string().min(2, "Name is required").max(255),
        email: z.string().email("Valid email is required"),
        phone: z.string().max(30).optional(),
        preferredDate: z.number().int().positive().optional(),
        topics: z.string().max(1000).optional(),
        message: z.string().max(2000).optional(),
      })
    )
    .mutation(async ({ input }) => {
      await createTrainingRequest({
        name: input.name,
        email: input.email,
        phone: input.phone ?? null,
        preferredDate: input.preferredDate ?? null,
        topics: input.topics ?? null,
        message: input.message ?? null,
        status: "pending",
      });

      const preferredDateStr = input.preferredDate
        ? new Date(input.preferredDate).toLocaleDateString("en-CA", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })
        : "No preference specified";

      // Never send success until persistence has completed; email is only a notification.
      await sendNotification({
        title: `New Training Request from ${input.name}`,
        replyTo: input.email,
        content: `
**Name:** ${input.name}
**Email:** ${input.email}
**Phone:** ${input.phone ?? "Not provided"}
**Preferred Date:** ${preferredDateStr}
**Topics:** ${input.topics ?? "Not specified"}
**Message:** ${input.message ?? "None"}

Please follow up with the requester at your earliest convenience.
        `.trim(),
      });

      return { success: true };
    }),
});
