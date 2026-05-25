import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import { users } from "../lib/db/schema";

const client = createClient({
  url: process.env.DATABASE_URL!,
  authToken: process.env.DATABASE_AUTH_TOKEN,
});

const db = drizzle(client);

async function seed() {
  await db
    .insert(users)
    .values([
      { id: "jake", display_name: "Jake", color: "#5b3a8f" },
      { id: "hannah", display_name: "Hannah", color: "#8a8599" },
    ])
    .onConflictDoNothing();

  console.log("Seeded: jake (#5b3a8f), hannah (#8a8599)");
  process.exit(0);
}

seed().catch((e) => {
  console.error(e);
  process.exit(1);
});
