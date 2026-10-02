import type { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";
import { SITE } from "@/lib/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const events = await prisma.event.findMany({
    where: { published: true },
    select: { slug: true, updatedAt: true },
  });

  const staticRoutes: MetadataRoute.Sitemap = [
    "",
    "/events",
    "/about",
    "/donate",
    "/donation-terms",
    "/tickets",
    "/contact",
  ].map((route) => ({
    url: `${SITE.url}${route}`,
    lastModified: new Date(),
  }));

  const eventRoutes: MetadataRoute.Sitemap = events.map((e) => ({
    url: `${SITE.url}/events/${e.slug}`,
    lastModified: e.updatedAt,
  }));

  return [...staticRoutes, ...eventRoutes];
}
