"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { MobileNavDrawer } from "@/components/ui/MobileNavDrawer";

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

  const menuRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  const isArchiveActive = activeRoute === "archive" || (pathname === "/archive") || (currentTab === "archive" && pathname === "/");
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
            href="/archive"
            onClick={() => onTabChange && onTabChange("archive")}
            className={`min-h-[44px] px-2.5 transition-colors duration-[--dur-fast] flex items-center ${
              isArchiveActive ? "font-semibold text-ink-900 border-b-2 border-accent-500" : "hover:text-ink-900"
            }`}
          >
            Archive
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
            href="/collections"
            className={`min-h-[44px] px-2.5 transition-colors duration-[--dur-fast] flex items-center ${
              pathname === "/collections" ? "font-semibold text-ink-900 border-b-2 border-accent-500" : "hover:text-ink-900"
            }`}
          >
            Collections
          </Link>
          <Link
            href="/inspiration"
            className={`min-h-[44px] px-2.5 transition-colors duration-[--dur-fast] flex items-center ${
              pathname === "/inspiration" ? "font-semibold text-ink-900 border-b-2 border-accent-500" : "hover:text-ink-900"
            }`}
          >
            Inspiration
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

          <button
            type="button"
            onClick={() => setSearchOverlayOpen(true)}
            aria-label="Open Search"
            className="flex sm:hidden h-11 w-11 items-center justify-center rounded-lg text-ink-500 hover:text-ink-900 hover:bg-paper-200 transition-colors duration-[--dur-fast] focus:outline-none focus:ring-2 focus:ring-accent-500"
          >
            🔍
          </button>

          <button
            type="button"
            onClick={() => {
              if (onOpenFavoritesModal) {
                onOpenFavoritesModal();
              } else {
                window.location.href = "/profile";
              }
            }}
            aria-label={`Favourites (${favoriteCount} saved)`}
            className="relative flex h-11 w-11 items-center justify-center text-ink-500 hover:text-accent-500 rounded-lg transition-colors duration-[--dur-fast] focus:outline-none focus:ring-2 focus:ring-accent-500"
          >
            ♡
            {favoriteCount > 0 && (
              <span className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-accent-500 text-[10px] font-medium text-paper-0">
                {favoriteCount}
              </span>
            )}
          </button>

          <div className="relative flex items-center" ref={menuRef}>
            <button
              type="button"
              onClick={() => setAvatarMenuOpen(!avatarMenuOpen)}
              aria-label="Local Profile user menu"
              aria-expanded={avatarMenuOpen}
              className="flex h-11 w-11 items-center justify-center rounded-full focus:outline-none focus:ring-2 focus:ring-accent-500"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-ink-900 font-mono text-xs text-paper-0 hover:ring-2 hover:ring-accent-500 transition-all duration-[--dur-fast]">
                L
              </div>
            </button>

            {avatarMenuOpen && (
              <div className="absolute right-0 top-12 w-52 rounded-lg border border-paper-300 bg-paper-100 p-2 shadow-2 z-50 text-xs">
                <div className="px-3 py-2 border-b border-paper-200">
                  <p className="font-medium text-ink-900">Local Profile</p>
                  <p className="text-[10px] text-ink-500">Saved on this device</p>
                </div>
                <Link
                  href="/profile"
                  onClick={() => setAvatarMenuOpen(false)}
                  className="flex items-center min-h-[44px] px-3 py-2 text-ink-500 hover:bg-paper-200 hover:text-accent-500 rounded transition-colors duration-[--dur-fast]"
                >
                  Manage Profile &amp; Favourites →
                </Link>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Shared Mobile Navigation Drawer */}
      <MobileNavDrawer
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        links={[
          {
            label: "Archive",
            href: "/archive",
            onClick: () => onTabChange?.("archive"),
            highlight: isArchiveActive,
          },
          {
            label: "Studio ✦",
            href: "/studio",
            onClick: () => onTabChange?.("studio"),
            highlight: isStudioActive,
          },
          { label: "Collections", href: "/collections" },
          { label: "Inspiration", href: "/inspiration" },
          { label: "About", href: "/about" },
        ]}
      />
    </>
  );
}
