"use client";

import { useState } from "react";
import Link from "next/link";
import { ArchiveTopbar } from "@/components/archive/ArchiveTopbar";
import { ARCHIVE_PRESETS, type SwatchRecipe } from "@/lib/presets/archive-presets";
import { SwatchThumbnail } from "@/components/archive/SwatchThumbnail";
import { getFeaturedTodayRecipe } from "@/lib/presets/collections";
import { useEditorStore } from "@/store/useEditorStore";
import { useRouter } from "next/navigation";

// ─── Inspiration card ─────────────────────────────────────────────────────────
function InspirationCard({ swatch, label }: { swatch: SwatchRecipe; label?: string }) {
  const store = useEditorStore();
  const router = useRouter();

  function openInStudio() {
    store.setGenerator(swatch.generatorId);
    store.setPalette([...swatch.palette]);
    store.setMode(swatch.mode);
    store.setSeed(swatch.seed);
    Object.entries(swatch.params).forEach(([key, val]) => {
      store.updateParam(swatch.generatorId, key, val);
    });
    router.push("/");
  }

  return (
    <button
      type="button"
      onClick={openInStudio}
      className="group relative w-full overflow-hidden rounded-2xl border border-[#E4DFD3] bg-white shadow-sm hover:-translate-y-1 transition-transform duration-200 focus:outline-none focus:ring-2 focus:ring-[#C9552F] text-left"
    >
      {/* Real Canvas Preview */}
      <div className="h-36 w-full overflow-hidden bg-[#F3EFE6]">
        <SwatchThumbnail swatch={swatch} width={240} height={200} />
      </div>
      {/* Info */}
      <div className="p-3">
        {label && (
          <span className="inline-block rounded-full bg-[#F3EFE6] px-2 py-0.5 text-[10px] font-mono text-[#5B584F] mb-1">
            {label}
          </span>
        )}
        <h3 className="font-serif text-sm font-medium text-[#2B2A26] group-hover:text-[#C9552F]">
          {swatch.name}
        </h3>
        <p className="text-[11px] text-[#8A8579]">{swatch.category} · {swatch.generatorId}</p>
        <div className="mt-2 flex gap-1">
          {swatch.palette.slice(0, 4).map((c, i) => (
            <div key={i} style={{ backgroundColor: c }} className="h-3.5 w-3.5 rounded-full border border-black/10" />
          ))}
        </div>
      </div>
      <div className="absolute right-3 top-3 rounded-full bg-black/40 px-2 py-0.5 text-[10px] font-medium text-white opacity-0 group-hover:opacity-100 transition">
        Open in Studio →
      </div>
    </button>
  );
}

