"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { MobileNavDrawer } from "@/components/ui/MobileNavDrawer";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

type Props = {
  onOpenStudioClick?: () => void;
};

export function LandingNav({ onOpenStudioClick }: Props) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <header
        className={`sticky top-0 z-40 flex h-16 items-center justify-between px-6 sm:px-10 transition-all duration-300 ${
          scrolled
            ? "bg-brand-bg/90 backdrop-blur-xl border-b border-brand-border shadow-xs"
            : "bg-brand-bg"
        }`}
      >
        {/* Brand with Editorial Fraunces Mark */}
        <Link href="/" className="group flex items-center gap-1.5 font-serif text-xl font-medium tracking-tight text-brand-ink">
          <span>WallMyDevice</span>
          <span className="text-brand-accent font-serif italic text-lg transition-transform group-hover:rotate-12 duration-300">✦</span>
        </Link>

        {/* Desktop Nav Links with Hover & Active Underline Animations */}
        <nav aria-label="Landing Navigation" className="hidden md:flex items-center gap-7 text-xs text-brand-muted">
          <button
            type="button"
            onClick={onOpenStudioClick}
            className={`relative py-1 transition font-medium group ${
              pathname === "/" ? "text-brand-ink" : "hover:text-brand-ink"
            }`}
          >
            Studio
            <span
              className={`absolute bottom-0 left-0 w-full h-[1.5px] bg-brand-accent transition-transform origin-left duration-200 ${
                pathname === "/" ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
              }`}
            />
          </button>
          <Link
            href="/archive"
            className={`relative py-1 transition group ${
              pathname.startsWith("/archive") ? "text-brand-ink font-medium" : "hover:text-brand-ink"
            }`}
          >
            Archive
            <span
              className={`absolute bottom-0 left-0 w-full h-[1.5px] bg-brand-accent transition-transform origin-left duration-200 ${
                pathname.startsWith("/archive") ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
              }`}
            />
          </Link>
          <Link
            href="/collections"
            className={`relative py-1 transition group ${
              pathname.startsWith("/collections") ? "text-brand-ink font-medium" : "hover:text-brand-ink"
            }`}
          >
            Collections
            <span
              className={`absolute bottom-0 left-0 w-full h-[1.5px] bg-brand-accent transition-transform origin-left duration-200 ${
                pathname.startsWith("/collections") ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
              }`}
            />
          </Link>
          <Link
            href="/inspiration"
            className={`relative py-1 transition group ${
              pathname.startsWith("/inspiration") ? "text-brand-ink font-medium" : "hover:text-brand-ink"
            }`}
          >
            Inspiration
            <span
              className={`absolute bottom-0 left-0 w-full h-[1.5px] bg-brand-accent transition-transform origin-left duration-200 ${
                pathname.startsWith("/inspiration") ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
              }`}
            />
          </Link>
          <Link
            href="/about"
            className={`relative py-1 transition group ${
              pathname.startsWith("/about") ? "text-brand-ink font-medium" : "hover:text-brand-ink"
            }`}
          >
            About
            <span
              className={`absolute bottom-0 left-0 w-full h-[1.5px] bg-brand-accent transition-transform origin-left duration-200 ${
                pathname.startsWith("/about") ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
              }`}
            />
          </Link>
        </nav>

        {/* Actions with ThemeToggle and Premium Shimmer CTA */}
        <div className="flex items-center gap-3">
          <ThemeToggle />

          <button
            type="button"
            onClick={onOpenStudioClick}
            className="relative overflow-hidden hidden sm:inline-flex rounded-full bg-brand-ink px-5 py-2 text-xs font-medium text-brand-bg shadow-xs hover:bg-brand-accent transition-all duration-300 group"
          >
            <span className="relative z-10 flex items-center gap-1">
              Open Studio <span className="text-brand-accent group-hover:text-brand-bg transition-colors">✦</span>
            </span>
            {/* Shimmer Light Glint Layer */}
            <div className="absolute inset-0 z-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out" />
          </button>

          {/* Mobile Hamburger Menu Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(true)}
            aria-label="Open mobile menu"
            className="flex md:hidden min-h-[44px] min-w-[44px] items-center justify-center rounded-xl border border-brand-border bg-brand-surface text-brand-ink hover:bg-brand-surface-2 transition"
          >
            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
              <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"/>
            </svg>
          </button>
        </div>
      </header>

      {/* Mobile Navigation Drawer */}
      <MobileNavDrawer
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        links={[
          { label: "Studio ✦", onClick: onOpenStudioClick, highlight: true },
          { label: "Archive", href: "/archive" },
          { label: "Collections", href: "/collections" },
          { label: "Inspiration", href: "/inspiration" },
          { label: "About", href: "/about" },
        ]}
      />
    </>
  );
}
