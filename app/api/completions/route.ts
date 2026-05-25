import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { completions, appState } from "@/lib/db/schema";
import { getSessionTokenFromCookie, getSessionUser } from "@/lib/auth";
import { TASK_MAP } from "@/lib/tasks";
import { getPeriodKeyForTask } from "@/lib/periods";
import { and, eq } from "drizzle-orm";

export async function POST(request: NextRequest) {
  const token = await getSessionTokenFromCookie();
  if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const userId = await getSessionUser(token);
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const { task_key } = body as { task_key: string };

  const task = TASK_MAP[task_key];
  if (!task) return NextResponse.json({ error: "Unknown task" }, { status: 400 });

  const stateRows = await db.select().from(appState).where(eq(appState.id, 1)).limit(1);
  const vacation = stateRows[0];
  const refDate =
    vacation?.vacation_mode && vacation.vacation_started_at
      ? new Date(vacation.vacation_started_at)
      : undefined;

  const period_key = getPeriodKeyForTask(task.cadence, refDate);
  const now = Date.now();

  const existing = await db
    .select()
    .from(completions)
    .where(
      and(
        eq(completions.task_key, task_key),
        eq(completions.period_key, period_key)
      )
    )
    .limit(1);

  if (existing.length > 0) {
    return NextResponse.json({ ok: true, id: existing[0].id, idempotent: true });
  }

  const result = await db
    .insert(completions)
    .values({
      task_key,
      user_id: userId,
      completed_at: now,
      period_key,
    })
    .returning();

  return NextResponse.json({ ok: true, id: result[0].id });
}
