import { formatInTimeZone, toZonedTime } from "date-fns-tz";
import { getISOWeek, getISOWeekYear } from "date-fns";

const TZ = "America/Chicago";

export function getDailyPeriodKey(date?: Date): string {
  const d = date ?? new Date();
  return formatInTimeZone(d, TZ, "yyyy-MM-dd");
}

export function getWeeklyPeriodKey(date?: Date): string {
  const d = date ?? new Date();
  const local = toZonedTime(d, TZ);
  const year = getISOWeekYear(local);
  const week = getISOWeek(local);
  return `${year}-W${String(week).padStart(2, "0")}`;
}

export function getPeriodKeyForTask(
  cadence: "daily" | "weekly",
  date?: Date
): string {
  return cadence === "daily"
    ? getDailyPeriodKey(date)
    : getWeeklyPeriodKey(date);
}

export function getDateDisplay(date?: Date): {
  dayLabel: string;
  weekLabel: string;
  weekKey: string;
} {
  const d = date ?? new Date();
  const dayLabel = formatInTimeZone(d, TZ, "EEEE, MMMM d");
  const weekLabel = formatInTimeZone(d, TZ, "MMMM d");
  const weekKey = getWeeklyPeriodKey(d);
  return { dayLabel, weekLabel, weekKey };
}

export function getLast4WeekKeys(date?: Date): string[] {
  const d = date ?? new Date();
  const keys: string[] = [];
  for (let i = 0; i < 4; i++) {
    const offset = new Date(d.getTime() - i * 7 * 24 * 60 * 60 * 1000);
    keys.push(getWeeklyPeriodKey(offset));
  }
  return keys.reverse();
}
