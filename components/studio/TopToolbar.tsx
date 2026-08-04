"use client";

export function TopToolbar() {
  return (
    <header
      className="flex h-12 w-full shrink-0 items-center justify-between px-4 text-xs select-none z-20 shadow-1 border-b border-paper-200"
      style={{
        background: "var(--paper-50)",
        color: "var(--ink-900)",
      }}
    >
      {/* ── Left: App Brand & Version ────────────────────────────────────── */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 font-serif font-semibold tracking-tight text-sm text-ink-900">
          <span className="text-accent-500">✦</span>
          <span>WallMyDevice</span>
          <span className="rounded bg-paper-100 px-1.5 py-0.5 font-mono text-[9.5px] text-ink-500 border border-paper-300">
            v2.1
          </span>
        </div>
      </div>

      {/* ── Center: Quick Search Bar ──────────────────────────────────────── */}
      <div className="hidden sm:flex items-center gap-2 rounded-lg bg-paper-100 border border-paper-300 px-3 py-1 text-ink-500 font-mono text-[11px]">
        <span>🔍 Search tools, devices, presets…</span>
        <kbd className="rounded bg-paper-50 px-1 py-0.5 text-[9px] text-ink-500 border border-paper-300">
          ⌘K
        </kbd>
      </div>

      {/* ── Right: Theme Toggle ───────────────────────────────────────────── */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => {
            const currentTheme = (typeof document !== "undefined" && document.documentElement.getAttribute("data-theme")) || "dark";
            const nextTheme = currentTheme === "dark" ? "light" : "dark";
            if (typeof document !== "undefined") {
              document.documentElement.setAttribute("data-theme", nextTheme);
              try { localStorage.setItem("wmd-theme", nextTheme); } catch {}
            }
          }}
          title="Toggle UI Chrome Theme (Light/Dark)"
          className="rounded-lg p-2 hover:bg-paper-100 border border-paper-300 transition-colors duration-[--dur-fast] text-ink-900 cursor-pointer"
        >
          <span>🌙</span>
        </button>
      </div>
    </header>
  );
}
