import React from "react";

type Props = {
  currentTab: "archive" | "studio";
  onTabChange: (tab: "archive" | "studio") => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  favoriteCount: number;
};

export function ArchiveTopbar({ currentTab, onTabChange, searchQuery, onSearchChange, favoriteCount }: Props) {
  return (
    <header className="flex h-[72px] items-center justify-between border-b border-[#E4DFD3] px-6 lg:px-10 bg-[#FAF8F4]">
      {/* Brand Logo */}
      <h1 className="font-serif text-xl font-medium tracking-tight text-[#2B2A26]">
        <button
          type="button"
          onClick={() => onTabChange("archive")}
          className="focus:outline-none"
        >
          WallMyDevice
        </button>
      </h1>

      {/* Centered Navigation */}
      <nav aria-label="Main Navigation" className="hidden md:flex gap-8 text-sm text-[#5B584F]">
        <button
          type="button"
          onClick={() => onTabChange("archive")}
          className={`pb-1 transition ${
            currentTab === "archive"
              ? "font-medium text-[#2B2A26] border-b-2 border-[#C9552F]"
              : "hover:text-[#2B2A26]"
          }`}
        >
          Archive
        </button>
        <button
          type="button"
          onClick={() => onTabChange("studio")}
          className={`pb-1 transition ${
            currentTab === "studio"
              ? "font-medium text-[#2B2A26] border-b-2 border-[#C9552F]"
              : "hover:text-[#2B2A26]"
          }`}
        >
          Studio
        </button>
        <span className="cursor-not-allowed opacity-60">Collections</span>
        <span className="cursor-not-allowed opacity-60">Inspiration</span>
        <span className="cursor-not-allowed opacity-60">About</span>
      </nav>

      {/* Right Tools */}
      <div className="flex items-center gap-4">
        <div className="relative hidden sm:flex items-center">
          <span className="absolute left-3 text-xs text-[#8A8579]">🔍</span>
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search prints, palettes, moods..."
            aria-label="Search prints, palettes, moods"
            className="w-56 lg:w-64 rounded-lg border border-[#E4DFD3] bg-white py-2 pl-9 pr-3 text-xs text-[#2B2A26] placeholder-[#8A8579] focus:border-[#C9552F] focus:outline-none"
          />
        </div>
        <button
          type="button"
          aria-label="Favorites"
          className="relative flex h-[34px] w-[34px] items-center justify-center text-[#5B584F] hover:text-[#C9552F]"
        >
          ♡
          {favoriteCount > 0 && (
            <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#C9552F] text-[10px] font-medium text-white">
              {favoriteCount}
            </span>
          )}
        </button>
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#2B2A26] font-mono text-xs text-white">
          A
        </div>
      </div>
    </header>
  );
}
