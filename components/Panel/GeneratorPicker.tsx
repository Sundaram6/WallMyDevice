"use client";

import { ensureRegistered, listGenerators } from "@/lib/generators";
import { useEditorStore } from "@/store/useEditorStore";

export function GeneratorPicker() {
  ensureRegistered();
  const generators = listGenerators();
  const active = useEditorStore((s) => s.generatorId);
  const setGenerator = useEditorStore((s) => s.setGenerator);

  return (
    <div className="grid grid-cols-2 gap-2">
      {generators.map((g) => {
        const isActive = active === g.id;
        return (
          <button
            key={g.id}
            type="button"
            onClick={() => setGenerator(g.id)}
            aria-pressed={isActive}
            className={`relative p-3 text-left rounded-md transition-all duration-[--dur-fast] focus-visible:outline-none ${
              isActive
                ? "bg-paper-0 border-2 border-accent-500 shadow-2"
                : "bg-paper-50 border border-paper-200 hover:bg-paper-0 hover:border-paper-300 hover:shadow-1"
            }`}
          >
            {/* Active dot indicator */}
            {isActive && (
              <span
                className="absolute top-2.5 right-2.5 rounded-full bg-accent-500 w-2 h-2"
              />
            )}

            {/* Generator name */}
            <div
              className={`font-serif text-xs font-semibold mb-1 ${
                isActive ? "text-accent-500" : "text-ink-900"
              }`}
            >
              {g.label}
            </div>

            {/* Description */}
            {g.description && (
              <div className="font-sans text-[10px] text-ink-500 leading-relaxed line-clamp-2">
                {g.description}
              </div>
            )}

            {/* SVG badge */}
            {g.supportsSvgExport && (
              <span className="mt-1.5 inline-block font-mono text-[9px] text-success-500 bg-success-500/10 border border-success-500/20 rounded px-1.5 py-0.5">
                SVG
              </span>
            )}
          </button>
        );
      })}

      {generators.length === 0 && (
        <div
          className="col-span-2 py-8 text-center"
          style={{ fontSize: 11, fontFamily: "monospace", color: "var(--ink-500)" }}
        >
          No generators registered.
        </div>
      )}
    </div>
  );
}
