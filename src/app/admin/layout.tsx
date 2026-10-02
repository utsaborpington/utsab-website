import AdminNav from "./AdminNav";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-indigo-950">
      <AdminNav />
      <div className="mx-auto max-w-5xl px-4 sm:px-6 py-10">{children}</div>
    </div>
  );
}
