export type TaskLayer = "daily" | "weekly" | "rotation" | "laundry";
export type TaskCadence = "daily" | "weekly";

export interface TaskDef {
  key: string;
  label: string;
  description: string;
  duration: string;
  layer: TaskLayer;
  cadence: TaskCadence;
  subGroup?: string;
}

export const DAILY_TASKS: TaskDef[] = [
  {
    key: "daily.morning.make_bed",
    label: "Make the bed",
    description: "Pull it tight. Set the pillows.",
    duration: "3 MIN",
    layer: "daily",
    cadence: "daily",
    subGroup: "Morning",
  },
  {
    key: "daily.morning.start_laundry",
    label: "Start laundry if it's laundry day",
    description: "Check the weekly laundry schedule.",
    duration: "2 MIN",
    layer: "daily",
    cadence: "daily",
    subGroup: "Morning",
  },
  {
    key: "daily.evening.kitchen_reset",
    label: "Kitchen reset",
    description: "Dishes done or in dishwasher. Counters wiped. Stovetop clear.",
    duration: "10 MIN",
    layer: "daily",
    cadence: "daily",
    subGroup: "After Dinner",
  },
  {
    key: "daily.evening.clutter_hotspot",
    label: "One clutter hotspot",
    description: "Entry, coffee table, or nightstand — pick one and clear it.",
    duration: "3 MIN",
    layer: "daily",
    cadence: "daily",
    subGroup: "After Dinner",
  },
  {
    key: "daily.bedtime.shine_sink",
    label: "Shine the sink",
    description: "Wipe the bathroom and kitchen sinks dry.",
    duration: "2 MIN",
    layer: "daily",
    cadence: "daily",
    subGroup: "Before Bed",
  },
  {
    key: "daily.bedtime.floor_scan",
    label: "Floor scan",
    description: "Walk the apartment, pick up anything on the floor.",
    duration: "2 MIN",
    layer: "daily",
    cadence: "daily",
    subGroup: "Before Bed",
  },
];

export const WEEKLY_TASKS: TaskDef[] = [
  {
    key: "weekly.pre_clean_tidy",
    label: "Pre-clean tidy",
    description: "Clear surfaces, put things away so you can actually clean.",
    duration: "10 MIN",
    layer: "weekly",
    cadence: "weekly",
  },
  {
    key: "weekly.dust_surfaces",
    label: "Dust all surfaces",
    description: "Shelves, baseboards, ceiling fans, tops of frames.",
    duration: "15 MIN",
    layer: "weekly",
    cadence: "weekly",
  },
  {
    key: "weekly.bathrooms",
    label: "Full bathroom clean",
    description: "Toilet, sink, mirror, tub/shower. Restock paper + soap.",
    duration: "20 MIN",
    layer: "weekly",
    cadence: "weekly",
  },
  {
    key: "weekly.vacuum",
    label: "Vacuum all rooms",
    description: "Every room, including under furniture edges.",
    duration: "20 MIN",
    layer: "weekly",
    cadence: "weekly",
  },
  {
    key: "weekly.mop",
    label: "Mop hard floors",
    description: "Kitchen and bathroom floors.",
    duration: "15 MIN",
    layer: "weekly",
    cadence: "weekly",
  },
  {
    key: "weekly.rotating_task",
    label: "This week's rotating task",
    description: "See the rotation card below.",
    duration: "20–45 MIN",
    layer: "weekly",
    cadence: "weekly",
  },
];

