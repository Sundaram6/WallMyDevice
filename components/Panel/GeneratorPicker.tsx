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
            className="relative p-3 text-left rounded-xl transition-all focus-visible:outline-none"
            style={{
              border: isActive ? "1.5px solid #C9552F" : "1.5px solid #EDE8E0",
              background: isActive ? "rgba(201,85,47,0.06)" : "#FFFFFF",
              boxShadow: isActive ? "0 0 0 3px rgba(201,85,47,0.08)" : "none",
            }}
            onMouseEnter={(e) => {
              if (!isActive) {
                (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(201,85,47,0.4)";
                (e.currentTarget as HTMLButtonElement).style.background = "#FAF8F4";
              }
            }}
            onMouseLeave={(e) => {
              if (!isActive) {
                (e.currentTarget as HTMLButtonElement).style.borderColor = "#EDE8E0";
                (e.currentTarget as HTMLButtonElement).style.background = "#FFFFFF";
              }
            }}
          >
            {/* Active dot indicator */}
            {isActive && (
              <span
                className="absolute top-2.5 right-2.5 rounded-full"
                style={{ width: 6, height: 6, background: "#C9552F" }}
              />
            )}

            {/* Generator name */}
            <div
              style={{
                fontSize: 12,
                fontWeight: 600,
                color: isActive ? "#C9552F" : "#2B2A26",
                marginBottom: 3,
                paddingRight: isActive ? 12 : 0,
              }}
            >
              {g.label}
            </div>

            {/* Description */}
            {g.description && (
              <div
                style={{
                  fontSize: 10,
                  color: "#8A8579",
                  lineHeight: 1.4,
                  display: "-webkit-box",
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                }}
              >
                {g.description}
              </div>
            )}

            {/* SVG badge */}
            {g.supportsSvgExport && (
              <span
                className="mt-1.5 inline-block"
                style={{
                  fontSize: 8,
                  fontFamily: "monospace",
                  color: "#16a34a",
                  background: "rgba(22,163,74,0.08)",
                  border: "1px solid rgba(22,163,74,0.2)",
                  borderRadius: 4,
                  padding: "1px 4px",
                }}
              >
                SVG
              </span>
            )}
          </button>
        );
      })}

      {generators.length === 0 && (
        <div
          className="col-span-2 py-8 text-center"
          style={{ fontSize: 11, fontFamily: "monospace", color: "#8A8579" }}
        >
          No generators registered.
        </div>
      )}
    </div>
  );
}
