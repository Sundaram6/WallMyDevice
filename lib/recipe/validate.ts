import { z } from "zod";

const HEX = /^#[0-9a-fA-F]{6}$/;
const SEED = /^[0-9a-z]{1,16}$/;

export const RecipeSchema = z.object({
  v: z.literal(1),
  type: z.literal("wallmydevice/recipe"),
  generator: z.string().min(1),
  params: z.record(z.string(), z.unknown()),
  palette: z.array(z.string().regex(HEX)).min(2).max(6),
  mode: z.enum(["light", "dark", "auto"]),
  seed: z.string().regex(SEED),
  grain: z.object({ enabled: z.boolean(), intensity: z.number().min(0).max(1) }),
  blur: z.number().min(0).max(1),
  resolution: z.object({
    preset: z.string(),
    width: z.number().int().min(320).max(15360),
    height: z.number().int().min(320).max(15360),
  }),
  overlays: z.object({
    clock: z.boolean(),
    date: z.boolean(),
    text: z.boolean(),
    value: z.string().max(200),
    font: z.string().min(1),
    size: z.number().min(0.1).max(8),
  }),
});

export type Recipe = z.infer<typeof RecipeSchema>;

export function parseRecipe(json: string):
  | { ok: true; recipe: Recipe }
  | { ok: false; error: string } {
  let parsed: unknown;
  try { parsed = JSON.parse(json); }
  catch { return { ok: false, error: "Not valid JSON" }; }
  const result = RecipeSchema.safeParse(parsed);
  if (!result.success) {
    const msg = result.error.issues
      .map(i => `${i.path.join(".") || "(root)"}: ${i.message}`)
      .join("; ");
    return { ok: false, error: msg };
  }
  return { ok: true, recipe: result.data };
}
