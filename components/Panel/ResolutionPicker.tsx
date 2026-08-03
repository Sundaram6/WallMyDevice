import { useState } from "react";
import { DEVICE_PRESETS, ASPECT_PRESETS, PHONE_CATALOGUE } from "@/lib/devices/presets";
import { useEditorStore } from "@/store/useEditorStore";
import { PHONE_BRANDS, findModel } from "@/lib/devices/phones";
import { TABLET_BRANDS, TABLET_MODELS } from "@/lib/devices/tablets";

const INPUT_CLS = {
  base: "w-full rounded-xl px-3 py-2 text-xs font-mono focus:outline-none transition-all",
  style: {
    border: "1.5px solid var(--paper-200)",
    background: "var(--paper-0)",
    color: "var(--ink-900)",
    fontSize: 11,
  } as React.CSSProperties,
};

function Label({ children }: { children: React.ReactNode }) {
  return (
    <span
      style={{
        display: "block",
        marginBottom: 5,
        fontSize: 9,
        fontFamily: "monospace",
        textTransform: "uppercase" as const,
        letterSpacing: "0.1em",
        color: "var(--ink-400)",
      }}
    >
      {children}
    </span>
  );
}

export function ResolutionPicker() {
  const resolutionId = useEditorStore((s) => s.resolutionId);
  const customWidth = useEditorStore((s) => s.customWidth);
  const customHeight = useEditorStore((s) => s.customHeight);
  const aspectLock = useEditorStore((s) => s.aspectLock);
  const setResolution = useEditorStore((s) => s.setResolution);
  const setCustomSize = useEditorStore((s) => s.setCustomSize);
  const setAspectLock = useEditorStore((s) => s.setAspectLock);

  const deviceType = useEditorStore((s) => s.deviceType);
  const setDeviceType = useEditorStore((s) => s.setDeviceType);
  const phoneBrand = useEditorStore((s) => s.phoneBrand);
  const phoneModel = useEditorStore((s) => s.phoneModel);
  const phoneDisplay = useEditorStore((s) => s.phoneDisplay);
  const setPhoneSelection = useEditorStore((s) => s.setPhoneSelection);
  const orientation = useEditorStore((s) => s.orientation);
  const setOrientation = useEditorStore((s) => s.setOrientation);

  const [modelSearch, setModelSearch] = useState("");
  const [tabletBrand, setTabletBrand] = useState("apple");
  const [tabletModel, setTabletModel] = useState("ipad-pro-13-m4");

  function handleModelChange(modelId: string) {
    if (!modelId) return;
    const model = findModel(modelId);
    if (!model) return;
    const disp = model.displays[0];
    setPhoneSelection(model.brandId, modelId, disp.id);
    const preset = DEVICE_PRESETS.find((p) => p.id === model.id);
    if (preset && preset.w === disp.width && preset.h === disp.height) {
      setResolution(model.id, disp.width, disp.height);
    } else {
      const w = orientation === "portrait" ? disp.width : disp.height;
      const h = orientation === "portrait" ? disp.height : disp.width;
      setResolution("custom", w, h);
    }
  }

  function handleTabletChange(modelId: string) {
    const tab = TABLET_MODELS.find((t) => t.id === modelId);
    if (!tab) return;
    setTabletModel(modelId);
    setTabletBrand(tab.brandId);
    const disp = tab.displays[0];
    const w = orientation === "portrait" ? Math.min(disp.width, disp.height) : Math.max(disp.width, disp.height);
    const h = orientation === "portrait" ? Math.max(disp.width, disp.height) : Math.min(disp.width, disp.height);
    setResolution("custom", w, h);
  }

  function handleDisplayChange(displayId: string) {
    if (!phoneModel) return;
    const model = findModel(phoneModel);
    if (!model) return;
    const disp = model.displays.find((d) => d.id === displayId);
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
      const p = DEVICE_PRESETS.find((x) => x.id === "desktop-1080p") ?? DEVICE_PRESETS[0];
      setResolution(p.id, p.w, p.h);
    } else if (cat === "laptop") {
      const p = DEVICE_PRESETS.find((x) => x.id === "macbook-14");
      if (p) setResolution(p.id, p.w, p.h);
    } else if (cat === "tablet") {
      handleTabletChange("ipad-pro-13-m4");
    } else if (cat === "custom") {
      setResolution("custom", customWidth, customHeight);
    }
  }

  const CATS = [
    { id: "phone", label: "📱 Phone" },
    { id: "tablet", label: "▭ Tablet" },
    { id: "desktop", label: "🖥 Desktop" },
    { id: "custom", label: "⚙ Custom" },
  ] as const;

  const selectStyle: React.CSSProperties = {
    ...INPUT_CLS.style,
    height: 36,
    appearance: "none",
    WebkitAppearance: "none",
    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6'%3E%3Cpath d='M0 0l5 6 5-6z' fill='%23A0968C'/%3E%3C/svg%3E")`,
    backgroundRepeat: "no-repeat",
    backgroundPosition: "right 10px center",
    paddingRight: 28,
  };

  return (
    <div className="space-y-3">
      {/* Category row */}
      <div>
        <Label>Device Type</Label>
        <div className="grid grid-cols-2 gap-1.5">
          {CATS.map((c) => {
            const isActive = deviceType === c.id;
            return (
              <button
                key={c.id}
                type="button"
                onClick={() => handleCategoryChange(c.id)}
                className="rounded-xl py-2 text-center text-xs transition-all font-medium"
                style={{
                  border: isActive ? "1.5px solid var(--accent-500)" : "1.5px solid var(--paper-200)",
                  background: isActive ? "rgba(201,85,47,0.07)" : "var(--paper-0)",
                  color: isActive ? "var(--accent-500)" : "var(--ink-700)",
                  fontSize: 11,
                }}
              >
                {c.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* DESKTOP preset */}
      {deviceType === "desktop" && (
        <div>
          <Label>Preset Size</Label>
          <select
            value={resolutionId}
            onChange={(e) => {
              const p = DEVICE_PRESETS.find((x) => x.id === e.target.value);
              if (p) setResolution(p.id, p.w, p.h);
            }}
            style={selectStyle}
            className="w-full"
          >
            {DEVICE_PRESETS.filter((p) => p.frame === "desktop-monitor" || p.frame === "ultrawide").map((p) => (
              <option key={p.id} value={p.id}>
                {p.label} ({p.w}×{p.h})
              </option>
            ))}
          </select>
        </div>
      )}

      {/* TABLET */}
      {deviceType === "tablet" && (
        <div className="space-y-2">
          <div>
            <Label>Brand</Label>
            <select
              value={tabletBrand}
              onChange={(e) => {
                const b = e.target.value;
                setTabletBrand(b);
                const firstTab = TABLET_MODELS.find((t) => t.brandId === b);
                if (firstTab) handleTabletChange(firstTab.id);
              }}
              style={selectStyle}
              className="w-full"
            >
              {TABLET_BRANDS.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <Label>Model</Label>
            <select
              value={tabletModel}
              onChange={(e) => handleTabletChange(e.target.value)}
              style={selectStyle}
              className="w-full"
            >
              {TABLET_MODELS.filter((t) => t.brandId === tabletBrand).map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}

      {/* PHONE */}
      {deviceType === "phone" && (
        <div className="space-y-2">
          <div>
            <Label>Brand</Label>
            <select
              value={phoneBrand ?? "apple"}
              onChange={(e) => {
                const brand = e.target.value;
                const firstModel = PHONE_CATALOGUE.find((m) => m.brandId === brand);
                if (firstModel) handleModelChange(firstModel.id);
              }}
              style={selectStyle}
              className="w-full"
            >
              {PHONE_BRANDS.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <div className="flex items-center justify-between mb-1">
              <Label>Model</Label>
              <input
                type="text"
                placeholder="Search…"
                value={modelSearch}
                onChange={(e) => setModelSearch(e.target.value)}
                className="rounded-lg focus:outline-none font-mono"
                style={{
                  fontSize: 10,
                  padding: "3px 8px",
                  border: "1.5px solid var(--paper-200)",
                  background: "var(--paper-50)",
                  color: "var(--ink-900)",
                  width: 90,
                }}
              />
            </div>
            <select
              value={phoneModel ?? PHONE_CATALOGUE[0].id}
              onChange={(e) => handleModelChange(e.target.value)}
              style={selectStyle}
              className="w-full"
            >
              {PHONE_CATALOGUE.filter((m) => {
                const matchBrand = m.brandId === (phoneBrand ?? "apple");
                const matchQuery = !modelSearch || m.name.toLowerCase().includes(modelSearch.toLowerCase());
                return matchBrand && matchQuery;
              }).map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name}
                </option>
              ))}
            </select>
          </div>

          {/* Foldable display */}
          {phoneModel &&
            (() => {
              const model = findModel(phoneModel);
              if (!model || model.displays.length <= 1) return null;
              return (
                <div>
                  <Label>Display</Label>
                  <select
                    value={phoneDisplay ?? model.displays[0].id}
                    onChange={(e) => handleDisplayChange(e.target.value)}
                    style={selectStyle}
                    className="w-full"
                  >
                    {model.displays.map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.name} ({d.width}×{d.height})
                      </option>
                    ))}
                  </select>
                </div>
              );
            })()}

          {/* Orientation */}
          <div>
            <Label>Orientation</Label>
            <div
              className="flex rounded-xl p-1"
              style={{ background: "var(--paper-50)", border: "1.5px solid var(--paper-200)" }}
            >
              {(["portrait", "landscape"] as const).map((o) => (
                <button
                  key={o}
                  type="button"
                  onClick={() => {
                    setOrientation(o);
                    if (phoneModel) {
                      if (o === "portrait") {
                        handleModelChange(phoneModel);
                      } else {
                        const model = findModel(phoneModel);
                        const disp =
                          model?.displays.find((d) => d.id === (phoneDisplay ?? model?.displays[0].id)) ??
                          model?.displays[0];
                        if (disp) setResolution("custom", disp.height, disp.width);
                      }
                    }
                  }}
                  className="flex-1 capitalize rounded-lg py-1.5 transition-all"
                  style={{
                    fontSize: 11,
                    fontWeight: orientation === o ? 600 : 400,
                    background: orientation === o ? "var(--paper-0)" : "transparent",
                    color: orientation === o ? "var(--ink-900)" : "var(--ink-500)",
                    boxShadow: orientation === o ? "0 1px 3px rgba(0,0,0,0.08)" : "none",
                  }}
                >
                  {o}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* CUSTOM size */}
      {deviceType === "custom" && (
        <div className="space-y-2">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label>Width (px)</Label>
              <input
                type="number"
                min={320}
                max={15360}
                value={customWidth}
                onChange={(e) => setCustomSize(Number(e.target.value) || 320, customHeight)}
                style={{ ...INPUT_CLS.style, height: 36, display: "block" }}
                className="w-full rounded-xl focus:outline-none"
              />
            </div>
            <div>
              <Label>Height (px)</Label>
              <input
                type="number"
                min={320}
                max={15360}
                value={customHeight}
                onChange={(e) => setCustomSize(customWidth, Number(e.target.value) || 320)}
                style={{ ...INPUT_CLS.style, height: 36, display: "block" }}
                className="w-full rounded-xl focus:outline-none"
              />
            </div>
          </div>

          <label className="flex items-center gap-2 cursor-pointer select-none" style={{ fontSize: 11, color: "var(--ink-700)" }}>
            <input
              type="checkbox"
              checked={aspectLock}
              onChange={(e) => setAspectLock(e.target.checked)}
              style={{ accentColor: "var(--accent-500)" }}
            />
            Lock aspect ratio
          </label>

          {/* Aspect presets */}
          <div>
            <Label>Aspect Presets</Label>
            <div className="flex flex-wrap gap-1.5">
              {ASPECT_PRESETS.map((a) => (
                <button
                  key={a.id}
                  type="button"
                  onClick={() => setCustomSize(a.w, a.h)}
                  className="rounded-lg transition-all font-mono"
                  style={{
                    fontSize: 9,
                    padding: "3px 8px",
                    border: "1.5px solid var(--paper-200)",
                    background: "var(--paper-50)",
                    color: "var(--ink-700)",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--accent-500)";
                    (e.currentTarget as HTMLButtonElement).style.color = "var(--accent-500)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--paper-100)";
                    (e.currentTarget as HTMLButtonElement).style.color = "var(--ink-700)";
                  }}
                >
                  {a.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Resolution readout */}
      <div
        className="flex items-center justify-between rounded-xl px-3 py-2"
        style={{ background: "var(--paper-50)", border: "1px solid var(--paper-200)" }}
      >
        <span style={{ fontSize: 9, fontFamily: "monospace", color: "var(--ink-400)", textTransform: "uppercase", letterSpacing: "0.08em" }}>
          Active
        </span>
        <span style={{ fontSize: 11, fontFamily: "monospace", fontWeight: 600, color: "var(--accent-500)" }}>
          {customWidth} × {customHeight}
        </span>
      </div>
    </div>
  );
}