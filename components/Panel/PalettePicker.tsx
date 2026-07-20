import { useRef } from "react";
import { CURATED_PALETTES, palettesForMode, type Palette } from "@/lib/palettes/data";
import { extractPalette } from "@/lib/palettes/extract";
import { useEditorStore } from "@/store/useEditorStore";
import { ColorInput } from "@/components/ui/ColorInput";
import { Button } from "@/components/ui/Button";

export function PalettePicker() {
  const palette = useEditorStore(s => s.palette);
  const setPalette = useEditorStore(s => s.setPalette);
  const mode = useEditorStore(s => s.mode);
  const effectiveMode = mode === "auto" ? "dark" : mode;
  const curated = palettesForMode(effectiveMode);
  const fileRef = useRef<HTMLInputElement | null>(null);

  function pickPalette(p: Palette) { setPalette(p.colors); }
  function updateColor(i: number, v: string) {
    const next = [...palette];
    next[i] = v;
    setPalette(next);
  }
  function addColor() {
    if (palette.length >= 6) return;
    setPalette([...palette, palette[palette.length - 1] ?? "#888888"]);
  }
  function removeColor(i: number) {
    if (palette.length <= 2) return;
    setPalette(palette.filter((_, idx) => idx !== i));
  }

  async function onFile(file: File) {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.src = url;
    await img.decode();
    const off = new OffscreenCanvas(64, 64);
    const ctx = off.getContext("2d")!;
    ctx.drawImage(img, 0, 0, 64, 64);
    const data = ctx.getImageData(0, 0, 64, 64);
    setPalette(extractPalette(data));
    URL.revokeObjectURL(url);
  }

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-5 gap-1">
        {curated.map(p => (
          <button
            key={p.id}
            type="button"
            onClick={() => pickPalette(p)}
            aria-label={`Use ${p.label} palette`}
            title={p.label}
            className="flex h-7 overflow-hidden rounded border border-zinc-700"
          >
            {p.colors.map(c => <span key={c} style={{ background: c }} className="flex-1" />)}
          </button>
        ))}
      </div>

      <div className="space-y-1">
        {palette.map((c, i) => (
          <div key={i} className="flex items-center gap-2">
            <ColorInput value={c} onChange={(v) => updateColor(i, v)} ariaLabel={`Color ${i + 1}`} />
            <input
              type="text"
              value={c}
              onChange={(e) => updateColor(i, e.target.value)}
              aria-label={`Color ${i + 1} hex`}
              className="flex-1 rounded-md border border-zinc-700 bg-zinc-900 px-2 py-1 text-xs text-zinc-100"
            />
            <button
              type="button"
              onClick={() => removeColor(i)}
              aria-label={`Remove color ${i + 1}`}
              className="text-zinc-500 hover:text-zinc-100"
            >
              x
            </button>
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        <Button onClick={addColor} disabled={palette.length >= 6}>+ Color</Button>
        <Button onClick={() => fileRef.current?.click()}>+ From image</Button>
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => { const f = e.target.files?.[0]; if (f) void onFile(f); }}
        />
      </div>
    </div>
  );
}
