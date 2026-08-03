"use client";

import { useRef, useState } from "react";
import { palettesForMode, type Palette } from "@/lib/palettes/data";
import { extractPalette } from "@/lib/palettes/extract";
import { generateHarmonyPalette, type HarmonyRule } from "@/lib/palettes/harmony";
import { NAMED_CURATED_COLLECTIONS } from "@/lib/palettes/curated-collections";
import { useEditorStore } from "@/store/useEditorStore";
import { ColorInput } from "@/components/ui/ColorInput";

type Tab = "presets" | "harmony" | "custom";

const HARMONY_RULES: Array<{ id: HarmonyRule; label: string }> = [
  { id: "analogous", label: "Analogous" },
  { id: "complementary", label: "Complementary" },
  { id: "triadic", label: "Triadic" },
  { id: "split-complementary", label: "Split-Complementary" },
  { id: "monochromatic", label: "Monochromatic" },
  { id: "tetradic", label: "Tetradic" },
];

export function PalettePicker() {
  const palette = useEditorStore((s) => s.palette);
  const setPalette = useEditorStore((s) => s.setPalette);
  const paletteLocked = useEditorStore((s) => s.paletteLocked);
  const togglePaletteLock = useEditorStore((s) => s.togglePaletteLock);
  const randomizePalette = useEditorStore((s) => s.randomizePalette);
  const mode = useEditorStore((s) => s.mode);

  const effectiveMode = mode === "auto" ? "dark" : mode;
  const legacyCurated = palettesForMode(effectiveMode);
  const fileRef = useRef<HTMLInputElement | null>(null);

  const [tab, setTab] = useState<Tab>("presets");
  const [seedHue, setSeedHue] = useState(210);
  const [harmonyRule, setHarmonyRule] = useState<HarmonyRule>("analogous");

  // Detect which curated collection matches the active palette
  const activePaletteId = NAMED_CURATED_COLLECTIONS.find(
    (c) =>
      c.colors.length === palette.length &&
      c.colors.every((col, i) => col === palette[i])
  )?.id;

  function applyHarmony(hue: number, rule: HarmonyRule) {
    setPalette(generateHarmonyPalette(hue, rule, 4));
  }

  function updateColor(i: number, v: string) {
    const next = [...palette];
    next[i] = v;
    setPalette(next);
  }

  function removeColor(i: number) {
    if (palette.length <= 2) return;
    setPalette(palette.filter((_, idx) => idx !== i));
  }

  function addColor() {
    if (palette.length >= 8) return;
    setPalette([...palette, palette[palette.length - 1] ?? "var(--ink-400)"]);
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
      {/* ── Toolbar ─────────────────────────────────────────────── */}
      <div className="flex items-center justify-between">
        {/* Sub-tabs */}
        <div className="flex gap-0.5" style={{ background: "var(--paper-50)", borderRadius: 8, padding: 3 }}>
          {(["presets", "harmony", "custom"] as const).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTab(t)}
              className="capitalize transition-all"
              style={{
                fontSize: 10,
                fontFamily: "monospace",
                padding: "3px 9px",
                borderRadius: 6,
                background: tab === t ? "var(--paper-0)" : "transparent",
                color: tab === t ? "var(--ink-900)" : "var(--ink-500)",
                fontWeight: tab === t ? 600 : 400,
                boxShadow: tab === t ? "0 1px 3px rgba(0,0,0,0.08)" : "none",
              }}
            >
              {t}
            </button>
          ))}
        </div>

        {/* Lock + Shuffle */}
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={togglePaletteLock}
            title={paletteLocked ? "Unlock palette" : "Lock palette"}
            className="rounded-lg transition-all"
            style={{
              padding: "5px 7px",
              fontSize: 12,
              border: paletteLocked ? "1px solid var(--accent-500)" : "1px solid var(--paper-200)",
              background: paletteLocked ? "rgba(201,85,47,0.08)" : "var(--paper-50)",
              color: paletteLocked ? "var(--accent-500)" : "var(--ink-500)",
            }}
          >
            {paletteLocked ? "🔒" : "🔓"}
          </button>
          <button
            type="button"
            onClick={randomizePalette}
            className="rounded-lg transition-all"
            style={{
              padding: "4px 9px",
              fontSize: 10,
              fontFamily: "monospace",
              border: "1px solid var(--paper-200)",
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
            ✦ Shuffle
          </button>
        </div>
      </div>

      {/* Active palette strip */}
      <div
        className="flex w-full overflow-hidden rounded-lg"
        style={{ height: 22, border: "1px solid var(--paper-300)", boxShadow: "inset 0 1px 2px rgba(0,0,0,0.06)" }}
      >
        {palette.map((color, i) => (
          <span key={i} style={{ flex: 1, backgroundColor: color }} title={color} />
        ))}
      </div>

      {/* ── PRESETS tab ─────────────────────────────────────────── */}
      {tab === "presets" && (
        <div
          className="space-y-1 no-scrollbar overflow-y-auto"
          style={{ maxHeight: 260 }}
        >
          {NAMED_CURATED_COLLECTIONS.map((c) => {
            const isSelected = activePaletteId === c.id;
            return (
              <button
                key={c.id}
                type="button"
                onClick={() => setPalette([...c.colors])}
                className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-all"
                style={{
                  border: isSelected ? "1.5px solid var(--accent-500)" : "1.5px solid transparent",
                  background: isSelected ? "rgba(201,85,47,0.05)" : "transparent",
                }}
                onMouseEnter={(e) => {
                  if (!isSelected) {
                    (e.currentTarget as HTMLButtonElement).style.background = "var(--paper-50)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isSelected) {
                    (e.currentTarget as HTMLButtonElement).style.background = "transparent";
                  }
                }}
              >
                {/* Color swatches */}
                <div className="flex gap-0.5 shrink-0">
                  {c.colors.slice(0, 5).map((col, i) => (
                    <span
                      key={i}
                      style={{
                        width: 14,
                        height: 14,
                        borderRadius: 3,
                        backgroundColor: col,
                        border: "1px solid rgba(0,0,0,0.08)",
                        display: "inline-block",
                      }}
                    />
                  ))}
                </div>

                {/* Palette name */}
                <span
                  className="flex-1 truncate"
                  style={{
                    fontSize: 12,
                    fontWeight: isSelected ? 600 : 400,
                    color: isSelected ? "var(--accent-500)" : "var(--ink-900)",
                  }}
                >
                  {c.label}
                </span>

                {isSelected && (
                  <span style={{ fontSize: 10, color: "var(--accent-500)", fontFamily: "monospace" }}>✓</span>
                )}
              </button>
            );
          })}

          {/* Legacy curated palettes */}
          {legacyCurated.length > 0 && (
            <div className="pt-3" style={{ borderTop: "1px solid var(--paper-200)", marginTop: 8 }}>
              <p
                style={{
                  fontSize: 9,
                  fontFamily: "monospace",
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                  color: "var(--ink-400)",
                  marginBottom: 8,
                }}
              >
                Classic
              </p>
              <div className="grid grid-cols-5 gap-1.5">
                {legacyCurated.map((p: Palette) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setPalette([...p.colors])}
                    title={p.label}
                    className="flex overflow-hidden rounded-lg"
                    style={{
                      height: 32,
                      border: "1.5px solid var(--paper-200)",
                    }}
                  >
                    {p.colors.map((c) => (
                      <span key={c} style={{ flex: 1, backgroundColor: c }} />
                    ))}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── HARMONY tab ─────────────────────────────────────────── */}
      {tab === "harmony" && (
        <div
          className="space-y-4 rounded-xl p-4"
          style={{ background: "var(--paper-50)", border: "1px solid var(--paper-200)" }}
        >
          {/* Hue slider */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label style={{ fontSize: 10, fontFamily: "monospace", color: "var(--ink-700)" }}>
                Seed Hue ({seedHue}°)
              </label>
              <button
                type="button"
                onClick={() => {
                  const h = Math.floor(Math.random() * 360);
                  setSeedHue(h);
                  applyHarmony(h, harmonyRule);
                }}
                style={{ fontSize: 10, fontFamily: "monospace", color: "var(--accent-500)" }}
                className="hover:underline"
              >
                ✦ Random
              </button>
            </div>
            <div className="relative">
              <input
                type="range"
                min={0}
                max={360}
                value={seedHue}
                onChange={(e) => {
                  const v = Number(e.target.value);
                  setSeedHue(v);
                  applyHarmony(v, harmonyRule);
                }}
                className="w-full h-2 rounded-lg appearance-none cursor-pointer"
                style={{
                  background: `linear-gradient(to right,
                    hsl(0,70%,55%), hsl(60,70%,55%), hsl(120,70%,55%),
                    hsl(180,70%,55%), hsl(240,70%,55%), hsl(300,70%,55%), hsl(360,70%,55%))`,
                }}
              />
            </div>
            {/* Harmony color preview */}
            <div
              className="flex mt-2 overflow-hidden rounded-lg"
              style={{ height: 18, border: "1px solid rgba(0,0,0,0.06)" }}
            >
              {generateHarmonyPalette(seedHue, harmonyRule, 4).map((c, i) => (
                <span key={i} style={{ flex: 1, backgroundColor: c }} />
              ))}
            </div>
          </div>

          {/* Harmony rule */}
          <div>
            <label style={{ fontSize: 10, fontFamily: "monospace", color: "var(--ink-700)", display: "block", marginBottom: 6 }}>
              Harmony Rule
            </label>
            <div className="grid grid-cols-2 gap-1.5">
              {HARMONY_RULES.map((r) => (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => {
                    setHarmonyRule(r.id);
                    applyHarmony(seedHue, r.id);
                  }}
                  className="py-1.5 rounded-lg text-left px-2.5 transition-all"
                  style={{
                    fontSize: 10,
                    border: harmonyRule === r.id ? "1.5px solid var(--accent-500)" : "1.5px solid var(--paper-200)",
                    background: harmonyRule === r.id ? "rgba(201,85,47,0.07)" : "var(--paper-0)",
                    color: harmonyRule === r.id ? "var(--accent-500)" : "var(--ink-700)",
                    fontWeight: harmonyRule === r.id ? 600 : 400,
                  }}
                >
                  {r.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── CUSTOM tab ──────────────────────────────────────────── */}
      {tab === "custom" && (
        <div className="space-y-2.5">
          <div className="flex justify-between" style={{ fontSize: 10, fontFamily: "monospace", color: "var(--ink-400)" }}>
            <span>{palette.length} colors</span>
            <span>{palette.length >= 8 ? "Max 8" : palette.length <= 2 ? "Min 2" : ""}</span>
          </div>

          {palette.map((c, i) => (
            <div key={i} className="flex items-center gap-2">
              <div className="shrink-0" style={{ width: 36, height: 36 }}>
                <ColorInput
                  value={c}
                  onChange={(v) => updateColor(i, v)}
                  ariaLabel={`Color ${i + 1}`}
                />
              </div>
              <input
                type="text"
                value={c}
                onChange={(e) => updateColor(i, e.target.value)}
                aria-label={`Color ${i + 1} hex`}
                className="flex-1 rounded-lg font-mono focus:outline-none transition-all"
                style={{
                  fontSize: 11,
                  padding: "8px 10px",
                  border: "1.5px solid var(--paper-200)",
                  background: "var(--paper-0)",
                  color: "var(--ink-900)",
                  height: 36,
                }}
                onFocus={(e) => (e.target.style.borderColor = "var(--accent-500)")}
                onBlur={(e) => (e.target.style.borderColor = "var(--paper-100)")}
              />
              <button
                type="button"
                disabled={palette.length <= 2}
                onClick={() => removeColor(i)}
                aria-label={`Remove color ${i + 1}`}
                className="flex items-center justify-center rounded-lg transition-all disabled:opacity-25"
                style={{
                  width: 36,
                  height: 36,
                  fontSize: 12,
                  border: "1.5px solid var(--paper-200)",
                  background: "var(--paper-50)",
                  color: "var(--ink-500)",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--accent-100)";
                  (e.currentTarget as HTMLButtonElement).style.color = "var(--danger-500)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--paper-100)";
                  (e.currentTarget as HTMLButtonElement).style.color = "var(--ink-500)";
                }}
              >
                ✕
              </button>
            </div>
          ))}

          <div className="flex gap-2 pt-1">
            <button
              type="button"
              disabled={palette.length >= 8}
              onClick={addColor}
              className="flex-1 rounded-xl py-2 text-xs transition-all disabled:opacity-30"
              style={{ border: "1.5px solid var(--paper-200)", background: "var(--paper-50)", color: "var(--ink-700)", fontSize: 11 }}
            >
              + Add Color
            </button>
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="flex-1 rounded-xl py-2 text-xs transition-all"
              style={{ border: "1.5px solid var(--paper-200)", background: "var(--paper-50)", color: "var(--ink-700)", fontSize: 11 }}
            >
              ↑ From Image
            </button>
          </div>
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
      )}
    </div>
  );
}
