function sanitize(s: string): string {
  return s.replace(/[^a-zA-Z0-9_-]/g, "");
}

export function buildFilename(
  generatorId: string,
  seed: string,
  size: { width: number; height: number },
  ext: string
): string {
  return `wallmydevice-${sanitize(generatorId)}-${sanitize(seed)}-${size.width}x${size.height}.${ext}`;
}

buildFilename.batch = function buildBatchFilename(timestamp: string): string {
  return `wallmydevice-batch-${sanitize(timestamp)}.zip`;
};
