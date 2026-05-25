import { redirect } from "next/navigation";
import { getSessionTokenFromCookie, getSessionUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { users, appState } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { Header } from "@/components/Header";
import { ROTATION_TASKS, LAUNDRY_TASKS } from "@/lib/tasks";

export const dynamic = "force-dynamic";

export default async function SystemPage() {
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
  const vacationUser = vacation?.updated_by
    ? allUsers.find((u) => u.id === vacation.updated_by) ?? null
    : null;

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
      <main className="max-w-document mx-auto px-6 py-10 space-y-12">
        <div>
          <h1
            className="font-fraunces text-h2 text-[#1a1424] mb-1"
            style={{ fontVariationSettings: '"opsz" 72' }}
          >
            The System
          </h1>
          <p className="label-mono text-[#6b6378]">Reference — read-only</p>
        </div>

        <div className="space-y-2">
          <div className="flex items-baseline gap-3 pb-2 border-b-[3px] border-double border-[#1a1424]">
            <span className="label-mono text-[#5b3a8f]">01</span>
            <h2
              className="font-fraunces text-h2 text-[#1a1424]"
              style={{ fontVariationSettings: '"opsz" 72' }}
            >
              Philosophy
            </h2>
          </div>
          <div className="bg-[#f6f4f9] border border-[#c9c2d4] rounded-sm px-6 py-5 space-y-4 callout-primary">
            <p className="font-fraunces text-lead text-[#1a1424] italic">
              &ldquo;Clean enough to be healthy, tidy enough to be calm, not so perfect that it becomes a burden.&rdquo;
            </p>
            <p className="text-body text-[#3a2f4a] font-[Inter_Tight,sans-serif]">
              The system runs on layers. The Daily Ten handles the entropy of everyday life. The Saturday Focus handles the week&rsquo;s accumulated grime. The Rotation handles the deep work that only needs doing monthly. No layer is optional — but none of them should take more than an hour on a bad week.
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-baseline gap-3 pb-2 border-b-[3px] border-double border-[#1a1424]">
            <span className="label-mono text-[#5b3a8f]">02</span>
            <h2
              className="font-fraunces text-h2 text-[#1a1424]"
              style={{ fontVariationSettings: '"opsz" 72' }}
            >
              Layer One — The Daily Ten
            </h2>
          </div>
          <div className="bg-[#f6f4f9] border border-[#c9c2d4] rounded-sm overflow-hidden">
            <div className="px-5 py-3 border-b border-dashed border-[#c9c2d4]">
              <p className="label-mono text-[#6b6378] text-[10px]">Total time: ~20 min</p>
            </div>
            {[
              { slot: "Morning", items: ["Make the bed (3 min)", "Start laundry if it&rsquo;s laundry day (2 min)"] },
              { slot: "After Dinner", items: ["Kitchen reset — dishes, counters, stovetop (10 min)", "One clutter hotspot — entry, coffee table, or nightstand (3 min)"] },
              { slot: "Before Bed", items: ["Shine the sink (2 min)", "Floor scan — pick up anything on the floor (2 min)"] },
            ].map(({ slot, items }) => (
              <div key={slot} className="px-5 py-4 border-t border-[#c9c2d4] first:border-t-0">
                <p
                  className="font-fraunces text-[15px] font-[500] italic text-[#1a1424] mb-2"
                >
                  {slot}
                </p>
                <ul className="space-y-1">
                  {items.map((item) => (
                    <li
                      key={item}
                      className="text-body-sm text-[#3a2f4a] font-[Inter_Tight,sans-serif] pl-4 relative before:absolute before:left-0 before:content-['–'] before:text-[#6b6378]"
                      dangerouslySetInnerHTML={{ __html: item }}
                    />
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-baseline gap-3 pb-2 border-b-[3px] border-double border-[#1a1424]">
            <span className="label-mono text-[#5b3a8f]">03</span>
            <h2
              className="font-fraunces text-h2 text-[#1a1424]"
              style={{ fontVariationSettings: '"opsz" 72' }}
            >
              Layer Two — Saturday Focus
            </h2>
          </div>
          <div className="bg-[#f6f4f9] border border-[#c9c2d4] rounded-sm overflow-hidden">
            <div className="px-5 py-3 border-b border-dashed border-[#c9c2d4]">
              <p className="label-mono text-[#6b6378] text-[10px]">Total time: ~80–90 min · Weekly</p>
            </div>
            {[
              "Pre-clean tidy — surfaces clear before you start",
              "Dust all surfaces — shelves, baseboards, ceiling fans, tops of frames",
              "Full bathroom clean — toilet, sink, mirror, tub. Restock supplies.",
              "Vacuum all rooms — every room, including under furniture edges",
              "Mop hard floors — kitchen and bathroom",
              "This week&rsquo;s rotating task — see rotation schedule",
            ].map((item, i) => (
              <div
                key={i}
                className="flex items-baseline gap-3 px-5 py-3 border-t border-[#c9c2d4] first:border-t-0"
              >
                <span className="label-mono-xs text-[#5b3a8f] flex-shrink-0">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span
                  className="text-body-sm text-[#3a2f4a] font-[Inter_Tight,sans-serif]"
                  dangerouslySetInnerHTML={{ __html: item }}
                />
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-baseline gap-3 pb-2 border-b-[3px] border-double border-[#1a1424]">
            <span className="label-mono text-[#5b3a8f]">04</span>
            <h2
              className="font-fraunces text-h2 text-[#1a1424]"
              style={{ fontVariationSettings: '"opsz" 72' }}
            >
              Layer Three — The Rotation
            </h2>
          </div>
          <p className="text-body text-[#3a2f4a] font-[Inter_Tight,sans-serif]">
            Eight tasks on an 8-week cycle. One per week, added to Saturday Focus. Each task cycles back every two months — enough to stay on top of the deep work without it feeling like a project.
          </p>
          <div className="bg-[#f6f4f9] border border-[#c9c2d4] rounded-sm overflow-hidden">
            {ROTATION_TASKS.map((task, i) => (
              <div
                key={task.key}
                className="flex items-start gap-4 px-5 py-4 border-t border-[#c9c2d4] first:border-t-0"
              >
                <span className="label-mono text-[#5b3a8f] text-[11px] flex-shrink-0 mt-0.5">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-body-sm font-[500] text-[#1a1424] font-[Inter_Tight,sans-serif]">
                    {task.label}
                  </p>
                  <p className="text-[13px] text-[#6b6378] font-[Inter_Tight,sans-serif] mt-0.5">
                    {task.description}
                  </p>
                </div>
                <span className="label-mono-xs text-[#6b6378] flex-shrink-0">{task.duration}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-baseline gap-3 pb-2 border-b-[3px] border-double border-[#1a1424]">
            <span className="label-mono text-[#5b3a8f]">05</span>
            <h2
              className="font-fraunces text-h2 text-[#1a1424]"
              style={{ fontVariationSettings: '"opsz" 72' }}
            >
              Laundry Schedule
            </h2>
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            {LAUNDRY_TASKS.map((task) => (
              <div
                key={task.key}
                className="bg-[#f6f4f9] border border-[#c9c2d4] rounded-sm px-5 py-4 callout-secondary"
              >
                <p className="label-mono text-[#5b3a8f] text-[11px] mb-1">{task.subGroup}</p>
                <p className="text-body-sm font-[500] text-[#1a1424] font-[Inter_Tight,sans-serif]">
                  {task.label}
                </p>
                <p className="text-[13px] text-[#6b6378] font-[Inter_Tight,sans-serif] mt-1">
                  {task.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-baseline gap-3 pb-2 border-b-[3px] border-double border-[#1a1424]">
            <span className="label-mono text-[#5b3a8f]">06</span>
            <h2
              className="font-fraunces text-h2 text-[#1a1424]"
              style={{ fontVariationSettings: '"opsz" 72' }}
            >
              Rules of the Road
            </h2>
          </div>
          <div className="bg-[#f6f4f9] border border-[#c9c2d4] rounded-sm overflow-hidden callout-secondary">
            {[
              "The system is owned jointly. Neither person is the household manager.",
              "Done is done. A 70% kitchen reset is better than a skipped one.",
              "If a task gets missed, it rolls to the next day/week. Don't double up — that creates pressure.",
              "The rotation is a guideline. If the fridge week arrives and the fridge was just cleaned last month, skip it and note it.",
              "Supplies run out. First person to notice, first person to restock.",
            ].map((rule, i) => (
              <div
                key={i}
                className="flex items-start gap-4 px-5 py-4 border-t border-[#c9c2d4] first:border-t-0"
              >
                <span className="label-mono-xs text-[#8a8599] flex-shrink-0 mt-0.5">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <p className="text-body-sm text-[#3a2f4a] font-[Inter_Tight,sans-serif]">
                  {rule}
                </p>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
