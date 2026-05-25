CREATE TABLE `app_state` (
	`id` integer PRIMARY KEY NOT NULL,
	`vacation_mode` integer DEFAULT false NOT NULL,
	`vacation_started_at` integer,
	`updated_by` text NOT NULL,
	`updated_at` integer NOT NULL
);
