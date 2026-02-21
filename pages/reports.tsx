import { MembershipStatus, Role } from "@prisma/client";
import type { GetServerSideProps } from "next";
import { useMemo, useState } from "react";

import { ProtectedLayout } from "@/components/ProtectedLayout";
import { prisma } from "@/lib/prisma";
import { requirePageRole } from "@/lib/requirePageRole";

type ReportRow = {
  id: number;
  membershipNumber: string;
  status: MembershipStatus;
  vendorEmail: string | null;
};

type Props = {
  rows: ReportRow[];
};

export default function ReportsPage({ rows }: Props) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(
    () =>
      rows.filter((row) => {
        const target = `${row.membershipNumber} ${row.vendorEmail ?? ""} ${row.status}`.toLowerCase();
        return target.includes(query.toLowerCase());
      }),
    [rows, query]
  );

  return (
    <ProtectedLayout roles={["ADMIN", "USER"]}>
      <section className="space-y-4">
        <h1 className="text-2xl font-bold">Reports</h1>
        <input
          className="w-full rounded border border-slate-300 bg-white px-3 py-2 text-sm"
          placeholder="Filter by membership, vendor, status..."
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
        <div className="rounded border bg-white p-3">
          <ul className="space-y-2 text-sm">
            {filtered.map((row) => (
              <li key={row.id} className="rounded border p-2">
                {row.membershipNumber} | {row.vendorEmail ?? "No vendor"} | {row.status}
              </li>
            ))}
          </ul>
        </div>
      </section>
    </ProtectedLayout>
  );
}

export const getServerSideProps: GetServerSideProps<Props> = async (context) => {
  const guard = await requirePageRole<Props>(context, [Role.ADMIN, Role.USER]);
  if ("redirect" in guard) return guard;

  const memberships = await prisma.membership.findMany({
    include: {
      vendor: {
        select: { email: true }
      }
    },
    orderBy: { createdAt: "desc" }
  });

  return {
    props: {
      rows: memberships.map((row) => ({
        id: row.id,
        membershipNumber: row.membershipNumber,
        status: row.status,
        vendorEmail: row.vendor?.email ?? null
      }))
    }
  };
};
