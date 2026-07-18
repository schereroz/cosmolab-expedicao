import { sql } from "drizzle-orm";
import { sqliteTable, text } from "drizzle-orm/sqlite-core";

export const gameStates = sqliteTable("game_states", {
  familyId: text("family_id").primaryKey(),
  profileJson: text("profile_json").notNull(),
  updatedAt: text("updated_at").notNull().default(sql`CURRENT_TIMESTAMP`),
});
