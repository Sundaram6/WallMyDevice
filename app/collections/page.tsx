"use client";

import { useState } from "react";
import Link from "next/link";
import { ArchiveTopbar } from "@/components/archive/ArchiveTopbar";
import { ARCHIVE_PRESETS, type SwatchRecipe } from "@/lib/presets/archive-presets";
import { useEditorStore } from "@/store/useEditorStore";
import { useRouter } from "next/navigation";

// ─── Collection definitions ───────────────────────────────────────────────────
type Collection = {
  id: string;
  title: string;
  description: string;
  itemIds: string[];
  emoji: string;
};

const COLLECTIONS: Collection[] = [
  {
    id: "botanical-calm",
    title: "Botanical Calm",
    emoji: "🌿",
    description: "Organic waveforms and earthy palettes inspired by leaves, moss, and quiet forest light.",
    itemIds: ["terracotta-bloom", "indigo-garden", "olive-branch", "fern-shadow", "sage-smoke", "moss-tide", "forest-depth"],
  },
  {
    id: "midnight-screens",
    title: "Midnight Screens",
    emoji: "🌑",
    description: "OLED-optimised dark wallpapers built for true-black displays and deep ambient modes.",
    itemIds: ["abyss", "void-matter", "carbon-waves", "nightfall", "obsidian-flow", "static-noise", "nebula-drift"],
  },
  {
    id: "warm-minimalism",
    title: "Warm Minimalism",
    emoji: "☀️",
    description: "Soft paper textures and linen-toned gradients. Nothing unnecessary, nothing missing.",
    itemIds: ["paper-field", "linen-wave", "dust-circle", "fog-gradient", "rice-paper", "dune-flow", "ochre-field"],
  },
  {
    id: "bold-geometry",
    title: "Bold Geometry",
    emoji: "◆",
    description: "Sharp angles, high-contrast grids, and graphic triangles that command attention.",
    itemIds: ["cobalt-fracture", "hex-field", "diamond-grid", "neon-grid", "circuit-lines", "arches-shadows", "prism-break"],
  },
  {
    id: "soft-pastels",
    title: "Soft Pastels",
    emoji: "🌸",
    description: "Gentle candy gradients and dreamy haze for a tender, pastel-forward home screen.",
    itemIds: ["cotton-sky", "blush-petal", "mint-cool", "lavender-haze", "peach-soft", "candy-cloud", "blush-terrain"],
  },
  {
    id: "earth-tones",
    title: "Earth Tones",
    emoji: "🪨",
    description: "Sienna, ochre, clay, and desert — warm sediment-layer palettes for grounded aesthetics.",
    itemIds: ["dune-flow", "horizon-weave", "desert-rift", "ochre-field", "clay-plates", "sagebrush-lines"],
  },
  {
    id: "editorial-type",
    title: "Editorial Type",
    emoji: "A",
    description: "Typography-driven wallpapers where bold serifs and tracked caps become the visual.",
    itemIds: ["editorial-bold", "mono-whisper", "serif-study", "blueprint-text", "code-poetic", "type-specimen"],
  },
  {
    id: "retro-wave",
    title: "Retro Wave",
    emoji: "📼",
    description: "VHS grain, vaporwave grids, and lo-fi gradient sunsets built on analogue memory.",
    itemIds: ["vhs-noise", "vapor-grid", "lofi-sunset", "pixel-garden", "crt-glow"],
  },
];

