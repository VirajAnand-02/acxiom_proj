import { Role } from "@prisma/client";
import type { GetServerSidePropsContext, GetServerSidePropsResult } from "next";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";

export async function requirePageRole<T>(
  context: GetServerSidePropsContext,
  roles: Role[]
): Promise<GetServerSidePropsResult<T>> {
  const session = await getServerSession(context.req, context.res, authOptions);

  if (!session) {
    return {
      redirect: {
        destination: "/login",
        permanent: false
      }
    };
  }

  if (!session.user?.role || !roles.includes(session.user.role)) {
    return {
      redirect: {
        destination: "/dashboard",
        permanent: false
      }
    };
  }

  return { props: {} as T };
}
