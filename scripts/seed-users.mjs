import { createClient } from "@libsql/client";

const c = createClient({
  url: process.env.DATABASE_URL,
  authToken: process.env.DATABASE_AUTH_TOKEN,
});

await c.execute({
  sql: "INSERT OR IGNORE INTO users (id, display_name, color) VALUES (?, ?, ?)",
  args: ["jake", "Jake", "#5b3a8f"],
});
await c.execute({
  sql: "INSERT OR IGNORE INTO users (id, display_name, color) VALUES (?, ?, ?)",
  args: ["hannah", "Hannah", "#8a8599"],
});

const result = await c.execute("SELECT * FROM users ORDER BY id");
console.log("USERS:", result.rows);
