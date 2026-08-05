"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { useSafeSession } from "@/lib/auth-client";
import { MobileNavDrawer } from "@/components/ui/MobileNavDrawer";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { AuthModal } from "@/components/auth/AuthModal";
import { Heart, LogOut, Bookmark, User as UserIcon } from "lucide-react";

type Props = {
  onOpenStudioClick?: () => void;
};

export function LandingNav({ onOpenStudioClick }: Props) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const menuRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const { data: session } = useSafeSession();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setUserMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const userDisplayName = session?.user?.name || session?.user?.email?.split("@")[0] || "Artist";
  const userInitials = userDisplayName.slice(0, 2).toUpperCase();

  return (
    <>
      <header
        className={`sticky top-0 z-40 flex h-16 items-center justify-between px-6 sm:px-10 transition-all duration-[--dur-fast] ${
          scrolled
            ? "bg-paper-50/90 backdrop-blur-xl border-b border-paper-300 shadow-1"
            : "bg-paper-50"
        }`}
      >
        {/* Brand with Editorial Fraunces Mark */}
        <Link href="/" className="group flex items-center gap-1.5 font-serif text-xl font-medium tracking-tight text-ink-900">
          <span>WallMyDevice</span>
          <span className="text-accent-500 font-serif italic text-lg transition-transform group-hover:rotate-12 duration-[--dur-fast]">✦</span>
        </Link>

        {/* Desktop Nav Links */}
        <nav aria-label="Landing Navigation" className="hidden md:flex items-center gap-7 text-xs text-ink-500">
          <button
            type="button"
            onClick={onOpenStudioClick}
            className={`relative py-1 transition-colors duration-[--dur-fast] font-medium group ${
              pathname === "/" ? "text-ink-900" : "hover:text-ink-900"
            }`}
          >
            Studio
            <span
              className={`absolute bottom-0 left-0 w-full h-[1.5px] bg-accent-500 transition-transform origin-left duration-[--dur-fast] ${
                pathname === "/" ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
              }`}
            />
          </button>
          <Link
            href="/archive"
            className={`relative py-1 transition-colors duration-[--dur-fast] group ${
              pathname.startsWith("/archive") ? "text-ink-900 font-semibold" : "hover:text-ink-900"
            }`}
          >
            Archive
            <span
              className={`absolute bottom-0 left-0 w-full h-[1.5px] bg-accent-500 transition-transform origin-left duration-[--dur-fast] ${
                pathname.startsWith("/archive") ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
              }`}
            />
          </Link>
          <Link
            href="/collections"
            className={`relative py-1 transition-colors duration-[--dur-fast] group ${
              pathname.startsWith("/collections") ? "text-ink-900 font-semibold" : "hover:text-ink-900"
            }`}
          >
            Collections
            <span
              className={`absolute bottom-0 left-0 w-full h-[1.5px] bg-accent-500 transition-transform origin-left duration-[--dur-fast] ${
                pathname.startsWith("/collections") ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
              }`}
            />
          </Link>
          <Link
            href="/saved"
            className={`relative py-1 transition-colors duration-[--dur-fast] group ${
              pathname.startsWith("/saved") || pathname.startsWith("/favorites") ? "text-ink-900 font-semibold" : "hover:text-ink-900"
            }`}
          >
            Saved
            <span
              className={`absolute bottom-0 left-0 w-full h-[1.5px] bg-accent-500 transition-transform origin-left duration-[--dur-fast] ${
                pathname.startsWith("/saved") || pathname.startsWith("/favorites") ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
              }`}
            />
          </Link>
          <Link
            href="/about"
            className={`relative py-1 transition-colors duration-[--dur-fast] group ${
              pathname.startsWith("/about") ? "text-ink-900 font-semibold" : "hover:text-ink-900"
            }`}
          >
            About
            <span
              className={`absolute bottom-0 left-0 w-full h-[1.5px] bg-accent-500 transition-transform origin-left duration-[--dur-fast] ${
                pathname.startsWith("/about") ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
              }`}
            />
          </Link>
        </nav>

        {/* Actions with ThemeToggle and User Menu / Sign In CTA */}
        <div className="flex items-center gap-3">
          <ThemeToggle />

          {session?.user ? (
            <div className="relative" ref={menuRef}>
              <button
                type="button"
                data-testid="user-menu-button"
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-2 rounded-full border border-paper-300 bg-paper-100 p-1 pr-3 text-xs font-medium text-ink-900 hover:bg-paper-200 transition-all cursor-pointer"
              >
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-ink-900 text-[11px] font-mono text-white">
                  {userInitials}
                </div>
                <span className="hidden sm:inline max-w-[100px] truncate">{userDisplayName}</span>
              </button>

              {userMenuOpen && (
                <div data-testid="user-menu-dropdown" className="absolute right-0 top-11 w-56 rounded-2xl border border-paper-300 bg-paper-50 p-2 shadow-2 z-50 text-xs text-ink-900">
                  <div className="px-3 py-2 border-b border-paper-200">
                    <p className="font-medium truncate text-ink-900">{userDisplayName}</p>
                    <p className="text-[10px] text-ink-500 truncate">{session.user.email}</p>
                  </div>
                  <Link
                    href="/saved"
                    onClick={() => setUserMenuOpen(false)}
                    className="flex items-center gap-2 px-3 py-2 text-ink-700 hover:bg-paper-200 hover:text-ink-900 rounded-xl transition-colors"
                  >
                    <Bookmark size={14} className="text-accent-500" />
                    <span>Saved Wallpapers</span>
                  </Link>
                  <button
                    type="button"
                    onClick={() => {
                      setUserMenuOpen(false);
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
              className="relative overflow-hidden hidden sm:inline-flex rounded-full bg-ink-900 px-5 py-2 text-xs font-medium text-paper-0 shadow-1 hover:bg-accent-500 transition-all duration-[--dur-fast] group cursor-pointer"
            >
              <span className="relative z-10 flex items-center gap-1">
                Sign In <span className="text-accent-500 group-hover:text-paper-0 transition-colors duration-[--dur-fast]">✦</span>
              </span>
            </button>
          )}

          {/* Mobile Hamburger Menu Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(true)}
            aria-label="Open mobile menu"
            className="flex md:hidden min-h-[44px] min-w-[44px] items-center justify-center rounded-xl border border-paper-300 bg-paper-100 text-ink-900 hover:bg-paper-200 transition-colors duration-[--dur-fast]"
          >
            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
              <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"/>
            </svg>
          </button>
        </div>
      </header>

      {/* Auth Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
      />

      {/* Mobile Navigation Drawer */}
      <MobileNavDrawer
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        links={[
          { label: "Studio ✦", onClick: onOpenStudioClick, highlight: true },
          { label: "Archive", href: "/archive" },
          { label: "Collections", href: "/collections" },
          { label: "Saved Wallpapers", href: "/saved" },
          { label: "About", href: "/about" },
        ]}
      />
    </>
  );
}
