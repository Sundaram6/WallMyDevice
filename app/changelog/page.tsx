"use client";

import { useState } from "react";
import { ArchiveTopbar } from "@/components/archive/ArchiveTopbar";
import Link from "next/link";
import { CHANGELOG_HISTORY, CURRENT_VERSION } from "@/lib/changelog/data";

export default function ChangelogPage() {
  const [tab, setTab] = useState<"archive" | "studio">("archive");
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="min-h-screen bg-[#FAF8F4] text-[#2B2A26] font-sans">
      <ArchiveTopbar
        currentTab={tab}
        onTabChange={(t) => {
          if (t === "studio") window.location.href = "/#studio";
          else setTab(t);
        }}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        favoriteCount={0}
      />
      <main className="mx-auto max-w-4xl px-6 py-12">
        <div className="mb-10 text-center">
          <span className="font-mono text-xs uppercase tracking-widest text-[#C9552F]">
            Release History · Current {CURRENT_VERSION}
          </span>
          <h1 className="mt-2 font-serif text-3xl font-medium tracking-tight text-[#2B2A26] md:text-4xl">
            What&apos;s New in WallMyDevice
          </h1>
          <p className="mt-3 text-sm text-[#5B584F] max-w-xl mx-auto">
            Honest product updates, enhancements, and known system limits.
          </p>
          <div className="mt-4 flex justify-center gap-3">
            <Link href="/" className="rounded-xl bg-[#2B2A26] px-4 py-2 text-xs text-white">
              ← Back to Archive
            </Link>
            <Link href="/about" className="rounded-xl border border-[#D4CDBC] bg-white px-4 py-2 text-xs text-[#5B584F]">
              About &amp; FAQ
            </Link>
          </div>
        </div>

        <div className="space-y-8">
          {CHANGELOG_HISTORY.map((rel) => (
            <article key={rel.version} className="rounded-2xl border border-[#E4DFD3] bg-white p-6 md:p-8 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#E4DFD3] pb-4 mb-4 gap-2">
                <div>
                  <span className="font-mono text-xs text-[#C9552F]">{rel.version}</span>
                  <h2 className="font-serif text-xl font-medium text-[#2B2A26]">{rel.title}</h2>
                </div>
                <span className="font-mono text-xs text-[#8A8579]">{rel.releaseDate}</span>
              </div>

              <p className="text-xs text-[#5B584F] mb-6 leading-relaxed">{rel.summary}</p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-mono text-xs uppercase tracking-wider text-[#2B2A26] mb-2 font-bold">
                    ✦ New Features &amp; Improvements
                  </h3>
                  <ul className="space-y-1.5 text-xs text-[#5B584F] list-disc list-inside">
                    {rel.changes.map((c, i) => (
                      <li key={i}>{c}</li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="font-mono text-xs uppercase tracking-wider text-[#2B2A26] mb-2 font-bold">
                    🛠 Fixes &amp; Polish
                  </h3>
                  <ul className="space-y-1.5 text-xs text-[#5B584F] list-disc list-inside">
                    {rel.fixes.map((f, i) => (
                      <li key={i}>{f}</li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="mt-6 border-t border-[#E4DFD3] pt-4">
                <h3 className="font-mono text-[11px] uppercase tracking-wider text-[#8A8579] mb-2">
                  ⚠️ Honest Limitations
                </h3>
                <ul className="space-y-1 text-xs text-[#8A8579] list-disc list-inside">
                  {rel.limitations.map((l, i) => (
                    <li key={i}>{l}</li>
                  ))}
                </ul>
              </div>
            </article>
          ))}
        </div>
      </main>
    </div>
  );
}
