import Link from "next/link";
import { signOut, useSession } from "next-auth/react";

export function Header() {
  const { data: session } = useSession();

  return (
    <header className="border-b bg-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <nav className="flex flex-wrap items-center gap-3 text-sm font-medium">
          <Link href="/">Home</Link>
          <Link href="/chart">Chart</Link>
          {session?.user?.role === "ADMIN" && <Link href="/admin/maintenance">Maintenance</Link>}
          {session?.user?.role && ["ADMIN", "USER"].includes(session.user.role) && <Link href="/reports">Reports</Link>}
          {session?.user?.role && ["ADMIN", "USER"].includes(session.user.role) && <Link href="/transactions">Transactions</Link>}
          {session?.user?.role === "VENDOR" && <Link href="/vendor">Vendor</Link>}
          {session?.user?.role === "USER" && <Link href="/user">User</Link>}
        </nav>
        {session ? (
          <button className="rounded bg-slate-900 px-3 py-1.5 text-sm text-white" onClick={() => signOut({ callbackUrl: "/login" })}>
            Logout
          </button>
        ) : (
          <Link href="/login" className="rounded bg-slate-900 px-3 py-1.5 text-sm text-white">
            Login
          </Link>
        )}
      </div>
    </header>
  );
}
