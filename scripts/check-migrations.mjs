import { createClient } from "@libsql/client";

const c = createClient({
  url: process.env.DATABASE_URL,
  authToken: process.env.DATABASE_AUTH_TOKEN,
});

const rows = await c.execute("SELECT * FROM __drizzle_migrations");
console.log("__drizzle_migrations:", rows.rows);
