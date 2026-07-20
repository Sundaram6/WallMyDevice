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
    <div className="flex gap-1 rounded-md bg-zinc-900 p-1">
      {OPTIONS.map(o => (
        <button
          key={o.value}
          type="button"
          onClick={() => setMode(o.value)}
          data-active={mode === o.value}
          className={`flex-1 rounded px-2 py-1 text-xs transition ${
            mode === o.value ? "bg-zinc-700 text-zinc-50" : "text-zinc-400 hover:text-zinc-100"
          }`}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}