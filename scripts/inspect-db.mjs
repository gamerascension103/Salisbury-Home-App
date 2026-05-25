import { createClient } from "@libsql/client";

const c = createClient({
  url: process.env.DATABASE_URL,
  authToken: process.env.DATABASE_AUTH_TOKEN,
});

const tables = await c.execute(
  "SELECT name FROM sqlite_master WHERE type='table' ORDER BY name"
);
console.log("TABLES:", tables.rows.map((r) => r.name));

for (const row of tables.rows) {
  const count = await c.execute(`SELECT COUNT(*) as n FROM "${row.name}"`);
  console.log(`  ${row.name}: ${count.rows[0].n} rows`);
}

const users = await c.execute("SELECT * FROM users ORDER BY id");
console.log("\nUSERS:", users.rows);
