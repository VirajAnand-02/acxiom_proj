import { MembershipDuration, Role } from "@prisma/client";
import type { GetServerSideProps } from "next";
import { useState } from "react";
import { toast } from "react-toastify";

import { MembershipForm } from "@/components/MembershipForm";
import { ProtectedLayout } from "@/components/ProtectedLayout";
import { requirePageRole } from "@/lib/requirePageRole";

type LoadedMembership = {
  id: number;
  membershipNumber: string;
  vendorEmail: string;
  endDate: string;
};

export default function UpdateMembershipPage() {
  const [membership, setMembership] = useState<LoadedMembership | null>(null);

  return (
    <ProtectedLayout roles={["ADMIN"]}>
      <section className="space-y-4">
        <h1 className="text-2xl font-bold">Update Membership</h1>
        <MembershipForm
          mode="update"
          loadedMembership={membership}
          onLoadMembership={async (membershipNumber) => {
            const response = await fetch(`/api/memberships/${membershipNumber}`);
            if (!response.ok) {
              toast.error("Membership not found");
              setMembership(null);
              return;
            }
            const data = await response.json();
            setMembership({
              id: data.id,
              membershipNumber: data.membershipNumber,
              vendorEmail: data.vendorEmail ?? "N/A",
              endDate: new Date(data.endDate).toLocaleDateString()
            });
            toast.success("Membership loaded");
          }}
          onSubmitUpdate={async (payload) => {
            const body =
              payload.action === "CANCEL"
                ? { action: "CANCEL" }
                : { action: "EXTEND", extendBy: payload.extendBy ?? MembershipDuration.SIX_MONTHS };

            const response = await fetch(`/api/memberships/${payload.id}`, {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(body)
            });
            if (!response.ok) {
              const data = await response.json();
              toast.error(data.message || "Update failed");
              return;
            }
            toast.success(payload.action === "CANCEL" ? "Membership cancelled" : "Membership extended");
          }}
        />
      </section>
    </ProtectedLayout>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => requirePageRole(context, [Role.ADMIN]);
