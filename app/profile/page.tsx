"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArchiveTopbar } from "@/components/archive/ArchiveTopbar";
import { useRouter } from "next/navigation";
import { ARCHIVE_PRESETS } from "@/lib/presets/archive-presets";
import {
  initLibrary,
  subscribeLibrary,
  setProfileName,
  toggleFavourite,
  createWishlist,
  deleteWishlist,
  type LibraryData,
} from "@/lib/storage/library";

function FavouriteCard({ id, onRemove }: { id: string; onRemove: () => void }) {
  const swatch = ARCHIVE_PRESETS.find((p) => p.id === id);
  const router = useRouter();
  if (!swatch) return null;
  return (
    <div className="group flex items-center gap-3 rounded-xl border border-[#E4DFD3] bg-white p-3 shadow-xs">
      <div
        className="h-10 w-10 shrink-0 rounded-lg border border-black/10"
        style={{
          background: `linear-gradient(135deg, ${swatch.palette[0]} 0%, ${swatch.palette[swatch.palette.length - 1]} 100%)`,
        }}
      />
      <div className="min-w-0 flex-1">
        <p className="truncate text-xs font-medium text-[#2B2A26]">{swatch.name}</p>
        <p className="text-[10px] text-[#8A8579]">{swatch.category}</p>
      </div>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => router.push("/")}
          className="text-[10px] text-[#C9552F] hover:underline"
        >
          Open
        </button>
        <button
          type="button"
          onClick={onRemove}
          className="text-[10px] text-[#8A8579] hover:text-red-500"
        >
          ✕
        </button>
      </div>
    </div>
  );
}

