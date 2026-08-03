import { useEditorStore } from "@/store/useEditorStore";
import { Slider } from "@/components/ui/Slider";
import { Toggle } from "@/components/ui/Toggle";

export function FinishControls() {
  const grainEnabled = useEditorStore(s => s.grainEnabled);
  const grainIntensity = useEditorStore(s => s.grainIntensity);
  const blurIntensity = useEditorStore(s => s.blurIntensity);
  const setGrain = useEditorStore(s => s.setGrain);
  const setBlur = useEditorStore(s => s.setBlur);

  return (
    <div className="space-y-3">
      <label className="flex items-center justify-between text-xs text-ink-900">
        <span className="font-medium">Grain</span>
        <Toggle checked={grainEnabled} onChange={(v) => setGrain(v, grainIntensity)} ariaLabel="Toggle grain" />
      </label>
      <label className="block">
        <div className="mb-1 flex items-center justify-between text-xs text-ink-900">
          <span className="font-medium text-xs">Grain intensity</span>
          <span className="tabular-nums font-mono text-[11px] text-ink-500">{grainIntensity.toFixed(2)}</span>
        </div>
        <Slider value={grainIntensity} min={0} max={1} step={0.01} ariaLabel="Grain intensity" onChange={(v) => setGrain(grainEnabled, v)} />
      </label>
      <label className="block">
        <div className="mb-1 flex items-center justify-between text-xs text-ink-900">
          <span className="font-medium text-xs">Blur</span>
          <span className="tabular-nums font-mono text-[11px] text-ink-500">{blurIntensity.toFixed(2)}</span>
        </div>
        <Slider value={blurIntensity} min={0} max={1} step={0.01} ariaLabel="Blur" onChange={setBlur} />
      </label>
    </div>
  );
}
