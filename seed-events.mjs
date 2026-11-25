import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import * as dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: join(__dirname, ".env") });

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  console.error("DATABASE_URL not set");
  process.exit(1);
}

const connection = await mysql.createConnection(DATABASE_URL);
const db = drizzle(connection);

// Build event dates relative to today so they're always in the future
const now = new Date();
const addDays = (d, n) => new Date(d.getTime() + n * 24 * 60 * 60 * 1000);
const setTime = (d, h, m = 0) => {
  const copy = new Date(d);
  copy.setHours(h, m, 0, 0);
  return copy;
};

const events = [
  {
    title: "Introduction to Online Safety",
    description:
      "A friendly 90-minute workshop covering the basics of staying safe online — recognizing scam emails, safe browsing habits, and how to protect your personal information. No technical experience needed!",
    eventDate: setTime(addDays(now, 7), 14).getTime(), // 2:00 PM, 1 week from now
    eventEndDate: setTime(addDays(now, 7), 15, 30).getTime(),
    location: "Barrie Public Library — Room 201, 60 Worsley St, Barrie, ON",
    eventType: "in-person",
    capacity: 20,
    isActive: true,
  },
  {
    title: "Password Safety & Account Security",
    description:
      "Learn how to create strong passwords, use a password manager, and enable two-factor authentication on your accounts. We'll walk through it step by step together.",
    eventDate: setTime(addDays(now, 14), 10).getTime(), // 10:00 AM, 2 weeks from now
    eventEndDate: setTime(addDays(now, 14), 11, 30).getTime(),
    location: "Online via Zoom (link sent after registration)",
    eventType: "online",
    capacity: 30,
    isActive: true,
  },
  {
    title: "Spotting Phone & Text Scams",
    description:
      "Scammers are calling and texting more than ever. In this session we'll look at real examples of phone scams, how to spot them, and what to do if you receive one. Bring your questions!",
    eventDate: setTime(addDays(now, 21), 13).getTime(), // 1:00 PM, 3 weeks from now
    eventEndDate: setTime(addDays(now, 21), 14, 30).getTime(),
    location: "Barrie Senior Centre, 120 Bayfield St, Barrie, ON",
    eventType: "in-person",
    capacity: 25,
    isActive: true,
  },
  {
    title: "Safe Social Media for Seniors",
    description:
      "Facebook, Instagram, and WhatsApp can be wonderful ways to stay connected — but they also come with risks. We'll cover privacy settings, spotting fake profiles, and safe sharing practices.",
    eventDate: setTime(addDays(now, 28), 14).getTime(), // 2:00 PM, 4 weeks from now
    eventEndDate: setTime(addDays(now, 28), 15, 30).getTime(),
    location: "Online via Zoom (link sent after registration)",
    eventType: "online",
    capacity: 30,
    isActive: true,
  },
  {
    title: "Digital Guardians Community Q&A",
    description:
      "An open-format session where you can bring any technology or online safety question and get personalized help from our volunteers. No question is too basic — everyone is welcome!",
    eventDate: setTime(addDays(now, 35), 11).getTime(), // 11:00 AM, 5 weeks from now
    eventEndDate: setTime(addDays(now, 35), 12, 30).getTime(),
    location: "Barrie Public Library — Room 201, 60 Worsley St, Barrie, ON",
    eventType: "hybrid",
    capacity: 20,
    isActive: true,
  },
];

// Insert events (skip if table already has data to avoid duplicates)
const existing = await connection.execute("SELECT COUNT(*) as cnt FROM events");
const count = existing[0][0].cnt;

if (count > 0) {
  console.log(`Events table already has ${count} rows — skipping seed.`);
} else {
  for (const event of events) {
    await connection.execute(
      `INSERT INTO events (title, description, eventDate, eventEndDate, location, eventType, capacity, isActive)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        event.title,
        event.description,
        event.eventDate,
        event.eventEndDate,
        event.location,
        event.eventType,
        event.capacity,
        event.isActive ? 1 : 0,
      ]
    );
    console.log(`✓ Inserted: ${event.title}`);
  }
  console.log("\nAll events seeded successfully!");
}

await connection.end();
