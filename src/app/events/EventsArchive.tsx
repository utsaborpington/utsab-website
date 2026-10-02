"use client";

import { useMemo, useState } from "react";
import type { Event } from "@prisma/client";
import EventCard from "@/components/EventCard";
import { EVENT_TYPE_LABELS, EVENT_TYPES } from "@/lib/eventTypes";

export default function EventsArchive({ events }: { events: Event[] }) {
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [yearFilter, setYearFilter] = useState<string>("all");

  const years = useMemo(() => {
    const set = new Set<number>();
    events.forEach((e) => {
      if (e.startDate) set.add(new Date(e.startDate).getFullYear());
    });
    return Array.from(set).sort((a, b) => b - a);
  }, [events]);

  const filtered = events.filter((e) => {
    const typeOk = typeFilter === "all" || e.type === typeFilter;
    const yearOk =
      yearFilter === "all" ||
      (e.startDate && new Date(e.startDate).getFullYear().toString() === yearFilter);
    return typeOk && yearOk;
  });

  return (
    <div>
      <div className="mt-8 flex flex-wrap gap-3">
        <FilterGroup label="Type">
          <FilterButton active={typeFilter === "all"} onClick={() => setTypeFilter("all")}>
            All
          </FilterButton>
          {EVENT_TYPES.map((t) => (
            <FilterButton key={t} active={typeFilter === t} onClick={() => setTypeFilter(t)}>
              {EVENT_TYPE_LABELS[t]}
            </FilterButton>
          ))}
        </FilterGroup>

        {years.length > 0 && (
          <FilterGroup label="Year">
            <FilterButton active={yearFilter === "all"} onClick={() => setYearFilter("all")}>
              All
            </FilterButton>
            {years.map((y) => (
              <FilterButton
                key={y}
                active={yearFilter === y.toString()}
                onClick={() => setYearFilter(y.toString())}
              >
                {y}
              </FilterButton>
            ))}
          </FilterGroup>
        )}
      </div>

      {filtered.length === 0 ? (
        <p className="mt-12 text-lavender-500">No events match these filters.</p>
      ) : (
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      )}
    </div>
  );
}

function FilterGroup({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-[11.5px] font-bold uppercase tracking-wide text-lavender-700 mr-1">
        {label}
      </span>
      {children}
    </div>
  );
}

function FilterButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full px-4 py-1.5 text-[13px] font-semibold transition-colors ${
        active
          ? "bg-violet-500 text-lavender-50"
          : "bg-indigo-800 text-lavender-300 hover:text-marigold-500"
      }`}
    >
      {children}
    </button>
  );
}
