"use client";

import { useState } from "react";
import { ArchiveTopbar } from "@/components/archive/ArchiveTopbar";
import Link from "next/link";

export default function AboutPage() {
  const [tab, setTab] = useState<"archive" | "studio">("archive");
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="min-h-screen bg-[#FAF8F4] text-[#2B2A26] font-sans">
      <ArchiveTopbar
        currentTab={tab}
        onTabChange={(t) => {
          if (t === "studio") {
            window.location.href = "/#studio";
          } else {
            setTab(t);
          }
        }}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        favoriteCount={0}
      />
      <main className="mx-auto max-w-4xl px-6 py-12">
        <div className="mb-10 text-center">
          <span className="font-mono text-xs uppercase tracking-widest text-[#C9552F]">Documentation & Guide</span>
          <h1 className="mt-2 font-serif text-3xl font-medium tracking-tight text-[#2B2A26] md:text-4xl">
            About WallMyDevice
          </h1>
          <p className="mt-3 text-sm text-[#5B584F] max-w-xl mx-auto">
            High-precision, procedural wallpaper creation tailored for modern device displays.
          </p>
        </div>

        <div className="space-y-8 text-sm leading-relaxed text-[#2B2A26]">
          {/* Section 1 */}
          <section className="rounded-2xl border border-[#E4DFD3] bg-white p-6 md:p-8 shadow-sm">
            <h2 className="font-serif text-xl font-medium text-[#2B2A26] mb-3 flex items-center gap-2">
              <span className="text-[#C9552F]">✦</span> What WallMyDevice Does
            </h2>
            <p className="text-[#5B584F]">
              WallMyDevice is an interactive procedural wallpaper laboratory built for digital artists and device enthusiasts. It synthesizes geometric patterns, fluid gradients, and typography directly on-device using canvas and WebGL shaders, ensuring pixel-perfect resolution without compression artifacts.
            </p>
          </section>

          {/* Section 2 */}
          <section className="rounded-2xl border border-[#E4DFD3] bg-white p-6 md:p-8 shadow-sm">
            <h2 className="font-serif text-xl font-medium text-[#2B2A26] mb-3 flex items-center gap-2">
              <span className="text-[#C9552F]">✦</span> Deterministic Seeds & Reproducibility
            </h2>
            <p className="text-[#5B584F]">
              Every generated wallpaper is powered by a pseudo-random seed string. Re-entering the exact seed along with matching parameters, palette, and resolution will reconstruct the identical artwork deterministically. You can easily save and share your creations via recipe hashes or state snapshots.
            </p>
          </section>

          {/* Section 3 */}
          <section className="rounded-2xl border border-[#E4DFD3] bg-white p-6 md:p-8 shadow-sm">
            <h2 className="font-serif text-xl font-medium text-[#2B2A26] mb-3 flex items-center gap-2">
              <span className="text-[#C9552F]">✦</span> Archive vs. Studio Editor
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
              <div className="rounded-xl bg-[#FAF8F4] p-4 border border-[#E4DFD3]">
                <h3 className="font-medium text-[#2B2A26] mb-1">Archive Gallery</h3>
                <p className="text-xs text-[#5B584F]">
                  Quickly explore curated design swatches, filter by mood or category, and instantly generate wallpapers using streamlined default settings.
                </p>
              </div>
              <div className="rounded-xl bg-[#FAF8F4] p-4 border border-[#E4DFD3]">
                <h3 className="font-medium text-[#2B2A26] mb-1">Studio Editor</h3>
                <p className="text-xs text-[#5B584F]">
                  Fine-tune fine parameters, custom aspect ratios, multi-brand device mockups, noise grain intensity, overlays, and export format settings.
                </p>
              </div>
            </div>
          </section>

          {/* Section 4 */}
          <section className="rounded-2xl border border-[#E4DFD3] bg-white p-6 md:p-8 shadow-sm">
            <h2 className="font-serif text-xl font-medium text-[#2B2A26] mb-3 flex items-center gap-2">
              <span className="text-[#C9552F]">✦</span> Privacy & Personal Use Policy
            </h2>
            <p className="text-[#5B584F]">
              All generation, grain application, and rendering happen 100% locally inside your web browser. No personal data or generated images are uploaded to external servers. Wallpapers produced are designated for personal background use across your desktop, phone, and tablet devices.
            </p>
          </section>

          {/* Section 5 */}
          <section className="rounded-2xl border border-[#E4DFD3] bg-[#F3EFE6] p-6 md:p-8 text-xs font-mono text-[#5B584F]">
            <div className="flex justify-between items-center border-b border-[#D4CDBC] pb-3 mb-3">
              <span className="font-bold text-[#2B2A26]">Build & Version Specs</span>
              <span className="rounded bg-white px-2 py-0.5 border border-[#D4CDBC] text-[#2B2A26]">v0.1.2</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>Engine: WebGL2 / HTML5 Canvas2D</div>
              <div>Framework: Next.js 16 (App Router)</div>
              <div>State Management: Zustand</div>
              <div>Resolution Support: Up to 8K (15360px)</div>
            </div>
          </section>
        </div>

        <div className="mt-10 text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-xl bg-[#2B2A26] px-6 py-3 text-xs font-medium text-white shadow transition hover:bg-[#1a1917]"
          >
            ← Back to Archive
          </Link>
        </div>
      </main>
    </div>
  );
}
