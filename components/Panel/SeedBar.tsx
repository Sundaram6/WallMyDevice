import { useEditorStore } from "@/store/useEditorStore";

export function SeedBar() {
  const seed = useEditorStore((s) => s.seed);
  const setSeed = useEditorStore((s) => s.setSeed);
  const randomizeSeed = useEditorStore((s) => s.randomizeSeed);
  const seedLocked = useEditorStore((s) => s.seedLocked);
  const toggleSeedLock = useEditorStore((s) => s.toggleSeedLock);

  return (
    <div className="flex items-center gap-2">
      <input
        type="text"
        value={seed}
        onChange={(e) => setSeed(e.target.value.toLowerCase())}
        aria-label="Seed"
        className={`flex-1 rounded-lg border px-3 py-2 text-xs font-mono min-h-[44px] focus:outline-none transition ${
          seedLocked
            ? "border-accent-500/60 bg-accent-500/10 text-accent-500"
            : "border-paper-300 bg-paper-0 text-ink-900 focus:border-accent-500"
        }`}
      />
      <button
        type="button"
        onClick={toggleSeedLock}
        aria-label={seedLocked ? "Unlock Seed" : "Lock Seed"}
        title={seedLocked ? "Seed is locked" : "Lock seed against randomization"}
        className={`flex min-h-[44px] min-w-[44px] items-center justify-center rounded-lg border text-xs transition ${
          seedLocked
            ? "border-accent-500 bg-accent-500/20 text-accent-500"
            : "border-paper-300 bg-paper-50 text-ink-700 hover:bg-paper-100 hover:text-ink-900"
        }`}
      >
        {seedLocked ? (
          <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
            <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"/>
          </svg>
        ) : (
          <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
            <path d="M12 17c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm6-9h-1V6c0-2.76-2.24-5-5-5-2.28 0-4.27 1.54-4.84 3.75-.14.54.18 1.08.72 1.23.54.14 1.08-.18 1.23-.72C9.44 3.93 10.61 3 12 3c1.66 0 3 1.34 3 3v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm0 12H6V10h12v10z"/>
          </svg>
        )}
      </button>
      <button
        type="button"
        aria-label="Randomize seed"
        onClick={randomizeSeed}
        title="Generate new seed"
        className="flex min-h-[44px] px-3 items-center justify-center gap-1.5 rounded-lg border border-paper-300 bg-paper-50 text-xs font-mono text-ink-900 hover:bg-paper-100 transition"
      >
        <span>✦</span>
        <span>Seed</span>
      </button>
    </div>
  );
}