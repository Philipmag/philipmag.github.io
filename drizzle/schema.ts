import { bigint, boolean, int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

/**
 * Community events (workshops, webinars, info sessions).
 * dateConfirmed=false means the event is planned but not yet scheduled (TBD).
 * sessionSlot distinguishes morning vs afternoon sessions on the same day.
 */
export const events = mysqlTable("events", {
  id: int("id").autoincrement().primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  /** UTC Unix timestamp (ms) for the event start — null when date is TBD */
  eventDate: bigint("eventDate", { mode: "number" }),
  /** UTC Unix timestamp (ms) for the event end */
  eventEndDate: bigint("eventEndDate", { mode: "number" }),
  location: varchar("location", { length: 255 }),
  /** Online / In-Person / Hybrid */
  eventType: mysqlEnum("eventType", ["online", "in-person", "hybrid"]).default("in-person").notNull(),
  capacity: int("capacity"),
  /** Whether the date is confirmed. false = TBD */
  dateConfirmed: boolean("dateConfirmed").default(true).notNull(),
  /** morning / afternoon / full-day — for events with multiple slots */
  sessionSlot: mysqlEnum("sessionSlot", ["morning", "afternoon", "full-day", "evening"]).default("full-day").notNull(),
  /** Whether the event is still accepting registrations */
  isActive: boolean("isActive").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Event = typeof events.$inferSelect;
export type InsertEvent = typeof events.$inferInsert;

/**
 * Sign-ups for specific confirmed events/sessions.
 */
export const eventSignups = mysqlTable("eventSignups", {
  id: int("id").autoincrement().primaryKey(),
  eventId: int("eventId").notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 320 }).notNull(),
  phone: varchar("phone", { length: 30 }),
  /** Any special needs or questions */
  notes: text("notes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type EventSignup = typeof eventSignups.$inferSelect;
export type InsertEventSignup = typeof eventSignups.$inferInsert;

/**
 * Personal training session requests submitted by seniors.
 */
export const trainingRequests = mysqlTable("trainingRequests", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 320 }).notNull(),
  phone: varchar("phone", { length: 30 }),
  preferredDate: bigint("preferredDate", { mode: "number" }),
  topics: text("topics"),
  message: text("message"),
  status: mysqlEnum("status", ["pending", "contacted", "scheduled", "completed", "cancelled"])
    .default("pending")
    .notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type TrainingRequest = typeof trainingRequests.$inferSelect;
export type InsertTrainingRequest = typeof trainingRequests.$inferInsert;
