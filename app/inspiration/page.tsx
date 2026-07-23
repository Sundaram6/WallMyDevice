"use client";

import { useState } from "react";
import { ArchiveTopbar } from "@/components/archive/ArchiveTopbar";
import Link from "next/link";

export default function InspirationPage() {
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
      <main className="mx-auto max-w-5xl px-6 py-16 text-center">
        <div className="mx-auto max-w-md rounded-2xl border border-[#E4DFD3] bg-white p-10 shadow-sm">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#F3EFE6] text-2xl text-[#C9552F]">
            💡
          </div>
          <h1 className="font-serif text-2xl font-medium text-[#2B2A26]">Design Inspiration</h1>
          <p className="mt-3 text-sm text-[#5B584F] leading-relaxed">
            Discover community creations, generative art showcases, and aesthetic setups.
          </p>
          <div className="mt-6 flex justify-center gap-3">
            <Link
              href="/"
              className="rounded-xl bg-[#2B2A26] px-5 py-2.5 text-xs font-medium text-white shadow transition hover:bg-[#1a1917]"
            >
              Explore Wallpapers
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