// ─── Colour chip row ──────────────────────────────────────────────────────────
function PaletteStrip({ presets }: { presets: SwatchRecipe[] }) {
  const palette = presets.flatMap(p => p.palette).slice(0, 8);
  const unique = [...new Set(palette)].slice(0, 6);
  return (
    <div className="mt-3 flex items-center gap-1">
      {unique.map((c, i) => (
        <div key={i} style={{ backgroundColor: c }} className="h-4 w-4 rounded-full border border-black/10 shadow-sm" />
      ))}
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────
export default function CollectionsPage() {
  const [tab, setTab] = useState<"archive" | "studio">("archive");
  const [searchQuery, setSearchQuery] = useState("");
  const [expanded, setExpanded] = useState<string | null>(null);
  const store = useEditorStore();
  const router = useRouter();

  function loadIntoStudio(swatch: SwatchRecipe) {
    store.setGenerator(swatch.generatorId);
    store.setPalette([...swatch.palette]);
    store.setMode(swatch.mode);
    store.setSeed(swatch.seed);
    Object.entries(swatch.params).forEach(([key, val]) => {
      store.updateParam(swatch.generatorId, key, val);
    });
    router.push("/");
  }

  const filteredCollections = COLLECTIONS.filter(c => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return c.title.toLowerCase().includes(q) || c.description.toLowerCase().includes(q);
  });

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
          <h1 className="font-serif text-3xl font-medium text-[#2B2A26]">Curated Collections</h1>
          <p className="mt-2 text-sm text-[#5B584F]">
            Themed series that group archive recipes by mood, colour story, or visual language. Pick a collection and open any wallpaper in Studio.
          </p>
        </div>

        {/* Collection grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredCollections.map((col) => {
            const items = col.itemIds
              .map(id => ARCHIVE_PRESETS.find(p => p.id === id))
              .filter((p): p is SwatchRecipe => !!p);
            const isOpen = expanded === col.id;

            return (
              <article key={col.id} className="rounded-2xl border border-[#E4DFD3] bg-white shadow-sm overflow-hidden">
                {/* Cover */}
                <div
                  className="relative h-40 flex items-center justify-center cursor-pointer"
                  style={{
                    background: `linear-gradient(135deg, ${items[0]?.palette[0] ?? "#E4DFD3"} 0%, ${items[0]?.palette[1] ?? "#FAF8F4"} 50%, ${items[1]?.palette[0] ?? "#D4CDBC"} 100%)`,
                  }}
                  onClick={() => setExpanded(isOpen ? null : col.id)}
                >
                  <span className="text-5xl drop-shadow">{col.emoji}</span>
                  <span className="absolute top-3 right-3 rounded-full bg-black/30 px-2 py-0.5 text-[10px] text-white font-mono">
                    {items.length} prints
                  </span>
                </div>

                {/* Info */}
                <div className="p-4">
                  <h2
                    className="font-serif text-lg font-medium text-[#2B2A26] cursor-pointer hover:text-[#C9552F]"
                    onClick={() => setExpanded(isOpen ? null : col.id)}
                  >
                    {col.title}
                  </h2>
                  <p className="mt-1 text-xs text-[#5B584F] leading-relaxed line-clamp-2">{col.description}</p>
                  <PaletteStrip presets={items} />

                  <button
                    type="button"
                    onClick={() => setExpanded(isOpen ? null : col.id)}
                    className="mt-3 text-xs font-medium text-[#C9552F] hover:underline"
                  >
                    {isOpen ? "Hide prints ↑" : `Browse ${items.length} prints →`}
                  </button>
                </div>

                {/* Expanded item list */}
                {isOpen && (
                  <div className="border-t border-[#E4DFD3] divide-y divide-[#F3EFE6] bg-[#FAF8F4]">
                    {items.map((swatch) => (
                      <button
                        key={swatch.id}
                        type="button"
                        className="flex w-full items-center gap-3 px-4 py-2.5 text-left hover:bg-[#F0EBE2] transition group"
                        onClick={() => loadIntoStudio(swatch)}
                      >
                        {/* Mini palette */}
                        <div className="flex gap-0.5 shrink-0">
                          {swatch.palette.slice(0, 3).map((c, i) => (
                            <div key={i} style={{ backgroundColor: c }} className="h-5 w-5 rounded border border-black/10" />
                          ))}
                        </div>
                        <div className="min-w-0">
                          <div className="text-xs font-medium text-[#2B2A26] group-hover:text-[#C9552F] truncate">
                            {swatch.name}
                          </div>
                          <div className="text-[10px] text-[#8A8579]">{swatch.category}</div>
                        </div>
                        <span className="ml-auto text-[10px] text-[#C9552F] opacity-0 group-hover:opacity-100">Open →</span>
                      </button>
                    ))}
                  </div>
                )}
              </article>
            );
          })}
        </div>

        {filteredCollections.length === 0 && (
          <div className="py-20 text-center text-sm text-[#8A8579]">
            No collections match your search.
          </div>
        )}
      </main>
    </div>
  );
}
