"use client";

import { useEffect, useMemo, useState } from "react";
import { ensureRegistered, listGenerators } from "@/lib/generators";
import { useEditorStore } from "@/store/useEditorStore";
import { useGeneratorThumbnails } from "@/lib/render/useGeneratorThumbnails";

export function GeneratorPicker() {
  ensureRegistered();
  const generators = listGenerators();
  const storeActive = useEditorStore((s) => s.generatorId);
  const setGenerator = useEditorStore((s) => s.setGenerator);
  const mode = useEditorStore((s) => s.mode);
  const systemColorScheme = useEditorStore((s) => s.systemColorScheme);
  const remix = useEditorStore((s) => s.remix);

  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  const active = mounted ? storeActive : "waveform";

  // Resolve the effective display theme for thumbnail selection
  const effectiveTheme: "light" | "dark" =
    mode === "auto" ? systemColorScheme : mode === "dark" ? "dark" : "light";

  const generatorIds = useMemo(() => generators.map((g) => g.id), [generators]);
  const thumbnails = useGeneratorThumbnails(generatorIds);

  if (generators.length === 0) {
    return (
      <div
        className="py-8 text-center"
        style={{ fontSize: 11, fontFamily: "monospace", color: "var(--ink-500)" }}
      >
        No generators registered.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between px-0.5 mb-0.5">
        <span className="text-[10px] font-mono text-ink-500 uppercase tracking-wider">
          Style Library
        </span>
        <button
          type="button"
          onClick={remix}
          title="Remix active style with new seed & colors"
          className="flex items-center gap-1 text-[11px] font-medium text-accent-500 hover:text-accent-600 transition-colors cursor-pointer"
        >
          <span>🔀 Remix Active</span>
        </button>
      </div>

      <div className="grid grid-cols-2 gap-2">
      {generators.map((g) => {
        const isActive = active === g.id;
        const thumbs = thumbnails[g.id];
        const thumbUrl = thumbs ? thumbs[effectiveTheme] : undefined;

        return (
          <button
            key={g.id}
            id={`gen-picker-${g.id}`}
            type="button"
            onClick={() => setGenerator(g.id)}
            aria-pressed={isActive}
            aria-label={`Select ${g.label} generator`}
            suppressHydrationWarning
            className="relative overflow-hidden rounded-lg transition-all duration-[--dur-fast] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-500 focus-visible:ring-offset-1 group"
            style={{
              height: 96,
              border: isActive
                ? "2px solid var(--accent-500)"
                : "1.5px solid transparent",
              boxShadow: isActive
                ? "0 0 0 1px var(--accent-500)/30, 0 4px 16px rgba(0,0,0,0.4)"
                : "0 2px 8px rgba(0,0,0,0.25)",
            }}
          >
            {/* Thumbnail background */}
            {thumbUrl ? (
              <div
                aria-hidden="true"
                className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                style={{ backgroundImage: `url(${thumbUrl})` }}
              />
            ) : (
              /* Skeleton shimmer while rendering */
              <div
                aria-hidden="true"
                className="absolute inset-0"
                style={{
                  background: isActive
                    ? "linear-gradient(135deg, var(--accent-500)/20, var(--accent-500)/5)"
                    : "linear-gradient(135deg, var(--paper-100), var(--paper-200))",
                  animation: "gen-thumb-shimmer 1.8s ease-in-out infinite",
                }}
              />
            )}

            {/* Bottom gradient scrim — ensures text legibility on any image */}
            <div
              aria-hidden="true"
              className="absolute inset-0 rounded-lg"
              style={{
                background:
                  "linear-gradient(to top, rgba(0,0,0,0.82) 0%, rgba(0,0,0,0.45) 45%, rgba(0,0,0,0.08) 100%)",
              }}
            />

            {/* Hover brightener overlay */}
            <div
              aria-hidden="true"
              className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-[--dur-fast]"
              style={{ background: "rgba(255,255,255,0.06)" }}
            />

            {/* Active ring highlight */}
            {isActive && (
              <div
                aria-hidden="true"
                className="absolute inset-0 rounded-lg ring-2 ring-inset ring-accent-500/40"
              />
            )}

            {/* Active dot indicator */}
            {isActive && (
              <span
                className="absolute top-2 right-2 w-2 h-2 rounded-full bg-accent-500 shadow-[0_0_6px_2px_var(--accent-500)/60] z-10"
                aria-hidden="true"
              />
            )}

            {/* Text content */}
            <div className="absolute bottom-0 left-0 right-0 px-2.5 pb-2 z-10">
              {/* Generator name */}
              <div
                className="font-serif text-[11px] font-semibold leading-tight text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)] line-clamp-1"
                style={{
                  textShadow: "0 1px 3px rgba(0,0,0,0.9)",
                }}
              >
                {g.label}
              </div>

              {/* Category + SVG badge row */}
              <div className="flex items-center gap-1 mt-0.5">
                {g.category && (
                  <span
                    className="font-sans text-[9px] text-white/70 leading-none"
                    style={{ textShadow: "0 1px 2px rgba(0,0,0,0.8)" }}
                  >
                    {g.category}
                  </span>
                )}
                {g.supportsSvgExport && (
                  <span className="ml-auto inline-block font-mono text-[8px] text-emerald-300 bg-emerald-900/60 border border-emerald-500/30 rounded px-1 py-0.5 leading-none backdrop-blur-xs">
                    SVG
                  </span>
                )}
              </div>
            </div>
          </button>
        );
      })}

      <style>{`
        @keyframes gen-thumb-shimmer {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.6; }
        }
      `}</style>
      </div>
    </div>
  );
}
