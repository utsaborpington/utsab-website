"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { NAV_LINKS, SITE } from "@/lib/site";

export default function SiteHeader() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b border-white/8 bg-indigo-975/75 backdrop-blur-md">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="flex h-16 items-center justify-between">
          <Link
            href="/"
            className="flex items-baseline gap-2.5"
            onClick={() => setOpen(false)}
          >
            <span className="font-display text-xl font-extrabold tracking-wide text-marigold-500">
              {SITE.name}
            </span>
            <span className="hidden text-[12.5px] font-medium text-lavender-500 sm:inline">
              {SITE.tagline}
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-1.5">
            {NAV_LINKS.map((link) => {
              const active =
                link.href === "/" ? pathname === "/" : pathname.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`rounded-full px-4 py-2 text-[13px] font-semibold transition-colors ${
                    active
                      ? "bg-violet-500 text-lavender-50"
                      : "text-lavender-200 hover:text-marigold-500"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
            <Link
              href="/donate"
              className="ml-1 rounded-full bg-marigold-500 px-5 py-2 text-[13px] font-bold text-indigo-975 transition-transform hover:scale-105"
            >
              Donate
            </Link>
          </nav>

          <button
            type="button"
            className="md:hidden inline-flex items-center justify-center rounded-md p-2 text-marigold-500"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            <svg
              width="26"
              height="26"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            >
              {open ? (
                <path d="M6 6l12 12M18 6L6 18" />
              ) : (
                <path d="M4 7h16M4 12h16M4 17h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {open && (
        <nav className="md:hidden border-t border-white/8 bg-indigo-975">
          <div className="mx-auto max-w-6xl px-4 py-2 flex flex-col">
            {NAV_LINKS.map((link) => {
              const active =
                link.href === "/" ? pathname === "/" : pathname.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className={`rounded-md px-3 py-3 text-base font-medium ${
                    active ? "text-marigold-500 bg-white/5" : "text-lavender-200"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
            <Link
              href="/donate"
              onClick={() => setOpen(false)}
              className="mt-2 rounded-md bg-marigold-500 px-3 py-3 text-center text-base font-bold text-indigo-975"
            >
              Donate
            </Link>
          </div>
        </nav>
      )}
    </header>
  );
}
