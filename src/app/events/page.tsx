import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import EventsArchive from "./EventsArchive";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Past Events",
  description:
    "Browse UTSAB's archive of Durga Puja, Saraswati Puja, and community celebrations in Orpington.",
};

export default async function EventsPage() {
  const events = await prisma.event.findMany({
    where: { published: true },
    orderBy: [{ startDate: "desc" }, { createdAt: "desc" }],
  });

  return (
    <div className="dot-grid min-h-screen bg-indigo-950 px-4 py-16 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <header className="max-w-2xl">
          <p className="text-[12.5px] font-bold uppercase tracking-wide text-magenta-500">
            Our history
          </p>
          <h1 className="mt-3 font-display text-4xl font-extrabold text-lavender-50">
            Past Celebrations
          </h1>
          <p className="mt-4 text-[15.5px] leading-relaxed text-lavender-400">
            A look back at UTSAB&rsquo;s Durga Puja, Saraswati Puja, and community celebrations in
            Orpington over the years.
          </p>
        </header>

        <EventsArchive events={events} />
      </div>
    </div>
  );
}
