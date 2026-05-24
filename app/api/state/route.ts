import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { completions, users } from "@/lib/db/schema";
import { getSessionTokenFromCookie, getSessionUser } from "@/lib/auth";
import { getDailyPeriodKey, getWeeklyPeriodKey, getLast4WeekKeys } from "@/lib/periods";
import { inArray } from "drizzle-orm";

export async function GET(request: NextRequest) {
  const token = await getSessionTokenFromCookie();
  if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const userId = await getSessionUser(token);
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const dailyKey = getDailyPeriodKey();
  const weeklyKey = getWeeklyPeriodKey();
  const last4Weeks = getLast4WeekKeys();

  const allPeriodKeys = Array.from(
    new Set([dailyKey, weeklyKey, ...last4Weeks])
  );

  const rows = await db
    .select()
    .from(completions)
    .where(inArray(completions.period_key, allPeriodKeys));

  const allUsers = await db.select().from(users);

  return NextResponse.json({
    userId,
    dailyKey,
    weeklyKey,
    last4Weeks,
    completions: rows,
    users: allUsers,
  });
}
