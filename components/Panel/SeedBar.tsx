import { useEditorStore } from "@/store/useEditorStore";

export function SeedBar() {
  const seed = useEditorStore(s => s.seed);
  const setSeed = useEditorStore(s => s.setSeed);
  const randomizeSeed = useEditorStore(s => s.randomizeSeed);
  return (
    <div className="flex items-center gap-2">
      <input
        type="text"
        value={seed}
        onChange={(e) => setSeed(e.target.value.toLowerCase())}
        aria-label="Seed"
        className="flex-1 rounded-md border border-zinc-700 bg-zinc-900 px-2 py-1.5 text-sm text-zinc-100 focus:border-blue-500 focus:outline-none"
      />
      <button
        type="button"
        aria-label="Randomize seed"
        onClick={randomizeSeed}
        className="rounded-md bg-zinc-800 px-2 py-1.5 text-sm text-zinc-100 hover:bg-zinc-700"
      >
        d20
      </button>
    </div>
  );
}