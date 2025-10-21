CREATE TABLE `orders` (
	`id` varchar(64) NOT NULL,
	`userId` varchar(64),
	`customerName` varchar(255) NOT NULL,
	`customerEmail` varchar(320),
	`customerPhone` varchar(50) NOT NULL,
	`customerAddress` text NOT NULL,
	`items` text NOT NULL,
	`totalAmount` int NOT NULL,
	`status` enum('pending','confirmed','processing','shipped','delivered','cancelled') NOT NULL DEFAULT 'pending',
	`notes` text,
	`createdAt` timestamp DEFAULT (now()),
	`updatedAt` timestamp DEFAULT (now()),
	CONSTRAINT `orders_id` PRIMARY KEY(`id`)
);
