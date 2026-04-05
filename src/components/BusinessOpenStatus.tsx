import React from "react";

// Simple parser for hours string like "Mon-Fri: 7am-7pm, Sat-Sun: 8am-8pm"
// Only supports current day, not holidays or special cases
function parseHours(hours: string) {
  // Example: "Mon-Fri: 7am-7pm, Sat-Sun: 8am-8pm"
  // Returns: { Mon: [7,19], Tue: [7,19], ... }
  const days = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
  const result: Record<string, [number, number]> = {};
  const parts = hours.split(",");
  for (const part of parts) {
    const [dayPart, timePart] = part.split(":");
    if (!dayPart || !timePart) continue;
    let dayRange = dayPart.trim();
    let [open, close] = timePart.trim().split("-");
    if (!open || !close) continue;
    // Convert to 24h
    const to24 = (t: string) => {
      let [h, m] = t.replace(/am|pm/i,"").split(":");
      let hour = parseInt(h,10);
      if (/pm/i.test(t) && hour !== 12) hour += 12;
      if (/am/i.test(t) && hour === 12) hour = 0;
      return hour;
    };
    open = open.trim(); close = close.trim();
    let openH = to24(open), closeH = to24(close);
    // Handle ranges like Mon-Fri
    if (dayRange.includes("-")) {
      const [start, end] = dayRange.split("-").map(d=>d.trim());
      let startIdx = days.indexOf(start), endIdx = days.indexOf(end);
      for (let i = startIdx; i <= endIdx; i++) {
        result[days[i]] = [openH, closeH];
      }
    } else {
      result[dayRange] = [openH, closeH];
    }
  }
  return result;
}

export const BusinessOpenStatus: React.FC<{ hours: string }> = ({ hours }) => {
  const now = new Date();
  const day = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"][now.getDay()];
  const hour = now.getHours();
  const parsed = parseHours(hours);
  const today = parsed[day];
  let isOpen = false;
  if (today) {
    isOpen = hour >= today[0] && hour < today[1];
  }
  return (
    <span className={isOpen ? "text-green-600 font-semibold" : "text-red-600 font-semibold"}>
      {isOpen ? "Open Now" : "Closed Now"}
      <span className="ml-2 text-xs text-muted-foreground">(Hours: {hours})</span>
    </span>
  );
};
