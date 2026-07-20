import { useEditorStore } from "@/store/useEditorStore";
import { Toggle } from "@/components/ui/Toggle";
import { Select } from "@/components/ui/Select";
import { Slider } from "@/components/ui/Slider";

const FONTS = [
  { value: "Inter", label: "Inter" },
  { value: "JetBrains Mono", label: "JetBrains Mono" },
  { value: "Playfair Display", label: "Playfair Display" },
];

export function OverlayControls() {
  const clock = useEditorStore(s => s.overlayClock);
  const date = useEditorStore(s => s.overlayDate);
  const text = useEditorStore(s => s.overlayText);
  const textValue = useEditorStore(s => s.overlayTextValue);
  const font = useEditorStore(s => s.overlayFont);
  const size = useEditorStore(s => s.overlaySize);
  const setOverlay = useEditorStore(s => s.setOverlay);
  const setOverlayText = useEditorStore(s => s.setOverlayText);
  const setOverlayFont = useEditorStore(s => s.setOverlayFont);
  const setOverlaySize = useEditorStore(s => s.setOverlaySize);

  return (
    <div className="space-y-3">
      {(["clock", "date", "text"] as const).map(k => (
        <label key={k} className="flex items-center justify-between text-xs text-zinc-300">
          <span className="capitalize">{k}</span>
          <Toggle checked={k === "clock" ? clock : k === "date" ? date : text} onChange={(v) => setOverlay(k, v)} ariaLabel={`Toggle ${k}`} />
        </label>
      ))}
      <textarea
        value={textValue}
        onChange={(e) => setOverlayText(e.target.value)}
        placeholder="Custom text"
        className="w-full rounded-md border border-zinc-700 bg-zinc-900 px-2 py-1.5 text-xs text-zinc-100"
      />
      <Select value={font} onChange={setOverlayFont} options={FONTS} ariaLabel="Overlay font" />
      <label className="block">
        <div className="mb-1 flex items-center justify-between text-xs text-zinc-300">
          <span>Size</span>
          <span className="tabular-nums text-zinc-500">{size.toFixed(2)}</span>
        </div>
        <Slider value={size} min={0.1} max={4} step={0.05} ariaLabel="Overlay size" onChange={setOverlaySize} />
      </label>
    </div>
  );
}
