import { useState } from "react";
import { useEditorStore } from "@/store/useEditorStore";
import { parseRecipe, type Recipe } from "@/lib/recipe/validate";
import { Button } from "@/components/ui/Button";
import { DEVICE_PRESETS } from "@/lib/devices/presets";
import { getGenerator } from "@/lib/generators";

function applyRecipe(recipe: Recipe): { ok: true } | { ok: false; error: string } {
  const generator = getGenerator(recipe.generator);
  if (!generator) return { ok: false, error: `Unknown generator "${recipe.generator}"` };
  const paramCheck = generator.schema.zod.safeParse(recipe.params);
  if (!paramCheck.success) return { ok: false, error: `Invalid params: ${paramCheck.error.issues.map(i => i.path.join(".")).join(", ")}` };

  const preset = DEVICE_PRESETS.find(p => p.id === recipe.resolution.preset);
  const resolutionId = preset ? recipe.resolution.preset : "custom";

  useEditorStore.setState({
    generatorId: recipe.generator,
    params: { ...useEditorStore.getState().params, [recipe.generator]: recipe.params },
    palette: recipe.palette,
    mode: recipe.mode,
    seed: recipe.seed,
    grainEnabled: recipe.grain.enabled,
    grainIntensity: recipe.grain.intensity,
    blurIntensity: recipe.blur,
    resolutionId,
    customWidth: recipe.resolution.width,
    customHeight: recipe.resolution.height,
    overlayClock: recipe.overlays.clock,
    overlayDate: recipe.overlays.date,
    overlayText: recipe.overlays.text,
    overlayTextValue: recipe.overlays.value,
    overlayFont: recipe.overlays.font,
    overlaySize: recipe.overlays.size,
  });
  return { ok: true };
}

export function RecipeLoader() {
  const [open, setOpen] = useState(false);
  const [text, setText] = useState("");
  const [error, setError] = useState<string | null>(null);

  function onLoad() {
    setError(null);
    const r = parseRecipe(text);
    if (!r.ok) { setError(r.error); return; }
    const applied = applyRecipe(r.recipe);
    if (!applied.ok) { setError(applied.error); return; }
    setOpen(false);
    setText("");
  }

  return (
    <div>
      <Button onClick={() => setOpen(o => !o)}>Load recipe</Button>
      {open ? (
        <div className="mt-2 space-y-2 rounded-md border border-zinc-800 bg-zinc-900 p-2">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Paste a WallMyDevice recipe JSON here"
            className="h-32 w-full rounded-md border border-zinc-700 bg-zinc-950 px-2 py-1 text-xs text-zinc-100"
          />
          <div className="flex gap-2">
            <Button onClick={onLoad}>Load</Button>
            <Button onClick={() => { setOpen(false); setError(null); }}>Cancel</Button>
          </div>
          {error ? <p className="text-xs text-red-400">{error}</p> : null}
        </div>
      ) : null}
    </div>
  );
}