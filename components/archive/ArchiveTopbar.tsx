import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

type Props = {
  currentTab: "archive" | "studio";
  onTabChange: (tab: "archive" | "studio") => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  favoriteCount: number;
};

export function ArchiveTopbar({ currentTab, onTabChange, searchQuery, onSearchChange, favoriteCount }: Props) {
  const [avatarMenuOpen, setAvatarMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setAvatarMenuOpen(false);
      }
    }
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setAvatarMenuOpen(false);
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
    <header className="flex h-[72px] items-center justify-between border-b border-[#E4DFD3] px-6 lg:px-10 bg-[#FAF8F4]">
      {/* Brand Logo */}
      <h1 className="font-serif text-xl font-medium tracking-tight text-[#2B2A26]">
        <Link
          href="/"
          onClick={() => onTabChange("archive")}
          className="focus:outline-none"
        >
          WallMyDevice
        </Link>
      </h1>

      {/* Centered Navigation */}
      <nav aria-label="Main Navigation" className="flex gap-4 md:gap-8 text-xs md:text-sm text-[#5B584F]">
        <Link
          href="/"
          onClick={() => onTabChange("archive")}
          className={`pb-1 transition ${
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
          className={`pb-1 transition ${
            pathname === "/" && currentTab === "studio"
              ? "font-medium text-[#2B2A26] border-b-2 border-[#C9552F]"
              : "hover:text-[#2B2A26]"
          }`}
        >
          Studio
        </button>
        <Link
          href="/collections"
          className={`pb-1 transition ${
            pathname === "/collections"
              ? "font-medium text-[#2B2A26] border-b-2 border-[#C9552F]"
              : "hover:text-[#2B2A26]"
          }`}
        >
          Collections
        </Link>
        <Link
          href="/inspiration"
          className={`pb-1 transition ${
            pathname === "/inspiration"
              ? "font-medium text-[#2B2A26] border-b-2 border-[#C9552F]"
              : "hover:text-[#2B2A26]"
          }`}
        >
          Inspiration
        </Link>
        <Link
          href="/about"
          className={`pb-1 transition ${
            pathname === "/about"
              ? "font-medium text-[#2B2A26] border-b-2 border-[#C9552F]"
              : "hover:text-[#2B2A26]"
          }`}
        >
          About
        </Link>
      </nav>

      {/* Right Tools */}
      <div className="flex items-center gap-4">
        <div className="relative hidden sm:flex items-center">
          <span className="absolute left-3 text-xs text-[#8A8579]">🔍</span>
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search prints, palettes, moods..."
            aria-label="Search prints, palettes, moods"
            className="w-56 lg:w-64 rounded-lg border border-[#E4DFD3] bg-white py-2 pl-9 pr-3 text-xs text-[#2B2A26] placeholder-[#8A8579] focus:border-[#C9552F] focus:outline-none"
          />
        </div>
        <button
          type="button"
          aria-label="Favorites"
          className="relative flex h-[34px] w-[34px] items-center justify-center text-[#5B584F] hover:text-[#C9552F]"
        >
          ♡
          {favoriteCount > 0 && (
            <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#C9552F] text-[10px] font-medium text-white">
              {favoriteCount}
            </span>
          )}
        </button>
        
        {/* Guest Profile Menu */}
        <div className="relative" ref={menuRef}>
          <button
            type="button"
            onClick={() => setAvatarMenuOpen(!avatarMenuOpen)}
            aria-label="User Menu"
            aria-expanded={avatarMenuOpen}
            aria-haspopup="true"
            aria-controls="avatar-menu-dropdown"
            className="flex h-8 w-8 items-center justify-center rounded-full bg-[#2B2A26] font-mono text-xs text-white hover:ring-2 hover:ring-[#C9552F] transition focus:outline-none focus:ring-2 focus:ring-[#C9552F]"
          >
            A
          </button>

          {avatarMenuOpen && (
            <div id="avatar-menu-dropdown" className="absolute right-0 mt-2 w-48 rounded-lg border border-[#E4DFD3] bg-white p-2 shadow-lg z-50 text-xs">
              <div className="px-3 py-2 border-b border-[#E4DFD3] font-medium text-[#2B2A26]">
                Guest User
              </div>
              <Link
                href="/sign-in"
                onClick={() => setAvatarMenuOpen(false)}
                className="block px-3 py-2 text-[#5B584F] hover:bg-[#FAF8F4] hover:text-[#C9552F] rounded transition"
              >
                Sign In →
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
