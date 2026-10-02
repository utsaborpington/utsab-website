"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

export default function AdminNav() {
  const pathname = usePathname();
  const router = useRouter();

  if (pathname === "/admin/login") return null;

  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <header className="border-b border-white/8 bg-indigo-975">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 sm:px-6 py-4">
        <Link href="/admin" className="font-display text-xl font-extrabold text-marigold-500">
          UTSAB Admin
        </Link>
        <div className="flex items-center gap-4 text-sm">
          <Link href="/" target="_blank" className="text-lavender-300 hover:text-marigold-500">
            View site ↗
          </Link>
          <button
            type="button"
            onClick={handleLogout}
            className="rounded-full bg-violet-500 px-4 py-1.5 font-semibold text-lavender-50 hover:bg-violet-500/80"
          >
            Log out
          </button>
        </div>
      </div>
    </header>
  );
}
