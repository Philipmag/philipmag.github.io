CREATE TABLE `eventSignups` (
	`id` int AUTO_INCREMENT NOT NULL,
	`eventId` int NOT NULL,
	`name` varchar(255) NOT NULL,
	`email` varchar(320) NOT NULL,
	`phone` varchar(30),
	`notes` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `eventSignups_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `events` MODIFY COLUMN `eventDate` bigint;--> statement-breakpoint
ALTER TABLE `events` ADD `dateConfirmed` boolean DEFAULT true NOT NULL;--> statement-breakpoint
ALTER TABLE `events` ADD `sessionSlot` enum('morning','afternoon','full-day','evening') DEFAULT 'full-day' NOT NULL;