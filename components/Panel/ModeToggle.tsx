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
    <div className="flex gap-1 rounded-lg bg-white p-1 border border-[#E4DFD3] text-xs">
      {OPTIONS.map(o => (
        <button
          key={o.value}
          type="button"
          onClick={() => setMode(o.value)}
          data-active={mode === o.value}
          className={`flex-1 rounded-md px-2 py-1 text-xs font-medium transition ${
            mode === o.value
              ? "bg-[#2B2A26] text-white shadow-xs"
              : "text-[#5B584F] hover:text-[#2B2A26]"
          }`}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}