export const SITE = {
  name: "UTSAB",
  fullName: "Utsab Bengali Association of Orpington",
  tagline: "A Celebration of Life",
  description:
    "UTSAB brings Bengali culture to Orpington, Kent — hosting Durga Puja, Saraswati Puja, and community celebrations throughout the year.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.utsablondon.org",
  facebookUrl: "https://www.facebook.com/groups/338494123336023",
  contactEmail: process.env.CONTACT_EMAIL ?? "info@utsablondon.org",
  contactPhone: process.env.CONTACT_PHONE ?? "+44 7722 288179",
  gofundmeUrl:
    process.env.GOFUNDME_URL ??
    "https://www.gofundme.com/f/help-us-bring-home-a-new-durga-maa-idol",
} as const;

export const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/events", label: "Past Events" },
  { href: "/tickets", label: "Tickets" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
] as const;

export const FOOTER_EXPLORE_LINKS = [...NAV_LINKS, { href: "/donate", label: "Donate" }] as const;
