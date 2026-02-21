import type { GetServerSideProps } from "next";
import { Role } from "@prisma/client";
import { toast } from "react-toastify";

import { MembershipForm } from "@/components/MembershipForm";
import { ProtectedLayout } from "@/components/ProtectedLayout";
import { prisma } from "@/lib/prisma";
import { requirePageRole } from "@/lib/requirePageRole";
import type { AddMembershipInput } from "@/lib/validation/membership";

type Props = {
  vendorEmails: string[];
};

export default function AddMembershipPage({ vendorEmails }: Props) {
  return (
    <ProtectedLayout roles={["ADMIN"]}>
      <section className="space-y-4">
        <h1 className="text-2xl font-bold">Add Membership</h1>
        <MembershipForm
          mode="create"
          vendorOptions={vendorEmails}
          onSubmitCreate={async (payload: AddMembershipInput) => {
            const response = await fetch("/api/memberships", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(payload)
            });

            if (!response.ok) {
              const data = await response.json();
              toast.error(data.message || "Unable to create membership");
              return;
            }

            toast.success("Membership created");
          }}
        />
      </section>
    </ProtectedLayout>
  );
}

export const getServerSideProps: GetServerSideProps<Props> = async (context) => {
  const guard = await requirePageRole<Props>(context, [Role.ADMIN]);
  if ("redirect" in guard) return guard;

  const vendors = await prisma.user.findMany({
    where: { role: Role.VENDOR },
    select: { email: true }
  });

  return {
    props: {
      vendorEmails: vendors.map((vendor) => vendor.email)
    }
  };
};