export const ROTATION_TASKS: TaskDef[] = [
  {
    key: "rotation.01.appliance_exteriors",
    label: "Kitchen appliance exteriors",
    description:
      "Wipe down fridge exterior, dishwasher front, microwave exterior, toaster, coffee maker.",
    duration: "20 MIN",
    layer: "rotation",
    cadence: "weekly",
  },
  {
    key: "rotation.02.microwave_stovetop",
    label: "Microwave interior + stovetop deep",
    description:
      "Remove and soak microwave turntable. Scrub stovetop grates and drip pans.",
    duration: "25 MIN",
    layer: "rotation",
    cadence: "weekly",
  },
  {
    key: "rotation.03.baseboards_doorframes",
    label: "Baseboards + door frames",
    description:
      "Wipe all baseboards and door frames throughout the apartment.",
    duration: "30 MIN",
    layer: "rotation",
    cadence: "weekly",
  },
  {
    key: "rotation.04.bathroom_deep",
    label: "Bathroom deep clean",
    description:
      "Grout scrub, behind toilet, inside cabinets, exhaust fan cover.",
    duration: "40 MIN",
    layer: "rotation",
    cadence: "weekly",
  },
  {
    key: "rotation.05.bedrooms",
    label: "Bedroom deep clean",
    description:
      "Under bed vacuum, wash pillowcases, wipe nightstands + inside drawers.",
    duration: "30 MIN",
    layer: "rotation",
    cadence: "weekly",
  },
  {
    key: "rotation.06.fridge_freezer",
    label: "Fridge + freezer",
    description:
      "Remove all contents, wipe shelves and drawers, check expiry dates, restock.",
    duration: "45 MIN",
    layer: "rotation",
    cadence: "weekly",
  },
  {
    key: "rotation.07.windows_glass",
    label: "Windows + glass",
    description:
      "All windows (inside), mirrors, glass table surfaces, sliding doors.",
    duration: "25 MIN",
    layer: "rotation",
    cadence: "weekly",
  },
  {
    key: "rotation.08.vents_fans_lights",
    label: "Vents, fans + light fixtures",
    description:
      "Vacuum/wipe HVAC vents, ceiling fan blades, light fixture covers.",
    duration: "35 MIN",
    layer: "rotation",
    cadence: "weekly",
  },
];

export const LAUNDRY_TASKS: TaskDef[] = [
  {
    key: "laundry.tuesday.darks",
    label: "Darks",
    description: "Darks load — Tuesdays.",
    duration: "5 MIN",
    layer: "laundry",
    cadence: "weekly",
    subGroup: "Tue",
  },
  {
    key: "laundry.thursday.lights",
    label: "Lights",
    description: "Lights load — Thursdays.",
    duration: "5 MIN",
    layer: "laundry",
    cadence: "weekly",
    subGroup: "Thu",
  },
  {
    key: "laundry.saturday.sheets_towels",
    label: "Sheets + towels",
    description: "Sheets and towels load — Saturdays.",
    duration: "5 MIN",
    layer: "laundry",
    cadence: "weekly",
    subGroup: "Sat",
  },
];

export const ALL_TASKS: TaskDef[] = [
  ...DAILY_TASKS,
  ...WEEKLY_TASKS,
  ...ROTATION_TASKS,
  ...LAUNDRY_TASKS,
];

export const TASK_MAP: Record<string, TaskDef> = Object.fromEntries(
  ALL_TASKS.map((t) => [t.key, t])
);

export const ROTATION_ANCHOR_DATE = "2026-05-25";

export function getRotationIndex(isoWeekKey: string): number {
  const [anchorYear, anchorWeek] = parseIsoWeek(ROTATION_ANCHOR_DATE);
  const [currentYear, currentWeek] = parseIsoWeekFromKey(isoWeekKey);
  const anchorWeekNum = isoWeekToAbsolute(anchorYear, anchorWeek);
  const currentWeekNum = isoWeekToAbsolute(currentYear, currentWeek);
  const diff = currentWeekNum - anchorWeekNum;
  return ((diff % 8) + 8) % 8;
}

export function getCurrentRotationTask(isoWeekKey: string): TaskDef {
  const idx = getRotationIndex(isoWeekKey);
  return ROTATION_TASKS[idx];
}

function parseIsoWeek(dateStr: string): [number, number] {
  const d = new Date(dateStr + "T12:00:00Z");
  const jan4 = new Date(d.getFullYear(), 0, 4);
  const startOfWeek1 = new Date(jan4);
  startOfWeek1.setDate(jan4.getDate() - ((jan4.getDay() + 6) % 7));
  const dayOfYear = Math.floor(
    (d.getTime() - startOfWeek1.getTime()) / 86400000
  );
  const week = Math.floor(dayOfYear / 7) + 1;
  return [d.getFullYear(), week];
}

function parseIsoWeekFromKey(weekKey: string): [number, number] {
  const [yearStr, weekStr] = weekKey.split("-W");
  return [parseInt(yearStr), parseInt(weekStr)];
}

function isoWeekToAbsolute(year: number, week: number): number {
  return year * 53 + week;
}
