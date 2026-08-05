"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSafeSession } from "@/lib/auth-client";
import { ArchiveTopbar } from "@/components/archive/ArchiveTopbar";
import { AuthModal } from "@/components/auth/AuthModal";
import { triggerSingleExport } from "@/lib/export/actions";
import { useEditorStore } from "@/store/useEditorStore";
import { Trash2, ExternalLink, Download, Sparkles, Heart } from "lucide-react";

type SavedItem = {
  id: string;
  userId: string;
  title?: string;
  recipe: {
    generatorId: string;
    seed: string;
    palette: string[];
    params: Record<string, unknown>;
  };
  deviceType: string;
  createdAt: string;
};

export default function SavedWallpapersPage() {
  const router = useRouter();
  const { data: session, status } = useSafeSession();
  const [savedItems, setSavedItems] = useState<SavedItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [authModalOpen, setAuthModalOpen] = useState(false);

  const setGenerator = useEditorStore((s) => s.setGenerator);
  const setSeed = useEditorStore((s) => s.setSeed);
  const setPalette = useEditorStore((s) => s.setPalette);
  const setDeviceType = useEditorStore((s) => s.setDeviceType);
  const updateParam = useEditorStore((s) => s.updateParam);

  useEffect(() => {
    if (status === "unauthenticated") {
      setLoading(false);
      return;
    }

    if (status === "authenticated") {
      fetchSavedItems();
    }
  }, [status]);

  async function fetchSavedItems() {
    setLoading(true);
    try {
      const res = await fetch("/api/favorites");
      if (res.ok) {
        const data = await res.json();
        setSavedItems(data);
      }
    } catch (err) {
      console.error("Failed to load saved wallpapers:", err);
    } finally {
      setLoading(false);
    }
  }

  async function handleRemove(id: string) {
    try {
      const res = await fetch(`/api/favorites?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        setSavedItems((prev) => prev.filter((item) => item.id !== id));
      }
    } catch (err) {
      console.error("Failed to delete favorite wallpaper:", err);
    }
  }

  function handleLoadInStudio(item: SavedItem) {
    const r = item.recipe;
    setGenerator(r.generatorId);
    setSeed(r.seed);
    setPalette(r.palette);
    if (item.deviceType) setDeviceType(item.deviceType as any);

    if (r.params) {
      Object.entries(r.params).forEach(([k, v]) => {
        updateParam(r.generatorId, k, v);
      });
    }

    const paletteParam = r.palette.map((c) => c.replace("#", "")).join("-");
    router.push(`/studio?g=${r.generatorId}&s=${r.seed}&p=${paletteParam}&d=${item.deviceType || "desktop"}`);
  }

  function handleExport(item: SavedItem) {
    const r = item.recipe;
    setGenerator(r.generatorId);
    setSeed(r.seed);
    setPalette(r.palette);
    if (r.params) {
      Object.entries(r.params).forEach(([k, v]) => {
        updateParam(r.generatorId, k, v);
      });
    }
    triggerSingleExport();
  }

  const filteredItems = savedItems.filter((item) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    const g = item.recipe.generatorId.toLowerCase();
    const s = item.recipe.seed.toLowerCase();
    const t = (item.title || "").toLowerCase();
    return g.includes(q) || s.includes(q) || t.includes(q);
  });

  return (
    <div className="min-h-screen bg-paper-50 text-ink-900 font-sans select-none">
      <ArchiveTopbar
        activeRoute="archive"
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        favoriteCount={savedItems.length}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Page Header */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-paper-200 pb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-accent-500 font-serif italic text-xl">✦</span>
              <h1 className="font-serif text-3xl font-medium tracking-tight text-ink-900">
                Saved Wallpapers
              </h1>
            </div>
            <p className="text-xs text-ink-500">
              Your personal library of custom procedural recipes, seeds, and color palettes.
            </p>
          </div>

          <Link
            href="/studio"
            className="inline-flex items-center gap-1.5 rounded-full bg-ink-900 px-5 py-2.5 text-xs font-medium text-white shadow-1 hover:bg-accent-500 transition-all"
          >
            <Sparkles size={14} className="text-accent-500 group-hover:text-white" />
            <span>Create New in Studio</span>
          </Link>
        </div>

        {/* Content Section */}
        {status === "unauthenticated" ? (
          <div className="rounded-2xl border border-dashed border-paper-300 bg-white py-16 px-6 text-center max-w-md mx-auto">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-accent-500/10 text-accent-500">
              <Heart size={24} />
            </div>
            <h2 className="font-serif text-xl font-medium text-ink-900">Sign in to view saved wallpapers</h2>
            <p className="mt-1 text-xs text-ink-500 mb-6">
              Create an account or sign in to persist your favorite wallpaper recipes across devices.
            </p>
            <button
              type="button"
              onClick={() => setAuthModalOpen(true)}
              className="rounded-xl bg-accent-500 px-6 py-2.5 text-xs font-semibold text-white shadow-1 hover:bg-accent-600 transition-all cursor-pointer"
            >
              Sign In / Create Account
            </button>
          </div>
        ) : loading ? (
          <div className="py-20 text-center text-xs font-mono text-ink-400 animate-pulse">
            Loading saved recipes…
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-paper-300 bg-white py-16 px-6 text-center max-w-md mx-auto">
            <p className="text-sm font-medium text-ink-900">No saved wallpapers yet</p>
            <p className="mt-1 text-xs text-ink-500 mb-6">
              Click the ♡ Save button in the Studio toolbar to add recipes to your library.
            </p>
            <Link
              href="/studio"
              className="inline-block rounded-xl bg-ink-900 px-5 py-2.5 text-xs font-medium text-white hover:bg-accent-500 transition-all"
            >
              Open Studio →
            </Link>
          </div>
        ) : (
          <div data-testid="saved-grid" className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {filteredItems.map((item) => {
              const r = item.recipe;
              const paletteColors = Array.isArray(r.palette) ? r.palette : ["#0f172a", "#f59e0b"];

              return (
                <div
                  key={item.id}
                  data-testid="saved-wallpaper-card"
                  className="group relative flex flex-col overflow-hidden rounded-2xl border border-paper-200 bg-white shadow-xs hover:shadow-1 transition-all duration-[--dur-fast]"
                >
                  {/* Visual Swatch / Thumbnail Header */}
                  <div
                    className="relative aspect-[3/4] w-full overflow-hidden border-b border-paper-200"
                    style={{
                      background: `linear-gradient(135deg, ${paletteColors[0]} 0%, ${
                        paletteColors[Math.floor(paletteColors.length / 2)] || paletteColors[0]
                      } 50%, ${paletteColors[paletteColors.length - 1]} 100%)`,
                    }}
                  >
                    {/* Floating Overlay Badge */}
                    <div className="absolute top-3 left-3 rounded-md bg-black/60 backdrop-blur-md px-2 py-1 text-[10px] font-mono text-white tracking-wide uppercase">
                      {r.generatorId}
                    </div>

                    {/* Quick Load Studio Hover Action */}
                    <div className="absolute inset-0 bg-ink-900/40 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-[--dur-fast] flex items-center justify-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleLoadInStudio(item)}
                        className="rounded-xl bg-white px-3.5 py-2 text-xs font-medium text-ink-900 shadow-2 hover:bg-accent-500 hover:text-white transition-all flex items-center gap-1.5 cursor-pointer"
                      >
                        <ExternalLink size={14} />
                        <span>Load in Studio</span>
                      </button>
                    </div>
                  </div>

                  {/* Card Content & Details */}
                  <div className="p-4 flex flex-col flex-1 justify-between gap-3">
                    <div>
                      <h3 className="font-serif text-sm font-medium text-ink-900 truncate">
                        {item.title || `${r.generatorId} wallpaper`}
                      </h3>
                      <p className="text-[11px] font-mono text-ink-500 mt-0.5">
                        seed: {r.seed} · {item.deviceType || "desktop"}
                      </p>
                      {/* Palette Swatches */}
                      <div className="mt-2.5 flex items-center gap-1.5">
                        {paletteColors.slice(0, 5).map((c, i) => (
                          <div
                            key={i}
                            style={{ backgroundColor: c }}
                            className="h-3.5 w-3.5 rounded-full border border-black/10 shadow-xs"
                          />
                        ))}
                      </div>
                    </div>

                    {/* Actions Bar */}
                    <div className="flex items-center justify-between pt-2 border-t border-paper-100">
                      <button
                        type="button"
                        onClick={() => handleExport(item)}
                        title="Download image"
                        className="flex items-center gap-1 text-[11px] font-medium text-ink-700 hover:text-accent-500 transition-colors cursor-pointer"
                      >
                        <Download size={13} />
                        <span>Export</span>
                      </button>

                      <button
                        type="button"
                        data-testid="remove-saved-button"
                        onClick={() => handleRemove(item.id)}
                        title="Remove from saved"
                        className="flex items-center gap-1 text-[11px] font-medium text-ink-400 hover:text-red-500 transition-colors cursor-pointer"
                      >
                        <Trash2 size={13} />
                        <span>Remove</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        onSuccess={() => fetchSavedItems()}
      />
    </div>
  );
}
