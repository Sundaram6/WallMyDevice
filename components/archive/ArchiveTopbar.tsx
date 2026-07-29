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
      <header className="flex h-[72px] items-center justify-between border-b border-brand-border px-4 sm:px-6 lg:px-10 bg-brand-bg relative z-20">
        <div className="flex items-center gap-1 md:hidden">
          <button
            type="button"
            onClick={() => setDrawerOpen(true)}
            aria-label="Open Navigation Drawer"
            aria-expanded={drawerOpen}
            className="flex h-11 w-11 items-center justify-center rounded-lg text-brand-ink hover:bg-brand-surface transition focus:outline-none focus:ring-2 focus:ring-brand-accent"
          >
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        <h1 className="font-serif text-xl font-medium tracking-tight text-brand-ink">
          <Link href="/" className="focus:outline-none flex items-center min-h-[44px] px-1">
            WallMyDevice
          </Link>
        </h1>

        <nav aria-label="Main Navigation" className="hidden md:flex gap-2 lg:gap-4 text-xs md:text-sm text-brand-muted">
          <Link
            href="/archive"
            onClick={() => onTabChange && onTabChange("archive")}
            className={`min-h-[44px] px-2.5 transition flex items-center ${
              isArchiveActive ? "font-medium text-brand-ink border-b-2 border-brand-accent" : "hover:text-brand-ink"
            }`}
          >
            Archive
          </Link>
          <Link
            href="/studio"
            onClick={() => onTabChange && onTabChange("studio")}
            className={`min-h-[44px] px-2.5 transition flex items-center ${
              isStudioActive ? "font-medium text-brand-ink border-b-2 border-brand-accent" : "hover:text-brand-ink"
            }`}
          >
            Studio
          </Link>
          <Link
            href="/collections"
            className={`min-h-[44px] px-2.5 transition flex items-center ${
              pathname === "/collections" ? "font-medium text-brand-ink border-b-2 border-brand-accent" : "hover:text-brand-ink"
            }`}
          >
            Collections
          </Link>
          <Link
            href="/inspiration"
            className={`min-h-[44px] px-2.5 transition flex items-center ${
              pathname === "/inspiration" ? "font-medium text-brand-ink border-b-2 border-brand-accent" : "hover:text-brand-ink"
            }`}
          >
            Inspiration
          </Link>
          <Link
            href="/about"
            className={`min-h-[44px] px-2.5 transition flex items-center ${
              pathname === "/about" ? "font-medium text-brand-ink border-b-2 border-brand-accent" : "hover:text-brand-ink"
            }`}
          >
            About
          </Link>
        </nav>

        <div className="flex items-center gap-1 sm:gap-2">
          <div className="relative hidden sm:flex items-center">
            <span className="absolute left-3 text-xs text-brand-muted">🔍</span>
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search prints, palettes, moods..."
              aria-label="Search prints, palettes, moods"
              className="w-48 lg:w-64 rounded-lg border border-brand-border bg-brand-surface-2 py-2 pl-9 pr-3 text-xs text-brand-ink placeholder-brand-muted focus:border-brand-accent focus:outline-none"
            />
          </div>

          <button
            type="button"
            onClick={() => setSearchOverlayOpen(true)}
            aria-label="Open Search"
            className="flex sm:hidden h-11 w-11 items-center justify-center rounded-lg text-brand-muted hover:text-brand-ink hover:bg-brand-surface transition focus:outline-none focus:ring-2 focus:ring-brand-accent"
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
            className="relative flex h-11 w-11 items-center justify-center text-brand-muted hover:text-brand-accent rounded-lg transition focus:outline-none focus:ring-2 focus:ring-brand-accent"
          >
            ♡
            {favoriteCount > 0 && (
              <span className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-brand-accent text-[10px] font-medium text-brand-bg">
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
              className="flex h-11 w-11 items-center justify-center rounded-full focus:outline-none focus:ring-2 focus:ring-brand-accent"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-ink font-mono text-xs text-brand-bg hover:ring-2 hover:ring-brand-accent transition">
                L
              </div>
            </button>

            {avatarMenuOpen && (
              <div className="absolute right-0 top-12 w-52 rounded-lg border border-brand-border bg-brand-surface-2 p-2 shadow-lg z-50 text-xs">
                <div className="px-3 py-2 border-b border-brand-border">
                  <p className="font-medium text-brand-ink">Local Profile</p>
                  <p className="text-[10px] text-brand-muted">Saved on this device</p>
                </div>
                <Link
                  href="/profile"
                  onClick={() => setAvatarMenuOpen(false)}
                  className="flex items-center min-h-[44px] px-3 py-2 text-brand-muted hover:bg-brand-bg hover:text-brand-accent rounded transition"
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
