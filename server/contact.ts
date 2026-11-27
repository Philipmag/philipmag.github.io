/*
 * Contact Form Router — Handles contact form submissions and notifies the owner.
 */

import { z } from "zod";
import { publicProcedure, router } from "./_core/trpc";
import { sendNotification } from "./mail";
import { TRPCError } from "@trpc/server";

export const contactRouter = router({
  submit: publicProcedure
    .input(
      z.object({
        name: z.string().trim().min(1, "Name is required").max(100, "Name is too long"),
        email: z.string().email("Please enter a valid email address").max(320),
        subject: z.string().trim().min(1, "Subject is required").max(200, "Subject is too long"),
        message: z.string().min(10, "Message must be at least 10 characters").max(5000, "Message is too long"),
        category: z.enum(["general", "scam-report", "tech-help", "feedback", "other"]),
      })
    )
    .mutation(async ({ input }) => {
      const categoryLabels: Record<string, string> = {
        general: "General Inquiry",
        "scam-report": "Scam Report",
        "tech-help": "Tech Help Request",
        feedback: "Feedback",
        other: "Other",
      };

      const title = `[Contact] ${categoryLabels[input.category] || input.category}: ${input.subject}`;
      const content = [
        `**From:** ${input.name}`,
        `**Email:** ${input.email}`,
        `**Category:** ${categoryLabels[input.category] || input.category}`,
        `**Subject:** ${input.subject}`,
        ``,
        `**Message:**`,
        input.message,
      ].join("\n");

      const sent = await sendNotification({ title, content, replyTo: input.email });
      if (!sent.delivered) {
        throw new TRPCError({
          code: "SERVICE_UNAVAILABLE",
          message: "Your message could not be delivered and has not been saved. Please email info@digitalguards.ca directly or try again later.",
        });
      }

      return {
        success: true,
        notified: true,
        message: "Thank you for reaching out! Your message has been delivered to our team.",
      };
    }),
});
