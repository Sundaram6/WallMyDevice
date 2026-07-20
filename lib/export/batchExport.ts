import JSZip from "jszip";
import { exportImage } from "./exportImage";
import { buildFilename } from "./filename";
import type { RenderInput } from "../render/renderToTarget";

export type BatchSize = { width: number; height: number };

export async function batchExport(
  input: RenderInput,
  sizes: BatchSize[],
  seed: string,
  onProgress?: (done: number, total: number) => void
): Promise<Blob> {
  const zip = new JSZip();
  const generatorId = input.generatorId;
  for (let i = 0; i < sizes.length; i++) {
    const size = sizes[i];
    const blob = await exportImage(input, size);
    zip.file(buildFilename(generatorId, seed, size, "png"), blob);
    onProgress?.(i + 1, sizes.length);
  }
  return zip.generateAsync({ type: "blob" });
}
