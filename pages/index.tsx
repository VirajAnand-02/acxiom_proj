import Link from "next/link";

export default function HomePage() {
  return (
    <section className="space-y-4">
      <h1 className="text-2xl font-bold">Event Management System</h1>
      <p className="text-sm text-slate-700">Role-based portal for Admin, User, and Vendor flows.</p>
      <div className="flex gap-3">
        <Link href="/login" className="rounded bg-slate-900 px-4 py-2 text-sm text-white">
          Login
        </Link>
        <Link href="/chart" className="rounded border border-slate-400 px-4 py-2 text-sm">
          View Chart
        </Link>
      </div>
    </section>
  );
}
