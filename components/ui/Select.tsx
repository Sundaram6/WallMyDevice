type Option = { value: string; label: string };
type Props = { value: string; options: readonly Option[]; onChange: (v: string) => void; ariaLabel?: string };
export function Select({ value, options, onChange, ariaLabel }: Props) {
  return (
    <select
      value={value}
      aria-label={ariaLabel}
      onChange={(e) => onChange(e.target.value)}
      className="w-full rounded-md border border-zinc-700 bg-zinc-900 px-2 py-1.5 text-sm text-zinc-100 focus:border-blue-500 focus:outline-none"
    >
      {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
    </select>
  );
}
