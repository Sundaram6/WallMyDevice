type Props = { checked: boolean; onChange: (v: boolean) => void; ariaLabel: string };
export function Toggle({ checked, onChange, ariaLabel }: Props) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={ariaLabel}
      onClick={() => onChange(!checked)}
      className={`relative h-5 w-9 rounded-full transition ${checked ? "bg-blue-500" : "bg-zinc-700"}`}
    >
      <span className={`absolute top-0.5 h-4 w-4 rounded-full bg-white transition ${checked ? "left-4" : "left-0.5"}`} />
    </button>
  );
}
