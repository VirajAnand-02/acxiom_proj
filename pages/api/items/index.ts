import { Role } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";
import { z } from "zod";

import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/role";

const itemSchema = z.object({
  name: z.string().min(1, "Name is required"),
  status: z.string().default("AVAILABLE")
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    const session = await requireRole(req, res, [Role.ADMIN, Role.VENDOR]);
    if (!session) return;

    const where = session.user?.role === Role.VENDOR ? { vendorId: Number(session.user.id) } : undefined;
    const items = await prisma.item.findMany({ where, orderBy: { createdAt: "desc" } });
    return res.status(200).json(items);
  }

  if (req.method === "POST") {
    const session = await requireRole(req, res, [Role.VENDOR]);
    if (!session) return;

    const parsed = itemSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ message: "Validation failed", errors: parsed.error.flatten() });
    }

    const item = await prisma.item.create({
      data: {
        name: parsed.data.name,
        status: parsed.data.status,
        vendorId: Number(session.user?.id)
      }
    });
    return res.status(201).json(item);
  }

  return res.status(405).json({ message: "Method not allowed" });
}
