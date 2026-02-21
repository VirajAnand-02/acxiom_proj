import { MembershipDuration } from "@prisma/client";
import { describe, expect, it } from "vitest";

import { addMembershipSchema, updateMembershipSchema } from "@/lib/validation/membership";

describe("membership validation schema", () => {
  it("accepts valid add membership payload", () => {
    const parsed = addMembershipSchema.safeParse({
      membershipNumber: "MEM-1234",
      vendorEmail: "vendor@example.com",
      startDate: "2026-02-21",
      duration: MembershipDuration.SIX_MONTHS
    });

    expect(parsed.success).toBe(true);
  });

  it("rejects update extend without extendBy", () => {
    const parsed = updateMembershipSchema.safeParse({
      action: "EXTEND"
    });

    expect(parsed.success).toBe(false);
  });
});
