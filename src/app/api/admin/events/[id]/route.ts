import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isEventType } from "@/lib/eventTypes";

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await request.json().catch(() => null);

  if (!body || typeof body.title !== "string" || !body.title.trim()) {
    return NextResponse.json({ error: "Title is required." }, { status: 400 });
  }
  if (!isEventType(body.type)) {
    return NextResponse.json({ error: "Invalid event type." }, { status: 400 });
  }

  const galleryUrls: string[] = Array.isArray(body.galleryImages) ? body.galleryImages : [];

  const event = await prisma.event.update({
    where: { id },
    data: {
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
        deleteMany: {},
        create: galleryUrls.map((url, i) => ({ url, alt: body.title, order: i })),
      },
    },
  });

  // Public event pages are ISR-cached; refresh them so changes show immediately.
  revalidatePath("/", "layout");
  return NextResponse.json({ event });
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await prisma.event.delete({ where: { id } });
  revalidatePath("/", "layout");
  return NextResponse.json({ ok: true });
}
