import Link from "next/link";
import type { GetServerSideProps } from "next";
import { Role } from "@prisma/client";

import { ProtectedLayout } from "@/components/ProtectedLayout";
import { requirePageRole } from "@/lib/requirePageRole";

export default function AdminMaintenancePage() {
  return (
    <ProtectedLayout roles={["ADMIN"]}>
      <section className="space-y-4">
        <h1 className="text-2xl font-bold">Maintenance Menu</h1>
        <div className="grid gap-2 sm:grid-cols-2">
          <Link href="/admin/maintenance/add-membership" className="rounded border bg-white p-3 text-sm">
            Add Memberships
          </Link>
          <Link href="/admin/maintenance/update-membership" className="rounded border bg-white p-3 text-sm">
            Update Memberships
          </Link>
          <Link href="/admin/maintenance/users" className="rounded border bg-white p-3 text-sm">
            Users Management
          </Link>
          <Link href="/admin/maintenance/vendors" className="rounded border bg-white p-3 text-sm">
            Vendor Management
          </Link>
        </div>
      </section>
    </ProtectedLayout>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => requirePageRole(context, [Role.ADMIN]);
