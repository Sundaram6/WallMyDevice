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

  const deviceType = useEditorStore(s => s.deviceType);
  const setDeviceType = useEditorStore(s => s.setDeviceType);
  const phoneBrand = useEditorStore(s => s.phoneBrand);
  const phoneModel = useEditorStore(s => s.phoneModel);
  const phoneDisplay = useEditorStore(s => s.phoneDisplay);
  const setPhoneSelection = useEditorStore(s => s.setPhoneSelection);
  const orientation = useEditorStore(s => s.orientation);
  const setOrientation = useEditorStore(s => s.setOrientation);

  // Apply phone model / display selection
  function handleModelChange(modelId: string) {
    if (!modelId) return;
    const model = findModel(modelId);
    if (!model) return;
    const disp = model.displays[0];
    setPhoneSelection(model.brandId, modelId, disp.id);

    const preset = DEVICE_PRESETS.find(p => p.id === model.id);
    if (preset && preset.w === disp.width && preset.h === disp.height) {
      setResolution(model.id, disp.width, disp.height);
    } else {
      const w = orientation === "portrait" ? disp.width : disp.height;
      const h = orientation === "portrait" ? disp.height : disp.width;
      setResolution("custom", w, h);
    }
  }

  function handleDisplayChange(displayId: string) {
    if (!phoneModel) return;
    const model = findModel(phoneModel);
    if (!model) return;
    const disp = model.displays.find(d => d.id === displayId);
    if (!disp) return;
    setPhoneSelection(phoneBrand, phoneModel, displayId);

    const w = orientation === "portrait" ? disp.width : disp.height;
    const h = orientation === "portrait" ? disp.height : disp.width;
    setResolution("custom", w, h);
  }

  function handleCategoryChange(cat: typeof deviceType) {
    setDeviceType(cat);
    if (cat === "phone") {
      const defaultModel = PHONE_CATALOGUE[0];
      handleModelChange(defaultModel.id);
    } else if (cat === "desktop") {
      const p = DEVICE_PRESETS.find(x => x.id === "desktop-1080p") ?? DEVICE_PRESETS[0];
      setResolution(p.id, p.w, p.h);
    } else if (cat === "laptop") {
      const p = DEVICE_PRESETS.find(x => x.id === "macbook-14");
      if (p) setResolution(p.id, p.w, p.h);
    } else if (cat === "tablet") {
      const p = DEVICE_PRESETS.find(x => x.id === "ipad-air-11");
      if (p) setResolution(p.id, p.w, p.h);
    } else if (cat === "custom") {
      setResolution("custom", customWidth, customHeight);
    }
  }

  return (
    <div className="space-y-2.5">
      {/* Category selector */}
      <div>
        <label className="mb-1 block text-[11px] font-medium text-zinc-400">Device Category</label>
        <div className="grid grid-cols-5 gap-1 text-xs">
          {(["desktop", "laptop", "tablet", "phone", "custom"] as const).map(cat => (
            <button
              key={cat}
              type="button"
              onClick={() => handleCategoryChange(cat)}
              className={`rounded py-1 px-1.5 capitalize text-center text-xs truncate transition ${
                deviceType === cat
                  ? "bg-zinc-100 text-zinc-900 font-medium"
                  : "bg-zinc-900 text-zinc-300 hover:bg-zinc-800 border border-zinc-800"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Preset pickers for desktop / laptop / tablet */}
      {deviceType !== "phone" && deviceType !== "custom" && (
        <div>
          <label className="mb-1 block text-[11px] font-medium text-zinc-400">Preset Size</label>
          <select
            value={resolutionId}
            onChange={(e) => {
              const p = DEVICE_PRESETS.find(x => x.id === e.target.value);
              if (p) setResolution(p.id, p.w, p.h);
            }}
            className="w-full rounded-md border border-zinc-700 bg-zinc-900 px-2 py-1.5 text-xs text-zinc-100 focus:outline-none"
          >
            {DEVICE_PRESETS.filter(p => {
              if (deviceType === "desktop") return p.frame === "desktop-monitor" || p.frame === "ultrawide";
              if (deviceType === "laptop") return p.frame === "macbook";
              if (deviceType === "tablet") return p.frame === "ipad";
              return true;
            }).map(p => (
              <option key={p.id} value={p.id}>{p.label} ({p.w}×{p.h})</option>
            ))}
          </select>
        </div>
      )}

      {/* Phone Brand / Model / Display Selector */}
      {deviceType === "phone" && (
        <div className="space-y-2 rounded-md border border-zinc-800 bg-zinc-900/60 p-2">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="mb-1 block text-[10px] text-zinc-400">Brand</label>
              <select
                value={phoneBrand ?? "apple"}
                onChange={(e) => {
                  const brand = e.target.value;
                  const firstModel = PHONE_CATALOGUE.find(m => m.brandId === brand);
                  if (firstModel) handleModelChange(firstModel.id);
                }}
                className="w-full rounded border border-zinc-700 bg-zinc-900 px-2 py-1 text-xs text-zinc-100"
              >
                {PHONE_BRANDS.map(b => <option key={b.id} value={b.id}>{b.label}</option>)}
              </select>
            </div>

            <div>
              <label className="mb-1 block text-[10px] text-zinc-400">Model</label>
              <select
                value={phoneModel ?? PHONE_CATALOGUE[0].id}
                onChange={(e) => handleModelChange(e.target.value)}
                className="w-full rounded border border-zinc-700 bg-zinc-900 px-2 py-1 text-xs text-zinc-100"
              >
                {PHONE_CATALOGUE.filter(m => m.brandId === (phoneBrand ?? "apple")).map(m => (
                  <option key={m.id} value={m.id}>{m.name}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Foldable display choice */}
          {phoneModel && (() => {
            const model = findModel(phoneModel);
            if (!model || model.displays.length <= 1) return null;
            return (
              <div>
                <label className="mb-1 block text-[10px] text-zinc-400">Display Screen</label>
                <select
                  value={phoneDisplay ?? model.displays[0].id}
                  onChange={(e) => handleDisplayChange(e.target.value)}
                  className="w-full rounded border border-zinc-700 bg-zinc-900 px-2 py-1 text-xs text-zinc-100"
                >
                  {model.displays.map(d => (
                    <option key={d.id} value={d.id}>{d.name} ({d.width}×{d.height})</option>
                  ))}
                </select>
              </div>
            );
          })()}

          {/* Orientation toggle */}
          <div className="flex items-center justify-between pt-1">
            <span className="text-[11px] text-zinc-400">Orientation</span>
            <div className="flex rounded border border-zinc-700 bg-zinc-950 p-0.5 text-xs">
              <button
                type="button"
                onClick={() => {
                  setOrientation("portrait");
                  if (phoneModel) handleModelChange(phoneModel);
                }}
                className={`rounded px-2.5 py-0.5 text-[11px] transition ${
                  orientation === "portrait" ? "bg-zinc-100 text-zinc-900 font-medium" : "text-zinc-400 hover:text-zinc-200"
                }`}
              >
                Portrait
              </button>
              <button
                type="button"
                onClick={() => {
                  setOrientation("landscape");
                  if (phoneModel) {
                    const model = findModel(phoneModel);
                    const disp = model?.displays.find(d => d.id === (phoneDisplay ?? model?.displays[0].id)) ?? model?.displays[0];
                    if (disp) setResolution("custom", disp.height, disp.width);
                  }
                }}
                className={`rounded px-2.5 py-0.5 text-[11px] transition ${
                  orientation === "landscape" ? "bg-zinc-100 text-zinc-900 font-medium" : "text-zinc-400 hover:text-zinc-200"
                }`}
              >
                Landscape
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Custom size input */}
      {deviceType === "custom" && (
        <div className="space-y-2 rounded-md border border-zinc-800 bg-zinc-900/60 p-2">
          <div className="flex items-center gap-2">
            <div className="flex-1">
              <label className="mb-0.5 block text-[10px] text-zinc-400">Width (px)</label>
              <input
                type="number" min={320} max={15360} value={customWidth}
                onChange={(e) => setCustomSize(Number(e.target.value) || 320, customHeight)}
                className="w-full rounded border border-zinc-700 bg-zinc-900 px-2 py-1 text-xs text-zinc-100"
              />
            </div>
            <span className="mt-4 text-zinc-500">×</span>
            <div className="flex-1">
              <label className="mb-0.5 block text-[10px] text-zinc-400">Height (px)</label>
              <input
                type="number" min={320} max={15360} value={customHeight}
                onChange={(e) => setCustomSize(customWidth, Number(e.target.value) || 320)}
                className="w-full rounded border border-zinc-700 bg-zinc-900 px-2 py-1 text-xs text-zinc-100"
              />
            </div>
          </div>

          <label className="flex items-center gap-2 text-[11px] text-zinc-400">
            <input
              type="checkbox"
              checked={aspectLock}
              onChange={(e) => setAspectLock(e.target.checked)}
              className="rounded border-zinc-700 bg-zinc-900"
            />
            Lock aspect ratio
          </label>

          <div className="flex flex-wrap gap-1 pt-1">
            {ASPECT_PRESETS.map(a => (
              <button
                key={a.id}
                type="button"
                onClick={() => setCustomSize(a.w, a.h)}
                className="rounded bg-zinc-800 px-2 py-0.5 text-[10px] text-zinc-300 hover:bg-zinc-700"
              >
                {a.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Resolution readout */}
      <div className="flex items-center justify-between text-[11px] text-zinc-400 px-0.5">
        <span>Active resolution:</span>
        <span className="font-mono font-medium text-zinc-200">{customWidth} × {customHeight} px</span>
      </div>
    </div>
  );
}