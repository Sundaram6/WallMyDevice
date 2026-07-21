import { useState } from "react";
import { parseRecipe } from "@/lib/recipe/validate";
import { applyRecipe } from "@/lib/recipe/apply";
import { Button } from "@/components/ui/Button";

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