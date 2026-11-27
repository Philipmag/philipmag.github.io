import { TRPCError } from "@trpc/server";
import { eq, gte, asc, or, isNull, and, count } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2";
import { events, trainingRequests, eventSignups, type InsertEvent, type InsertTrainingRequest, type InsertEventSignup } from "../drizzle/schema";

let pool: ReturnType<typeof mysql.createPool> | null = null;
let database: ReturnType<typeof drizzle> | null = null;
function unavailable(unconfirmed = false): TRPCError {
  return new TRPCError({ code: "SERVICE_UNAVAILABLE", message: unconfirmed
    ? "Calendar service is unavailable and we could not confirm this request. Please contact info@digitalguards.ca before submitting again."
    : "Calendar and training registration are unavailable. Please contact info@digitalguards.ca directly. No submission has been saved." });
}
/** Optional MySQL; educational guides and AI never call this function. */
export async function getDb() {
  if (!process.env.DATABASE_URL?.trim()) throw unavailable();
  if (!database) {
    try {
      pool = mysql.createPool({ uri: process.env.DATABASE_URL, connectionLimit: 5, waitForConnections: true, queueLimit: 20, connectTimeout: 8_000, enableKeepAlive: true, timezone: "Z" });
      database = drizzle(pool);
    } catch { throw unavailable(); }
  }
  return database;
}
async function query<T>(operation: (db: Awaited<ReturnType<typeof getDb>>) => Promise<T>): Promise<T> {
  try { return await operation(await getDb()); }
  catch (error) {
    if (error instanceof TRPCError) throw error;
    console.warn("[database] operation_unavailable");
    // A network failure after a write may leave commit acknowledgement uncertain.
    throw unavailable(true);
  }
}
export async function getUpcomingEvents() {
  return query(db => db.select().from(events).where(and(eq(events.isActive, true), or(gte(events.eventDate, Date.now()), isNull(events.eventDate)))).orderBy(asc(events.eventDate)));
}
export async function getAllEvents() { return query(db => db.select().from(events).orderBy(asc(events.eventDate))); }
export async function getEventById(id: number) {
  return query(async db => (await db.select().from(events).where(eq(events.id, id)).limit(1))[0]);
}
export async function createEvent(data: InsertEvent) { await query(db => db.insert(events).values(data)); }
export async function createEventSignup(data: InsertEventSignup) { await query(db => db.insert(eventSignups).values(data)); }
export async function getSignupsByEventId(eventId: number) {
  return query(db => db.select().from(eventSignups).where(eq(eventSignups.eventId, eventId)).orderBy(asc(eventSignups.createdAt)));
}
export async function countSignupsByEventId(eventId: number): Promise<number> {
  return query(async db => (await db.select({ count: count() }).from(eventSignups).where(eq(eventSignups.eventId, eventId)))[0]?.count ?? 0);
}
export async function createTrainingRequest(data: InsertTrainingRequest) { await query(db => db.insert(trainingRequests).values(data)); }
export async function getAllTrainingRequests() { return query(db => db.select().from(trainingRequests).orderBy(asc(trainingRequests.createdAt))); }
