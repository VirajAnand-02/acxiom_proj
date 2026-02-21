import { Role } from "@prisma/client";
import type { GetServerSideProps } from "next";

import { ProtectedLayout } from "@/components/ProtectedLayout";
import { requirePageRole } from "@/lib/requirePageRole";

export default function VendorDashboardPage() {
  return (
    <ProtectedLayout roles={["VENDOR"]}>
      <section className="space-y-4">
        <h1 className="text-2xl font-bold">Vendor Main Page</h1>
        <div className="grid gap-3 sm:grid-cols-3">
          <article className="rounded border bg-white p-3">
            <h2 className="font-semibold">Your Item</h2>
            <p className="text-sm text-slate-600">Insert or delete item entries.</p>
          </article>
          <article className="rounded border bg-white p-3">
            <h2 className="font-semibold">Add New Item</h2>
            <p className="text-sm text-slate-600">Update product status and request item.</p>
          </article>
          <article className="rounded border bg-white p-3">
            <h2 className="font-semibold">Transaction</h2>
            <p className="text-sm text-slate-600">Review user requests.</p>
          </article>
        </div>
      </section>
    </ProtectedLayout>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => requirePageRole(context, [Role.VENDOR]);
