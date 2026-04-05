import { DAYS, type StructuredHours } from "@/lib/businessHours";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type Props = {
  value: StructuredHours;
  onChange: (hours: StructuredHours) => void;
};

export function HoursEditor({ value, onChange }: Props) {
  const update = (index: number, patch: Partial<typeof value[0]>) => {
    const next = value.map((h, i) => i === index ? { ...h, ...patch } : h);
    onChange(next);
  };

  return (
    <div className="space-y-2">
      {value.map((h, i) => (
        <div key={h.day} className="grid grid-cols-[60px_1fr] gap-2 items-center">
          <div className="flex items-center gap-2">
            <Checkbox
              id={`closed-${h.day}`}
              checked={!h.closed}
              onCheckedChange={(v) => update(i, { closed: !v })}
            />
            <Label htmlFor={`closed-${h.day}`} className="font-medium w-8">{h.day}</Label>
          </div>
          {h.closed ? (
            <span className="text-sm text-muted-foreground">Closed</span>
          ) : (
            <div className="flex items-center gap-2">
              <Input
                className="h-8 text-sm w-28"
                value={h.open}
                placeholder="9:00 AM"
                onChange={(e) => update(i, { open: e.target.value })}
              />
              <span className="text-muted-foreground text-sm">–</span>
              <Input
                className="h-8 text-sm w-28"
                value={h.close}
                placeholder="5:00 PM"
                onChange={(e) => update(i, { close: e.target.value })}
              />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
