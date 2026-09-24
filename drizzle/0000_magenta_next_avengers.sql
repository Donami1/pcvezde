CREATE TABLE `Bookings` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`userId` text,
	`name` text NOT NULL,
	`phone` text NOT NULL,
	`city` text,
	`address` text,
	`period` text,
	`config` text,
	`comment` text,
	`status` text DEFAULT 'NEW' NOT NULL,
	`createdAt` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `Configs` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`slug` text NOT NULL,
	`name` text NOT NULL,
	`gpu` text NOT NULL,
	`cpu` text NOT NULL,
	`ram` text NOT NULL,
	`storage` text NOT NULL,
	`pricePerDay` integer NOT NULL,
	`pricePerMonth` integer,
	`image` text,
	`shortDesc` text,
	`features` text,
	`isActive` integer DEFAULT true NOT NULL,
	`sortOrder` integer DEFAULT 0 NOT NULL,
	`createdAt` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `Configs_slug_unique` ON `Configs` (`slug`);--> statement-breakpoint
CREATE TABLE `faq_items` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`question` text NOT NULL,
	`answer` text NOT NULL,
	`sortOrder` integer DEFAULT 0 NOT NULL,
	`createdAt` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `reviews` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`city` text DEFAULT '' NOT NULL,
	`rating` integer DEFAULT 5 NOT NULL,
	`text` text NOT NULL,
	`isActive` integer DEFAULT true NOT NULL,
	`sortOrder` integer DEFAULT 0 NOT NULL,
	`createdAt` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `settings` (
	`key` text PRIMARY KEY NOT NULL,
	`value` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `units` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`configId` integer,
	`label` text NOT NULL,
	`status` text DEFAULT 'FREE' NOT NULL,
	`bookingId` integer,
	`rentedAt` integer,
	`createdAt` integer NOT NULL,
	FOREIGN KEY (`configId`) REFERENCES `Configs`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`phone` text NOT NULL,
	`passwordHash` text NOT NULL,
	`createdAt` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `users_phone_unique` ON `users` (`phone`);