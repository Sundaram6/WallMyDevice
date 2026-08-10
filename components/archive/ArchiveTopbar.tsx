"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { useSafeSession } from "@/lib/auth-client";
import { MobileNavDrawer } from "@/components/ui/MobileNavDrawer";
import { AuthModal } from "@/components/auth/AuthModal";
import { Bookmark, LogOut } from "lucide-react";

type Props = {
  activeRoute?: "home" | "archive" | "studio" | "collections" | "inspiration" | "about";
  currentTab?: "archive" | "studio";
  onTabChange?: (tab: "archive" | "studio") => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  favoriteCount: number;
  onOpenFavoritesModal?: () => void;
};

export function ArchiveTopbar({
  activeRoute,
  currentTab,
  onTabChange,
  searchQuery,
  onSearchChange,
  favoriteCount,
  onOpenFavoritesModal,
}: Props) {
  const [avatarMenuOpen, setAvatarMenuOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [searchOverlayOpen, setSearchOverlayOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);

  const menuRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const { data: session } = useSafeSession();

  const isArchiveActive = activeRoute === "archive" || (pathname === "/archive");
  const isCollectionsActive = activeRoute === "collections" || (pathname === "/collections") || (currentTab === "archive" && pathname === "/");
  const isStudioActive = activeRoute === "studio" || (pathname === "/studio") || (currentTab === "studio" && pathname === "/");

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setAvatarMenuOpen(false);
      }
    }
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setAvatarMenuOpen(false);
        setDrawerOpen(false);
        setSearchOverlayOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const userDisplayName = session?.user?.name || session?.user?.email?.split("@")[0] || "Guest";
  const userInitials = userDisplayName.slice(0, 2).toUpperCase();

  return (
    <>
      <header className="flex h-[72px] items-center justify-between border-b border-paper-300 px-4 sm:px-6 lg:px-10 bg-paper-50 relative z-20">
        <div className="flex items-center gap-1 md:hidden">
          <button
            type="button"
            onClick={() => setDrawerOpen(true)}
            aria-label="Open Navigation Drawer"
            aria-expanded={drawerOpen}
            className="flex h-11 w-11 items-center justify-center rounded-lg text-ink-900 hover:bg-paper-200 transition-colors duration-[--dur-fast] focus:outline-none focus:ring-2 focus:ring-accent-500"
          >
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        <h1 className="font-serif text-xl font-medium tracking-tight text-ink-900">
          <Link href="/" className="focus:outline-none flex items-center min-h-[44px] px-1">
            WallMyDevice
          </Link>
        </h1>

        <nav aria-label="Main Navigation" className="hidden md:flex gap-2 lg:gap-4 text-xs md:text-sm text-ink-500">
          <Link
            href="/collections"
            onClick={() => onTabChange && onTabChange("archive")}
            className={`min-h-[44px] px-2.5 transition-colors duration-[--dur-fast] flex items-center ${
              isCollectionsActive ? "font-semibold text-ink-900 border-b-2 border-accent-500" : "hover:text-ink-900"
            }`}
          >
            Collections
          </Link>
          <Link
            href="/studio"
            onClick={() => onTabChange && onTabChange("studio")}
            className={`min-h-[44px] px-2.5 transition-colors duration-[--dur-fast] flex items-center ${
              isStudioActive ? "font-semibold text-ink-900 border-b-2 border-accent-500" : "hover:text-ink-900"
            }`}
          >
            Studio
          </Link>
          <Link
            href="/archive"
            className={`min-h-[44px] px-2.5 transition-colors duration-[--dur-fast] flex items-center ${
              isArchiveActive ? "font-semibold text-ink-900 border-b-2 border-accent-500" : "hover:text-ink-900"
            }`}
          >
            Archive
          </Link>
          <Link
            href="/saved"
            className={`min-h-[44px] px-2.5 transition-colors duration-[--dur-fast] flex items-center ${
              pathname === "/saved" || pathname === "/favorites" ? "font-semibold text-ink-900 border-b-2 border-accent-500" : "hover:text-ink-900"
            }`}
          >
            Saved
          </Link>
          <Link
            href="/about"
            className={`min-h-[44px] px-2.5 transition-colors duration-[--dur-fast] flex items-center ${
              pathname === "/about" ? "font-semibold text-ink-900 border-b-2 border-accent-500" : "hover:text-ink-900"
            }`}
          >
            About
          </Link>
        </nav>

        <div className="flex items-center gap-1 sm:gap-2">
          <div className="relative hidden sm:flex items-center">
            <span className="absolute left-3 text-xs text-ink-500">🔍</span>
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search prints, palettes, moods..."
              aria-label="Search prints, palettes, moods"
              className="w-48 lg:w-64 rounded-lg border border-paper-300 bg-paper-100 py-2 pl-9 pr-3 text-xs text-ink-900 placeholder-ink-500 focus:border-accent-500 focus:outline-none transition-colors duration-[--dur-fast]"
            />
          </div>

          <Link
            href="/saved"
            aria-label={`Saved Wallpapers (${favoriteCount} saved)`}
            className="relative flex h-11 w-11 items-center justify-center text-ink-500 hover:text-accent-500 rounded-lg transition-colors duration-[--dur-fast] focus:outline-none focus:ring-2 focus:ring-accent-500"
          >
            ♡
            {favoriteCount > 0 && (
              <span className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-accent-500 text-[10px] font-medium text-paper-0">
                {favoriteCount}
              </span>
            )}
          </Link>

          {session?.user ? (
            <div className="relative flex items-center" ref={menuRef}>
              <button
                type="button"
                data-testid="user-menu-button"
                onClick={() => setAvatarMenuOpen(!avatarMenuOpen)}
                aria-label="User menu"
                aria-expanded={avatarMenuOpen}
                className="flex h-11 w-11 items-center justify-center rounded-full focus:outline-none focus:ring-2 focus:ring-accent-500"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-ink-900 font-mono text-xs text-paper-0 hover:ring-2 hover:ring-accent-500 transition-all duration-[--dur-fast]">
                  {userInitials}
                </div>
              </button>

              {avatarMenuOpen && (
                <div data-testid="user-menu-dropdown" className="absolute right-0 top-10 w-56 rounded-xl border border-paper-300 bg-paper-50 p-2 shadow-2 z-[100] text-xs text-ink-900">
                  <div className="px-3 py-2 border-b border-paper-200">
                    <p className="font-medium truncate text-ink-900">{userDisplayName}</p>
                    <p className="text-[10px] text-ink-500 truncate">{session.user.email}</p>
                  </div>
                  <Link
                    href="/saved"
                    onClick={() => setAvatarMenuOpen(false)}
                    className="flex items-center gap-2 px-3 py-2 text-ink-700 hover:bg-paper-200 hover:text-ink-900 rounded-xl transition-colors"
                  >
                    <Bookmark size={14} className="text-accent-500" />
                    <span>Saved Wallpapers</span>
                  </Link>
                  <button
                    type="button"
                    onClick={() => {
                      setAvatarMenuOpen(false);
                      signOut({ callbackUrl: "/" });
                    }}
                    className="flex w-full items-center gap-2 px-3 py-2 text-red-500 hover:bg-red-500/10 rounded-xl transition-colors cursor-pointer text-left"
                  >
                    <LogOut size={14} />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              type="button"
              data-testid="sign-in-button"
              onClick={() => setAuthModalOpen(true)}
              className="rounded-full bg-ink-900 px-4 py-2 text-xs font-medium text-white hover:bg-accent-500 transition-all cursor-pointer shadow-1"
            >
              Sign In
            </button>
          )}
        </div>
      </header>

      {/* Auth Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
      />

      {/* Shared Mobile Navigation Drawer */}
      <MobileNavDrawer
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        links={[
          {
            label: "Studio ✦",
            href: "/studio",
            onClick: () => onTabChange?.("studio"),
            highlight: isStudioActive,
          },
          {
            label: "Archive",
            href: "/archive",
            onClick: () => onTabChange?.("archive"),
            highlight: isArchiveActive,
          },
          {
            label: "Collections",
            href: "/collections",
            highlight: isCollectionsActive,
          },
          { label: "Saved Wallpapers", href: "/saved" },
          { label: "About", href: "/about" },
        ]}
      />
    </>
  );
}
