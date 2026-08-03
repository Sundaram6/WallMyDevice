type Props = { checked: boolean; onChange: (v: boolean) => void; ariaLabel: string };
export function Toggle({ checked, onChange, ariaLabel }: Props) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={ariaLabel}
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-pill transition-colors duration-[--dur-fast] ease-[--ease-out] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-500/50 ${
        checked ? "bg-accent-500" : "bg-paper-300"
      }`}
    >
      <span
        className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-paper-0 shadow-1 transition-transform duration-[--dur-fast] ease-[--ease-out] ${
          checked ? "translate-x-4.5" : "translate-x-0.5"
        } my-auto`}
      />
    </button>
  );
}
