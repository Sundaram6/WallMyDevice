import { useEffect, useState } from "react";
import { getGenerator } from "@/lib/generators";
import { useEditorStore } from "@/store/useEditorStore";
import { Slider } from "@/components/ui/Slider";
import { Toggle } from "@/components/ui/Toggle";

export function ParamsForm() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  const storeGeneratorId = useEditorStore(s => s.generatorId);
  const generatorId = mounted ? storeGeneratorId : "waveform";
  const params = useEditorStore(s => s.params[generatorId]) as Record<string, unknown> | undefined;
  const updateParam = useEditorStore(s => s.updateParam);
  const generator = getGenerator(generatorId);
  if (!generator || !params) return null;

  return (
    <div className="space-y-3">
      {generator.paramControls.map(c => {
        const value = params[c.key as string];
        if (c.type === "slider" && c.min !== undefined && c.max !== undefined && c.step !== undefined && typeof value === "number") {
          return (
            <label key={String(c.key)} className="block">
              <div className="mb-1 flex items-center justify-between text-xs text-ink-900">
                <span className="font-medium text-xs">{c.label}</span>
                <span className="tabular-nums font-mono text-[11px] text-ink-500">{Number(value).toFixed(c.step < 1 ? 2 : 0)}</span>
              </div>
              <Slider
                value={value}
                min={c.min}
                max={c.max}
                step={c.step}
                ariaLabel={c.label}
                onChange={(v) => updateParam(generatorId, String(c.key), v)}
              />
            </label>
          );
        }
        if (c.type === "toggle" && typeof value === "boolean") {
          return (
            <label key={String(c.key)} className="flex items-center justify-between text-xs text-ink-900">
              <span className="font-medium">{c.label}</span>
              <Toggle
                checked={value}
                onChange={(v) => updateParam(generatorId, String(c.key), v)}
                ariaLabel={c.label}
              />
            </label>
          );
        }
        if (c.type === "select" && c.options && typeof value === "string") {
          return (
            <label key={String(c.key)} className="block">
              <div className="mb-1 text-xs font-medium text-ink-900">{c.label}</div>
              <select
                value={value}
                aria-label={c.label}
                onChange={(e) => updateParam(generatorId, String(c.key), e.target.value)}
                className="w-full rounded-lg border border-paper-300 bg-paper-0 px-2.5 py-1.5 text-xs text-ink-900 focus:border-accent-500 focus:outline-none"
              >
                {c.options.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </label>
          );
        }
        return null;
      })}
    </div>
  );
}