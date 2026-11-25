CREATE TABLE `events` (
	`id` int AUTO_INCREMENT NOT NULL,
	`title` varchar(255) NOT NULL,
	`description` text,
	`eventDate` int NOT NULL,
	`eventEndDate` int,
	`location` varchar(255),
	`eventType` enum('online','in-person','hybrid') NOT NULL DEFAULT 'in-person',
	`capacity` int,
	`isActive` boolean NOT NULL DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `events_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `trainingRequests` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`email` varchar(320) NOT NULL,
	`phone` varchar(30),
	`preferredDate` int,
	`topics` text,
	`message` text,
	`status` enum('pending','contacted','scheduled','completed','cancelled') NOT NULL DEFAULT 'pending',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `trainingRequests_id` PRIMARY KEY(`id`)
);
