import { getGenerator } from "@/lib/generators";
import { useEditorStore } from "@/store/useEditorStore";
import { Slider } from "@/components/ui/Slider";
import { Toggle } from "@/components/ui/Toggle";

export function ParamsForm() {
  const generatorId = useEditorStore(s => s.generatorId);
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
              <div className="mb-1 flex items-center justify-between text-xs text-zinc-300">
                <span>{c.label}</span>
                <span className="tabular-nums text-zinc-500">{Number(value).toFixed(c.step < 1 ? 2 : 0)}</span>
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
            <label key={String(c.key)} className="flex items-center justify-between text-xs text-zinc-300">
              <span>{c.label}</span>
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
              <div className="mb-1 text-xs text-zinc-300">{c.label}</div>
              <select
                value={value}
                aria-label={c.label}
                onChange={(e) => updateParam(generatorId, String(c.key), e.target.value)}
                className="w-full rounded-md border border-zinc-700 bg-zinc-900 px-2 py-1.5 text-sm text-zinc-100 focus:border-blue-500 focus:outline-none"
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