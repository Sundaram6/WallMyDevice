import { useState } from "react";
import { useEditorStore } from "@/store/useEditorStore";
import { getGenerator } from "@/lib/generators";
import { exportImage } from "@/lib/export/exportImage";
import { batchExport } from "@/lib/export/batchExport";
import { buildFilename } from "@/lib/export/filename";
import { encodeRecipe, encodeHash } from "@/lib/recipe/encode";
import type { Recipe } from "@/lib/recipe/validate";
import { DEVICE_PRESETS } from "@/lib/devices/presets";
import { buildInput, downloadBlob } from "@/lib/export/actions";
import { validateExportSize } from "@/lib/export/limits";

const FORMATS = ["PNG", "JPG", "WEBP", "SVG"] as const;
type Format = "png" | "jpg" | "webp" | "svg";

export function ExportBar({ compact = false }: { compact?: boolean }) {
  useEditorStore((s) => s.exportFormat);
  const setExportFormat = useEditorStore((s) => s.setExportFormat);
  const exportFormat = useEditorStore.getState().exportFormat;
  const [progress, setProgress] = useState<{ done: number; total: number } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [batchOpen, setBatchOpen] = useState(false);
  const [batchSelection, setBatchSelection] = useState<string[]>(["desktop-1080p", "iphone-15-pro"]);

  function buildRecipe(): Recipe {
    const s = useEditorStore.getState();
    return {
      v: 1,
      type: "wallmydevice/recipe",
      generator: s.generatorId,
      params: (s.params[s.generatorId] ?? {}) as Record<string, unknown>,
      palette: s.palette,
      mode: s.mode,
      seed: s.seed,
      grain: { enabled: s.grainEnabled, intensity: s.grainIntensity },
      blur: s.blurIntensity,
      resolution: { preset: s.resolutionId, width: s.customWidth, height: s.customHeight },
      overlays: {
        clock: s.overlayClock,
        date: s.overlayDate,
        text: s.overlayText,
        value: s.overlayTextValue,
        font: s.overlayFont,
        size: s.overlaySize,
      },
    };
  }

  async function onDownload() {
    setError(null);
    try {
      const built = buildInput();
      if (!built) return;
      const w = useEditorStore.getState().customWidth;
      const h = useEditorStore.getState().customHeight;
      const sizeCheck = validateExportSize(w, h);
      if (!sizeCheck.ok) { setError(sizeCheck.error); return; }
      if (exportFormat === "svg") {
        const g = getGenerator(built.generatorId);
        if (!g || !g.toSvg) throw new Error("This generator cannot export as SVG");
        const svg = g.toSvg({ width: w, height: h }, built.input.params as never, built.seed, built.input.palette);
        const blob = new Blob([svg], { type: "image/svg+xml" });
        downloadBlob(blob, buildFilename(built.generatorId, built.seed, { width: w, height: h }, "svg"));
      } else {
        const blob = await exportImage(built.input, { width: w, height: h }, exportFormat);
        downloadBlob(blob, buildFilename(built.generatorId, built.seed, { width: w, height: h }, exportFormat));
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Render failed");
    }
  }

  async function onBatch() {
    setError(null);
    const built = buildInput();
    if (!built) return;
    const sizes = batchSelection
      .map((id) => DEVICE_PRESETS.find((p) => p.id === id))
      .filter((p): p is NonNullable<typeof p> => p != null && p.id !== "custom")
      .map((p) => ({ width: p.w, height: p.h }));
    if (sizes.length === 0) return;
    setProgress({ done: 0, total: sizes.length });
    try {
      const zip = await batchExport(built.input, sizes, built.seed, (done, total) => setProgress({ done, total }));
      const ts = String(Date.now());
      downloadBlob(zip, buildFilename.batch(ts));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Batch failed");
    } finally {
      setProgress(null);
    }
  }

  function onRecipeJson() {
    const json = encodeRecipe(buildRecipe());
    const blob = new Blob([json], { type: "application/json" });
    downloadBlob(blob, `wallmydevice-recipe-${useEditorStore.getState().seed}.json`);
  }

  async function onCopyShareLink() {
    try {
      const hash = encodeHash(buildRecipe());
      const url = `${location.origin}${location.pathname}${hash}`;
      await navigator.clipboard.writeText(url);
    } catch (_e) {
      setError("Could not copy link. Recipe URL too long?");
    }
  }

  function toggleBatch(id: string) {
    setBatchSelection((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  }

  // SVG available?
  const canSvg = (() => {
    const gId = useEditorStore.getState().generatorId;
    const gen = getGenerator(gId);
    return gen?.supportsSvgExport ?? false;
  })();

  const btnBase: React.CSSProperties = {
    fontSize: 11,
    fontWeight: 500,
    border: "1.5px solid #EDE8E0",
    borderRadius: 12,
    background: "#FAF8F4",
    color: "#5B584F",
    padding: "7px 12px",
    cursor: "pointer",
    transition: "all 0.15s ease",
    whiteSpace: "nowrap" as const,
  };

  return (
    <div className="space-y-2">
      {/* Format pills */}
      <div
        className="flex rounded-xl p-1"
        style={{ background: "#F5F1EB", border: "1.5px solid #EDE8E0" }}
      >
        {FORMATS.filter((f) => f !== "SVG" || canSvg).map((f) => {
          const isActive = exportFormat === f.toLowerCase() as Format;
          return (
            <button
              key={f}
              type="button"
              onClick={() => setExportFormat(f.toLowerCase() as Format)}
              className="flex-1 rounded-lg py-1.5 transition-all"
              style={{
                fontSize: 10,
                fontWeight: isActive ? 700 : 400,
                fontFamily: "monospace",
                background: isActive ? "#FFFFFF" : "transparent",
                color: isActive ? "#C9552F" : "#8A8579",
                boxShadow: isActive ? "0 1px 3px rgba(0,0,0,0.1)" : "none",
              }}
            >
              {f}
            </button>
          );
        })}
      </div>

      {/* Primary download button */}
      <button
        type="button"
        onClick={onDownload}
        className="w-full flex items-center justify-center gap-2 rounded-xl py-3 transition-all font-semibold"
        style={{
          fontSize: 13,
          background: "#C9552F",
          color: "#FFFFFF",
          border: "none",
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLButtonElement).style.background = "#A8441F";
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLButtonElement).style.background = "#C9552F";
        }}
      >
        <span>↓</span>
        <span>Download Wallpaper</span>
      </button>

      {/* Secondary row */}
      {!compact && (
        <div className="grid grid-cols-3 gap-1.5">
          <button
            type="button"
            onClick={() => setBatchOpen((o) => !o)}
            style={btnBase}
            onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.borderColor = "#C9552F"; (e.currentTarget as HTMLButtonElement).style.color = "#C9552F"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.borderColor = "#EDE8E0"; (e.currentTarget as HTMLButtonElement).style.color = "#5B584F"; }}
          >
            Batch
          </button>
          <button
            type="button"
            onClick={onRecipeJson}
            style={btnBase}
            onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.borderColor = "#C9552F"; (e.currentTarget as HTMLButtonElement).style.color = "#C9552F"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.borderColor = "#EDE8E0"; (e.currentTarget as HTMLButtonElement).style.color = "#5B584F"; }}
          >
            Recipe
          </button>
          <button
            type="button"
            onClick={onCopyShareLink}
            style={btnBase}
            onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.borderColor = "#C9552F"; (e.currentTarget as HTMLButtonElement).style.color = "#C9552F"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.borderColor = "#EDE8E0"; (e.currentTarget as HTMLButtonElement).style.color = "#5B584F"; }}
          >
            Share ↗
          </button>
        </div>
      )}

      {/* Compact: secondary actions as tiny icon-links */}
      {compact && (
        <div className="flex justify-center gap-4">
          {[
            { label: "Batch", action: () => setBatchOpen((o) => !o) },
            { label: "Recipe JSON", action: onRecipeJson },
            { label: "Share Link ↗", action: onCopyShareLink },
          ].map(({ label, action }) => (
            <button
              key={label}
              type="button"
              onClick={action}
              style={{ fontSize: 10, fontFamily: "monospace", color: "#A0968C", background: "none", border: "none", cursor: "pointer" }}
              className="hover:underline transition-opacity hover:opacity-70"
            >
              {label}
            </button>
          ))}
        </div>
      )}

      {/* Batch panel */}
      {batchOpen && (
        <div
          className="space-y-2 rounded-xl p-3"
          style={{ border: "1.5px solid #EDE8E0", background: "#FFFFFF" }}
        >
          <p style={{ fontSize: 9, fontFamily: "monospace", textTransform: "uppercase", letterSpacing: "0.1em", color: "#A0968C", marginBottom: 6 }}>
            Target Devices
          </p>
          {DEVICE_PRESETS.filter((p) => p.id !== "custom").map((p) => (
            <label
              key={p.id}
              className="flex items-center gap-2 cursor-pointer select-none"
              style={{ fontSize: 11, color: "#2B2A26" }}
            >
              <input
                type="checkbox"
                checked={batchSelection.includes(p.id)}
                onChange={() => toggleBatch(p.id)}
                style={{ accentColor: "#C9552F" }}
              />
              <span>{p.label}</span>
              <span style={{ fontSize: 9, fontFamily: "monospace", color: "#A0968C" }}>
                {p.w}×{p.h}
              </span>
            </label>
          ))}
          <button
            type="button"
            onClick={onBatch}
            disabled={batchSelection.length === 0 || progress !== null}
            className="w-full rounded-xl py-2 mt-1 font-semibold transition-all disabled:opacity-40"
            style={{ fontSize: 12, background: "#C9552F", color: "#FFFFFF", border: "none" }}
          >
            {progress
              ? `Generating ${progress.done}/${progress.total}…`
              : "Generate All Selected"}
          </button>
          {progress && (
            <div className="h-1.5 w-full overflow-hidden rounded-full" style={{ background: "#EDE8E0" }}>
              <div
                className="h-full transition-all duration-300"
                style={{ width: `${(progress.done / progress.total) * 100}%`, background: "#C9552F" }}
              />
            </div>
          )}
        </div>
      )}

      {error && (
        <p style={{ fontSize: 10, fontFamily: "monospace", color: "#DC2626" }}>{error}</p>
      )}
    </div>
  );
}
