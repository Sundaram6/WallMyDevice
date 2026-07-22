import React, { useState } from "react";
import { ArchiveTopbar } from "./ArchiveTopbar";
import { ArchiveSidebar } from "./ArchiveSidebar";
import { SwatchGrid } from "./SwatchGrid";
import { QuickGeneratePanel } from "./QuickGeneratePanel";
import { GenerateBottomSheet } from "./GenerateBottomSheet";

type Props = {
  currentTab: "archive" | "studio";
  onTabChange: (tab: "archive" | "studio") => void;
  childrenStudio?: React.ReactNode;
};

export function ArchiveShell({ currentTab, onTabChange, childrenStudio }: Props) {
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [isMobileSheetOpen, setIsMobileSheetOpen] = useState(false);

  const toggleFavorite = (id: string) => {
    setFavorites((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <div className="min-h-screen bg-[#FAF8F4] text-[#2B2A26] font-sans">
      {/* Top Bar */}
      <ArchiveTopbar
        currentTab={currentTab}
        onTabChange={onTabChange}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        favoriteCount={favorites.size}
      />

      {/* Main Studio View vs Archive View */}
      {currentTab === "studio" ? (
        <div className="relative flex h-[calc(100vh-72px)] overflow-hidden bg-[#F3EFE6]">
          {childrenStudio}
        </div>
      ) : (
        <div className="flex min-h-[calc(100vh-72px)]">
          {/* Left Archive Sidebar (Desktop/Tablet) */}
          <div className="hidden md:block">
            <ArchiveSidebar
              activeCategory={activeCategory}
              onSelectCategory={setActiveCategory}
              onOpenStudio={() => onTabChange("studio")}
            />
          </div>

          {/* Central Gallery Grid */}
          <main className="flex-1 min-w-0">
            {/* Category horizontal scroll bar on small screens */}
            <div className="md:hidden flex gap-2 overflow-x-auto p-4 border-b border-[#E4DFD3] bg-[#F3EFE6]">
              {["all", "new", "trending", "botanicals", "geometric", "monochrome"].map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setActiveCategory(cat)}
                  className={`rounded-full px-3 py-1 text-xs capitalize whitespace-nowrap border ${
                    activeCategory === cat ? "bg-[#2B2A26] text-white border-[#2B2A26]" : "border-[#D4CDBC] text-[#5B584F] bg-white"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <SwatchGrid
              activeCategory={activeCategory}
              searchQuery={searchQuery}
              onOpenStudio={() => onTabChange("studio")}
              favorites={favorites}
              onToggleFavorite={toggleFavorite}
            />
          </main>

          {/* Right Quick Generator Panel (Desktop) */}
          <div className="hidden xl:block">
            <QuickGeneratePanel onOpenStudio={() => onTabChange("studio")} />
          </div>
        </div>
      )}

      {/* Floating Trigger & Bottom Sheet for Mobile/Tablet */}
      {currentTab === "archive" && (
        <div className="xl:hidden">
          <button
            type="button"
            onClick={() => setIsMobileSheetOpen(true)}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2 rounded-full bg-[#2B2A26] px-6 py-3 text.xs font-medium text-white shadow-xl hover:bg-[#1a1917]"
          >
            ✦ Generate Wallpaper
          </button>
          <GenerateBottomSheet
            isOpen={isMobileSheetOpen}
            onClose={() => setIsMobileSheetOpen(false)}
            onOpenStudio={() => {
              setIsMobileSheetOpen(false);
              onTabChange("studio");
            }}
          />
        </div>
      )}
    </div>
  );
}