// ─── Section wrapper ──────────────────────────────────────────────────────────
function Section({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) {
  return (
    <section className="mb-14">
      <div className="mb-5">
        <h2 className="font-serif text-2xl font-medium text-[#2B2A26]">{title}</h2>
        {subtitle && <p className="mt-1 text-sm text-[#5B584F]">{subtitle}</p>}
      </div>
      {children}
    </section>
  );
}

// ─── Color story section ──────────────────────────────────────────────────────
function ColorStoryCard({ name, palette, presets }: { name: string; palette: string[]; presets: SwatchRecipe[] }) {
  return (
    <div className="rounded-2xl border border-[#E4DFD3] bg-white overflow-hidden shadow-sm">
      <div
        className="h-20"
        style={{
          background: `linear-gradient(90deg, ${palette.map((c, i) => `${c} ${(i / (palette.length - 1)) * 100}%`).join(", ")})`,
        }}
      />
      <div className="p-4">
        <h3 className="font-serif text-base font-medium text-[#2B2A26]">{name}</h3>
        <p className="mt-1 text-xs text-[#5B584F]">{presets.length} wallpapers in this palette family</p>
        <div className="mt-3 flex gap-1">
          {palette.map((c, i) => (
            <div key={i} style={{ backgroundColor: c }} className="h-4 w-4 rounded border border-black/10" title={c} />
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Generator spotlight ──────────────────────────────────────────────────────
function GeneratorSpotlight({
  id,
  label,
  description,
  emoji,
  examples,
}: {
  id: string;
  label: string;
  description: string;
  emoji: string;
  examples: SwatchRecipe[];
}) {
  const store = useEditorStore();
  const router = useRouter();

  return (
    <div className="rounded-2xl border border-[#E4DFD3] bg-white p-5 shadow-sm">
      <div className="flex items-start gap-3">
        <span className="text-2xl">{emoji}</span>
        <div>
          <h3 className="font-serif text-lg font-medium text-[#2B2A26]">{label}</h3>
          <p className="mt-1 text-xs text-[#5B584F]">{description}</p>
        </div>
      </div>
      <div className="mt-4 grid grid-cols-3 gap-2">
        {examples.slice(0, 3).map(s => (
          <button
            key={s.id}
            type="button"
            className="group rounded-lg overflow-hidden border border-[#E4DFD3] hover:border-[#C9552F] transition"
            onClick={() => {
              store.setGenerator(s.generatorId);
              store.setPalette([...s.palette]);
              store.setMode(s.mode);
              store.setSeed(s.seed);
              Object.entries(s.params).forEach(([key, val]) => store.updateParam(s.generatorId, key, val));
              router.push("/");
            }}
          >
            <div
              className="h-16"
              style={{
                background: `linear-gradient(135deg, ${s.palette[0]} 0%, ${s.palette[s.palette.length - 1]} 100%)`,
              }}
            />
            <div className="px-2 py-1 text-[10px] text-[#5B584F] group-hover:text-[#C9552F] truncate">{s.name}</div>
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────
export default function InspirationPage() {
  const [tab, setTab] = useState<"archive" | "studio">("archive");
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  const trending = ARCHIVE_PRESETS.filter(p => p.isTrending);
  const newest = ARCHIVE_PRESETS.filter(p => p.isNew);
  const dark = ARCHIVE_PRESETS.filter(p => p.categoryTag === "dark" || p.mode === "dark").slice(0, 6);
  const pastel = ARCHIVE_PRESETS.filter(p => p.categoryTag === "pastel").slice(0, 6);
  const waveformPresets = ARCHIVE_PRESETS.filter(p => p.generatorId === "waveform").slice(0, 3);
  const gradientPresets = ARCHIVE_PRESETS.filter(p => p.generatorId === "fluid-gradient").slice(0, 3);
  const geometricPresets = ARCHIVE_PRESETS.filter(p => p.generatorId === "geometric").slice(0, 3);
  const typographyPresets = ARCHIVE_PRESETS.filter(p => p.generatorId === "typography").slice(0, 3);

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

      <main className="mx-auto max-w-7xl px-6 py-10">
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-serif text-3xl font-medium text-[#2B2A26]">Inspiration</h1>
          <p className="mt-2 text-sm text-[#5B584F]">
            Discover wallpapers from every generator, colour story, and mood. Click any card to open it directly in Studio.
          </p>
        </div>

        {/* Featured Today Banner */}
        {(() => {
          const featured = getFeaturedTodayRecipe();
          return (
            <div className="mb-12 rounded-2xl border border-[#E4DFD3] bg-[#F3EFE6] p-6 shadow-xs flex flex-col md:flex-row items-center gap-6">
              <div className="h-48 w-36 shrink-0 overflow-hidden rounded-lg border border-[#D4CDBC] shadow-md">
                <SwatchThumbnail swatch={featured} width={280} height={360} />
              </div>
              <div className="flex-1">
                <span className="font-mono text-[10px] uppercase tracking-wider text-[#C9552F]">
                  Featured Today · {new Date().toLocaleDateString(undefined, { weekday: "long", month: "short", day: "numeric" })}
                </span>
                <h2 className="font-serif text-2xl font-medium text-[#2B2A26] mt-1">{featured.name}</h2>
                <p className="text-xs text-[#5B584F] mt-1 leading-relaxed">
                  Daily deterministic pick. Every visitor sees the same curated artwork today. Remix parameters or export in high-resolution.
                </p>
                <div className="mt-4 flex gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      const store = useEditorStore.getState();
                      store.setGenerator(featured.generatorId);
                      store.setPalette([...featured.palette]);
                      store.setMode(featured.mode);
                      store.setSeed(featured.seed);
                      Object.entries(featured.params).forEach(([key, val]) => {
                        store.updateParam(featured.generatorId, key, val);
                      });
                      router.push("/");
                    }}
                    className="rounded-xl bg-[#2B2A26] px-4 py-2.5 text-xs font-medium text-white shadow-xs hover:bg-[#1a1917]"
                  >
                    ✦ Remix Featured Wallpaper
                  </button>
                  <Link
                    href={`/r/${featured.id}`}
                    className="rounded-xl border border-[#D4CDBC] bg-white px-4 py-2.5 text-xs font-medium text-[#5B584F] hover:bg-[#FAF8F4]"
                  >
                    Share Recipe →
                  </Link>
                </div>
              </div>
            </div>
          );
        })()}

        {/* Trending */}
        <Section title="Trending Now" subtitle="The most popular prints across the archive this week.">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-4">
            {trending.map(s => (
              <InspirationCard key={s.id} swatch={s} label="Trending" />
            ))}
          </div>
        </Section>

        {/* Recently Added */}
        <Section title="Recently Added" subtitle="Fresh wallpapers added to the archive.">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-4">
            {newest.map(s => (
              <InspirationCard key={s.id} swatch={s} label="New" />
            ))}
          </div>
        </Section>

        {/* Color Stories */}
        <Section title="Color Stories" subtitle="Explore the archive by dominant palette family.">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <ColorStoryCard
              name="Midnight Blues"
              palette={["#050510", "#1A0A30", "#3A1A60", "#8040C0"]}
              presets={dark}
            />
            <ColorStoryCard
              name="Warm Earth"
              palette={["#C4A882", "#8C6E50", "#5A4030", "#2E2018"]}
              presets={ARCHIVE_PRESETS.filter(p => p.categoryTag === "earth-sand")}
            />
            <ColorStoryCard
              name="Botanical Greens"
              palette={["#2C3B28", "#5C7A50", "#A8C490", "#EDE8DC"]}
              presets={ARCHIVE_PRESETS.filter(p => p.categoryTag === "botanicals")}
            />
            <ColorStoryCard
              name="Candy Pastels"
              palette={["#FFE5F0", "#FFB3D1", "#C0A8E8", "#B0EEDD"]}
              presets={pastel}
            />
          </div>
        </Section>

        {/* Device Picks */}
        <Section title="Device Picks" subtitle="Optimised for specific screen types and form factors.">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="rounded-2xl border border-[#E4DFD3] bg-white p-5 shadow-sm">
              <h3 className="font-serif text-base font-medium">📱 OLED Phones</h3>
              <p className="mt-1 text-xs text-[#5B584F]">True black wallpapers that save battery on OLED displays.</p>
              <div className="mt-3 grid grid-cols-3 gap-2">
                {dark.slice(0, 3).map(s => (
                  <InspirationCard key={s.id} swatch={s} />
                ))}
              </div>
            </div>
            <div className="rounded-2xl border border-[#E4DFD3] bg-white p-5 shadow-sm">
              <h3 className="font-serif text-base font-medium">🖥️ Widescreen</h3>
              <p className="mt-1 text-xs text-[#5B584F]">Geometric and landscape patterns that thrive on wide displays.</p>
              <div className="mt-3 grid grid-cols-3 gap-2">
                {geometricPresets.slice(0, 3).map(s => (
                  <InspirationCard key={s.id} swatch={s} />
                ))}
              </div>
            </div>
            <div className="rounded-2xl border border-[#E4DFD3] bg-white p-5 shadow-sm">
              <h3 className="font-serif text-base font-medium">📟 Cover Screens</h3>
              <p className="mt-1 text-xs text-[#5B584F]">Punchy gradients and minimal prints for foldable cover displays.</p>
              <div className="mt-3 grid grid-cols-3 gap-2">
                {trending.slice(0, 3).map(s => (
                  <InspirationCard key={s.id} swatch={s} />
                ))}
              </div>
            </div>
          </div>
        </Section>

        {/* Generator Spotlights */}
        <Section title="Generator Spotlights" subtitle="Each generator is a distinct visual engine. Explore them all.">
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
            <GeneratorSpotlight
              id="waveform"
              emoji="〰️"
              label="Waveform"
              description="Stacked sine curves and organic ridgelines. The most landscape-like generator."
              examples={waveformPresets}
            />
            <GeneratorSpotlight
              id="fluid-gradient"
              emoji="💧"
              label="Fluid Gradient"
              description="Blurred blob meshes with swirl and distortion. Great for soft, glowing looks."
              examples={gradientPresets}
            />
            <GeneratorSpotlight
              id="geometric"
              emoji="△"
              label="Geometric"
              description="Grids of circles, squares, and triangles. Dense patterns with precise structure."
              examples={geometricPresets}
            />
            <GeneratorSpotlight
              id="typography"
              emoji="T"
              label="Typography"
              description="Single word or phrase set in serif or sans. The text is the wallpaper."
              examples={typographyPresets}
            />
          </div>
        </Section>
      </main>
    </div>
  );
}
