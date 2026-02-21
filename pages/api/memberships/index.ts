import { MembershipDuration, Role } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";

import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/role";
import { addMembershipSchema } from "@/lib/validation/membership";

function addDuration(startDate: Date, duration: MembershipDuration) {
  const result = new Date(startDate);
  if (duration === MembershipDuration.SIX_MONTHS) result.setMonth(result.getMonth() + 6);
  if (duration === MembershipDuration.ONE_YEAR) result.setFullYear(result.getFullYear() + 1);
  if (duration === MembershipDuration.TWO_YEARS) result.setFullYear(result.getFullYear() + 2);
  return result;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const session = await requireRole(req, res, [Role.ADMIN]);
  if (!session) return;

  const parsed = addMembershipSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ message: "Validation failed", errors: parsed.error.flatten() });
  }

  const vendor = await prisma.user.findUnique({
    where: { email: parsed.data.vendorEmail.toLowerCase() }
  });
  if (!vendor || vendor.role !== Role.VENDOR) {
    return res.status(400).json({ message: "Vendor not found" });
  }

  const startDate = new Date(parsed.data.startDate);
  const endDate = addDuration(startDate, parsed.data.duration);

  try {
    const membership = await prisma.membership.create({
      data: {
        membershipNumber: parsed.data.membershipNumber,
        vendorId: vendor.id,
        startDate,
        endDate,
        duration: parsed.data.duration
      },
      include: {
        vendor: { select: { email: true } }
      }
    });

    return res.status(201).json({
      id: membership.id,
      membershipNumber: membership.membershipNumber,
      vendorEmail: membership.vendor?.email ?? null,
      startDate: membership.startDate,
      endDate: membership.endDate,
      duration: membership.duration,
      status: membership.status
    });
  } catch {
    return res.status(409).json({ message: "Membership number already exists" });
  }
}
