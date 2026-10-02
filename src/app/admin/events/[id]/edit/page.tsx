import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import EventForm from "../../EventForm";

function toDateInput(d: Date | null): string {
  if (!d) return "";
  return new Date(d).toISOString().slice(0, 10);
}

export default async function EditEventPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const event = await prisma.event.findUnique({
    where: { id },
    include: { galleryImages: { orderBy: { order: "asc" } } },
  });
  if (!event) notFound();

  return (
    <div>
      <h1 className="font-display text-3xl font-extrabold text-lavender-50">Edit Event</h1>
      <div className="mt-6">
        <EventForm
          initial={{
            id: event.id,
            title: event.title,
            type: event.type as "durga_puja" | "saraswati_puja" | "other",
            startDate: toDateInput(event.startDate),
            endDate: toDateInput(event.endDate),
            venueName: event.venueName ?? "",
            venueAddress: event.venueAddress ?? "",
            description: event.description,
            images: event.galleryImages.map((g) => g.url),
            published: event.published,
          }}
        />
      </div>
    </div>
  );
}
