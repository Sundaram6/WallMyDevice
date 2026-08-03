import { useEditorStore, type Mode } from "@/store/useEditorStore";

const OPTIONS: Array<{ value: Mode; label: string }> = [
  { value: "light", label: "Light" },
  { value: "dark", label: "Dark" },
  { value: "auto", label: "Auto" },
];

export function ModeToggle() {
  const mode = useEditorStore(s => s.mode);
  const setMode = useEditorStore(s => s.setMode);
  return (
    <div className="flex gap-1 rounded-lg bg-paper-50 p-1 border border-paper-200 text-xs">
      {OPTIONS.map(o => (
        <button
          key={o.value}
          type="button"
          onClick={() => setMode(o.value)}
          data-active={mode === o.value}
          className={`flex-1 rounded-md px-2 py-1 text-xs font-medium transition ${
            mode === o.value
              ? "bg-ink-900 text-paper-0 shadow-xs"
              : "text-ink-700 hover:text-ink-900"
          }`}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}