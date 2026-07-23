import { useEditorStore } from "@/store/useEditorStore";
import { ensureRegistered, getGenerator } from "@/lib/generators";
import { exportImage } from "@/lib/export/exportImage";
import { batchExport } from "@/lib/export/batchExport";
import { buildFilename } from "@/lib/export/filename";
import { DEVICE_PRESETS } from "@/lib/devices/presets";
import { buildRenderInput, resolvePalette } from "@/lib/render/renderToTarget";
import { buildRendererError } from "@/lib/render/generationState";

let activeExport: Promise<void> | null = null;

export function downloadBlob(blob: Blob, name: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

export function buildInput(size?: { width: number; height: number }) {
  ensureRegistered();
  const s = useEditorStore.getState();
  const generatorId = s.generatorId;
  const g = getGenerator(generatorId);
  if (!g) return null;
  const dimensions = size ?? { width: s.customWidth, height: s.customHeight };
  const input = buildRenderInput(s, dimensions);
  return { input, seed: s.seed, generatorId };
}

export async function triggerSingleExport(
  size?: { width: number; height: number },
  onProgress?: (status: string) => void
): Promise<void> {
  if (activeExport) {
    onProgress?.("Export in progress…");
    return activeExport;
  }

  const exportTask = (async () => {
    try {
      onProgress?.("Preparing high-resolution export…");
      // Yield to main thread for UI responsiveness
      await new Promise((r) => setTimeout(r, 20));

      const built = buildInput(size);
      if (!built) throw new Error("Could not initialize export renderer");

      const s = useEditorStore.getState();
      const w = size ? size.width : s.customWidth;
      const h = size ? size.height : s.customHeight;
      const exportFormat = s.exportFormat;

      onProgress?.(`Rendering ${w}×${h} px wallpaper…`);
      await new Promise((r) => setTimeout(r, 10));

      if (exportFormat === "svg") {
        const g = getGenerator(built.generatorId);
        if (!g || !g.toSvg) throw new Error("This generator cannot export as SVG");
        const palette = resolvePalette(built.input.palette, built.input.mode, built.input.autoMode);
        const svg = g.toSvg({ width: w, height: h }, built.input.params as never, built.seed, palette);
        const blob = new Blob([svg], { type: "image/svg+xml" });
        downloadBlob(blob, buildFilename(built.generatorId, built.seed, { width: w, height: h }, "svg"));
      } else {
        const blob = await exportImage(built.input, { width: w, height: h }, exportFormat);
        downloadBlob(blob, buildFilename(built.generatorId, built.seed, { width: w, height: h }, exportFormat));
      }

      onProgress?.("✓ Export complete!");
    } catch (err) {
      const formatted = buildRendererError("export", "failed", err);
      onProgress?.(`Export failed: ${formatted.userMessage}`);
      throw err;
    } finally {
      activeExport = null;
    }
  })();

  activeExport = exportTask;
  return exportTask;
}

export async function triggerBatchExport(
  batchSelection?: string[],
  onProgress?: (status: string) => void
): Promise<void> {
  if (activeExport) {
    onProgress?.("Export in progress…");
    return activeExport;
  }

  const exportTask = (async () => {
    try {
      onProgress?.("Preparing batch export package…");
      await new Promise((r) => setTimeout(r, 20));

      const built = buildInput();
      if (!built) throw new Error("Could not initialize batch export");

      const selection = batchSelection ?? ["desktop-1080p", "iphone-15-pro"];
      const sizes = selection
        .map((id) => DEVICE_PRESETS.find((p) => p.id === id))
        .filter((p): p is NonNullable<typeof p> => p != null && p.id !== "custom")
        .map((p) => ({ width: p.w, height: p.h }));

      if (sizes.length === 0) return;

      onProgress?.(`Rendering ${sizes.length} wallpaper variations…`);
      const zip = await batchExport(built.input, sizes, built.seed);
      const ts = String(Date.now());
      downloadBlob(zip, buildFilename.batch(ts));
      onProgress?.("✓ Batch export complete!");
    } catch (err) {
      const formatted = buildRendererError("batch-export", "failed", err);
      onProgress?.(`Batch export failed: ${formatted.userMessage}`);
      throw err;
    } finally {
      activeExport = null;
    }
  })();

  activeExport = exportTask;
  return exportTask;
}
