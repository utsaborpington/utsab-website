import type { EventStatus } from "@/lib/eventStatus";

const STYLES: Record<EventStatus, string> = {
  live: "bg-magenta-500 text-lavender-50",
  upcoming: "bg-marigold-500 text-indigo-975",
  past: "bg-[rgba(20,12,36,0.6)] text-lavender-100",
  undated: "bg-[rgba(20,12,36,0.6)] text-lavender-100",
};

const LABELS: Record<EventStatus, string> = {
  live: "Happening now",
  upcoming: "Upcoming",
  past: "Past event",
  undated: "Past event",
};

export default function StatusBadge({ status }: { status: EventStatus }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-wide ${STYLES[status]}`}
    >
      {status === "live" && (
        <span className="h-1.5 w-1.5 rounded-full bg-lavender-50 animate-pulse" />
      )}
      {LABELS[status]}
    </span>
  );
}
