import { DAYS, isOpenNow, parseHours } from "@/lib/businessHours";
import { Badge } from "@/components/ui/badge";
import { MapPin } from "lucide-react";

type Props = {
  address: string | null;
  hoursRaw: string | null;
};

export function BusinessLocationHours({ address, hoursRaw }: Props) {
  const hours = parseHours(hoursRaw);
  const open = hours ? isOpenNow(hours) : null;
  const today = (new Date().getDay() + 6) % 7; // 0=Mon

  return (
    <div className="grid md:grid-cols-2 gap-6">
      {/* Map */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <MapPin className="h-5 w-5 text-muted-foreground" />
          <span className="font-medium">{address ?? "Address not listed"}</span>
        </div>
        {address && (
          <div className="space-y-2">
            <div className="rounded-xl overflow-hidden border h-56">
              <iframe
                title="Business location"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                src={`https://www.google.com/maps?q=${encodeURIComponent(address)}&output=embed`}
              />
            </div>
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-primary hover:underline"
            >
              View larger map ↗
            </a>
          </div>
        )}
      </div>

      {/* Hours */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <span className="font-medium">Hours</span>
          {open !== null && (
            <Badge className={open ? "bg-green-600 text-white" : "bg-red-500 text-white"}>
              {open ? "Open now" : "Closed now"}
            </Badge>
          )}
        </div>
        {hours ? (
          <div className="space-y-1">
            {hours.map((h, i) => (
              <div key={h.day} className={`flex justify-between text-sm py-1 border-b last:border-0 ${i === today ? "font-semibold text-foreground" : "text-muted-foreground"}`}>
                <span className="w-12">{h.day}</span>
                <span>{h.closed ? "Not open" : `${h.open} – ${h.close}`}</span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">
            {hoursRaw ?? "Hours not listed"}
          </p>
        )}
      </div>
    </div>
  );
}
