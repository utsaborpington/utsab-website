"use client";

import { useState } from "react";

type Status = "idle" | "submitting" | "success" | "error";

export default function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("submitting");
    setError("");

    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error ?? "Something went wrong. Please try again.");
      }
      setStatus("success");
      form.reset();
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    }
  }

  if (status === "success") {
    return (
      <div className="surface-shadow rounded-[20px] bg-indigo-800 p-8">
        <p className="font-display text-2xl font-extrabold text-lavender-50">Message sent</p>
        <p className="mt-2 text-lavender-400">
          Thank you for reaching out — we&rsquo;ll get back to you as soon as we can.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="surface-shadow flex flex-col gap-[18px] rounded-[20px] bg-indigo-800 p-8"
    >
      <div>
        <label htmlFor="name" className="text-[13px] font-semibold text-lavender-100">
          Name
        </label>
        <input id="name" name="name" type="text" required className="input mt-1.5" />
      </div>
      <div>
        <label htmlFor="email" className="text-[13px] font-semibold text-lavender-100">
          Email
        </label>
        <input id="email" name="email" type="email" required className="input mt-1.5" />
      </div>
      <div>
        <label htmlFor="message" className="text-[13px] font-semibold text-lavender-100">
          Message
        </label>
        <textarea id="message" name="message" required rows={5} className="input mt-1.5" />
      </div>

      {status === "error" && <p className="text-sm text-magenta-500">{error}</p>}

      <button
        type="submit"
        disabled={status === "submitting"}
        className="glow-marigold mt-1 inline-flex w-fit items-center justify-center rounded-full bg-marigold-500 px-7 py-3.5 font-bold text-indigo-975 transition-transform hover:scale-105 disabled:opacity-60 disabled:hover:scale-100"
      >
        {status === "submitting" ? "Sending…" : "Send message"}
      </button>
    </form>
  );
}
