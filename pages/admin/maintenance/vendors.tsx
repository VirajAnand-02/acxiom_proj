import { Role } from "@prisma/client";
import type { GetServerSideProps } from "next";

import { ProtectedLayout } from "@/components/ProtectedLayout";
import { prisma } from "@/lib/prisma";
import { requirePageRole } from "@/lib/requirePageRole";

type Props = {
  vendors: Array<{ id: number; name: string; email: string }>;
};

export default function VendorsManagementPage({ vendors }: Props) {
  return (
    <ProtectedLayout roles={["ADMIN"]}>
      <section className="space-y-4">
        <h1 className="text-2xl font-bold">Vendor Management</h1>
        <div className="overflow-x-auto rounded border bg-white">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-slate-100">
              <tr>
                <th className="px-3 py-2">Name</th>
                <th className="px-3 py-2">Email</th>
              </tr>
            </thead>
            <tbody>
              {vendors.map((vendor) => (
                <tr key={vendor.id} className="border-t">
                  <td className="px-3 py-2">{vendor.name}</td>
                  <td className="px-3 py-2">{vendor.email}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </ProtectedLayout>
  );
}

export const getServerSideProps: GetServerSideProps<Props> = async (context) => {
  const guard = await requirePageRole<Props>(context, [Role.ADMIN]);
  if ("redirect" in guard) return guard;

  const vendors = await prisma.user.findMany({
    where: { role: Role.VENDOR },
    orderBy: { createdAt: "desc" },
    select: { id: true, name: true, email: true }
  });

  return { props: { vendors } };
};
