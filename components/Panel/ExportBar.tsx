import { useState } from "react";
import { useEditorStore } from "@/store/useEditorStore";
import { getGenerator } from "@/lib/generators";
import { exportImage } from "@/lib/export/exportImage";
import { batchExport } from "@/lib/export/batchExport";
import { buildFilename } from "@/lib/export/filename";
import { encodeRecipe, encodeHash } from "@/lib/recipe/encode";
import type { Recipe } from "@/lib/recipe/validate";
import { DEVICE_PRESETS } from "@/lib/devices/presets";
import { Button } from "@/components/ui/Button";
import { Select } from "@/components/ui/Select";
import { buildInput, downloadBlob } from "@/lib/export/actions";
import { validateExportSize } from "@/lib/export/limits";

export function ExportBar() {
  useEditorStore(s => s.exportFormat);
  const setExportFormat = useEditorStore(s => s.setExportFormat);
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
      if (!sizeCheck.ok) {
        setError(sizeCheck.error);
        return;
      }
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
      .map(id => DEVICE_PRESETS.find(p => p.id === id))
      .filter((p): p is NonNullable<typeof p> => p != null && p.id !== "custom")
      .map(p => ({ width: p.w, height: p.h }));
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
    setBatchSelection(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  }

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <Select
          value={exportFormat}
          onChange={(v) => setExportFormat(v as typeof exportFormat)}
          options={(() => {
            const g = useEditorStore.getState().generatorId;
            const gen = getGenerator(g);
            return [
              { value: "png", label: "PNG" },
              { value: "jpg", label: "JPG" },
              { value: "webp", label: "WEBP" },
              { value: "svg", label: "SVG" },
            ].filter(o => o.value !== "svg" || (gen && gen.supportsSvgExport));
          })()}
          ariaLabel="Export format"
        />
        <Button onClick={onDownload}>Download</Button>
      </div>

      <div className="flex gap-2">
        <Button onClick={() => setBatchOpen(o => !o)}>Batch export</Button>
        <Button onClick={onRecipeJson}>Recipe JSON</Button>
        <Button onClick={onCopyShareLink}>Share link</Button>
      </div>

      {batchOpen ? (
        <div className="space-y-2 rounded-md border border-zinc-800 bg-zinc-900 p-2">
          {DEVICE_PRESETS.filter(p => p.id !== "custom").map(p => (
            <label key={p.id} className="flex items-center gap-2 text-xs text-zinc-300">
              <input
                type="checkbox"
                checked={batchSelection.includes(p.id)}
                onChange={() => toggleBatch(p.id)}
              />
              {p.label} ({p.w}x{p.h})
            </label>
          ))}
          <Button onClick={onBatch} disabled={batchSelection.length === 0 || progress !== null}>
            Generate all
          </Button>
          {progress ? (
            <div className="h-1 w-full overflow-hidden rounded-full bg-zinc-800">
              <div className="h-full bg-blue-500 transition-all" style={{ width: `${(progress.done / progress.total) * 100}%` }} />
            </div>
          ) : null}
        </div>
      ) : null}

      {error ? <p className="text-xs text-red-400">{error}</p> : null}
    </div>
  );
}
