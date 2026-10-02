/**
 * Seeds the database from site-dump/events.json (content mined from the old
 * WordPress site) and copies the real, full-resolution photos referenced by
 * each event into public/images/archive/ so they ship as static assets.
 *
 * Safe to re-run: clears and re-inserts events each time.
 */
import { PrismaClient } from "@prisma/client";
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const prisma = new PrismaClient();

const ROOT = path.resolve(__dirname, "..");
const DUMP_EVENTS = path.join(ROOT, "site-dump", "events.json");
const RAW_UPLOADS = path.join(ROOT, "site-dump-raw", "uploads");
const PUBLIC_ARCHIVE = path.join(ROOT, "public", "images", "archive");

type DumpImage = {
  filename: string;
  relativePath: string; // e.g. uploads/uploads/2024/10/Banner.jpeg
  sourceUrl?: string;
  role?: string;
};

type DumpEvent = {
  title: string;
  eventType: "Durga Puja" | "Saraswati Puja" | string;
  year: number;
  startDate: string | null;
  endDate: string | null;
  venue: { name: string; address: string; phone?: string | null } | null;
  description: string | null;
  images: DumpImage[];
  slug: string;
  status: string;
};

const TYPE_MAP: Record<string, string> = {
  "Durga Puja": "durga_puja",
  "Saraswati Puja": "saraswati_puja",
};

/** Strips WordPress's auto-generated "-WIDTHxHEIGHT" size suffix, e.g.
 * "Banner-1024x682.jpeg" -> "Banner.jpeg", to find the original upload. */
function toOriginalFilename(filename: string): string {
  return filename.replace(/-\d+x\d+(?=\.[a-zA-Z]+$)/, "");
}

/** Cleans leftover WordPress/plugin shortcodes and stale "today" framing out
 * of description text so it reads as normal prose on the new site. */
function cleanDescription(raw: string | null): string {
  if (!raw) return "";
  return raw
    .replace(/\[gslogo[^\]]*\]/g, "")
    .replace(/\[wpgmza[^\]]*\]/g, "")
    .replace(/##\s*\*\*\s*ANNOUNCEMENT\s*\*\*[\s\S]*?\*{20,}\n*/gi, "")
    .replace(/Utsab welsomes/g, "Utsab welcomes")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

async function copyImage(img: DumpImage): Promise<string | null> {
  // relativePath looks like "uploads/uploads/<year>/<month>/<filename>"
  const parts = img.relativePath.split("/");
  const filename = parts[parts.length - 1];
  const month = parts[parts.length - 2];
  const year = parts[parts.length - 3];

  const originalFilename = toOriginalFilename(filename);
  const originalSourcePath = path.join(RAW_UPLOADS, "uploads", year, month, originalFilename);
  const fallbackSourcePath = path.join(RAW_UPLOADS, "uploads", year, month, filename);

  const sourcePath = fs.existsSync(originalSourcePath) ? originalSourcePath : fallbackSourcePath;
  const finalFilename = fs.existsSync(originalSourcePath) ? originalFilename : filename;

  if (!fs.existsSync(sourcePath)) {
    console.warn(`  ! missing source image, skipping: ${sourcePath}`);
    return null;
  }

  const destDir = path.join(PUBLIC_ARCHIVE, year, month);
  fs.mkdirSync(destDir, { recursive: true });
  const destPath = path.join(destDir, finalFilename);
  if (!fs.existsSync(destPath)) {
    // Re-encode through sharp (bakes in EXIF rotation, strips embedded ICC
    // profiles/metadata) — some WhatsApp exports in this archive carry ICC
    // profiles that hang Chrome's image decoder, so we normalize all of them
    // rather than special-case the affected files.
    const ext = path.extname(finalFilename).toLowerCase();
    const pipeline = sharp(sourcePath).rotate();
    if (ext === ".png") {
      await pipeline.png({ quality: 90 }).toFile(destPath);
    } else {
      await pipeline.jpeg({ quality: 88, mozjpeg: true }).toFile(destPath);
    }
  }

  return `/images/archive/${year}/${month}/${finalFilename}`;
}

async function main() {
  if (!fs.existsSync(DUMP_EVENTS)) {
    throw new Error(`Cannot find ${DUMP_EVENTS}. Run this from the project root.`);
  }
  const events: DumpEvent[] = JSON.parse(fs.readFileSync(DUMP_EVENTS, "utf-8"));

  console.log(`Seeding ${events.length} events...`);

  await prisma.galleryImage.deleteMany();
  await prisma.event.deleteMany();

  for (const e of events) {
    const type = TYPE_MAP[e.eventType] ?? "other";

    // Some pages reference a generic fallback image via the WP theme's
    // ".local" dev placeholder domain (see site-dump/NOTES.md) rather than a
    // real per-event upload — e.g. the Durga Puja 2024 banner gets reused as
    // "the" featured image on unrelated Saraswati Puja pages. Drop it when
    // the event has other, genuinely event-specific images available.
    const isGenericFallback = (img: DumpImage) =>
      Boolean(img.sourceUrl && img.sourceUrl.includes("utsab.local"));
    const hasRealImages = e.images.some((img) => !isGenericFallback(img));
    const relevantImages = hasRealImages
      ? e.images.filter((img) => !isGenericFallback(img))
      : e.images;

    const imageUrls = (await Promise.all(relevantImages.map(copyImage))).filter(
      (u): u is string => Boolean(u),
    );
    const uniqueUrls = [...new Set(imageUrls)];

    if (uniqueUrls.length === 0) {
      console.warn(`  ! no resolvable images for "${e.title}"`);
    }

    await prisma.event.create({
      data: {
        slug: e.slug,
        title: e.title,
        type,
        startDate: e.startDate ? new Date(e.startDate) : null,
        endDate: e.endDate ? new Date(e.endDate) : null,
        venueName: e.venue?.name ?? null,
        venueAddress: e.venue?.address ?? null,
        description:
          cleanDescription(e.description) ||
          `${e.eventType} ${e.year}, celebrated with the UTSAB community in Orpington. Photos from this celebration are shown below.`,
        coverImage: uniqueUrls[0] ?? null,
        published: true,
        galleryImages: {
          create: uniqueUrls.map((url, i) => ({
            url,
            alt: `${e.title} — photo ${i + 1}`,
            order: i,
          })),
        },
      },
    });
    console.log(`  + ${e.title} (${uniqueUrls.length} images)`);
  }

  console.log("Seed complete.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
