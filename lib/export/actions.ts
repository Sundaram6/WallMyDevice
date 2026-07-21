import { useEditorStore } from "@/store/useEditorStore";
import { ensureRegistered, getGenerator } from "@/lib/generators";
import { exportImage } from "@/lib/export/exportImage";
import { batchExport } from "@/lib/export/batchExport";
import { buildFilename } from "@/lib/export/filename";
import { DEVICE_PRESETS } from "@/lib/devices/presets";

import { buildRenderInput } from "@/lib/render/renderToTarget";

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

export async function triggerSingleExport() {
  const built = buildInput();
  if (!built) return;
  const s = useEditorStore.getState();
  const w = s.customWidth;
  const h = s.customHeight;
  const exportFormat = s.exportFormat;
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
}

export async function triggerBatchExport(batchSelection?: string[]) {
  const built = buildInput();
  if (!built) return;
  const selection = batchSelection ?? ["desktop-1080p", "iphone-15-pro"];
  const sizes = selection
    .map(id => DEVICE_PRESETS.find(p => p.id === id))
    .filter((p): p is NonNullable<typeof p> => p != null && p.id !== "custom")
    .map(p => ({ width: p.w, height: p.h }));
  if (sizes.length === 0) return;
  const zip = await batchExport(built.input, sizes, built.seed);
  const ts = String(Date.now());
  downloadBlob(zip, buildFilename.batch(ts));
}
