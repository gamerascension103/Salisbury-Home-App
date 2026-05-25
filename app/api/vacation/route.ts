import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { appState } from "@/lib/db/schema";
import { getSessionTokenFromCookie, getSessionUser } from "@/lib/auth";
import { eq } from "drizzle-orm";

export async function POST(request: NextRequest) {
  const token = await getSessionTokenFromCookie();
  if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const userId = await getSessionUser(token);
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const { enabled } = body as { enabled: boolean };

  const now = Date.now();

  const rows = await db.select().from(appState).where(eq(appState.id, 1)).limit(1);
  const current = rows[0];

  if (!current) {
    await db.insert(appState).values({
      id: 1,
      vacation_mode: enabled,
      vacation_started_at: enabled ? now : null,
      updated_by: userId,
      updated_at: now,
    });
  } else if (current.vacation_mode === enabled) {
    return NextResponse.json(current);
  } else {
    await db
      .update(appState)
      .set({
        vacation_mode: enabled,
        vacation_started_at: enabled ? now : null,
        updated_by: userId,
        updated_at: now,
      })
      .where(eq(appState.id, 1));
  }

  const updated = await db.select().from(appState).where(eq(appState.id, 1)).limit(1);
  return NextResponse.json(updated[0]);
}
