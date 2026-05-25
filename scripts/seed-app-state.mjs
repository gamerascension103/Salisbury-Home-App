import { createClient } from "@libsql/client";

const c = createClient({
  url: process.env.DATABASE_URL,
  authToken: process.env.DATABASE_AUTH_TOKEN,
});

await c.execute({
  sql: `INSERT OR IGNORE INTO app_state (id, vacation_mode, vacation_started_at, updated_by, updated_at)
        VALUES (1, 0, NULL, 'system', ?)`,
  args: [Date.now()],
});

const result = await c.execute("SELECT * FROM app_state WHERE id = 1");
console.log("APP_STATE:", result.rows);
