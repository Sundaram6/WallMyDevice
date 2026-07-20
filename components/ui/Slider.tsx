type Props = {
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (v: number) => void;
  ariaLabel?: string;
};

export function Slider({ value, min, max, step, onChange, ariaLabel }: Props) {
  return (
    <input
      type="range"
      min={min}
      max={max}
      step={step}
      value={value}
      aria-label={ariaLabel}
      onChange={(e) => onChange(Number(e.target.value))}
      className="h-1 w-full cursor-pointer appearance-none rounded-full bg-zinc-700 accent-blue-500"
    />
  );
}
