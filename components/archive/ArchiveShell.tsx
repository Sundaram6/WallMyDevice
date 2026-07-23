import React, { useState, useEffect } from "react";
import { ArchiveTopbar } from "./ArchiveTopbar";
import { ArchiveSidebar } from "./ArchiveSidebar";
import { SwatchGrid } from "./SwatchGrid";
import { QuickGeneratePanel } from "./QuickGeneratePanel";
import { GenerateBottomSheet } from "./GenerateBottomSheet";
import { FavoritesDrawer } from "./FavoritesDrawer";
import { ARCHIVE_CATEGORIES } from "@/lib/presets/archive-presets";
import { initLibrary, subscribeLibrary, toggleFavourite } from "@/lib/storage/library";

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
  const [isFavoritesDrawerOpen, setIsFavoritesDrawerOpen] = useState(false);

  // Subscribe to persistent shared library
  useEffect(() => {
    const initial = initLibrary();
    setFavorites(new Set(initial.favourites));

    const unsub = subscribeLibrary((data) => {
      setFavorites(new Set(data.favourites));
    });
    return unsub;
  }, []);

  const handleToggleFavorite = (id: string) => {
    toggleFavourite(id);
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
        onOpenFavoritesModal={() => setIsFavoritesDrawerOpen(true)}
      />

      {/* Favorites Drawer Overlay */}
      <FavoritesDrawer
        isOpen={isFavoritesDrawerOpen}
        onClose={() => setIsFavoritesDrawerOpen(false)}
        favorites={favorites}
        onToggleFavorite={handleToggleFavorite}
        onOpenStudio={() => onTabChange("studio")}
      />

      {/* Main Studio View vs Archive View */}
      {currentTab === "studio" ? (
        <div className="relative flex h-[calc(100dvh-72px)] w-full overflow-hidden bg-[#F3EFE6]">
          {childrenStudio}
        </div>
      ) : (
        <div className="flex min-h-[calc(100dvh-72px)]">
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
            <div className="md:hidden relative border-b border-[#E4DFD3] bg-[#F3EFE6]">
              <div className="flex gap-2 overflow-x-auto p-3 no-scrollbar scroll-smooth">
                {ARCHIVE_CATEGORIES.map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setActiveCategory(cat.id)}
                    className={`flex items-center min-h-[44px] rounded-full px-4 text-xs capitalize whitespace-nowrap border shrink-0 transition ${
                      activeCategory === cat.id
                        ? "bg-[#2B2A26] text-white border-[#2B2A26] shadow-xs"
                        : "border-[#D4CDBC] text-[#5B584F] bg-white hover:text-[#2B2A26]"
                    }`}
                  >
                    <span>{cat.label}</span>
                    <span className="ml-1.5 font-mono text-[10px] opacity-75">({cat.count})</span>
                  </button>
                ))}
              </div>
              {/* Trailing edge gradient fade hint */}
              <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-[#F3EFE6] to-transparent" />
            </div>

            <SwatchGrid
              activeCategory={activeCategory}
              searchQuery={searchQuery}
              onOpenStudio={() => onTabChange("studio")}
              favorites={favorites}
              onToggleFavorite={handleToggleFavorite}
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
            className="fixed bottom-[calc(1.5rem+env(safe-area-inset-bottom,0px))] left-1/2 -translate-x-1/2 z-30 flex items-center gap-2 rounded-full bg-[#2B2A26] px-6 py-3 text-xs font-medium text-white shadow-xl hover:bg-[#1a1917]"
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
