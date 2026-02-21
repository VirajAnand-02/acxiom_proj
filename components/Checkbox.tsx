type Props = {
  id: string;
  label: string;
  checked: boolean;
  onChange: (nextChecked: boolean) => void;
};

export function Checkbox({ id, label, checked, onChange }: Props) {
  return (
    <label htmlFor={id} className="flex items-center gap-2 text-sm">
      <input id={id} type="checkbox" checked={checked} onChange={(event) => onChange(event.target.checked)} />
      {label} ({checked ? "yes" : "no"})
    </label>
  );
}
