"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { SITE } from "@/lib/site";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });

    if (res.ok) {
      const dest = searchParams.get("from") || "/admin";
      router.push(dest);
      router.refresh();
    } else {
      const body = await res.json().catch(() => ({}));
      setError(body.error ?? "Login failed.");
      setLoading(false);
    }
  }

  return (
    <div className="dot-grid mx-auto flex min-h-[70vh] max-w-md flex-col justify-center bg-indigo-950 px-4 sm:px-6">
      <p className="text-center font-display text-3xl font-extrabold text-lavender-50">
        {SITE.name} Admin
      </p>
      <form
        onSubmit={handleSubmit}
        className="surface-shadow mt-8 space-y-4 rounded-[20px] bg-indigo-800 p-8"
      >
        <div>
          <label htmlFor="password" className="text-[13px] font-semibold text-lavender-100">
            Admin password
          </label>
          <input
            id="password"
            type="password"
            required
            autoFocus
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input mt-1.5"
          />
        </div>
        {error && <p className="text-sm text-magenta-500">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="glow-marigold w-full rounded-full bg-marigold-500 px-8 py-3 font-bold text-indigo-975 transition-transform hover:scale-105 disabled:opacity-60 disabled:hover:scale-100"
        >
          {loading ? "Signing in…" : "Sign in"}
        </button>
      </form>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
