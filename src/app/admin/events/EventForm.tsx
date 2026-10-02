"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { EVENT_TYPE_LABELS, EVENT_TYPES, type EventType } from "@/lib/eventTypes";

export type EventFormValues = {
  id?: string;
  title: string;
  type: EventType;
  startDate: string; // yyyy-mm-dd or ""
  endDate: string;
  venueName: string;
  venueAddress: string;
  description: string;
  images: string[]; // first image is the cover
  published: boolean;
};

const EMPTY: EventFormValues = {
  title: "",
  type: "durga_puja",
  startDate: "",
  endDate: "",
  venueName: "",
  venueAddress: "",
  description: "",
  images: [],
  published: true,
};

export default function EventForm({ initial }: { initial?: EventFormValues }) {
  const router = useRouter();
  const [values, setValues] = useState<EventFormValues>(initial ?? EMPTY);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isEdit = Boolean(values.id);

  function update<K extends keyof EventFormValues>(key: K, value: EventFormValues[K]) {
    setValues((v) => ({ ...v, [key]: value }));
  }

  async function handleUpload(files: FileList | null) {
    if (!files || files.length === 0) return;
    setUploading(true);
    setError("");
    try {
      const uploaded: string[] = [];
      for (const file of Array.from(files)) {
        const formData = new FormData();
        formData.append("file", file);
        const res = await fetch("/api/admin/upload", { method: "POST", body: formData });
        if (!res.ok) throw new Error("Upload failed.");
        const body = await res.json();
        uploaded.push(body.url);
      }
      update("images", [...values.images, ...uploaded]);
    } catch {
      setError("One or more images failed to upload. Please try again.");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  function removeImage(url: string) {
    update(
      "images",
      values.images.filter((u) => u !== url),
    );
  }

  function makeCover(url: string) {
    update("images", [url, ...values.images.filter((u) => u !== url)]);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");

    const payload = {
      title: values.title,
      type: values.type,
      startDate: values.startDate || null,
      endDate: values.endDate || null,
      venueName: values.venueName,
      venueAddress: values.venueAddress,
      description: values.description,
      coverImage: values.images[0] ?? null,
      galleryImages: values.images,
      published: values.published,
    };

    const res = await fetch(isEdit ? `/api/admin/events/${values.id}` : "/api/admin/events", {
      method: isEdit ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      router.push("/admin");
      router.refresh();
    } else {
      const body = await res.json().catch(() => ({}));
      setError(body.error ?? "Failed to save event.");
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="surface-shadow grid gap-6 rounded-[18px] bg-indigo-800 p-6 sm:grid-cols-2">
        <Field label="Title" className="sm:col-span-2">
          <input
            required
            value={values.title}
            onChange={(e) => update("title", e.target.value)}
            className="input"
          />
        </Field>

        <Field label="Event type">
          <select
            value={values.type}
            onChange={(e) => update("type", e.target.value as EventType)}
            className="input"
          >
            {EVENT_TYPES.map((t) => (
              <option key={t} value={t}>
                {EVENT_TYPE_LABELS[t]}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Visible on site">
          <label className="flex items-center gap-2 pt-2">
            <input
              type="checkbox"
              checked={values.published}
              onChange={(e) => update("published", e.target.checked)}
              className="h-4 w-4"
            />
            <span className="text-sm text-lavender-300">Published</span>
          </label>
        </Field>

        <Field label="Start date">
          <input
            type="date"
            value={values.startDate}
            onChange={(e) => update("startDate", e.target.value)}
            className="input"
          />
        </Field>

        <Field label="End date">
          <input
            type="date"
            value={values.endDate}
            onChange={(e) => update("endDate", e.target.value)}
            className="input"
          />
        </Field>

        <Field label="Venue name">
          <input
            value={values.venueName}
            onChange={(e) => update("venueName", e.target.value)}
            className="input"
          />
        </Field>

        <Field label="Venue address">
          <input
            value={values.venueAddress}
            onChange={(e) => update("venueAddress", e.target.value)}
            className="input"
          />
        </Field>

        <Field label="Description" className="sm:col-span-2">
          <textarea
            rows={8}
            value={values.description}
            onChange={(e) => update("description", e.target.value)}
            className="input"
            placeholder="Separate paragraphs with a blank line."
          />
        </Field>
      </div>

      <div className="surface-shadow rounded-[18px] bg-indigo-800 p-6">
        <p className="text-sm font-semibold text-lavender-100">Photos</p>
        <p className="mt-1 text-xs text-lavender-600">
          The first photo is used as the cover image. Click a photo to make it the cover.
        </p>

        {values.images.length > 0 && (
          <div className="mt-4 grid grid-cols-3 gap-3 sm:grid-cols-4">
            {values.images.map((url, i) => (
              <div key={url} className="group relative aspect-square overflow-hidden rounded-lg">
                <button type="button" onClick={() => makeCover(url)} className="block h-full w-full">
                  <Image src={url} alt="" fill sizes="150px" className="object-cover" />
                </button>
                {i === 0 && (
                  <span className="absolute left-1 top-1 rounded-full bg-marigold-500 px-2 py-0.5 text-[10px] font-bold text-indigo-975">
                    Cover
                  </span>
                )}
                <button
                  type="button"
                  onClick={() => removeImage(url)}
                  aria-label="Remove photo"
                  className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-indigo-975/80 text-lavender-50 opacity-0 transition-opacity group-hover:opacity-100"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="mt-4">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={(e) => handleUpload(e.target.files)}
            disabled={uploading}
            className="text-sm text-lavender-300"
          />
          {uploading && <p className="mt-2 text-sm text-lavender-400">Uploading…</p>}
        </div>
      </div>

      {error && <p className="text-sm text-magenta-500">{error}</p>}

      <div className="flex gap-4">
        <button
          type="submit"
          disabled={saving || uploading}
          className="glow-marigold rounded-full bg-marigold-500 px-8 py-3 font-bold text-indigo-975 transition-transform hover:scale-105 disabled:opacity-60 disabled:hover:scale-100"
        >
          {saving ? "Saving…" : isEdit ? "Save changes" : "Create event"}
        </button>
        <button
          type="button"
          onClick={() => router.push("/admin")}
          className="rounded-full px-8 py-3 font-semibold text-lavender-300 hover:bg-white/5"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

function Field({
  label,
  children,
  className = "",
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <label className={`block ${className}`}>
      <span className="text-sm font-semibold text-lavender-100">{label}</span>
      <div className="mt-1">{children}</div>
    </label>
  );
}
