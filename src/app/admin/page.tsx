import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { EVENT_TYPE_LABELS, isEventType } from "@/lib/eventTypes";
import { formatDateRange } from "@/lib/format";
import { getEventStatus } from "@/lib/eventStatus";
import StatusBadge from "@/components/StatusBadge";
import DeleteEventButton from "./DeleteEventButton";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const events = await prisma.event.findMany({
    orderBy: [{ startDate: "desc" }, { createdAt: "desc" }],
  });

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-display text-3xl font-extrabold text-lavender-50">Events</h1>
        <Link
          href="/admin/events/new"
          className="glow-marigold rounded-full bg-marigold-500 px-6 py-2.5 font-bold text-indigo-975 transition-transform hover:scale-105"
        >
          + New event
        </Link>
      </div>

      <div className="surface-shadow mt-8 overflow-hidden rounded-[18px] bg-indigo-800">
        {events.length === 0 ? (
          <p className="p-8 text-center text-lavender-400">No events yet. Create your first one.</p>
        ) : (
          <table className="w-full text-left text-sm">
            <thead className="bg-indigo-950 text-[11.5px] font-bold uppercase tracking-wide text-lavender-700">
              <tr>
                <th className="px-4 py-3">Title</th>
                <th className="px-4 py-3">Type</th>
                <th className="px-4 py-3">Dates</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Visible</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-white/6">
              {events.map((event) => (
                <tr key={event.id}>
                  <td className="px-4 py-3 font-medium text-lavender-100">{event.title}</td>
                  <td className="px-4 py-3 text-lavender-400">
                    {isEventType(event.type) ? EVENT_TYPE_LABELS[event.type] : event.type}
                  </td>
                  <td className="px-4 py-3 text-lavender-400">
                    {event.startDate ? formatDateRange(event.startDate, event.endDate) : "—"}
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={getEventStatus(event)} />
                  </td>
                  <td className="px-4 py-3 text-lavender-400">
                    {event.published ? "Yes" : "Hidden"}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end gap-3">
                      <Link
                        href={`/admin/events/${event.id}/edit`}
                        className="font-semibold text-marigold-500 hover:text-marigold-300"
                      >
                        Edit
                      </Link>
                      <DeleteEventButton eventId={event.id} eventTitle={event.title} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
