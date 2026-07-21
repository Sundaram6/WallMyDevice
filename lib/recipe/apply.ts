import { useEditorStore } from "@/store/useEditorStore";
import { DEVICE_PRESETS } from "@/lib/devices/presets";
import { getGenerator } from "@/lib/generators";
import type { Recipe } from "@/lib/recipe/validate";

export function applyRecipe(recipe: Recipe): { ok: true } | { ok: false; error: string } {
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
