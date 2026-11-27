-- The standalone app no longer uses the legacy OAuth users table.
-- Deliberately retain any existing rows: removing an integration is not authorization to delete user data.
-- Fresh standalone schema management uses drizzle/schema.ts (events, eventSignups, trainingRequests only).
SELECT 1;
