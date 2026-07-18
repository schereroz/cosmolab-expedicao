CREATE TABLE `game_states` (
	`family_id` text PRIMARY KEY NOT NULL,
	`profile_json` text NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
