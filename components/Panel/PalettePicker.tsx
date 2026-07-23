import { useRef } from "react";
import { palettesForMode, type Palette } from "@/lib/palettes/data";
import { extractPalette } from "@/lib/palettes/extract";
import { useEditorStore } from "@/store/useEditorStore";
import { ColorInput } from "@/components/ui/ColorInput";
import { Button } from "@/components/ui/Button";

export function PalettePicker() {
  const palette = useEditorStore((s) => s.palette);
  const setPalette = useEditorStore((s) => s.setPalette);
  const mode = useEditorStore((s) => s.mode);
  const effectiveMode = mode === "auto" ? "dark" : mode;
  const curated = palettesForMode(effectiveMode);
  const fileRef = useRef<HTMLInputElement | null>(null);

  function pickPalette(p: Palette) {
    setPalette(p.colors);
  }
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
      {/* Curated Presets */}
      <div className="grid grid-cols-5 gap-1.5">
        {curated.map((p) => (
          <button
            key={p.id}
            type="button"
            onClick={() => pickPalette(p)}
            aria-label={`Use ${p.label} palette`}
            title={p.label}
            className="flex min-h-[44px] overflow-hidden rounded-md border border-zinc-700 focus:ring-2 focus:ring-[#C9552F]"
          >
            {p.colors.map((c) => (
              <span key={c} style={{ background: c }} className="flex-1" />
            ))}
          </button>
        ))}
      </div>

      {/* Palette Colors Control List */}
      <div className="space-y-2">
        <div className="flex justify-between text-[11px] font-mono text-zinc-400">
          <span>Palette colors ({palette.length}/6)</span>
          <span>{palette.length <= 2 ? "Min 2 colors required" : palette.length >= 6 ? "Max 6 colors reached" : ""}</span>
        </div>
        {palette.map((c, i) => (
          <div key={i} className="flex items-center gap-2">
            <div className="shrink-0 flex items-center justify-center min-h-[44px] min-w-[44px]">
              <ColorInput value={c} onChange={(v) => updateColor(i, v)} ariaLabel={`Color ${i + 1}`} />
            </div>
            <input
              type="text"
              value={c}
              onChange={(e) => updateColor(i, e.target.value)}
              aria-label={`Color ${i + 1} hex`}
              className="flex-1 rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-xs text-zinc-100 min-h-[44px]"
            />
            <button
              type="button"
              disabled={palette.length <= 2}
              onClick={() => removeColor(i)}
              aria-label={`Remove color ${i + 1}`}
              className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-lg border border-zinc-800 text-sm font-medium text-zinc-400 hover:text-red-400 hover:border-red-500/40 disabled:opacity-30 transition"
            >
              ✕
            </button>
          </div>
        ))}
      </div>

      {/* Add / Extract Buttons */}
      <div className="flex gap-2">
        <Button onClick={addColor} disabled={palette.length >= 6} className="min-h-[44px] flex-1">
          + Add Color ({palette.length}/6)
        </Button>
        <Button onClick={() => fileRef.current?.click()} className="min-h-[44px] flex-1">
          + From Image
        </Button>
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) void onFile(f);
          }}
        />
      </div>
    </div>
  );
}
