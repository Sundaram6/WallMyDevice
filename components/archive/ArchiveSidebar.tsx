import React from "react";
import { ARCHIVE_CATEGORIES } from "@/lib/presets/archive-presets";

type Props = {
  activeCategory: string;
  onSelectCategory: (catId: string) => void;
  onOpenStudio: () => void;
};

export function ArchiveSidebar({ activeCategory, onSelectCategory, onOpenStudio }: Props) {
  return (
    <aside className="w-[240px] shrink-0 border-r border-paper-300 bg-paper-100 p-7 pt-9">
      <h1 className="font-serif text-3xl font-normal leading-[1.1] text-ink-900">
        Print Swatch<br />Archive.
      </h1>
      <p className="mt-3.5 max-w-[200px] text-xs leading-relaxed text-ink-500">
        Curated prints inspired by textile swatches, color stories, and timeless pattern.
      </p>

      <div className="my-5 h-px w-9 bg-ink-900/40" />

      {/* Category List */}
      <ul className="flex flex-col gap-0.5 text-xs">
        {ARCHIVE_CATEGORIES.map((cat) => {
          const isActive = activeCategory === cat.id;
          return (
            <li key={cat.id}>
              <button
                type="button"
                onClick={() => onSelectCategory(cat.id)}
                className={`flex w-full items-center justify-between rounded-md px-2 py-2 transition-all duration-[--dur-fast] ${
                  isActive
                    ? "bg-ink-900 font-semibold text-paper-0 shadow-1"
                    : "text-ink-500 hover:text-ink-900 hover:bg-paper-200"
                }`}
              >
                <span>{cat.label}</span>
                <span className={`font-mono text-[11px] ${isActive ? "text-paper-0/80" : "text-ink-500"}`}>{cat.count}</span>
              </button>
            </li>
          );
        })}
      </ul>

      {/* Studio Workspace Card */}
      <div className="mt-9 rounded-xl border border-paper-300 bg-paper-0 p-4 shadow-1">
        <p className="font-mono text-[10px] uppercase tracking-wider text-accent-500">
          Studio Workspace
        </p>
        <p className="mt-2 text-xs leading-relaxed text-ink-500">
          Go beyond generation. Compose, tune, and refine in our advanced design studio.
        </p>
        <button
          type="button"
          onClick={onOpenStudio}
          className="mt-3 inline-block border-b border-ink-900 pb-0.5 text-xs font-medium text-ink-900 transition hover:text-accent-500 hover:border-accent-500"
        >
          Open Workspace →
        </button>
      </div>

      <div className="mt-12 text-[11px] text-ink-500">
        © 2026 WallMyDevice · Personal use
      </div>
    </aside>
  );
}
