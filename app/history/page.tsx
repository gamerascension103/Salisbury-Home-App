import { redirect } from "next/navigation";
import { getSessionTokenFromCookie, getSessionUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { completions, users, appState } from "@/lib/db/schema";
import { getLast4WeekKeys, getDailyPeriodKey } from "@/lib/periods";
import {
  DAILY_TASKS,
  WEEKLY_TASKS,
  ROTATION_TASKS,
  LAUNDRY_TASKS,
} from "@/lib/tasks";
import { eq, inArray } from "drizzle-orm";
import { Header } from "@/components/Header";

export const dynamic = "force-dynamic";

export default async function HistoryPage() {
  const token = await getSessionTokenFromCookie();
  if (!token) redirect("/login");

  const userId = await getSessionUser(token);
  if (!userId) redirect("/login");

  const allUsers = await db.select().from(users);
  const currentUser = allUsers.find((u) => u.id === userId);
  if (!currentUser) redirect("/login");

  const userMap = Object.fromEntries(allUsers.map((u) => [u.id, u]));

  const vacationRows = await db.select().from(appState).where(eq(appState.id, 1)).limit(1);
  const vacation = vacationRows[0] ?? null;
  const isVacation = vacation?.vacation_mode ?? false;
  const vacationUser = vacation?.updated_by
    ? allUsers.find((u) => u.id === vacation.updated_by) ?? null
    : null;

  const last4Weeks = getLast4WeekKeys();
  const dailyKey = getDailyPeriodKey();

  const rows = await db
    .select()
    .from(completions)
    .where(inArray(completions.period_key, last4Weeks));

  const completionIndex: Record<string, { user_id: string }> = {};
  for (const row of rows) {
    const k = `${row.task_key}::${row.period_key}`;
    if (!completionIndex[k]) {
      completionIndex[k] = { user_id: row.user_id };
    }
  }

  const historyTasks = [
    { group: "Daily", tasks: DAILY_TASKS },
    { group: "Weekly Focus", tasks: WEEKLY_TASKS },
    { group: "Rotation", tasks: ROTATION_TASKS },
    { group: "Laundry", tasks: LAUNDRY_TASKS },
  ];

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
      <main className="max-w-document mx-auto px-6 py-10">
        <div className="mb-8">
          <h1
            className="font-fraunces text-h2 text-[#1a1424]"
            style={{ fontVariationSettings: '"opsz" 72' }}
          >
            Last 4 Weeks
          </h1>
          <p className="label-mono text-[#6b6378] mt-1">Completion history</p>
        </div>

        <div className="bg-[#f6f4f9] border border-[#c9c2d4] rounded-sm overflow-hidden card-shadow">
          <div className="shimmer-bar" />
          <div className="overflow-x-auto">
            <table className="w-full min-w-[560px]">
              <thead>
                <tr className="border-b border-[#c9c2d4]">
                  <th className="text-left px-5 py-3 label-mono text-[#6b6378] text-[10px] font-normal w-[220px]">
                    Task
                  </th>
                  {last4Weeks.map((wk) => (
                    <th
                      key={wk}
                      className="text-center px-3 py-3 label-mono text-[#6b6378] text-[10px] font-normal"
                    >
                      {wk.replace("-W", " W")}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {historyTasks.map(({ group, tasks }) => (
                  <>
                    <tr key={`group-${group}`} className="bg-[#ebe8f0]">
                      <td
                        colSpan={5}
                        className="px-5 py-1.5 label-mono text-[#5b3a8f] text-[10px]"
                      >
                        {group}
                      </td>
                    </tr>
                    {tasks.map((task) => (
                      <tr
                        key={task.key}
                        className="border-t border-[#c9c2d4] hover:bg-[#ebe8f0] transition-colors duration-100"
                      >
                        <td className="px-5 py-2.5 text-[13px] text-[#3a2f4a] font-[Inter_Tight,sans-serif]">
                          {task.label}
                        </td>
                        {last4Weeks.map((wk) => {
                          const periodKey =
                            task.cadence === "daily" ? dailyKey : wk;
                          const k = `${task.key}::${periodKey}`;
                          const c = completionIndex[k];
                          const completer = c ? userMap[c.user_id] : null;
                          return (
                            <td key={wk} className="text-center px-3 py-2.5">
                              {completer ? (
                                <span
                                  className="inline-flex items-center justify-center w-5 h-5 rounded-sm"
                                  style={{ backgroundColor: completer.color }}
                                  title={`Done by ${completer.display_name}`}
                                >
                                  <svg
                                    width="10"
                                    height="8"
                                    viewBox="0 0 10 8"
                                    fill="none"
                                  >
                                    <path
                                      d="M1 4L3.5 6.5L9 1"
                                      stroke="#f6f4f9"
                                      strokeWidth="1.8"
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                    />
                                  </svg>
                                </span>
                              ) : (
                                <span className="inline-block w-5 h-5 border border-[#c9c2d4] rounded-sm" />
                              )}
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </>
                ))}
              </tbody>
            </table>
          </div>

          <div className="px-5 py-3 border-t border-[#c9c2d4] flex items-center gap-4">
            {allUsers.map((u) => (
              <div key={u.id} className="flex items-center gap-1.5">
                <span
                  className="inline-block w-3 h-3 rounded-sm"
                  style={{ backgroundColor: u.color }}
                />
                <span className="label-mono-xs text-[#6b6378]">{u.display_name}</span>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
