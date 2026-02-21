import { useSession } from "next-auth/react";
import type { PropsWithChildren } from "react";

type Props = PropsWithChildren<{
  roles?: Array<"ADMIN" | "USER" | "VENDOR">;
}>;

export function ProtectedLayout({ children, roles }: Props) {
  const { status, data } = useSession();

  if (status === "loading") {
    return <p className="text-sm text-slate-600">Loading session...</p>;
  }

  if (status === "unauthenticated") {
    return <p className="text-sm text-red-600">Please log in to continue.</p>;
  }

  if (roles?.length && data?.user?.role && !roles.includes(data.user.role)) {
    return <p className="text-sm text-red-600">You do not have access to this page.</p>;
  }

  return <>{children}</>;
}
