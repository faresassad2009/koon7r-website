CREATE TABLE `customDesigns` (
	`id` varchar(64) NOT NULL,
	`orderId` varchar(64) NOT NULL,
	`frontDesignUrl` text,
	`backDesignUrl` text,
	`createdAt` timestamp DEFAULT (now()),
	CONSTRAINT `customDesigns_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `messages` (
	`id` varchar(64) NOT NULL,
	`name` varchar(255) NOT NULL,
	`email` varchar(320) NOT NULL,
	`message` text NOT NULL,
	`isRead` boolean NOT NULL DEFAULT false,
	`createdAt` timestamp DEFAULT (now()),
	CONSTRAINT `messages_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `settings` (
	`key` varchar(255) NOT NULL,
	`value` text NOT NULL,
	`updatedAt` timestamp DEFAULT (now()),
	CONSTRAINT `settings_key` PRIMARY KEY(`key`)
);
