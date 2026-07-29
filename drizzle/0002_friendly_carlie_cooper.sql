CREATE TABLE `foods` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`name` varchar(128) NOT NULL,
	`brand` varchar(64),
	`unit` varchar(16) NOT NULL DEFAULT 'g',
	`servingSize` float NOT NULL DEFAULT 100,
	`calories` float NOT NULL,
	`protein` float NOT NULL,
	`carbs` float NOT NULL DEFAULT 0,
	`fat` float NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `foods_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `meal_entries` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`date` date NOT NULL,
	`meal` varchar(32) NOT NULL,
	`foodId` int NOT NULL,
	`quantity` float NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `meal_entries_id` PRIMARY KEY(`id`)
);
