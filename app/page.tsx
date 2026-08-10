"use client";

import { LandingNav } from "@/components/landing/LandingNav";
import { HeroSection } from "@/components/landing/HeroSection";
import { InlineStudio } from "@/components/landing/InlineStudio";
import { SeasonalDropSection } from "@/components/landing/SeasonalDropSection";
import { CollectionGrid } from "@/components/landing/CollectionGrid";
import { SectionDivider } from "@/components/landing/SectionDivider";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import Link from "next/link";

export default function HomePage() {
  const scrollToStudio = () => {
    const el = document.getElementById("studio-section");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="relative min-h-screen bg-paper-50 text-ink-900 selection:bg-accent-500/20">
      {/* Navigation Bar with Shimmer CTA & ThemeToggle */}
      <LandingNav onOpenStudioClick={scrollToStudio} />

      {/* Main Page Flow */}
      <main>
        {/* Hero Section with Photorealistic S25 Ultra CSS Renderer */}
        <HeroSection onOpenStudioClick={scrollToStudio} />

        {/* Editorial Divider */}
        <ScrollReveal direction="none" delayMs={0}>
          <SectionDivider label="✦" sublabel="GENERATIVE PRINT STUDIO" />
        </ScrollReveal>

        {/* Section 2: Interactive Studio Experience */}
        <ScrollReveal direction="up" delayMs={50}>
          <InlineStudio />
        </ScrollReveal>

        {/* Section 3: Seasonal Weekly Drop Banner */}
        <ScrollReveal direction="left" delayMs={0}>
          <SeasonalDropSection onOpenStudio={scrollToStudio} />
        </ScrollReveal>

        {/* Editorial Divider */}
        <ScrollReveal direction="none" delayMs={0}>
          <SectionDivider label="✦" sublabel="CURATED CATALOGUE" />
        </ScrollReveal>

        {/* Section 4: Curated Collection Grid */}
        <ScrollReveal direction="up" delayMs={80}>
          <CollectionGrid
            onSelectRecipe={() => {
              scrollToStudio();
            }}
          />
        </ScrollReveal>
      </main>

      {/* Refined Multi-Column Editorial Footer */}
      <footer className="border-t border-paper-300 bg-paper-50 pt-16 pb-12 px-6 sm:px-10 lg:px-16 text-ink-500">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-paper-300">
          {/* Column 1: Brand & Tagline */}
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center gap-2 font-serif text-xl text-ink-900 font-medium">
              <span>WallMyDevice</span>
              <span className="text-accent-500 italic font-serif">✦</span>
            </div>
            <p className="text-xs text-ink-500 max-w-sm leading-relaxed">
              A generative print studio crafting native-resolution wallpapers for phones, tablets, and desktop displays entirely in your browser.
            </p>
            <div className="font-mono text-[10.5px] text-ink-500 uppercase tracking-widest pt-2">
              VOL. 08 · 90+ CURATED SEEDS
            </div>
          </div>

          {/* Column 2: Studio Navigation */}
          <div className="md:col-span-3 space-y-3 text-xs">
            <h4 className="font-mono text-[10px] uppercase tracking-widest text-ink-900 font-semibold">STUDIO</h4>
            <ul className="space-y-2 text-ink-500">
              <li><button type="button" onClick={scrollToStudio} className="hover:text-ink-900 transition-colors duration-[--dur-fast]">Generator Studio ✦</button></li>
              <li><Link href="/collections" className="hover:text-ink-900 transition-colors duration-[--dur-fast]">Print Archive</Link></li>
              <li><Link href="/archive" className="hover:text-ink-900 transition-colors duration-[--dur-fast]">Curated Collections</Link></li>
              <li><Link href="/inspiration" className="hover:text-ink-900 transition-colors duration-[--dur-fast]">Design Inspiration</Link></li>
            </ul>
          </div>

          {/* Column 3: Resources & Product */}
          <div className="md:col-span-4 space-y-3 text-xs">
            <h4 className="font-mono text-[10px] uppercase tracking-widest text-ink-900 font-semibold">ABOUT & UPDATES</h4>
            <ul className="space-y-2 text-ink-500">
              <li><Link href="/changelog" className="hover:text-ink-900 transition-colors duration-[--dur-fast]">Changelog & Version History</Link></li>
              <li><Link href="/about" className="hover:text-ink-900 transition-colors duration-[--dur-fast]">About WallMyDevice</Link></li>
              <li><Link href="/favourites" className="hover:text-ink-900 transition-colors duration-[--dur-fast]">My Saved Wallpapers</Link></li>
            </ul>
            <div className="pt-2 text-[11px] text-ink-500">
              <span>Made for digital devices & physical spaces.</span>
            </div>
          </div>
        </div>

        {/* Footer Sub-Bar */}
        <div className="max-w-7xl mx-auto pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <p>© {new Date().getFullYear()} WallMyDevice Studio. All rights reserved.</p>
          <div className="flex gap-6 text-ink-500">
            <span className="hover:text-ink-900 transition-colors duration-[--dur-fast] cursor-pointer">Privacy</span>
            <span>·</span>
            <span className="hover:text-ink-900 transition-colors duration-[--dur-fast] cursor-pointer">Terms</span>
            <span>·</span>
            <span className="hover:text-ink-900 transition-colors duration-[--dur-fast] cursor-pointer">GitHub</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
