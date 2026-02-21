import { Role } from "@prisma/client";
import type { GetServerSideProps } from "next";

import { ProtectedLayout } from "@/components/ProtectedLayout";
import { prisma } from "@/lib/prisma";
import { requirePageRole } from "@/lib/requirePageRole";

type Props = {
  users: Array<{ id: number; name: string; email: string; role: Role }>;
};

export default function UsersManagementPage({ users }: Props) {
  return (
    <ProtectedLayout roles={["ADMIN"]}>
      <section className="space-y-4">
        <h1 className="text-2xl font-bold">Users Management</h1>
        <div className="overflow-x-auto rounded border bg-white">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-slate-100">
              <tr>
                <th className="px-3 py-2">Name</th>
                <th className="px-3 py-2">Email</th>
                <th className="px-3 py-2">Role</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="border-t">
                  <td className="px-3 py-2">{user.name}</td>
                  <td className="px-3 py-2">{user.email}</td>
                  <td className="px-3 py-2">{user.role}</td>
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

  const users = await prisma.user.findMany({
    where: { role: { in: [Role.USER, Role.ADMIN] } },
    orderBy: { createdAt: "desc" },
    select: { id: true, name: true, email: true, role: true }
  });

  return { props: { users } };
};
