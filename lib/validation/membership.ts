import { MembershipDuration } from "@prisma/client";
import { z } from "zod";

export const durationEnum = z.nativeEnum(MembershipDuration, {
  errorMap: () => ({ message: "Select a membership duration" })
});

export const addMembershipSchema = z.object({
  membershipNumber: z.string().trim().min(1, "Membership number is required"),
  vendorEmail: z.string().trim().toLowerCase().email("Vendor email is required"),
  startDate: z
    .string()
    .min(1, "Start date is required")
    .refine((value) => !Number.isNaN(new Date(value).getTime()), "Start date must be valid"),
  duration: durationEnum
});

export const updateMembershipSchema = z
  .object({
    action: z.enum(["EXTEND", "CANCEL"]),
    extendBy: durationEnum.optional()
  })
  .superRefine((value, ctx) => {
    if (value.action === "EXTEND" && !value.extendBy) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["extendBy"],
        message: "Choose how long to extend"
      });
    }
  });

export type AddMembershipInput = z.infer<typeof addMembershipSchema>;
export type UpdateMembershipInput = z.infer<typeof updateMembershipSchema>;
