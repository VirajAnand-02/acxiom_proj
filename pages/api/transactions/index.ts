import { Role } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";
import { z } from "zod";

import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/role";

const transactionSchema = z.object({
  amount: z.number().nonnegative(),
  status: z.string().min(1)
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    const session = await requireRole(req, res, [Role.ADMIN, Role.USER]);
    if (!session) return;

    const transactions = await prisma.transaction.findMany({
      orderBy: { createdAt: "desc" },
      take: 200
    });
    return res.status(200).json(transactions);
  }

  if (req.method === "POST") {
    const session = await requireRole(req, res, [Role.ADMIN, Role.USER]);
    if (!session) return;

    const parsed = transactionSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ message: "Validation failed", errors: parsed.error.flatten() });
    }

    const transaction = await prisma.transaction.create({
      data: {
        amount: parsed.data.amount,
        status: parsed.data.status,
        userId: Number(session.user?.id)
      }
    });
    return res.status(201).json(transaction);
  }

  return res.status(405).json({ message: "Method not allowed" });
}
