import { zodResolver } from "@hookform/resolvers/zod";
import { MembershipDuration } from "@prisma/client";
import { useMemo } from "react";
import { useForm } from "react-hook-form";

import { Checkbox } from "@/components/Checkbox";
import { FormInput } from "@/components/FormInput";
import { RadioGroup } from "@/components/RadioGroup";
import { addMembershipSchema, type AddMembershipInput } from "@/lib/validation/membership";

const durationOptions = [
  { label: "6 months", value: MembershipDuration.SIX_MONTHS },
  { label: "1 year", value: MembershipDuration.ONE_YEAR },
  { label: "2 years", value: MembershipDuration.TWO_YEARS }
];

type ExistingMembership = {
  id: number;
  membershipNumber: string;
  vendorEmail: string;
  endDate: string;
};

type CreateProps = {
  mode: "create";
  vendorOptions: string[];
  onSubmitCreate: (payload: AddMembershipInput) => Promise<void>;
};

type UpdateProps = {
  mode: "update";
  loadedMembership: ExistingMembership | null;
  onLoadMembership: (membershipNumber: string) => Promise<void>;
  onSubmitUpdate: (payload: { id: number; action: "EXTEND" | "CANCEL"; extendBy?: MembershipDuration }) => Promise<void>;
};

type Props = CreateProps | UpdateProps;

export function MembershipForm(props: Props) {
  const addForm = useForm<AddMembershipInput>({
    resolver: zodResolver(addMembershipSchema),
    defaultValues: {
      duration: MembershipDuration.SIX_MONTHS
    }
  });

  const updateForm = useForm<{ membershipNumber: string; extendBy: MembershipDuration; cancelMembership: boolean }>({
    defaultValues: {
      membershipNumber: "",
      extendBy: MembershipDuration.SIX_MONTHS,
      cancelMembership: false
    }
  });

  const vendorDatalistId = useMemo(() => `vendors-${Math.random().toString(36).slice(2)}`, []);

  if (props.mode === "create") {
    return (
      <form
        className="space-y-4 rounded border bg-white p-4"
        onSubmit={addForm.handleSubmit(async (values) => {
          await props.onSubmitCreate(values);
          addForm.reset({ duration: MembershipDuration.SIX_MONTHS });
        })}
      >
        <FormInput id="membershipNumber" label="Membership Number" error={addForm.formState.errors.membershipNumber?.message} {...addForm.register("membershipNumber")} />
        <div className="space-y-1">
          <FormInput id="vendorEmail" label="Vendor Email" list={vendorDatalistId} error={addForm.formState.errors.vendorEmail?.message} {...addForm.register("vendorEmail")} />
          <datalist id={vendorDatalistId}>
            {props.vendorOptions.map((vendor) => (
              <option key={vendor} value={vendor} />
            ))}
          </datalist>
        </div>
        <FormInput id="startDate" label="Start Date" type="date" error={addForm.formState.errors.startDate?.message} {...addForm.register("startDate")} />
        <RadioGroup
          legend="Membership Length"
          name="duration"
          value={addForm.watch("duration")}
          options={durationOptions}
          onChange={(value) => addForm.setValue("duration", value as MembershipDuration)}
          error={addForm.formState.errors.duration?.message}
        />
        <button type="submit" className="rounded bg-slate-900 px-4 py-2 text-sm text-white">
          Add Membership
        </button>
      </form>
    );
  }

  const membership = props.loadedMembership;
  const cancelMembership = updateForm.watch("cancelMembership");

  return (
    <div className="space-y-4 rounded border bg-white p-4">
      <form
        className="flex gap-2"
        onSubmit={updateForm.handleSubmit(async (values) => {
          await props.onLoadMembership(values.membershipNumber);
        })}
      >
        <div className="w-full">
          <FormInput
            id="loadMembershipNumber"
            label="Membership Number"
            required
            error={updateForm.formState.errors.membershipNumber?.message}
            {...updateForm.register("membershipNumber", { required: "Membership number is required" })}
          />
        </div>
        <button type="submit" className="mt-6 h-10 rounded bg-slate-800 px-4 text-sm text-white">
          Load
        </button>
      </form>

      {membership ? (
        <form
          className="space-y-3 border-t pt-3"
          onSubmit={updateForm.handleSubmit(async (values) => {
            await props.onSubmitUpdate({
              id: membership.id,
              action: values.cancelMembership ? "CANCEL" : "EXTEND",
              extendBy: values.cancelMembership ? undefined : values.extendBy
            });
          })}
        >
          <p className="text-sm">
            Loaded: <span className="font-medium">{membership.membershipNumber}</span> ({membership.vendorEmail}) current end date:{" "}
            <span className="font-medium">{membership.endDate}</span>
          </p>
          <Checkbox id="cancelMembership" label="Cancel membership" checked={cancelMembership} onChange={(next) => updateForm.setValue("cancelMembership", next)} />
          <RadioGroup
            legend="Extend by"
            name="extendBy"
            value={updateForm.watch("extendBy")}
            options={durationOptions}
            disabled={cancelMembership}
            onChange={(value) => updateForm.setValue("extendBy", value as MembershipDuration)}
          />
          <button type="submit" className="rounded bg-slate-900 px-4 py-2 text-sm text-white">
            Save Update
          </button>
        </form>
      ) : null}
    </div>
  );
}
