import Link from "next/link";
import { Role } from "@prisma/client";
import type { GetServerSideProps } from "next";

import { ProtectedLayout } from "@/components/ProtectedLayout";
import { requirePageRole } from "@/lib/requirePageRole";

export default function UserDashboardPage() {
  return (
    <ProtectedLayout roles={["USER"]}>
      <section className="space-y-4">
        <h1 className="text-2xl font-bold">User Dashboard</h1>
        <div className="grid gap-2 sm:grid-cols-2">
          <div className="rounded border bg-white p-3">Vendor</div>
          <div className="rounded border bg-white p-3">Cart</div>
          <div className="rounded border bg-white p-3">Guest List</div>
          <div className="rounded border bg-white p-3">Order Status</div>
        </div>
        <div className="flex gap-2">
          <Link href="/reports" className="rounded border px-3 py-2 text-sm">
            Open Reports
          </Link>
          <Link href="/transactions" className="rounded border px-3 py-2 text-sm">
            Open Transactions
          </Link>
        </div>
      </section>
    </ProtectedLayout>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => requirePageRole(context, [Role.USER]);
