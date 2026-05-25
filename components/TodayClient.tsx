"use client";

import { useState, useCallback } from "react";
import { formatInTimeZone } from "date-fns-tz";
import { TaskRow, CompletionData, UserData } from "./TaskRow";
import { SectionCard } from "./SectionCard";
import { Toast } from "./Toast";
import { DAILY_TASKS, WEEKLY_TASKS, LAUNDRY_TASKS } from "@/lib/tasks";
import { Check } from "lucide-react";

interface RotationTaskInfo {
  key: string;
  label: string;
  description: string;
  duration: string;
}

const TZ = "America/Chicago";

interface TodayClientProps {
  currentUserId: string;
  users: UserData[];
  completions: CompletionData[];
  dailyKey: string;
  weeklyKey: string;
  dayLabel: string;
  weekLabel: string;
  weekKey: string;
  rotationIndex: number;
  currentRotationTask: RotationTaskInfo;
  vacationMode: boolean;
  vacationStartedAt: number | null;
  vacationSetByName: string | null;
}

export function TodayClient({
  currentUserId,
  users,
  completions: initialCompletions,
  dailyKey,
  weeklyKey,
  dayLabel,
  weekLabel,
  weekKey,
  rotationIndex,
  currentRotationTask,
  vacationMode,
  vacationStartedAt,
  vacationSetByName,
}: TodayClientProps) {
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const handleError = useCallback((msg: string) => {
    setToastMsg(msg);
  }, []);

  function getCompletion(taskKey: string, periodKey: string): CompletionData | null {
    return (
      initialCompletions.find(
        (c) => c.task_key === taskKey && c.period_key === periodKey
      ) ?? null
    );
  }

  const morningTasks = DAILY_TASKS.filter((t) => t.subGroup === "Morning");
  const eveningTasks = DAILY_TASKS.filter((t) => t.subGroup === "After Dinner");
  const bedtimeTasks = DAILY_TASKS.filter((t) => t.subGroup === "Before Bed");

  const rotationNum = String(rotationIndex + 1).padStart(2, "0");

  return (
    <>
      {vacationMode && (
        <div className="px-6 py-2 border-b border-[#c9c2d4] bg-[#f6f4f9]">
          <p className="label-mono text-[10px] text-[#6b6378]">
            Paused since{" "}
            {vacationStartedAt
              ? formatInTimeZone(
                  new Date(vacationStartedAt),
                  TZ,
                  "EEEE, MMMM d"
                )
              : "an earlier date"}
            {vacationSetByName ? ` by ${vacationSetByName}` : ""}. Tap AWAY to
            resume.
          </p>
        </div>
      )}
      <main className="max-w-document mx-auto px-6 py-10 space-y-8">
        <div className="mb-2">
          <h1
            className="font-fraunces text-[28px] font-[500] text-[#1a1424] leading-tight"
            style={{ fontVariationSettings: '"opsz" 72' }}
          >
            {vacationMode ? `Paused — viewing ${dayLabel}` : dayLabel}
          </h1>
          <p className="label-mono text-[#6b6378] mt-1">
            Week of {weekLabel} · Week {rotationNum} of the rotation
          </p>
        </div>

        <div className="space-y-4">
          <div className="flex items-baseline gap-3 pb-2 border-b-[3px] border-double border-[#1a1424]">
            <span className="label-mono text-[#5b3a8f]">01</span>
            <h2
              className="font-fraunces text-h2 text-[#1a1424] flex-1"
              style={{ fontVariationSettings: '"opsz" 72' }}
            >
              The Daily Ten
            </h2>
            <span className="label-mono-xs text-[#6b6378]">Daily</span>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            {[
              { label: "Morning", tasks: morningTasks },
              { label: "After Dinner", tasks: eveningTasks },
              { label: "Before Bed", tasks: bedtimeTasks },
            ].map(({ label, tasks }) => (
              <div
                key={label}
                className="bg-[#f6f4f9] border border-[#c9c2d4] rounded-sm overflow-hidden"
              >
                <div className="px-4 py-2.5 border-b border-dashed border-[#c9c2d4]">
                  <span
                    className="font-fraunces text-[15px] font-[500] italic text-[#1a1424]"
                  >
                    {label}
                  </span>
                </div>
                <div className="py-1">
                  {tasks.map((task) => (
                    <TaskRow
                      key={task.key}
                      taskKey={task.key}
                      label={task.label}
                      description={task.description}
                      duration={task.duration}
                      completion={getCompletion(task.key, dailyKey)}
                      users={users}
                      currentUserId={currentUserId}
                      onError={handleError}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-baseline gap-3 pb-2 border-b-[3px] border-double border-[#1a1424]">
            <span className="label-mono text-[#5b3a8f]">02</span>
            <h2
              className="font-fraunces text-h2 text-[#1a1424] flex-1"
              style={{ fontVariationSettings: '"opsz" 72' }}
            >
              Saturday Focus
            </h2>
            <span className="label-mono-xs text-[#6b6378]">Weekly</span>
          </div>

          <SectionCard
            number="02"
            title="Weekly tasks"
            meta="Once a week"
            defaultCollapsed={true}
          >
            {WEEKLY_TASKS.map((task, i) => (
              <TaskRow
                key={task.key}
                taskKey={task.key}
                label={`${String(i + 1).padStart(2, "0")}. ${task.label}`}
                description={task.description}
                duration={task.duration}
                completion={getCompletion(task.key, weeklyKey)}
                users={users}
                currentUserId={currentUserId}
                onError={handleError}
              />
            ))}
          </SectionCard>
        </div>

        <div className="space-y-4">
          <div className="flex items-baseline gap-3 pb-2 border-b-[3px] border-double border-[#1a1424]">
            <span className="label-mono text-[#5b3a8f]">03</span>
            <h2
              className="font-fraunces text-h2 text-[#1a1424] flex-1"
              style={{ fontVariationSettings: '"opsz" 72' }}
            >
              This Week&apos;s Task
            </h2>
            <span className="label-mono-xs text-[#6b6378]">
              Rotation {rotationNum} / 08
            </span>
          </div>

          <RotationCard
            task={currentRotationTask}
            completion={getCompletion(currentRotationTask.key, weeklyKey)}
            users={users}
            currentUserId={currentUserId}
            onError={handleError}
          />
        </div>

        <div className="space-y-4">
          <div className="flex items-baseline gap-3 pb-2 border-b-[3px] border-double border-[#1a1424]">
            <span className="label-mono text-[#5b3a8f]">04</span>
            <h2
              className="font-fraunces text-h2 text-[#1a1424] flex-1"
              style={{ fontVariationSettings: '"opsz" 72' }}
            >
              Laundry
            </h2>
            <span className="label-mono-xs text-[#6b6378]">Tue · Thu · Sat</span>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            {LAUNDRY_TASKS.map((task) => (
              <div
                key={task.key}
                className="bg-[#f6f4f9] border border-[#c9c2d4] rounded-sm overflow-hidden"
              >
                <div className="px-4 py-2.5 border-b border-dashed border-[#c9c2d4]">
                  <span className="label-mono text-[#5b3a8f] text-[11px]">
                    {task.subGroup}
                  </span>
                </div>
                <div className="py-1">
                  <TaskRow
                    taskKey={task.key}
                    label={task.label}
                    description={task.description}
                    duration={task.duration}
                    completion={getCompletion(task.key, weeklyKey)}
                    users={users}
                    currentUserId={currentUserId}
                    onError={handleError}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {toastMsg && (
        <Toast message={toastMsg} onDismiss={() => setToastMsg(null)} />
      )}
    </>
  );
}

interface RotationCardProps {
  task: RotationTaskInfo;
  completion: CompletionData | null;
  users: UserData[];
  currentUserId: string;
  onError: (msg: string) => void;
}

function RotationCard({
  task,
  completion,
  users,
  currentUserId,
  onError,
}: RotationCardProps) {
  return (
    <div
      className="relative overflow-hidden rounded-sm border border-[#c9c2d4]"
      style={{
        background: "linear-gradient(135deg, var(--accent-deep) 0%, var(--ink) 100%)",
      }}
    >
      <div
        className="absolute top-0 right-0 w-48 h-48 pointer-events-none"
        style={{
          background:
            "radial-gradient(circle at 100% 0%, rgba(212, 208, 220, 0.15) 0%, transparent 60%)",
        }}
      />
      <div className="relative px-6 py-5">
        <p className="label-mono text-[#d4d0dc] text-[10px] mb-2">
          Deep clean rotation
        </p>
        <h3 className="font-fraunces text-[20px] font-[500] text-[#f6f4f9] mb-2 leading-snug">
          {task.label}
        </h3>
        <p className="text-[14px] text-[#b8b3c4] font-[Inter_Tight,sans-serif] leading-relaxed mb-4">
          {task.description}
        </p>
        <TaskRow
          taskKey={task.key}
          label="Mark done"
          description={task.description}
          duration={task.duration}
          completion={completion}
          users={users}
          currentUserId={currentUserId}
          onError={onError}
          inverted
        />
      </div>
    </div>
  );
}
