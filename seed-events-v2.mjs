import mysql from "mysql2/promise";
import * as dotenv from "dotenv";
dotenv.config();

const conn = await mysql.createConnection(process.env.DATABASE_URL);

// Clear existing events and signups
await conn.execute("DELETE FROM eventSignups");
await conn.execute("DELETE FROM events");

// June 28, 2026 — confirmed morning session (10:00 AM – 12:00 PM EDT)
// EDT = UTC-4, so 10:00 AM EDT = 14:00 UTC
const june28Morning = new Date("2026-06-28T14:00:00.000Z").getTime();
const june28MorningEnd = new Date("2026-06-28T16:00:00.000Z").getTime();

// June 28, 2026 — confirmed afternoon session (2:00 PM – 4:00 PM EDT)
// 2:00 PM EDT = 18:00 UTC
const june28Afternoon = new Date("2026-06-28T18:00:00.000Z").getTime();
const june28AfternoonEnd = new Date("2026-06-28T20:00:00.000Z").getTime();

await conn.execute(
  `INSERT INTO events (title, description, eventDate, eventEndDate, location, eventType, capacity, dateConfirmed, sessionSlot, isActive)
   VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
  [
    "Free Digital Safety Training — Morning Session",
    "Beginner-friendly session covering the basics of staying safe online. Topics include recognizing scam emails and texts, creating strong passwords, and safe web browsing. No prior experience needed — bring your questions!",
    june28Morning,
    june28MorningEnd,
    "Peterborough, Ontario",
    "in-person",
    20,
    true,
    "morning",
    true,
  ]
);

await conn.execute(
  `INSERT INTO events (title, description, eventDate, eventEndDate, location, eventType, capacity, dateConfirmed, sessionSlot, isActive)
   VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
  [
    "Free Digital Safety Training — Afternoon Session",
    "Intermediate session for those who want to go deeper. Topics include social media privacy settings, safe online banking, understanding AI and chatbots, and protecting your personal information online.",
    june28Afternoon,
    june28AfternoonEnd,
    "Peterborough, Ontario",
    "in-person",
    20,
    true,
    "afternoon",
    true,
  ]
);

// TBD events — dateConfirmed = false, eventDate = null placeholder (use 0)
const tbdEvents = [
  {
    title: "Scam Awareness Workshop",
    description: "An in-depth look at the most common scams targeting seniors in Canada today — phone scams, grandparent scams, online shopping fraud, and more. Learn how to protect yourself and your family.",
    sessionSlot: "full-day",
    eventType: "in-person",
    capacity: 30,
  },
  {
    title: "Social Media Safety Seminar",
    description: "Learn how to use Facebook, Instagram, and other platforms safely. We'll cover privacy settings, recognizing fake profiles, and how to avoid oversharing personal information.",
    sessionSlot: "morning",
    eventType: "in-person",
    capacity: 25,
  },
  {
    title: "Online Banking & Shopping Safety",
    description: "Gain confidence using online banking and shopping safely. We'll walk through secure login practices, how to spot fake websites, and what to do if something goes wrong.",
    sessionSlot: "afternoon",
    eventType: "in-person",
    capacity: 25,
  },
  {
    title: "AI & Technology Q&A Session",
    description: "An open Q&A session about artificial intelligence, smart devices, and new technology. Bring your questions — no topic is too basic. We're here to help you understand the digital world.",
    sessionSlot: "evening",
    eventType: "hybrid",
    capacity: 40,
  },
];

for (const ev of tbdEvents) {
  await conn.execute(
    `INSERT INTO events (title, description, eventDate, eventEndDate, location, eventType, capacity, dateConfirmed, sessionSlot, isActive)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      ev.title,
      ev.description,
      null,
      null,
      "Peterborough, Ontario",
      ev.eventType,
      ev.capacity,
      false,
      ev.sessionSlot,
      true,
    ]
  );
}

await conn.end();
console.log("✅ Events seeded: 2 confirmed (June 28) + 4 TBD");
