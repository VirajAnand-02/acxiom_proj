import { Role } from "@prisma/client";
import type { GetServerSideProps } from "next";

import { ProtectedLayout } from "@/components/ProtectedLayout";
import { prisma } from "@/lib/prisma";
import { requirePageRole } from "@/lib/requirePageRole";

type Props = {
  transactions: Array<{ id: number; amount: number; status: string; createdAt: string }>;
};

export default function TransactionsPage({ transactions }: Props) {
  return (
    <ProtectedLayout roles={["ADMIN", "USER"]}>
      <section className="space-y-4">
        <h1 className="text-2xl font-bold">Transactions</h1>
        <div className="rounded border bg-white p-3">
          <ul className="space-y-2 text-sm">
            {transactions.map((transaction) => (
              <li key={transaction.id} className="rounded border p-2">
                #{transaction.id} | ${transaction.amount.toFixed(2)} | {transaction.status} | {new Date(transaction.createdAt).toLocaleString()}
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

  const transactions = await prisma.transaction.findMany({
    orderBy: { createdAt: "desc" },
    take: 100
  });

  return {
    props: {
      transactions: transactions.map((transaction) => ({
        id: transaction.id,
        amount: transaction.amount,
        status: transaction.status,
        createdAt: transaction.createdAt.toISOString()
      }))
    }
  };
};
