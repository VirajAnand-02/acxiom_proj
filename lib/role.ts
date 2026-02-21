import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";

export type AppRole = "ADMIN" | "USER" | "VENDOR";

type RoleSession = {
  user?: {
    id?: string;
    role?: AppRole;
    email?: string;
  };
} | null;

export async function requireRole(
  req: NextApiRequest,
  res: NextApiResponse,
  roles: AppRole[]
): Promise<RoleSession> {
  const session = (await getServerSession(req, res, authOptions)) as RoleSession;

  if (!session?.user?.role || !roles.includes(session.user.role)) {
    res.status(403).json({ message: "Forbidden" });
    return null;
  }

  return session;
}
