"use client";

import { useState, useEffect } from "react";
import { ArchiveTopbar } from "@/components/archive/ArchiveTopbar";
import { ArchiveSidebar } from "@/components/archive/ArchiveSidebar";
import { SwatchGrid } from "@/components/archive/SwatchGrid";
import { QuickGeneratePanel } from "@/components/archive/QuickGeneratePanel";
import { GenerateBottomSheet } from "@/components/archive/GenerateBottomSheet";
import { FavoritesDrawer } from "@/components/archive/FavoritesDrawer";
import { ARCHIVE_CATEGORIES } from "@/lib/presets/archive-presets";
import { initLibrary, subscribeLibrary, toggleFavourite } from "@/lib/storage/library";
import { useRouter } from "next/navigation";

export default function CollectionsPage() {
  const router = useRouter();
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [isMobileSheetOpen, setIsMobileSheetOpen] = useState(false);
  const [isFavoritesDrawerOpen, setIsFavoritesDrawerOpen] = useState(false);

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

  const handleOpenStudio = () => {
    router.push("/studio");
  };

  return (
    <div className="min-h-screen bg-paper-50 text-ink-900 font-sans">
      <ArchiveTopbar
        activeRoute="collections"
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        favoriteCount={favorites.size}
        onOpenFavoritesModal={() => setIsFavoritesDrawerOpen(true)}
      />

      <FavoritesDrawer
        isOpen={isFavoritesDrawerOpen}
        onClose={() => setIsFavoritesDrawerOpen(false)}
        favorites={favorites}
        onToggleFavorite={handleToggleFavorite}
        onOpenStudio={handleOpenStudio}
      />

      <div className="flex min-h-[calc(100dvh-72px)]">
        <div className="hidden md:block">
          <ArchiveSidebar
            activeCategory={activeCategory}
            onSelectCategory={setActiveCategory}
            onOpenStudio={handleOpenStudio}
          />
        </div>

        <main className="flex-1 min-w-0">
          <div className="md:hidden relative border-b border-paper-300 bg-paper-100">
            <div className="flex gap-2 overflow-x-auto p-3 no-scrollbar scroll-smooth">
              {ARCHIVE_CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setActiveCategory(cat.id)}
                  className={`flex items-center min-h-[44px] rounded-full px-4 text-xs capitalize whitespace-nowrap border shrink-0 transition duration-[--dur-fast] ${
                    activeCategory === cat.id
                      ? "bg-ink-900 text-paper-0 border-ink-900 shadow-1 font-semibold"
                      : "border-paper-300 text-ink-500 bg-paper-50 hover:text-ink-900"
                  }`}
                >
                  <span>{cat.label}</span>
                  <span className="ml-1.5 font-mono text-[10px] opacity-75">({cat.count})</span>
                </button>
              ))}
            </div>
            <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-paper-100 to-transparent" />
          </div>

          <SwatchGrid
            activeCategory={activeCategory}
            searchQuery={searchQuery}
            onOpenStudio={handleOpenStudio}
            favorites={favorites}
            onToggleFavorite={handleToggleFavorite}
          />
        </main>

        <div className="hidden xl:block">
          <QuickGeneratePanel onOpenStudio={handleOpenStudio} />
        </div>
      </div>

      <div className="xl:hidden">
        <button
          type="button"
          onClick={() => setIsMobileSheetOpen(true)}
          className="fixed bottom-[calc(1.5rem+env(safe-area-inset-bottom,0px))] left-1/2 -translate-x-1/2 z-30 flex items-center gap-2 rounded-full bg-ink-900 px-6 py-3 text-xs font-medium text-paper-0 shadow-2 hover:bg-accent-500 transition-colors duration-[--dur-fast]"
        >
          ✦ Generate Wallpaper
        </button>
        <GenerateBottomSheet
          isOpen={isMobileSheetOpen}
          onClose={() => setIsMobileSheetOpen(false)}
          onOpenStudio={() => {
            setIsMobileSheetOpen(false);
            handleOpenStudio();
          }}
        />
      </div>
    </div>
  );
}
