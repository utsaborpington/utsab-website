import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isEventType } from "@/lib/eventTypes";

function slugify(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  if (!body || typeof body.title !== "string" || !body.title.trim()) {
    return NextResponse.json({ error: "Title is required." }, { status: 400 });
  }
  if (!isEventType(body.type)) {
    return NextResponse.json({ error: "Invalid event type." }, { status: 400 });
  }

  const baseSlug = slugify(body.title);
  let slug = baseSlug;
  let n = 1;
  while (await prisma.event.findUnique({ where: { slug } })) {
    slug = `${baseSlug}-${++n}`;
  }

  const galleryUrls: string[] = Array.isArray(body.galleryImages) ? body.galleryImages : [];

  const event = await prisma.event.create({
    data: {
      slug,
      title: body.title.trim(),
      type: body.type,
      startDate: body.startDate ? new Date(body.startDate) : null,
      endDate: body.endDate ? new Date(body.endDate) : null,
      venueName: body.venueName?.trim() || null,
      venueAddress: body.venueAddress?.trim() || null,
      description: body.description?.trim() || "",
      coverImage: body.coverImage || galleryUrls[0] || null,
      published: body.published !== false,
      galleryImages: {
        create: galleryUrls.map((url, i) => ({ url, alt: body.title, order: i })),
      },
    },
  });

  return NextResponse.json({ event });
}
