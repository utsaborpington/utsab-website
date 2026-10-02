import type { Metadata } from "next";
import { SITE } from "@/lib/site";
import ContactForm from "./ContactForm";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with UTSAB — Utsab Bengali Association of Orpington.",
};

export default function ContactPage() {
  return (
    <div className="dot-grid min-h-screen bg-indigo-950 px-4 py-16 sm:px-6">
      <div className="mx-auto max-w-5xl">
        <header className="max-w-2xl">
          <p className="text-[12.5px] font-bold uppercase tracking-wide text-magenta-500">
            Get in touch
          </p>
          <h1 className="mt-3 font-display text-4xl font-extrabold text-lavender-50 sm:text-[38px]">
            Contact Us
          </h1>
          <p className="mt-3.5 max-w-lg text-[15.5px] leading-relaxed text-lavender-400">
            Questions about an event, interested in sponsoring, or want to volunteer? We&rsquo;d
            love to hear from you.
          </p>
        </header>

        <div className="mt-11 grid gap-12 md:grid-cols-[260px_1fr]">
          <div className="flex flex-col gap-[22px]">
            <ContactDetail
              label="Email"
              value={SITE.contactEmail}
              href={`mailto:${SITE.contactEmail}`}
            />
            <ContactDetail
              label="Phone"
              value={SITE.contactPhone}
              href={`tel:${SITE.contactPhone}`}
            />
            <ContactDetail
              label="Venue"
              value="Sanderson Hall, Mickleham Road, Orpington, Kent, BR5 2RW"
            />
            <ContactDetail label="Facebook" value="Join our group" href={SITE.facebookUrl} external />
          </div>

          <ContactForm />
        </div>
      </div>
    </div>
  );
}

function ContactDetail({
  label,
  value,
  href,
  external,
}: {
  label: string;
  value: string;
  href?: string;
  external?: boolean;
}) {
  return (
    <div>
      <p className="text-[11px] font-semibold uppercase tracking-wide text-lavender-700">
        {label}
      </p>
      {href ? (
        <a
          href={href}
          target={external ? "_blank" : undefined}
          rel={external ? "noopener noreferrer" : undefined}
          className="mt-1 block text-[15px] font-semibold text-marigold-500 hover:text-marigold-300"
        >
          {value}
        </a>
      ) : (
        <p className="mt-1 text-[15px] font-semibold text-lavender-100">{value}</p>
      )}
    </div>
  );
}
