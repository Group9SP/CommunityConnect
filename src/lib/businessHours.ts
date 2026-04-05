export const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"] as const;
export type Day = typeof DAYS[number];

export type DayHours = {
  day: Day;
  open: string;  // "7:00 AM"
  close: string; // "10:00 PM"
  closed: boolean;
};

export type StructuredHours = DayHours[];

export function parseHours(raw: string | null | undefined): StructuredHours | null {
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) return parsed as StructuredHours;
  } catch {
    // legacy plain string — can't parse
  }
  return null;
}

export function defaultHours(): StructuredHours {
  return DAYS.map((day) => ({
    day,
    open: "9:00 AM",
    close: "5:00 PM",
    closed: day === "Sun",
  }));
}

function to24(time: string): number {
  // "7:00 AM" -> minutes since midnight
  const [timePart, meridiem] = time.trim().split(" ");
  const [h, m] = timePart.split(":").map(Number);
  let hours = h;
  if (meridiem === "PM" && h !== 12) hours += 12;
  if (meridiem === "AM" && h === 12) hours = 0;
  return hours * 60 + (m || 0);
}

export function isOpenNow(hours: StructuredHours): boolean {
  const now = new Date();
  const dayIndex = (now.getDay() + 6) % 7; // 0=Mon
  const todayHours = hours[dayIndex];
  if (!todayHours || todayHours.closed) return false;
  const nowMinutes = now.getHours() * 60 + now.getMinutes();
  return nowMinutes >= to24(todayHours.open) && nowMinutes < to24(todayHours.close);
}
