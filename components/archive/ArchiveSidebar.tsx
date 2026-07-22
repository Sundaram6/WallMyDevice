import React from "react";
import { ARCHIVE_CATEGORIES } from "@/lib/presets/archive-presets";

type Props = {
  activeCategory: string;
  onSelectCategory: (catId: string) => void;
  onOpenStudio: () => void;
};

export function ArchiveSidebar({ activeCategory, onSelectCategory, onOpenStudio }: Props) {
  return (
    <aside className="w-[240px] shrink-0 border-r border-[#E4DFD3] p-7 pt-9">
      <h1 className="font-serif text-3xl font-normal leading-[1.1] text-[#2B2A26]">
        Print Swatch<br />Archive.
      </h1>
      <p className="mt-3.5 max-w-[200px] text-xs leading-relaxed text-[#5B584F]">
        Curated prints inspired by textile swatches, color stories, and timeless pattern.
      </p>

      <div className="my-5 h-px w-9 bg-[#2B2A26]/40" />

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
                    ? "bg-[#F3EFE6] font-medium text-[#2B2A26]"
                    : "text-[#5B584F] hover:text-[#2B2A26]"
                }`}
              >
                <span>{cat.label}</span>
                <span className="font-mono text-[11px] text-[#8A8579]">{cat.count}</span>
              </button>
            </li>
          );
        })}
      </ul>

      {/* Studio Workspace Card */}
      <div className="mt-9 rounded-xl border border-[#D4CDBC] bg-[#F3EFE6] p-4">
        <p className="font-mono text-[10px] uppercase tracking-wider text-[#C9552F]">
          Studio Workspace
        </p>
        <p className="mt-2 text-xs leading-relaxed text-[#5B584F]">
          Go beyond generation. Compose, tune, and refine in our advanced design studio.
        </p>
        <button
          type="button"
          onClick={onOpenStudio}
          className="mt-3 inline-block border-b border-[#2B2A26] pb-0.5 text-xs font-medium text-[#2B2A26] transition hover:text-[#C9552F] hover:border-[#C9552F]"
        >
          Open Workspace →
        </button>
      </div>

      <div className="mt-12 text-[11px] text-[#8A8579]">
        © 2026 WallMyDevice · Personal use
      </div>
    </aside>
  );
}