export default function ProfilePage() {
  const [tab, setTab] = useState<"archive" | "studio">("archive");
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  const [lib, setLib] = useState<LibraryData | null>(null);
  const [nameInput, setNameInput] = useState("");
  const [activeTab, setActiveTab] = useState<"favourites" | "recipes" | "recentViewed" | "recentGenerated" | "wishlists">("favourites");
  const [newWishlistName, setNewWishlistName] = useState("");

  useEffect(() => {
    const initial = initLibrary();
    setLib(initial);
    if (initial.profileName) {
      setNameInput(initial.profileName);
    }
    const unsub = subscribeLibrary((data) => {
      setLib(data);
    });
    return unsub;
  }, []);

  function handleSaveName() {
    if (!nameInput.trim()) return;
    setProfileName(nameInput.trim());
  }

  function handleCreateWishlist() {
    if (!newWishlistName.trim()) return;
    createWishlist(newWishlistName.trim());
    setNewWishlistName("");
  }

  const userDisplayName = lib?.profileName || "Local User";
  const initials = userDisplayName.slice(0, 2).toUpperCase();

  return (
    <div className="min-h-screen bg-[#FAF8F4] text-[#2B2A26] font-sans">
      <ArchiveTopbar
        currentTab={tab}
        onTabChange={(t) => {
          if (t === "studio") router.push("/");
          else setTab(t);
        }}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        favoriteCount={lib?.favourites.length ?? 0}
      />

      <main className="flex min-h-[calc(100vh-72px)] items-start justify-center px-4 sm:px-6 py-8 sm:py-12">
        <div className="w-full max-w-3xl space-y-6">
          {/* Profile Header */}
          <div className="rounded-2xl border border-[#E4DFD3] bg-white p-6 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#2B2A26] font-mono text-xl text-white">
                {initials}
              </div>
              <div>
                <h1 className="font-serif text-xl font-medium text-[#2B2A26]">{userDisplayName}</h1>
                <p className="text-xs text-[#8A8579]">Local profile · Saved on this device</p>
                <div className="mt-1.5 flex flex-wrap gap-2 text-[11px] text-[#5B584F]">
                  <span>{lib?.favourites.length ?? 0} favourites</span>
                  <span>·</span>
                  <span>{lib?.recentlyGenerated.length ?? 0} generated</span>
                  <span>·</span>
                  <span>{lib?.wishlists.length ?? 0} wishlists</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <input
                type="text"
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                placeholder="Set display name"
                className="rounded-xl border border-[#D4CDBC] bg-[#FAF8F4] px-3 py-2 text-xs text-[#2B2A26] focus:border-[#C9552F] focus:outline-none"
              />
              <button
                type="button"
                onClick={handleSaveName}
                className="rounded-xl bg-[#2B2A26] px-3.5 py-2 text-xs font-medium text-white hover:bg-[#1a1917]"
              >
                Save
              </button>
            </div>
          </div>

          {/* Section Tabs */}
          <div className="flex overflow-x-auto gap-1 rounded-xl border border-[#E4DFD3] bg-white p-1 shadow-xs no-scrollbar">
            {[
              { id: "favourites", label: `♥ Favourites (${lib?.favourites.length ?? 0})` },
              { id: "recentGenerated", label: `✦ Generated (${lib?.recentlyGenerated.length ?? 0})` },
              { id: "recentViewed", label: `👁 Recently Viewed (${lib?.recentlyViewed.length ?? 0})` },
              { id: "wishlists", label: `📋 Wishlists (${lib?.wishlists.length ?? 0})` },
            ].map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setActiveTab(t.id as any)}
                className={`flex-1 min-w-[120px] rounded-lg py-2 px-3 text-xs font-medium whitespace-nowrap transition ${
                  activeTab === t.id ? "bg-[#2B2A26] text-white shadow-xs" : "text-[#5B584F] hover:text-[#2B2A26]"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* Favourites View */}
          {activeTab === "favourites" && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="font-serif text-base font-medium text-[#2B2A26]">Saved Favourites</h2>
                <Link href="/" className="text-xs text-[#C9552F] hover:underline">
                  Browse archive to add →
                </Link>
              </div>
              {!lib?.favourites || lib.favourites.length === 0 ? (
                <div className="rounded-xl border border-dashed border-[#D4CDBC] bg-white py-12 text-center">
                  <p className="text-sm text-[#8A8579]">No favourites saved on this device yet.</p>
                  <p className="mt-1 text-xs text-[#8A8579]">Click ♡ on any archive wallpaper to save it here.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {lib.favourites.map((id) => (
                    <FavouriteCard key={id} id={id} onRemove={() => toggleFavourite(id)} />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Recently Generated View */}
          {activeTab === "recentGenerated" && (
            <div className="space-y-3">
              <h2 className="font-serif text-base font-medium text-[#2B2A26]">Recently Generated Recipes</h2>
              {!lib?.recentlyGenerated || lib.recentlyGenerated.length === 0 ? (
                <div className="rounded-xl border border-dashed border-[#D4CDBC] bg-white py-12 text-center">
                  <p className="text-sm text-[#8A8579]">No generated wallpapers recorded yet.</p>
                  <p className="mt-1 text-xs text-[#8A8579]">Click Generate Wallpaper in the Studio to create patterns.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {lib.recentlyGenerated.map((r, idx) => (
                    <div key={idx} className="rounded-xl border border-[#E4DFD3] bg-white p-3 shadow-xs flex items-center justify-between">
                      <div>
                        <p className="text-xs font-medium text-[#2B2A26]">{r.name}</p>
                        <p className="text-[10px] text-[#8A8579]">
                          {r.generatorId} · seed: {r.seed}
                        </p>
                      </div>
                      <div className="flex gap-1">
                        {r.palette.slice(0, 4).map((c, i) => (
                          <div key={i} style={{ backgroundColor: c }} className="h-4 w-4 rounded-full border border-black/10" />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Recently Viewed View */}
          {activeTab === "recentViewed" && (
            <div className="space-y-3">
              <h2 className="font-serif text-base font-medium text-[#2B2A26]">Recently Viewed Wallpapers</h2>
              {!lib?.recentlyViewed || lib.recentlyViewed.length === 0 ? (
                <div className="rounded-xl border border-dashed border-[#D4CDBC] bg-white py-12 text-center">
                  <p className="text-sm text-[#8A8579]">No recently viewed prints.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {lib.recentlyViewed.map((id) => (
                    <FavouriteCard key={id} id={id} onRemove={() => {}} />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Wishlists View */}
          {activeTab === "wishlists" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="font-serif text-base font-medium text-[#2B2A26]">My Wishlists</h2>
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newWishlistName}
                  onChange={(e) => setNewWishlistName(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleCreateWishlist()}
                  placeholder="New wishlist name…"
                  maxLength={40}
                  className="flex-1 rounded-xl border border-[#D4CDBC] bg-white px-4 py-2.5 text-xs text-[#2B2A26] placeholder-[#8A8579] focus:border-[#C9552F] focus:outline-none"
                />
                <button
                  type="button"
                  onClick={handleCreateWishlist}
                  disabled={!newWishlistName.trim()}
                  className="rounded-xl bg-[#2B2A26] px-4 py-2.5 text-xs font-medium text-white hover:bg-[#1a1917] disabled:opacity-40 transition"
                >
                  + Create
                </button>
              </div>

              {!lib?.wishlists || lib.wishlists.length === 0 ? (
                <div className="rounded-xl border border-dashed border-[#D4CDBC] bg-white py-12 text-center">
                  <p className="text-sm text-[#8A8579]">No wishlists created yet.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-3">
                  {lib.wishlists.map((wl) => (
                    <div key={wl.id} className="rounded-xl border border-[#E4DFD3] bg-white p-4 shadow-xs flex items-center justify-between">
                      <div>
                        <h3 className="font-medium text-sm text-[#2B2A26]">{wl.name}</h3>
                        <p className="text-[10px] text-[#8A8579]">{wl.itemIds.length} items</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => deleteWishlist(wl.id)}
                        className="text-xs text-[#8A8579] hover:text-red-500"
                      >
                        Delete
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
