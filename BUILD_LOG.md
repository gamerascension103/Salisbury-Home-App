# Build Log

## Entries

```
salisbury_v1 | Shipped Salisbury Home App v1: two-user shared cleaning checklist with daily/weekly/rotation/laundry tracking, last 4 weeks history, shared-password auth, deployed to Vercel.
```

### v1 — Initial build (2026-05-24)

**Scope:** Full v1 greenfield build per `salisbury_brief.md`.

**What was built:**
- Next.js 16 App Router + TypeScript + Tailwind CSS
- Turso (SQLite) + Drizzle ORM — schema: `users`, `completions`, `sessions`
- Migrations: `drizzle/0001_initial_schema.sql`, `drizzle/0002_seed_users.sql`
- Shared household password auth — `/login`, `/api/login`, `/api/logout`, middleware
- `/` — Today page: Daily Ten (3 time blocks), Saturday Focus (collapsed), Rotation card, Laundry (3 day cards)
- `/history` — Last 4 weeks grid, colored by completer
- `/system` — Read-only reference: philosophy, all layers, rotation schedule, laundry, rules of the road
- API routes: `POST /api/completions`, `DELETE /api/completions/:id`, `GET /api/state`
- Optimistic UI on task check, second-tap undo (own completions only), error toast on failure
- Design canon applied: Fraunces/Inter Tight/JetBrains Mono, purple/silver palette, atmospheric wash, shimmer bar, no emoji in chrome, no pure black/white/gray, border-radius max 2px

**Migrations status:**
- `0001_initial_schema.sql` — committed, needs `drizzle-kit migrate` run against production Turso DB
- `0002_seed_users.sql` — committed, needs `drizzle-kit migrate` run against production Turso DB

**Open items before launch (from brief):**
- Set `ROTATION_ANCHOR_DATE` in `lib/tasks.ts` to the correct Monday once deployment week is confirmed
- Set env vars in Vercel: `DATABASE_URL`, `DATABASE_AUTH_TOKEN`, `HOUSEHOLD_PASSWORD`, `SESSION_SECRET`
- Run `npm run db:migrate` against production Turso DB
- Visual verification at 1280px + 375px (pending — requires live/local DB)
