import { integer, sqliteTable, text, index } from "drizzle-orm/sqlite-core";

export const users = sqliteTable("users", {
  id: text("id").primaryKey(),
  display_name: text("display_name").notNull(),
  color: text("color").notNull(),
});

export const completions = sqliteTable(
  "completions",
  {
    id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
    task_key: text("task_key").notNull(),
    user_id: text("user_id")
      .notNull()
      .references(() => users.id),
    completed_at: integer("completed_at", { mode: "number" }).notNull(),
    period_key: text("period_key").notNull(),
  },
  (table) => ({
    taskPeriodIdx: index("idx_task_period").on(table.task_key, table.period_key),
    completedAtIdx: index("idx_completed_at").on(table.completed_at),
  })
);

export const sessions = sqliteTable("sessions", {
  id: text("id").primaryKey(),
  user_id: text("user_id")
    .notNull()
    .references(() => users.id),
  created_at: integer("created_at", { mode: "number" }).notNull(),
  expires_at: integer("expires_at", { mode: "number" }).notNull(),
});

export type User = typeof users.$inferSelect;
export type Completion = typeof completions.$inferSelect;
export type Session = typeof sessions.$inferSelect;
