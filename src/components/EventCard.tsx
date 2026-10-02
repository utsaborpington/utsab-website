import Image from "next/image";
import Link from "next/link";
import type { Event } from "@prisma/client";
import { EVENT_TYPE_LABELS, isEventType } from "@/lib/eventTypes";
import { formatDateRange } from "@/lib/format";
import { getEventStatus } from "@/lib/eventStatus";
import StatusBadge from "./StatusBadge";

export default function EventCard({ event }: { event: Event }) {
  const status = getEventStatus(event);
  const typeLabel = isEventType(event.type) ? EVENT_TYPE_LABELS[event.type] : "Celebration";

  return (
    <Link
      href={`/events/${event.slug}`}
      className="surface-shadow group flex flex-col overflow-hidden rounded-[18px] bg-indigo-800 transition-shadow hover:shadow-[0_20px_60px_-20px_rgba(217,74,168,0.35)]"
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-violet-950">
        {event.coverImage ? (
          <Image
            src={event.coverImage}
            alt={event.title}
            fill
            sizes="(min-width: 1024px) 320px, (min-width: 640px) 45vw, 90vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center font-display text-3xl text-lavender-200/30">
            {typeLabel}
          </div>
        )}
        <div className="absolute left-3 top-3">
          <StatusBadge status={status} />
        </div>
      </div>
      <div className="flex flex-1 flex-col gap-1 p-5">
        <p className="text-[11.5px] font-bold uppercase tracking-wide text-marigold-500">
          {typeLabel}
        </p>
        <h3 className="font-display text-[17px] font-bold text-lavender-50 leading-snug">
          {event.title.replace(/^UTSAB\s+/, "")}
        </h3>
        <p className="mt-1 text-[13px] text-lavender-600">
          {event.startDate ? formatDateRange(event.startDate, event.endDate) : ""}
        </p>
        {event.venueName && <p className="text-[13px] text-lavender-600">{event.venueName}</p>}
      </div>
    </Link>
  );
}
