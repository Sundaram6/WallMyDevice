import React from "react";
import { ARCHIVE_CATEGORIES } from "@/lib/presets/archive-presets";

type Props = {
  activeCategory: string;
  onSelectCategory: (catId: string) => void;
  onOpenStudio: () => void;
};

export function ArchiveSidebar({ activeCategory, onSelectCategory, onOpenStudio }: Props) {
  return (
    <aside className="w-[240px] shrink-0 border-r border-brand-border p-7 pt-9">
      <h1 className="font-serif text-3xl font-normal leading-[1.1] text-brand-ink">
        Print Swatch<br />Archive.
      </h1>
      <p className="mt-3.5 max-w-[200px] text-xs leading-relaxed text-brand-muted">
        Curated prints inspired by textile swatches, color stories, and timeless pattern.
      </p>

      <div className="my-5 h-px w-9 bg-brand-ink/40" />

      {/* Category List */}
      <ul className="flex flex-col gap-0.5 text-xs">
        {ARCHIVE_CATEGORIES.map((cat) => {
          const isActive = activeCategory === cat.id;
          return (
            <li key={cat.id}>
              <button
                type="button"
                onClick={() => onSelectCategory(cat.id)}
                className={`flex w-full items-center justify-between rounded-md px-2 py-2 transition ${
                  isActive
                    ? "bg-brand-surface font-medium text-brand-ink"
                    : "text-brand-muted hover:text-brand-ink"
                }`}
              >
                <span>{cat.label}</span>
                <span className="font-mono text-[11px] text-brand-muted">{cat.count}</span>
              </button>
            </li>
          );
        })}
      </ul>

      {/* Studio Workspace Card */}
      <div className="mt-9 rounded-xl border border-brand-border bg-brand-surface p-4">
        <p className="font-mono text-[10px] uppercase tracking-wider text-brand-accent">
          Studio Workspace
        </p>
        <p className="mt-2 text-xs leading-relaxed text-brand-muted">
          Go beyond generation. Compose, tune, and refine in our advanced design studio.
        </p>
        <button
          type="button"
          onClick={onOpenStudio}
          className="mt-3 inline-block border-b border-brand-ink pb-0.5 text-xs font-medium text-brand-ink transition hover:text-brand-accent hover:border-brand-accent"
        >
          Open Workspace →
        </button>
      </div>

      <div className="mt-12 text-[11px] text-brand-muted">
        © 2026 WallMyDevice · Personal use
      </div>
    </aside>
  );
}
