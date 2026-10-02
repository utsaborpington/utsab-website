import Image from "next/image";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { selectHeroEvent, getEventStatus } from "@/lib/eventStatus";
import { formatDateRange } from "@/lib/format";
import { EVENT_TYPE_LABELS, isEventType } from "@/lib/eventTypes";
import StatusBadge from "@/components/StatusBadge";
import EventCard from "@/components/EventCard";
import Reveal from "@/components/Reveal";
import ParallaxImage from "@/components/ParallaxImage";
import { SITE } from "@/lib/site";

export const revalidate = 3600;

export default async function Home() {
  const events = await prisma.event.findMany({ where: { published: true } });
  const hero = selectHeroEvent(events);

  const recentPast = events
    .filter((e) => e.id !== hero?.id)
    .sort((a, b) => {
      const aTime = a.startDate ? new Date(a.startDate).getTime() : 0;
      const bTime = b.startDate ? new Date(b.startDate).getTime() : 0;
      return bTime - aTime;
    })
    .slice(0, 3);

  return (
    <div>
      {hero ? <Hero event={hero} /> : <NoEventsHero />}

      <div className="gradient-bar" />

      <Reveal className="dot-grid relative overflow-hidden bg-indigo-950 py-20 sm:py-24">
        <div className="pointer-events-none absolute -bottom-36 -left-36 h-96 w-96 rounded-full bg-violet-500/25 blur-3xl" />
        <div className="relative mx-auto grid max-w-5xl gap-14 px-4 sm:px-6 md:grid-cols-[0.9fr_1.1fr] md:items-center">
          <div className="surface-shadow relative aspect-square overflow-hidden rounded-3xl">
            {recentPast[0]?.coverImage && (
              <Image
                src={recentPast[0].coverImage}
                alt=""
                fill
                sizes="(min-width: 768px) 40vw, 90vw"
                className="object-cover"
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-indigo-950/80 to-transparent" />
          </div>
          <div>
            <p className="text-[12.5px] font-bold uppercase tracking-wide text-magenta-500">
              Who we are
            </p>
            <h2 className="mt-3 font-display text-3xl font-extrabold leading-tight text-lavender-50 sm:text-[34px]">
              A home for Bengali culture in Orpington
            </h2>
            <p className="mt-5 max-w-md text-[15.5px] leading-relaxed text-lavender-400">
              UTSAB is a non-profit association celebrating Bengali and Hindu culture through
              Durga Puja, Saraswati Puja, and community gatherings throughout the year. We bring
              together generations to share prayers, food, music, and tradition — creating a home
              away from home for our community.
            </p>
            <Link
              href="/about"
              className="mt-6 inline-flex items-center gap-2 font-bold text-marigold-500 hover:text-marigold-300"
            >
              Learn more about us →
            </Link>
          </div>
        </div>
      </Reveal>

      {recentPast.length > 0 && (
        <Reveal className="dot-grid bg-indigo-900 py-20 sm:py-24">
          <div className="mx-auto max-w-5xl px-4 sm:px-6">
            <div className="flex items-baseline justify-between">
              <h2 className="font-display text-2xl font-extrabold text-lavender-50 sm:text-[30px]">
                Recent celebrations
              </h2>
              <Link href="/events" className="font-bold text-marigold-500 hover:text-marigold-300">
                View archive →
              </Link>
            </div>
            <div className="mt-9 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {recentPast.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          </div>
        </Reveal>
      )}

      <Reveal className="dot-grid relative overflow-hidden bg-gradient-to-br from-violet-950 to-violet-500 py-20 text-center sm:py-24">
        <div className="pointer-events-none absolute bottom-[-120px] right-[20%] h-80 w-80 rounded-full bg-magenta-500/35 blur-3xl" />
        <div className="relative mx-auto max-w-2xl px-4 sm:px-6">
          <h2 className="font-display text-2xl font-extrabold text-marigold-500 sm:text-[32px]">
            Help us welcome Maa Durga home
          </h2>
          <p className="mt-4 text-[15.5px] leading-relaxed text-lavender-200">
            We&rsquo;re raising funds for a new Durga Maa idol and to keep {SITE.name}&rsquo;s
            celebrations free and open to everyone. Every contribution, big or small, helps.
          </p>
          <Link
            href="/donate"
            className="glow-marigold mt-7 inline-flex items-center justify-center rounded-full bg-marigold-500 px-9 py-3.5 font-bold text-indigo-975 transition-transform hover:scale-105"
          >
            Donate now
          </Link>
        </div>
      </Reveal>
    </div>
  );
}

function Hero({
  event,
}: {
  event: Awaited<ReturnType<typeof prisma.event.findMany>>[number] & {
    status: ReturnType<typeof getEventStatus>;
  };
}) {
  const typeLabel = isEventType(event.type) ? EVENT_TYPE_LABELS[event.type] : "Celebration";
  const isFuture = event.status === "live" || event.status === "upcoming";

  return (
    <section className="dot-grid relative overflow-hidden bg-indigo-950">
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(circle at 15% 25%, rgba(217,74,168,0.27) 0%, transparent 45%), radial-gradient(circle at 80% 15%, rgba(240,181,69,0.24) 0%, transparent 50%), radial-gradient(circle at 90% 90%, rgba(108,63,201,0.33) 0%, transparent 50%)",
        }}
      />
      <div className="relative mx-auto flex max-w-6xl flex-wrap items-center gap-10 px-4 py-20 sm:px-6 sm:py-28">
        <div className="min-w-0 flex-1 basis-[380px]">
          <div className="flex flex-wrap items-center gap-3">
            <StatusBadge status={event.status} />
            <span className="text-[11.5px] font-bold uppercase tracking-wide text-marigold-500">
              {typeLabel}
            </span>
          </div>

          <h1 className="mt-5 max-w-xl font-display text-4xl font-extrabold leading-[1.05] text-lavender-50 sm:text-6xl">
            {event.title.replace(/^UTSAB\s+/, "")}
          </h1>

          <p className="mt-5 max-w-md text-[16.5px] leading-relaxed text-lavender-300">
            {isFuture
              ? "Join UTSAB for a celebration of community, culture, and devotion in Orpington."
              : "Our most recent celebration with the UTSAB community — see how it went."}
          </p>

          <div className="mt-7 flex flex-wrap gap-x-8 gap-y-3">
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
              </div>
            )}
          </div>

          <div className="mt-8 flex flex-wrap gap-3.5">
            <Link
              href={`/events/${event.slug}`}
              className="glow-marigold inline-flex items-center justify-center rounded-full bg-marigold-500 px-8 py-3.5 font-bold text-indigo-975 transition-transform hover:scale-105"
            >
              View details
            </Link>
            <Link
              href="/donate"
              className="inline-flex items-center justify-center rounded-full border-[1.5px] border-white/25 px-8 py-3.5 font-bold text-lavender-50 transition-colors hover:bg-white/10"
            >
              Donate
            </Link>
          </div>
        </div>

        {event.coverImage && (
          <div className="min-w-0 flex-1 basis-[320px]">
            <ParallaxImage
              src={event.coverImage}
              alt={event.title}
              priority
              rotateDeg={-1}
              wrapperClassName="surface-shadow relative mx-auto aspect-[4/3] w-full max-w-[520px] overflow-hidden rounded-[20px] shadow-[0_0_60px_-10px_rgba(217,74,168,0.5)]"
              imageClassName="object-cover"
            />
          </div>
        )}
      </div>
    </section>
  );
}

function NoEventsHero() {
  return (
    <section className="dot-grid bg-indigo-950 py-32 text-center">
      <h1 className="font-display text-4xl font-extrabold text-lavender-50">{SITE.name}</h1>
      <p className="mt-4 text-lavender-400">
        No events published yet — check back soon, or explore our{" "}
        <Link href="/events" className="text-marigold-500 underline decoration-marigold-500/60">
          past celebrations
        </Link>
        .
      </p>
    </section>
  );
}
