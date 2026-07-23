"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArchiveTopbar } from "@/components/archive/ArchiveTopbar";
import { useRouter } from "next/navigation";
import { ARCHIVE_PRESETS } from "@/lib/presets/archive-presets";

// ─── Types ────────────────────────────────────────────────────────────────────
type GuestUser = {
  name: string;
  createdAt: string;
  favourites: string[];       // swatch ids
  wishlists: Wishlist[];
};

type Wishlist = {
  id: string;
  name: string;
  itemIds: string[];
  createdAt: string;
};

const STORAGE_KEY = "wallmydevice:guestUser";

function loadUser(): GuestUser | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as GuestUser;
  } catch {
    return null;
  }
}

function saveUser(user: GuestUser) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
  } catch {}
}

function clearUser() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {}
}

// ─── Sub-components ───────────────────────────────────────────────────────────
function FavouriteCard({ id, onRemove }: { id: string; onRemove: () => void }) {
  const swatch = ARCHIVE_PRESETS.find(p => p.id === id);
  const router = useRouter();
  if (!swatch) return null;
  return (
    <div className="group flex items-center gap-3 rounded-xl border border-[#E4DFD3] bg-white p-3 shadow-sm">
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
      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition">
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

// ─── Main page ────────────────────────────────────────────────────────────────
export default function SignInPage() {
  const [tab, setTab] = useState<"archive" | "studio">("archive");
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  const [user, setUser] = useState<GuestUser | null>(null);
  const [nameInput, setNameInput] = useState("");
  const [view, setView] = useState<"landing" | "profile" | "wishlists">("landing");
  const [newWishlistName, setNewWishlistName] = useState("");
  const [editingWishlist, setEditingWishlist] = useState<string | null>(null);

  // Load on mount
  useEffect(() => {
    const saved = loadUser();
    if (saved) {
      setUser(saved);
      setView("profile");
    }
  }, []);

  function handleSignIn() {
    if (!nameInput.trim()) return;
    const newUser: GuestUser = {
      name: nameInput.trim(),
      createdAt: new Date().toISOString(),
      favourites: [],
      wishlists: [],
    };
    saveUser(newUser);
    setUser(newUser);
    setView("profile");
  }

  function handleSignOut() {
    clearUser();
    setUser(null);
    setNameInput("");
    setView("landing");
  }

  function addWishlist() {
    if (!newWishlistName.trim() || !user) return;
    const updated: GuestUser = {
      ...user,
      wishlists: [
        ...user.wishlists,
        {
          id: Date.now().toString(36),
          name: newWishlistName.trim(),
          itemIds: [],
          createdAt: new Date().toISOString(),
        },
      ],
    };
    saveUser(updated);
    setUser(updated);
    setNewWishlistName("");
  }

  function removeWishlist(id: string) {
    if (!user) return;
    const updated = { ...user, wishlists: user.wishlists.filter(w => w.id !== id) };
    saveUser(updated);
    setUser(updated);
  }

  function removeFavourite(itemId: string) {
    if (!user) return;
    const updated = { ...user, favourites: user.favourites.filter(f => f !== itemId) };
    saveUser(updated);
    setUser(updated);
  }

  const initials = user ? user.name.slice(0, 2).toUpperCase() : "?";

  // ─── Landing / Sign-in ──────────────────────────────────────────────────────
  const landingView = (
    <div className="w-full max-w-md">
      <div className="rounded-2xl border border-[#E4DFD3] bg-white p-8 shadow-sm">
        <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-[#F3EFE6] text-2xl">
          👤
        </div>
        <h1 className="text-center font-serif text-2xl font-medium text-[#2B2A26]">
          Create Your Profile
        </h1>
        <p className="mt-2 text-center text-xs text-[#5B584F] leading-relaxed">
          Sign in with a display name to save favourites, create wishlists, and keep your generated wallpapers organised. Everything stays local — no account required.
        </p>

        {/* Name input */}
        <div className="mt-6 space-y-3">
          <input
            type="text"
            value={nameInput}
            onChange={e => setNameInput(e.target.value)}
            onKeyDown={e => e.key === "Enter" && handleSignIn()}
            placeholder="Your display name"
            maxLength={32}
            className="w-full rounded-xl border border-[#D4CDBC] bg-[#FAF8F4] px-4 py-3 text-sm text-[#2B2A26] placeholder-[#8A8579] focus:border-[#C9552F] focus:outline-none"
          />
          <button
            type="button"
            disabled={!nameInput.trim()}
            onClick={handleSignIn}
            className="w-full rounded-xl bg-[#2B2A26] py-3 text-xs font-medium text-white shadow transition hover:bg-[#1a1917] disabled:opacity-40"
          >
            Sign in as Guest →
          </button>
        </div>

        {/* Features */}
        <div className="mt-6 space-y-2">
          {[
            ["♥", "Save wallpapers to Favourites"],
            ["📋", "Organise with Wishlists"],
            ["🎨", "Generate & store custom wallpapers"],
            ["🔒", "100% local — no server, no account"],
          ].map(([icon, text]) => (
            <div key={text} className="flex items-center gap-2 text-xs text-[#5B584F]">
              <span>{icon}</span>
              <span>{text}</span>
            </div>
          ))}
        </div>

        <p className="mt-6 text-center text-[10px] text-[#8A8579]">
          Your data is saved in your browser's localStorage only.
        </p>
      </div>

      <p className="mt-4 text-center text-xs text-[#8A8579]">
        Already exploring?{" "}
        <Link href="/" className="text-[#C9552F] hover:underline">
          Back to Archive →
        </Link>
      </p>
    </div>
  );

  // ─── Profile view ───────────────────────────────────────────────────────────
  const profileView = user && (
    <div className="w-full max-w-2xl">
      {/* Profile header */}
      <div className="mb-6 flex items-center justify-between rounded-2xl border border-[#E4DFD3] bg-white p-6 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#2B2A26] font-mono text-xl text-white">
            {initials}
          </div>
          <div>
            <h1 className="font-serif text-xl font-medium text-[#2B2A26]">{user.name}</h1>
            <p className="text-xs text-[#8A8579]">
              Guest profile · since {new Date(user.createdAt).toLocaleDateString()}
            </p>
            <div className="mt-1 flex gap-3 text-[11px] text-[#5B584F]">
              <span>{user.favourites.length} favourites</span>
              <span>·</span>
              <span>{user.wishlists.length} wishlists</span>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <Link
            href="/"
            className="rounded-xl border border-[#D4CDBC] px-4 py-2 text-xs font-medium text-[#5B584F] hover:bg-[#F3EFE6] transition"
          >
            Studio →
          </Link>
          <button
            type="button"
            onClick={handleSignOut}
            className="rounded-xl border border-red-200 px-4 py-2 text-xs font-medium text-red-500 hover:bg-red-50 transition"
          >
            Sign Out
          </button>
        </div>
      </div>

      {/* Tab switcher */}
      <div className="mb-4 flex gap-1 rounded-xl border border-[#E4DFD3] bg-white p-1 shadow-sm">
        {(["profile", "wishlists"] as const).map(v => (
          <button
            key={v}
            type="button"
            onClick={() => setView(v)}
            className={`flex-1 rounded-lg py-2 text-xs font-medium capitalize transition ${
              view === v
                ? "bg-[#2B2A26] text-white shadow"
                : "text-[#5B584F] hover:text-[#2B2A26]"
            }`}
          >
            {v === "profile" ? "♥ Favourites" : "📋 Wishlists"}
          </button>
        ))}
      </div>

      {/* Favourites panel */}
      {view === "profile" && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="font-serif text-base font-medium text-[#2B2A26]">Saved Favourites</h2>
            <Link href="/" className="text-xs text-[#C9552F] hover:underline">
              Browse archive to add →
            </Link>
          </div>
          {user.favourites.length === 0 ? (
            <div className="rounded-xl border border-dashed border-[#D4CDBC] bg-white py-12 text-center">
              <p className="text-sm text-[#8A8579]">No favourites yet.</p>
              <p className="mt-1 text-xs text-[#8A8579]">Click ♡ on any archive wallpaper to save it here.</p>
              <Link
                href="/"
                className="mt-4 inline-block rounded-xl bg-[#2B2A26] px-5 py-2.5 text-xs font-medium text-white hover:bg-[#1a1917] transition"
              >
                Explore Archive
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {user.favourites.map(id => (
                <FavouriteCard key={id} id={id} onRemove={() => removeFavourite(id)} />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Wishlists panel */}
      {view === "wishlists" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-serif text-base font-medium text-[#2B2A26]">My Wishlists</h2>
          </div>

          {/* Create new wishlist */}
          <div className="flex gap-2">
            <input
              type="text"
              value={newWishlistName}
              onChange={e => setNewWishlistName(e.target.value)}
              onKeyDown={e => e.key === "Enter" && addWishlist()}
              placeholder="New wishlist name…"
              maxLength={40}
              className="flex-1 rounded-xl border border-[#D4CDBC] bg-white px-4 py-2.5 text-xs text-[#2B2A26] placeholder-[#8A8579] focus:border-[#C9552F] focus:outline-none"
            />
            <button
              type="button"
              onClick={addWishlist}
              disabled={!newWishlistName.trim()}
              className="rounded-xl bg-[#2B2A26] px-4 py-2.5 text-xs font-medium text-white hover:bg-[#1a1917] disabled:opacity-40 transition"
            >
              + Create
            </button>
          </div>

          {user.wishlists.length === 0 ? (
            <div className="rounded-xl border border-dashed border-[#D4CDBC] bg-white py-12 text-center">
              <p className="text-sm text-[#8A8579]">No wishlists yet.</p>
              <p className="mt-1 text-xs text-[#8A8579]">Create a wishlist to organise wallpapers by theme or device.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-3">
              {user.wishlists.map(wl => (
                <div key={wl.id} className="rounded-xl border border-[#E4DFD3] bg-white p-4 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium text-sm text-[#2B2A26]">{wl.name}</h3>
                      <p className="text-[10px] text-[#8A8579]">
                        {wl.itemIds.length} items · created {new Date(wl.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeWishlist(wl.id)}
                      className="text-xs text-[#8A8579] hover:text-red-500 transition"
                    >
                      Delete
                    </button>
                  </div>
                  {wl.itemIds.length === 0 && (
                    <p className="mt-2 text-[11px] text-[#8A8579] italic">
                      Empty — open any wallpaper and add it to this list from the Studio.
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );

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
        favoriteCount={0}
      />

      <main className="flex min-h-[calc(100vh-72px)] items-start justify-center px-6 py-12">
        {user ? profileView : landingView}
      </main>
    </div>
  );
}
