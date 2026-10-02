import type { Event } from "@prisma/client";

export type EventStatus = "live" | "upcoming" | "past" | "undated";

/**
 * Status is derived purely from today's date vs the event's stored dates —
 * never hand-set, so it can't go stale.
 */
export function getEventStatus(event: Pick<Event, "startDate" | "endDate">, now = new Date()): EventStatus {
  const { startDate, endDate } = event;
  if (!startDate) return "undated";

  const start = new Date(startDate);
  const end = endDate ? new Date(endDate) : start;

  // Compare by calendar day so an event "ends" at the end of its end date.
  const startOfDay = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate());
  const today = startOfDay(now);
  const eventStart = startOfDay(start);
  const eventEnd = startOfDay(end);

  if (today >= eventStart && today <= eventEnd) return "live";
  if (today < eventStart) return "upcoming";
  return "past";
}

export type EventWithStatus<T> = T & { status: EventStatus };

/**
 * Picks the single most relevant event for the homepage hero:
 * the live event if one is happening now, otherwise the soonest upcoming
 * dated event, otherwise the most recent past event (dated or not) as a
 * graceful fallback so the hero never shows nothing.
 */
export function selectHeroEvent<
  T extends Pick<Event, "startDate" | "endDate" | "createdAt">,
>(events: T[], now = new Date()): EventWithStatus<T> | null {
  if (events.length === 0) return null;

  const withStatus = events.map((e) => ({ ...e, status: getEventStatus(e, now) }));

  const live = withStatus.find((e) => e.status === "live");
  if (live) return live;

  const upcoming = withStatus
    .filter((e) => e.status === "upcoming")
    .sort((a, b) => new Date(a.startDate!).getTime() - new Date(b.startDate!).getTime());
  if (upcoming[0]) return upcoming[0];

  const dated = withStatus
    .filter((e) => e.startDate)
    .sort((a, b) => new Date(b.startDate!).getTime() - new Date(a.startDate!).getTime());
  if (dated[0]) return dated[0];

  const newest = [...withStatus].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );
  return newest[0] ?? null;
}
