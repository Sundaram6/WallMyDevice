import { DEVICE_PRESETS, ASPECT_PRESETS } from "@/lib/devices/presets";
import { useEditorStore } from "@/store/useEditorStore";

export function ResolutionPicker() {
  const resolutionId = useEditorStore(s => s.resolutionId);
  const customWidth = useEditorStore(s => s.customWidth);
  const customHeight = useEditorStore(s => s.customHeight);
  const aspectLock = useEditorStore(s => s.aspectLock);
  const setResolution = useEditorStore(s => s.setResolution);
  const setCustomSize = useEditorStore(s => s.setCustomSize);
  const setAspectLock = useEditorStore(s => s.setAspectLock);

  return (
    <div className="space-y-2">
      <select
        value={resolutionId}
        onChange={(e) => {
          const p = DEVICE_PRESETS.find(x => x.id === e.target.value);
          if (p) setResolution(p.id, p.w, p.h);
        }}
        className="w-full rounded-md border border-zinc-700 bg-zinc-900 px-2 py-1.5 text-sm text-zinc-100"
        aria-label="Device preset"
      >
        {DEVICE_PRESETS.map(p => <option key={p.id} value={p.id}>{p.label}</option>)}
      </select>

      {resolutionId === "custom" ? (
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <input
              type="number" min={320} max={15360} value={customWidth}
              onChange={(e) => setCustomSize(Number(e.target.value) || 320, customHeight)}
              aria-label="Width"
              className="w-full rounded-md border border-zinc-700 bg-zinc-900 px-2 py-1.5 text-sm text-zinc-100"
            />
            <span className="text-zinc-500">x</span>
            <input
              type="number" min={320} max={15360} value={customHeight}
              onChange={(e) => setCustomSize(customWidth, Number(e.target.value) || 320)}
              aria-label="Height"
              className="w-full rounded-md border border-zinc-700 bg-zinc-900 px-2 py-1.5 text-sm text-zinc-100"
            />
          </div>
          <label className="flex items-center gap-2 text-xs text-zinc-400">
            <input
              type="checkbox"
              checked={aspectLock}
              onChange={(e) => setAspectLock(e.target.checked)}
            />
            Aspect lock
          </label>
          <div className="flex flex-wrap gap-1">
            {ASPECT_PRESETS.map(a => (
              <button
                key={a.id}
                type="button"
                onClick={() => setCustomSize(a.w, a.h)}
                className="rounded bg-zinc-800 px-2 py-0.5 text-xs text-zinc-300 hover:bg-zinc-700"
              >
                {a.label}
              </button>
            ))}
          </div>
        </div>
      ) : null}
      <p className="text-xs text-zinc-500">
        {customWidth} x {customHeight}
      </p>
    </div>
  );
}