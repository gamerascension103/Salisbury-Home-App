"use client";

import { useState, useRef, useCallback } from "react";
import { formatInTimeZone } from "date-fns-tz";
import { Check } from "lucide-react";

export interface CompletionData {
  id: number;
  task_key: string;
  user_id: string;
  completed_at: number;
  period_key: string;
}

export interface UserData {
  id: string;
  display_name: string;
  color: string;
}

interface TaskRowProps {
  taskKey: string;
  label: string;
  description: string;
  duration: string;
  completion: CompletionData | null;
  users: UserData[];
  currentUserId: string;
  onError: (msg: string) => void;
  inverted?: boolean;
}

const TZ = "America/Chicago";

export function TaskRow({
  taskKey,
  label,
  description,
  duration,
  completion: initialCompletion,
  users,
  currentUserId,
  onError,
  inverted = false,
}: TaskRowProps) {
  const [completion, setCompletion] = useState<CompletionData | null>(
    initialCompletion
  );
  const [showDetail, setShowDetail] = useState(false);
  const [animating, setAnimating] = useState(false);
  const tapCountRef = useRef(0);
  const tapTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const completer = completion
    ? users.find((u) => u.id === completion.user_id)
    : null;

  const handleTap = useCallback(async () => {
    if (animating) return;

    if (!completion) {
      setAnimating(true);
      const optimistic: CompletionData = {
        id: -1,
        task_key: taskKey,
        user_id: currentUserId,
        completed_at: Date.now(),
        period_key: "",
      };
      setCompletion(optimistic);

      const res = await fetch("/api/completions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ task_key: taskKey }),
      });

      if (res.ok) {
        const data = await res.json();
        setCompletion((prev) =>
          prev ? { ...prev, id: data.id } : null
        );
      } else {
        setCompletion(null);
        onError("Couldn't save — try again.");
      }
      setAnimating(false);
      return;
    }

    tapCountRef.current += 1;
    if (tapCountRef.current === 1) {
      setShowDetail((v) => !v);
      tapTimerRef.current = setTimeout(() => {
        tapCountRef.current = 0;
      }, 400);
    } else if (tapCountRef.current >= 2) {
      if (tapTimerRef.current) clearTimeout(tapTimerRef.current);
      tapCountRef.current = 0;
      setShowDetail(false);

      if (completion.user_id !== currentUserId) {
        onError("You can only undo your own completions.");
        return;
      }

      if (completion.id === -1) return;

      const saved = completion;
      setCompletion(null);
      const res = await fetch(`/api/completions/${saved.id}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        setCompletion(saved);
        if (res.status === 403) {
          onError("You can only undo your own completions.");
        } else {
          onError("Couldn't undo — try again.");
        }
      }
    }
  }, [completion, animating, currentUserId, taskKey, onError]);

  const checkerColor = completer?.color ?? "#5b3a8f";
  const isChecked = !!completion;

  return (
    <button
      type="button"
      onClick={handleTap}
      className={[
        "w-full text-left flex items-start gap-3 py-3 px-4 rounded-sm",
        "transition-colors duration-150 min-h-[44px]",
        isChecked ? "opacity-75" : inverted ? "hover:bg-white/10" : "hover:bg-[#ebe8f0]",
      ].join(" ")}
    >
      <span
        className={[
          "flex-shrink-0 mt-0.5 w-5 h-5 flex items-center justify-center border rounded-sm",
          "transition-all duration-200",
          animating ? "scale-110" : "scale-100",
        ].join(" ")}
        style={
          isChecked
            ? { backgroundColor: checkerColor, borderColor: checkerColor }
            : { backgroundColor: "var(--bg)", borderColor: "var(--rule)" }
        }
      >
        {isChecked && <Check size={12} strokeWidth={2.5} color="#f6f4f9" />}
      </span>

      <span className="flex-1 min-w-0">
        <span className="flex items-baseline gap-2 flex-wrap">
          <span
            className={[
              "text-[14px] font-[Inter_Tight,sans-serif]",
              isChecked
                ? "line-through " + (inverted ? "text-[#b8b3c4]" : "text-[#6b6378]")
                : inverted ? "text-[#f6f4f9]" : "text-[#1a1424]",
            ].join(" ")}
          >
            {label}
          </span>
          <span className="label-mono-xs text-[#6b6378] flex-shrink-0">
            {duration}
          </span>
        </span>

        {showDetail && completion && completer && (
          <span className="block mt-1 text-[12px] text-[#6b6378] font-[Inter_Tight,sans-serif]">
            Done by{" "}
            <span style={{ color: completer.color }}>{completer.display_name}</span>
            {" at "}
            {formatInTimeZone(
              new Date(completion.completed_at),
              TZ,
              "h:mm a"
            )}
            {completion.user_id === currentUserId && (
              <span className="ml-2 text-[#8a8599]">· tap again to undo</span>
            )}
          </span>
        )}
      </span>
    </button>
  );
}
