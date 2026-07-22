import { DEVICE_PRESETS, ASPECT_PRESETS, PHONE_CATALOGUE } from "@/lib/devices/presets";
import { useEditorStore } from "@/store/useEditorStore";
import { PHONE_BRANDS, findModel } from "@/lib/devices/phones";

export function ResolutionPicker() {
  const resolutionId = useEditorStore(s => s.resolutionId);
  const customWidth = useEditorStore(s => s.customWidth);
  const customHeight = useEditorStore(s => s.customHeight);
  const aspectLock = useEditorStore(s => s.aspectLock);
  const setResolution = useEditorStore(s => s.setResolution);
  const setCustomSize = useEditorStore(s => s.setCustomSize);
  const setAspectLock = useEditorStore(s => s.setAspectLock);

  // device / phone picker state from store
  const deviceType = useEditorStore(s => (s as any).deviceType) as typeof useEditorStore extends any ? any : any;
  const setDeviceType = useEditorStore(s => s.setDeviceType);
  const phoneBrand = useEditorStore(s => (s as any).phoneBrand) as string | undefined;
  const phoneModel = useEditorStore(s => (s as any).phoneModel) as string | undefined;
  const phoneDisplay = useEditorStore(s => (s as any).phoneDisplay) as string | undefined;
  const setPhoneSelection = useEditorStore(s => s.setPhoneSelection);
  const orientation = useEditorStore(s => (s as any).orientation) as "portrait" | "landscape";
  const setOrientation = useEditorStore(s => s.setOrientation);

  // helper to apply a phone display to resolution
  function applyPhoneSelection(modelId?: string, displayId?: string) {
    if (!modelId) return;
    const model = findModel(modelId);
    if (!model) return;
    const disp = displayId ? model.displays.find(d => d.id === displayId) : model.displays[0];
    if (!disp) return;
    // If the project has a top-level preset matching the model id, preserve that preset id for backward compatibility
    const preset = DEVICE_PRESETS.find(p => p.id === model.id);
    if (preset && preset.w === disp.width && preset.h === disp.height) {
      setResolution(model.id, disp.width, disp.height);
    } else {
      // otherwise treat as custom-sized preset
      setResolution("custom", orientation === "portrait" ? disp.width : disp.height, orientation === "portrait" ? disp.height : disp.width);
    }
  }

  return (
    <div className="space-y-2">
      <label className="text-xs text-zinc-500">Device type</label>
      <div className="flex gap-2">
        <select
          value={deviceType}
          onChange={(e) => setDeviceType(e.target.value as any)}
          className="flex-1 rounded-md border border-zinc-700 bg-zinc-900 px-2 py-1.5 text-sm text-zinc-100"
          aria-label="Device type"
        >
          <option value="desktop">Desktop</option>
          <option value="laptop">Laptop</option>
          <option value="tablet">Tablet</option>
          <option value="phone">Phone</option>
          <option value="custom">Custom</option>
        </select>

        <select
          value={resolutionId}
          onChange={(e) => {
            const p = DEVICE_PRESETS.find(x => x.id === e.target.value);
            if (p) setResolution(p.id, p.w, p.h);
          }}
          className="w-48 rounded-md border border-zinc-700 bg-zinc-900 px-2 py-1.5 text-sm text-zinc-100"
          aria-label="Device preset"
        >
          {DEVICE_PRESETS.map(p => <option key={p.id} value={p.id}>{p.label}</option>)}
        </select>
      </div>

      {deviceType === "phone" ? (
        <div className="space-y-2">
          <div className="grid grid-cols-2 gap-2">
            <select
              value={phoneBrand ?? "apple"}
              onChange={(e) => setPhoneSelection(e.target.value, undefined, undefined)}
              className="rounded-md border border-zinc-700 bg-zinc-900 px-2 py-1.5 text-sm text-zinc-100"
              aria-label="Phone brand"
            >
              {PHONE_BRANDS.map(b => <option key={b.id} value={b.id}>{b.label}</option>)}
            </select>

            <select
              value={phoneModel ?? ""}
              onChange={(e) => {
                const modelId = e.target.value || undefined;
                setPhoneSelection(phoneBrand, modelId, undefined);
                applyPhoneSelection(modelId, undefined);
              }}
              className="rounded-md border border-zinc-700 bg-zinc-900 px-2 py-1.5 text-sm text-zinc-100"
              aria-label="Phone model"
            >
              <option value="">Select model…</option>
              {PHONE_CATALOGUE.filter(m => m.brandId === (phoneBrand ?? "apple")).map(m => (
                <option key={m.id} value={m.id}>{m.name}{m.status === "previous" ? " — previous" : ""}</option>
              ))}
            </select>
          </div>

          {/* display selector for multi-display phones (foldables) */}
          {phoneModel ? (() => {
            const model = findModel(phoneModel);
            if (!model) return null;
            if (model.displays.length <= 1) return null;
            return (
              <select
                value={phoneDisplay ?? model.displays[0].id}
                onChange={(e) => {
                  const disp = e.target.value || undefined;
                  setPhoneSelection(phoneBrand, phoneModel, disp);
                  applyPhoneSelection(phoneModel, disp);
                }}
                className="w-full rounded-md border border-zinc-700 bg-zinc-900 px-2 py-1.5 text-sm text-zinc-100"
                aria-label="Phone display"
              >
                {model.displays.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
              </select>
            );
          })() : null}

          <div className="flex items-center gap-2">
            <label className="text-xs text-zinc-500">Orientation</label>
            <div className="flex gap-1">
              <button
                type="button"
                onClick={() => { setOrientation("portrait"); applyPhoneSelection(phoneModel, phoneDisplay); }}
                className={`rounded px-2 py-1 text-xs ${orientation === "portrait" ? "bg-blue-600 text-white" : "bg-zinc-800 text-zinc-300"}`}
              >Portrait</button>
              <button
                type="button"
                onClick={() => { setOrientation("landscape"); applyPhoneSelection(phoneModel, phoneDisplay); }}
                className={`rounded px-2 py-1 text-xs ${orientation === "landscape" ? "bg-blue-600 text-white" : "bg-zinc-800 text-zinc-300"}`}
              >Landscape</button>
            </div>
          </div>

        </div>
      ) : null}

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