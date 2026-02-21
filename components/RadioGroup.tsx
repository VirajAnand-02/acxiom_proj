type Option = {
  label: string;
  value: string;
};

type Props = {
  legend: string;
  name: string;
  value: string;
  options: Option[];
  onChange: (value: string) => void;
  error?: string;
  disabled?: boolean;
};

export function RadioGroup({ legend, name, value, options, onChange, error, disabled }: Props) {
  return (
    <fieldset className="space-y-2" aria-invalid={Boolean(error)}>
      <legend className="text-sm font-medium">{legend}</legend>
      <div className="space-y-1">
        {options.map((option) => (
          <label key={option.value} className="flex items-center gap-2 text-sm">
            <input
              type="radio"
              name={name}
              value={option.value}
              checked={value === option.value}
              disabled={disabled}
              onChange={(event) => onChange(event.target.value)}
            />
            {option.label}
          </label>
        ))}
      </div>
      {error ? <p className="text-xs text-red-600">{error}</p> : null}
    </fieldset>
  );
}
