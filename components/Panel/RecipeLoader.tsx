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
    <div className="pt-1">
      <Button variant="secondary" className="w-full text-xs" onClick={() => setOpen(o => !o)}>
        {open ? "Close Recipe Import" : "Load recipe"}
      </Button>
      {open ? (
        <div className="mt-2 space-y-2 rounded-xl border border-[#E4DFD3] bg-white p-3 shadow-xs">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Paste a WallMyDevice recipe JSON here..."
            className="h-32 w-full rounded-lg border border-[#D4CDBC] bg-[#FAF8F4] p-2 text-xs font-mono text-[#2B2A26] focus:border-[#C9552F] focus:outline-none"
          />
          <div className="flex gap-2">
            <Button variant="primary" className="flex-1" onClick={onLoad}>Load</Button>
            <Button variant="secondary" onClick={() => { setOpen(false); setError(null); }}>Cancel</Button>
          </div>
          {error ? <p className="text-xs text-red-500 font-mono mt-1">{error}</p> : null}
        </div>
      ) : null}
    </div>
  );
}