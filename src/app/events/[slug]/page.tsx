import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { EVENT_TYPE_LABELS, isEventType } from "@/lib/eventTypes";
import { formatDateRange } from "@/lib/format";
import { getEventStatus } from "@/lib/eventStatus";
import StatusBadge from "@/components/StatusBadge";
import EventGallery from "./EventGallery";

export const revalidate = 3600;

async function getEvent(slug: string) {
  return prisma.event.findUnique({
    where: { slug },
    include: { galleryImages: { orderBy: { order: "asc" } } },
  });
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const event = await getEvent(slug);
  if (!event) return {};

  const title = event.title.replace(/^UTSAB\s+/, "");
  const description =
    event.description.slice(0, 155) ||
    `${title} — a UTSAB celebration in Orpington.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: event.coverImage ? [{ url: event.coverImage }] : undefined,
    },
  };
}

export default async function EventDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const event = await getEvent(slug);
  if (!event || !event.published) notFound();

  const status = getEventStatus(event);
  const typeLabel = isEventType(event.type) ? EVENT_TYPE_LABELS[event.type] : "Celebration";
  const paragraphs = event.description.split(/\n{2,}/).filter(Boolean);

  return (
    <div className="bg-indigo-950">
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          {event.coverImage && (
            <Image
              src={event.coverImage}
              alt=""
              fill
              priority
              sizes="100vw"
              className="object-cover opacity-30"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-indigo-950 via-indigo-950/75 to-indigo-950/45" />
        </div>
        <div className="relative mx-auto max-w-4xl px-4 sm:px-6 py-20">
          <Link
            href="/events"
            className="text-[13.5px] font-semibold text-marigold-500 hover:text-marigold-300"
          >
            ← Past Events
          </Link>
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <StatusBadge status={status} />
            <span className="text-[11.5px] font-bold uppercase tracking-wide text-marigold-500">
              {typeLabel}
            </span>
          </div>
          <h1 className="mt-4 font-display text-4xl font-extrabold text-lavender-50 sm:text-5xl">
            {event.title.replace(/^UTSAB\s+/, "")}
          </h1>
          <div className="mt-6 flex flex-wrap gap-x-8 gap-y-3">
            {event.startDate && (
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wide text-marigold-500">
                  Dates
                </p>
                <p className="mt-1 font-bold text-lavender-100">
                  {formatDateRange(event.startDate, event.endDate)}
                </p>
              </div>
            )}
            {event.venueName && (
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wide text-marigold-500">
                  Venue
                </p>
                <p className="mt-1 font-bold text-lavender-100">{event.venueName}</p>
                {event.venueAddress && (
                  <p className="text-[13px] text-lavender-600">{event.venueAddress}</p>
                )}
              </div>
            )}
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-4xl px-4 sm:px-6 py-12">
        {paragraphs.length > 0 && (
          <div className="max-w-none">
            {paragraphs.map((p, i) => (
              <p key={i} className="mb-4 text-[15.5px] leading-relaxed text-lavender-400">
                {p}
              </p>
            ))}
          </div>
        )}

        {event.galleryImages.length > 0 && (
          <div className="mt-12">
            <h2 className="font-display text-2xl font-extrabold text-lavender-50">
              Photo Gallery
            </h2>
            <div className="my-4 h-0.5 w-16 rounded-full bg-gradient-to-r from-marigold-500 to-magenta-500" />
            <EventGallery images={event.galleryImages} />
          </div>
        )}
      </div>
    </div>
  );
}
