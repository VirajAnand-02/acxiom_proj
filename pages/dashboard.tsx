import type { GetServerSideProps } from "next";
import { Role } from "@prisma/client";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";

export default function DashboardRouterPage() {
  return null;
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getServerSession(context.req, context.res, authOptions);
  if (!session) {
    return {
      redirect: {
        destination: "/login",
        permanent: false
      }
    };
  }

  const role = session.user.role as Role;
  let destination = "/user";
  if (role === Role.ADMIN) destination = "/admin/maintenance";
  if (role === Role.VENDOR) destination = "/vendor";

  return {
    redirect: {
      destination,
      permanent: false
    }
  };
};
