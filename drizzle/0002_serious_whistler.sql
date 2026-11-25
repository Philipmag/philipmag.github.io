ALTER TABLE `events` MODIFY COLUMN `eventDate` bigint NOT NULL;--> statement-breakpoint
ALTER TABLE `events` MODIFY COLUMN `eventEndDate` bigint;--> statement-breakpoint
ALTER TABLE `trainingRequests` MODIFY COLUMN `preferredDate` bigint;