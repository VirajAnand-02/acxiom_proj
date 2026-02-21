import { MembershipDuration, MembershipStatus, Role } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";

import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/role";
import { updateMembershipSchema } from "@/lib/validation/membership";

function addDuration(endDate: Date, duration: MembershipDuration) {
  const next = new Date(endDate);
  if (duration === MembershipDuration.SIX_MONTHS) next.setMonth(next.getMonth() + 6);
  if (duration === MembershipDuration.ONE_YEAR) next.setFullYear(next.getFullYear() + 1);
  if (duration === MembershipDuration.TWO_YEARS) next.setFullYear(next.getFullYear() + 2);
  return next;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const identifier = req.query.identifier;
  if (typeof identifier !== "string") {
    return res.status(400).json({ message: "Invalid identifier" });
  }

  if (req.method === "GET") {
    const session = await requireRole(req, res, [Role.ADMIN, Role.VENDOR]);
    if (!session) return;

    const membership = await prisma.membership.findUnique({
      where: { membershipNumber: identifier },
      include: { vendor: { select: { id: true, email: true } } }
    });
    if (!membership) {
      return res.status(404).json({ message: "Membership not found" });
    }

    if (session.user?.role === Role.VENDOR && Number(session.user.id) !== membership.vendorId) {
      return res.status(403).json({ message: "Forbidden" });
    }

    return res.status(200).json({
      id: membership.id,
      membershipNumber: membership.membershipNumber,
      vendorId: membership.vendorId,
      vendorEmail: membership.vendor?.email ?? null,
      startDate: membership.startDate,
      endDate: membership.endDate,
      status: membership.status,
      duration: membership.duration
    });
  }

  if (req.method === "PUT") {
    const session = await requireRole(req, res, [Role.ADMIN]);
    if (!session) return;

    const id = Number(identifier);
    if (Number.isNaN(id)) {
      return res.status(400).json({ message: "Membership id must be numeric" });
    }

    const parsed = updateMembershipSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ message: "Validation failed", errors: parsed.error.flatten() });
    }

    const membership = await prisma.membership.findUnique({ where: { id } });
    if (!membership) {
      return res.status(404).json({ message: "Membership not found" });
    }

    const payload = parsed.data;
    if (payload.action === "CANCEL") {
      const cancelled = await prisma.membership.update({
        where: { id },
        data: {
          status: MembershipStatus.CANCELLED
        }
      });
      return res.status(200).json(cancelled);
    }

    const nextEndDate = addDuration(membership.endDate, payload.extendBy || MembershipDuration.SIX_MONTHS);
    const updated = await prisma.membership.update({
      where: { id },
      data: {
        endDate: nextEndDate,
        duration: payload.extendBy || MembershipDuration.SIX_MONTHS,
        status: MembershipStatus.ACTIVE
      }
    });
    return res.status(200).json(updated);
  }

  return res.status(405).json({ message: "Method not allowed" });
}
