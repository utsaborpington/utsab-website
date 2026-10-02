import Link from "next/link";
import { FOOTER_EXPLORE_LINKS, SITE } from "@/lib/site";

export default function SiteFooter() {
  return (
    <footer className="dot-grid bg-indigo-975 text-lavender-300">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-14 grid gap-10 sm:grid-cols-3">
        <div>
          <p className="font-display text-xl font-extrabold text-marigold-500">{SITE.name}</p>
          <p className="mt-2 text-[13px] text-lavender-600">{SITE.fullName}</p>
          <p className="mt-0.5 text-[13px] text-lavender-600">Orpington, Kent, United Kingdom</p>
        </div>

        <div>
          <p className="text-[11.5px] font-bold uppercase tracking-wide text-marigold-500">
            Explore
          </p>
          <ul className="mt-3 space-y-2 text-[13px]">
            {FOOTER_EXPLORE_LINKS.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="hover:text-marigold-500">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="text-[11.5px] font-bold uppercase tracking-wide text-marigold-500">
            Get in touch
          </p>
          <ul className="mt-3 space-y-2 text-[13px]">
            <li>
              <a href={`mailto:${SITE.contactEmail}`} className="hover:text-marigold-500">
                {SITE.contactEmail}
              </a>
            </li>
            <li>
              <a href={`tel:${SITE.contactPhone}`} className="hover:text-marigold-500">
                {SITE.contactPhone}
              </a>
            </li>
            <li>
              <a
                href={SITE.facebookUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-marigold-500"
              >
                Facebook Group
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <p className="border-t border-white/8 py-5 text-xs text-lavender-700">
          &copy; {new Date().getFullYear()} {SITE.fullName}. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
