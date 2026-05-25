import { redirect } from "next/navigation";
import { getSessionTokenFromCookie, getSessionUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { completions, users, appState } from "@/lib/db/schema";
import { getDailyPeriodKey, getWeeklyPeriodKey, getDateDisplay } from "@/lib/periods";
import {
  DAILY_TASKS,
  WEEKLY_TASKS,
  ROTATION_TASKS,
  LAUNDRY_TASKS,
  getCurrentRotationTask,
  getRotationIndex,
} from "@/lib/tasks";
import { eq, inArray } from "drizzle-orm";
import { Header } from "@/components/Header";
import { TodayClient } from "@/components/TodayClient";

export const dynamic = "force-dynamic";

export default async function TodayPage() {
  const token = await getSessionTokenFromCookie();
  if (!token) redirect("/login");

  const userId = await getSessionUser(token);
  if (!userId) redirect("/login");

  const allUsers = await db.select().from(users);
  const currentUser = allUsers.find((u) => u.id === userId);
  if (!currentUser) redirect("/login");

  const vacationRows = await db.select().from(appState).where(eq(appState.id, 1)).limit(1);
  const vacation = vacationRows[0] ?? null;
  const isVacation = vacation?.vacation_mode ?? false;
  const refDate =
    isVacation && vacation?.vacation_started_at
      ? new Date(vacation.vacation_started_at)
      : new Date();

  const vacationUser = vacation?.updated_by
    ? allUsers.find((u) => u.id === vacation.updated_by) ?? null
    : null;

  const dailyKey = getDailyPeriodKey(refDate);
  const weeklyKey = getWeeklyPeriodKey(refDate);

  const rows = await db
    .select()
    .from(completions)
    .where(inArray(completions.period_key, [dailyKey, weeklyKey]));

  const { dayLabel, weekLabel, weekKey } = getDateDisplay(refDate);
  const rotationIndex = getRotationIndex(weekKey);
  const currentRotation = getCurrentRotationTask(weekKey);

  return (
    <div className="min-h-screen">
      <Header
        userId={currentUser.id}
        displayName={currentUser.display_name}
        color={currentUser.color}
        vacationMode={isVacation}
        vacationStartedAt={vacation?.vacation_started_at ?? null}
        vacationSetByName={vacationUser?.display_name ?? null}
      />
      <TodayClient
        currentUserId={userId}
        users={allUsers}
        completions={rows}
        dailyKey={dailyKey}
        weeklyKey={weeklyKey}
        dayLabel={dayLabel}
        weekLabel={weekLabel}
        weekKey={weekKey}
        rotationIndex={rotationIndex}
        currentRotationTask={{
          key: currentRotation.key,
          label: currentRotation.label,
          description: currentRotation.description,
          duration: currentRotation.duration,
        }}
        vacationMode={isVacation}
        vacationStartedAt={vacation?.vacation_started_at ?? null}
        vacationSetByName={vacationUser?.display_name ?? null}
      />
    </div>
  );
}
