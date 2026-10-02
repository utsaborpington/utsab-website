import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Tickets",
  description: "Ticketing for UTSAB events is coming soon.",
};

// Placeholder route — swap this content for a real booking flow (e.g. embed
// a checkout widget or link to an external ticketing provider) without
// needing to change the URL or nav structure.
export default function TicketsPage() {
  return (
    <div className="dot-grid relative min-h-[70vh] overflow-hidden bg-indigo-950">
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(circle at 50% 30%, rgba(108,63,201,0.2) 0%, transparent 55%)",
        }}
      />
      <div className="relative mx-auto flex max-w-xl flex-col items-center px-4 sm:px-6 py-24 text-center">
        <span className="inline-flex items-center rounded-full bg-marigold-500/20 px-4 py-1.5 text-[11.5px] font-bold uppercase tracking-wide text-marigold-500">
          Coming soon
        </span>
        <h1 className="mt-6 font-display text-[34px] font-extrabold text-lavender-50">
          Online Ticketing Is on Its Way
        </h1>
        <p className="mt-4 text-[15.5px] leading-relaxed text-lavender-400">
          We&rsquo;re working on bringing online ticket booking to UTSAB events. In the meantime,
          please get in touch with us for entry, catering, or stall enquiries for our upcoming
          celebrations.
        </p>
        <Link
          href="/contact"
          className="mt-[30px] inline-flex items-center justify-center rounded-full bg-violet-500 px-[30px] py-3.5 font-bold text-lavender-50 transition-transform hover:scale-105"
        >
          Contact us
        </Link>
      </div>
    </div>
  );
}
