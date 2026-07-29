type Props = { value: string; onChange: (v: string) => void; ariaLabel?: string };
export function ColorInput({ value, onChange, ariaLabel }: Props) {
  return (
    <input
      type="color"
      value={value}
      aria-label={ariaLabel}
      onChange={(e) => onChange(e.target.value)}
      className="h-7 w-7 cursor-pointer rounded-lg border border-[#E4DFD3] bg-transparent"
    />
  );
}
