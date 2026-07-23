"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ARCHIVE_PRESETS } from "@/lib/presets/archive-presets";
import { SwatchThumbnail } from "./SwatchThumbnail";

type Props = {
  currentTab: "archive" | "studio";
  onTabChange: (tab: "archive" | "studio") => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  favoriteCount: number;
  onOpenFavoritesModal?: () => void;
};

export function ArchiveTopbar({
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
  const drawerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const pathname = usePathname();

  // Handle avatar menu click outside / escape
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

  // Lock body scroll and trap focus when mobile drawer or search overlay is open
  useEffect(() => {
    if (drawerOpen || searchOverlayOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [drawerOpen, searchOverlayOpen]);

  // Focus trap for drawer
  useEffect(() => {
    if (!drawerOpen || !drawerRef.current) return;
    const focusableElements = drawerRef.current.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    if (focusableElements.length === 0) return;

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    firstElement.focus();

    function handleTabKey(e: KeyboardEvent) {
      if (e.key !== "Tab") return;
      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        }
      } else {
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    }

    document.addEventListener("keydown", handleTabKey);
    return () => document.removeEventListener("keydown", handleTabKey);
  }, [drawerOpen]);

  // Auto-focus search input when search overlay opens
  useEffect(() => {
    if (searchOverlayOpen) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 50);
    }
  }, [searchOverlayOpen]);

  return (
    <>
      <header className="flex h-[72px] items-center justify-between border-b border-[#E4DFD3] px-4 sm:px-6 lg:px-10 bg-[#FAF8F4] relative z-20">
        {/* Left Mobile Controls (Hamburger) */}
        <div className="flex items-center gap-1 md:hidden">
          <button
            type="button"
            onClick={() => setDrawerOpen(true)}
            aria-label="Open Navigation Drawer"
            aria-expanded={drawerOpen}
            className="flex h-11 w-11 items-center justify-center rounded-lg text-[#2B2A26] hover:bg-[#F3EFE6] transition focus:outline-none focus:ring-2 focus:ring-[#C9552F]"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>

        {/* Brand Logo */}
        <h1 className="font-serif text-xl font-medium tracking-tight text-[#2B2A26]">
          <Link
            href="/"
            onClick={() => {
              onTabChange("archive");
              setDrawerOpen(false);
            }}
            className="focus:outline-none flex items-center min-h-[44px] px-1"
          >
            WallMyDevice
          </Link>
        </h1>

        {/* Desktop Navigation (Hidden below md) */}
        <nav
          aria-label="Main Navigation"
          className="hidden md:flex gap-2 lg:gap-4 text-xs md:text-sm text-[#5B584F]"
        >
          <Link
            href="/"
            onClick={() => onTabChange("archive")}
            className={`min-h-[44px] px-2.5 transition flex items-center ${
              pathname === "/" && currentTab === "archive"
                ? "font-medium text-[#2B2A26] border-b-2 border-[#C9552F]"
                : "hover:text-[#2B2A26]"
            }`}
          >
            Archive
          </Link>
          <button
            type="button"
            onClick={() => onTabChange("studio")}
            className={`min-h-[44px] px-2.5 transition flex items-center ${
              pathname === "/" && currentTab === "studio"
                ? "font-medium text-[#2B2A26] border-b-2 border-[#C9552F]"
                : "hover:text-[#2B2A26]"
            }`}
          >
            Studio
          </button>
          <Link
            href="/collections"
            className={`min-h-[44px] px-2.5 transition flex items-center ${
              pathname === "/collections"
                ? "font-medium text-[#2B2A26] border-b-2 border-[#C9552F]"
                : "hover:text-[#2B2A26]"
            }`}
          >
            Collections
          </Link>
          <Link
            href="/inspiration"
            className={`min-h-[44px] px-2.5 transition flex items-center ${
              pathname === "/inspiration"
                ? "font-medium text-[#2B2A26] border-b-2 border-[#C9552F]"
                : "hover:text-[#2B2A26]"
            }`}
          >
            Inspiration
          </Link>
          <Link
            href="/about"
            className={`min-h-[44px] px-2.5 transition flex items-center ${
              pathname === "/about"
                ? "font-medium text-[#2B2A26] border-b-2 border-[#C9552F]"
                : "hover:text-[#2B2A26]"
            }`}
          >
            About
          </Link>
        </nav>

        {/* Right Tools */}
        <div className="flex items-center gap-1 sm:gap-2">
          {/* Desktop Search Input */}
          <div className="relative hidden sm:flex items-center">
            <span className="absolute left-3 text-xs text-[#8A8579]">🔍</span>
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search prints, palettes, moods..."
              aria-label="Search prints, palettes, moods"
              className="w-48 lg:w-64 rounded-lg border border-[#E4DFD3] bg-white py-2 pl-9 pr-3 text-xs text-[#2B2A26] placeholder-[#8A8579] focus:border-[#C9552F] focus:outline-none"
            />
          </div>

          {/* Mobile Search Icon Button */}
          <button
            type="button"
            onClick={() => setSearchOverlayOpen(true)}
            aria-label="Open Search"
            className="flex sm:hidden h-11 w-11 items-center justify-center rounded-lg text-[#5B584F] hover:text-[#2B2A26] hover:bg-[#F3EFE6] transition focus:outline-none focus:ring-2 focus:ring-[#C9552F]"
          >
            🔍
          </button>

          {/* Favorites Heart Button: opens favourites overlay/drawer or routes to /profile */}
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
            className="relative flex h-11 w-11 items-center justify-center text-[#5B584F] hover:text-[#C9552F] rounded-lg transition focus:outline-none focus:ring-2 focus:ring-[#C9552F]"
          >
            ♡
            {favoriteCount > 0 && (
              <span className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#C9552F] text-[10px] font-medium text-white">
                {favoriteCount}
              </span>
            )}
          </button>

          {/* Profile Avatar & Dropdown */}
          <div className="relative flex items-center" ref={menuRef}>
            <button
              type="button"
              onClick={() => setAvatarMenuOpen(!avatarMenuOpen)}
              aria-label="Local Profile user menu"
              aria-expanded={avatarMenuOpen}
              aria-haspopup="true"
              aria-controls="avatar-menu-dropdown"
              className="flex h-11 w-11 items-center justify-center rounded-full focus:outline-none focus:ring-2 focus:ring-[#C9552F]"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#2B2A26] font-mono text-xs text-white hover:ring-2 hover:ring-[#C9552F] transition">
                L
              </div>
            </button>

            {avatarMenuOpen && (
              <div
                id="avatar-menu-dropdown"
                className="absolute right-0 top-12 w-52 rounded-lg border border-[#E4DFD3] bg-white p-2 shadow-lg z-50 text-xs"
              >
                <div className="px-3 py-2 border-b border-[#E4DFD3]">
                  <p className="font-medium text-[#2B2A26]">Local Profile</p>
                  <p className="text-[10px] text-[#8A8579]">Saved on this device</p>
                </div>
                <Link
                  href="/profile"
                  onClick={() => setAvatarMenuOpen(false)}
                  className="flex items-center min-h-[44px] px-3 py-2 text-[#5B584F] hover:bg-[#FAF8F4] hover:text-[#C9552F] rounded transition"
                >
                  Manage Profile &amp; Favourites →
                </Link>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* ─── Mobile Slide-in Drawer ────────────────────────────────────────────── */}
      {drawerOpen && (
        <div className="fixed inset-0 z-50 sm:hidden flex">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
            onClick={() => setDrawerOpen(false)}
            aria-hidden="true"
          />

          {/* Drawer Panel */}
          <div
            ref={drawerRef}
            className="relative flex w-4/5 max-w-xs flex-col bg-[#FAF8F4] p-6 shadow-2xl h-full z-10 border-r border-[#E4DFD3]"
          >
            <div className="flex items-center justify-between border-b border-[#E4DFD3] pb-4">
              <span className="font-serif text-lg font-medium text-[#2B2A26]">
                Navigation
              </span>
              <button
                type="button"
                onClick={() => setDrawerOpen(false)}
                aria-label="Close Navigation Drawer"
                className="flex h-11 w-11 items-center justify-center rounded-lg text-[#5B584F] hover:text-[#2B2A26] hover:bg-[#F3EFE6]"
              >
                ✕
              </button>
            </div>

            <nav aria-label="Mobile Navigation Drawer" className="mt-6 flex flex-col gap-1">
              <Link
                href="/"
                onClick={() => {
                  onTabChange("archive");
                  setDrawerOpen(false);
                }}
                className={`flex h-11 items-center px-3 rounded-lg text-sm font-medium transition ${
                  pathname === "/" && currentTab === "archive"
                    ? "bg-[#2B2A26] text-white"
                    : "text-[#5B584F] hover:bg-[#F3EFE6] hover:text-[#2B2A26]"
                }`}
              >
                Archive
              </Link>
              <button
                type="button"
                onClick={() => {
                  onTabChange("studio");
                  setDrawerOpen(false);
                }}
                className={`flex h-11 w-full items-center px-3 rounded-lg text-sm font-medium text-left transition ${
                  pathname === "/" && currentTab === "studio"
                    ? "bg-[#2B2A26] text-white"
                    : "text-[#5B584F] hover:bg-[#F3EFE6] hover:text-[#2B2A26]"
                }`}
              >
                Studio
              </button>
              <Link
                href="/collections"
                onClick={() => setDrawerOpen(false)}
                className={`flex h-11 items-center px-3 rounded-lg text-sm font-medium transition ${
                  pathname === "/collections"
                    ? "bg-[#2B2A26] text-white"
                    : "text-[#5B584F] hover:bg-[#F3EFE6] hover:text-[#2B2A26]"
                }`}
              >
                Collections
              </Link>
              <Link
                href="/inspiration"
                onClick={() => setDrawerOpen(false)}
                className={`flex h-11 items-center px-3 rounded-lg text-sm font-medium transition ${
                  pathname === "/inspiration"
                    ? "bg-[#2B2A26] text-white"
                    : "text-[#5B584F] hover:bg-[#F3EFE6] hover:text-[#2B2A26]"
                }`}
              >
                Inspiration
              </Link>
              <Link
                href="/about"
                onClick={() => setDrawerOpen(false)}
                className={`flex h-11 items-center px-3 rounded-lg text-sm font-medium transition ${
                  pathname === "/about"
                    ? "bg-[#2B2A26] text-white"
                    : "text-[#5B584F] hover:bg-[#F3EFE6] hover:text-[#2B2A26]"
                }`}
              >
                About
              </Link>
              <button
                type="button"
                onClick={() => {
                  setDrawerOpen(false);
                  if (onOpenFavoritesModal) onOpenFavoritesModal();
                  else window.location.href = "/profile";
                }}
                className="flex h-11 w-full items-center justify-between px-3 rounded-lg text-sm font-medium text-[#5B584F] hover:bg-[#F3EFE6] hover:text-[#2B2A26] transition"
              >
                <span>Favourites</span>
                <span className="font-mono text-xs bg-[#E4DFD3] px-2 py-0.5 rounded-full text-[#2B2A26]">{favoriteCount}</span>
              </button>
              <Link
                href="/profile"
                onClick={() => setDrawerOpen(false)}
                className={`flex h-11 items-center px-3 rounded-lg text-sm font-medium transition ${
                  pathname === "/profile"
                    ? "bg-[#2B2A26] text-white"
                    : "text-[#5B584F] hover:bg-[#F3EFE6] hover:text-[#2B2A26]"
                }`}
              >
                Local Profile
              </Link>
            </nav>

            <div className="mt-auto border-t border-[#E4DFD3] pt-4 text-xs text-[#8A8579]">
              © 2026 WallMyDevice · Saved on this device
            </div>
          </div>
        </div>
      )}

      {/* ─── Mobile Full-Screen Search Overlay ────────────────────────────────── */}
      {searchOverlayOpen && (
        <div className="fixed inset-0 z-50 sm:hidden bg-[#FAF8F4] flex flex-col h-[100dvh] w-full p-4">
          <div className="flex items-center gap-2 border-b border-[#E4DFD3] pb-3">
            <div className="relative flex-1 items-center">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-[#8A8579]">
                🔍
              </span>
              <input
                ref={searchInputRef}
                type="search"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Search prints, palettes, moods..."
                aria-label="Search prints, palettes, moods"
                className="w-full rounded-xl border border-[#D4CDBC] bg-white py-3 pl-10 pr-8 text-sm text-[#2B2A26] placeholder-[#8A8579] focus:border-[#C9552F] focus:outline-none"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => onSearchChange("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 flex h-11 w-11 items-center justify-center text-xs text-[#8A8579] hover:text-[#2B2A26]"
                >
                  ✕
                </button>
              )}
            </div>
            <button
              type="button"
              onClick={() => setSearchOverlayOpen(false)}
              className="flex h-11 px-3 items-center justify-center rounded-xl bg-[#2B2A26] text-xs font-medium text-white shadow-xs shrink-0"
            >
              Done
            </button>
          </div>

          <div className="flex-1 overflow-y-auto pt-4 text-xs text-[#5B584F]">
            {searchQuery ? (
              (() => {
                const q = searchQuery.toLowerCase();
                const matches = ARCHIVE_PRESETS.filter(
                  (s) =>
                    s.name.toLowerCase().includes(q) ||
                    s.category.toLowerCase().includes(q) ||
                    s.generatorId.toLowerCase().includes(q) ||
                    s.seed.toLowerCase() === q ||
                    s.tags.some((t) => t.toLowerCase().includes(q))
                );

                if (matches.length === 0) {
                  return (
                    <div className="py-12 text-center text-[#8A8579]">
                      <p className="text-sm font-medium">No matching prints found</p>
                      <p className="mt-1 text-xs">Try searching for &ldquo;waveform&rdquo;, &ldquo;botanicals&rdquo;, or &ldquo;dark&rdquo;.</p>
                    </div>
                  );
                }

                return (
                  <div className="space-y-3">
                    <p className="font-mono text-[11px] uppercase tracking-wider text-[#8A8579]">
                      Found {matches.length} matching {matches.length === 1 ? "print" : "prints"}
                    </p>
                    <div className="grid grid-cols-2 gap-3">
                      {matches.slice(0, 10).map((swatch) => (
                        <div
                          key={swatch.id}
                          onClick={() => {
                            setSearchOverlayOpen(false);
                            window.location.href = `/?recipe=${swatch.id}`;
                          }}
                          className="group relative cursor-pointer rounded-lg border border-[#E4DFD3] bg-white p-2 shadow-xs"
                        >
                          <div className="h-28 w-full overflow-hidden rounded bg-[#F3EFE6]">
                            <SwatchThumbnail swatch={swatch} width={160} height={200} />
                          </div>
                          <p className="mt-1.5 truncate font-serif text-xs font-medium text-[#2B2A26]">{swatch.name}</p>
                          <p className="text-[10px] text-[#8A8579]">{swatch.category}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })()
            ) : (
              <div className="py-8 text-center text-[#8A8579]">
                <p className="text-xs">Type a keyword, seed, or palette color to search in real time.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
