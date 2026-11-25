import { eq, gte, asc, or, isNull } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2";
import {
  InsertUser,
  users,
  events,
  trainingRequests,
  eventSignups,
  InsertEvent,
  InsertTrainingRequest,
  InsertEventSignup,
} from "../drizzle/schema";
import { ENV } from './_core/env';

// Use a persistent connection pool instead of a new connection per request.
// This eliminates the 300-800ms TCP+TLS handshake cost on every DB query.
// connectionLimit=5 is safe for TiDB Serverless free tier (max 25 connections).
let _pool: ReturnType<typeof mysql.createPool> | null = null;
let _db: ReturnType<typeof drizzle> | null = null;

export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      if (!_pool) {
        _pool = mysql.createPool({
          uri: process.env.DATABASE_URL,
          connectionLimit: 5,
          waitForConnections: true,
          queueLimit: 0,
          enableKeepAlive: true,
          keepAliveInitialDelay: 10000,
        });
      }
      _db = drizzle(_pool);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) throw new Error("User openId is required for upsert");

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = { openId: user.openId };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) values.lastSignedIn = new Date();
    if (Object.keys(updateSet).length === 0) updateSet.lastSignedIn = new Date();

    await db.insert(users).values(values).onDuplicateKeyUpdate({ set: updateSet });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }
  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

// ─── Events ───────────────────────────────────────────────────────────────────

/**
 * Return all active events: confirmed upcoming ones + all TBD (dateConfirmed=false).
 * Confirmed events are ordered by date; TBD events come after.
 */
export async function getUpcomingEvents() {
  const db = await getDb();
  if (!db) return [];

  const nowMs = Date.now();
  // Get all active events where date is in the future OR date is TBD (null)
  return db
    .select()
    .from(events)
    .where(or(gte(events.eventDate, nowMs), isNull(events.eventDate)))
    .orderBy(asc(events.eventDate));
}

/** Return all events (including past), ordered by date ascending. */
export async function getAllEvents() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(events).orderBy(asc(events.eventDate));
}

/** Return a single event by id. */
export async function getEventById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(events).where(eq(events.id, id)).limit(1);
  return result[0] ?? undefined;
}

/** Insert a new event. */
export async function createEvent(data: InsertEvent) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.insert(events).values(data);
}

// ─── Event Signups ────────────────────────────────────────────────────────────

/** Insert a new event signup. */
export async function createEventSignup(data: InsertEventSignup) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.insert(eventSignups).values(data);
}

/** Return all signups for a specific event. */
export async function getSignupsByEventId(eventId: number) {
  const db = await getDb();
  if (!db) return [];
  return db
    .select()
    .from(eventSignups)
    .where(eq(eventSignups.eventId, eventId))
    .orderBy(asc(eventSignups.createdAt));
}

/** Count signups for a specific event. */
export async function countSignupsByEventId(eventId: number): Promise<number> {
  const db = await getDb();
  if (!db) return 0;
  const result = await db
    .select()
    .from(eventSignups)
    .where(eq(eventSignups.eventId, eventId));
  return result.length;
}

// ─── Training Requests ────────────────────────────────────────────────────────

export async function createTrainingRequest(data: InsertTrainingRequest) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.insert(trainingRequests).values(data);
}

export async function getAllTrainingRequests() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(trainingRequests).orderBy(asc(trainingRequests.createdAt));
}
