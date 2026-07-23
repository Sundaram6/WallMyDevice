"use client";

import { useState } from "react";
import { ArchiveTopbar } from "@/components/archive/ArchiveTopbar";
import Link from "next/link";

type FeedbackEntry = {
  id: string;
  type: "feedback" | "feature";
  text: string;
  submittedAt: string;
};

const FEEDBACK_KEY = "wallmydevice:feedback";

function loadFeedback(): FeedbackEntry[] {
  try {
    const raw = localStorage.getItem(FEEDBACK_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveFeedback(entries: FeedbackEntry[]) {
  try {
    localStorage.setItem(FEEDBACK_KEY, JSON.stringify(entries));
  } catch {}
}

export default function AboutPage() {
  const [tab, setTab] = useState<"archive" | "studio">("archive");
  const [searchQuery, setSearchQuery] = useState("");
  const [feedbackText, setFeedbackText] = useState("");
  const [feedbackType, setFeedbackType] = useState<"feedback" | "feature">("feedback");
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit() {
    if (!feedbackText.trim()) return;
    const existing = loadFeedback();
    const entry: FeedbackEntry = {
      id: Date.now().toString(36),
      type: feedbackType,
      text: feedbackText.trim(),
      submittedAt: new Date().toISOString(),
    };
    saveFeedback([...existing, entry]);
    setFeedbackText("");
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  }

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
          <span className="font-mono text-xs uppercase tracking-widest text-[#C9552F]">Documentation &amp; Guide</span>
          <h1 className="mt-2 font-serif text-3xl font-medium tracking-tight text-[#2B2A26] md:text-4xl">
            About WallMyDevice
          </h1>
          <p className="mt-3 text-sm text-[#5B584F] max-w-xl mx-auto">
            High-precision, procedural wallpaper creation tailored for modern device displays.
          </p>
        </div>

        <div className="space-y-8 text-sm leading-relaxed text-[#2B2A26]">

          <section className="rounded-2xl border border-[#E4DFD3] bg-white p-6 md:p-8 shadow-sm">
            <h2 className="font-serif text-xl font-medium text-[#2B2A26] mb-3 flex items-center gap-2">
              <span className="text-[#C9552F]">✦</span> What WallMyDevice Does
            </h2>
            <p className="text-[#5B584F]">
              WallMyDevice is an interactive procedural wallpaper laboratory built for digital artists and device enthusiasts. It synthesizes geometric patterns, fluid gradients, and typography directly on-device using canvas and WebGL shaders, ensuring pixel-perfect resolution without compression artifacts.
            </p>
          </section>

          <section className="rounded-2xl border border-[#E4DFD3] bg-white p-6 md:p-8 shadow-sm">
            <h2 className="font-serif text-xl font-medium text-[#2B2A26] mb-3 flex items-center gap-2">
              <span className="text-[#C9552F]">✦</span> Deterministic Seeds &amp; Reproducibility
            </h2>
            <p className="text-[#5B584F]">
              Every generated wallpaper is powered by a pseudo-random seed string. Re-entering the exact seed along with matching parameters, palette, and resolution will reconstruct the identical artwork deterministically. You can easily save and share your creations via recipe hashes or state snapshots.
            </p>
          </section>

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

          <section className="rounded-2xl border border-[#E4DFD3] bg-white p-6 md:p-8 shadow-sm">
            <h2 className="font-serif text-xl font-medium text-[#2B2A26] mb-3 flex items-center gap-2">
              <span className="text-[#C9552F]">✦</span> Privacy &amp; Personal Use Policy
            </h2>
            <p className="text-[#5B584F]">
              All generation, grain application, and rendering happen 100% locally inside your web browser. No personal data or generated images are uploaded to external servers. Wallpapers produced are designated for personal background use across your desktop, phone, and tablet devices.
            </p>
          </section>

          <section className="rounded-2xl border border-[#E4DFD3] bg-[#F3EFE6] p-6 md:p-8 text-xs font-mono text-[#5B584F]">
            <div className="flex justify-between items-center border-b border-[#D4CDBC] pb-3 mb-3">
              <span className="font-bold text-[#2B2A26]">Build &amp; Version Specs</span>
              <span className="rounded bg-white px-2 py-0.5 border border-[#D4CDBC] text-[#2B2A26]">v0.1.2</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>Engine: WebGL2 / HTML5 Canvas2D</div>
              <div>Framework: Next.js 16 (App Router)</div>
              <div>State Management: Zustand</div>
              <div>Resolution Support: Up to 8K (15360px)</div>
            </div>
          </section>

          {/* ── Feedback & Feature Requests ──────────────────────────────────── */}
          <section id="feedback" className="rounded-2xl border border-[#E4DFD3] bg-white p-6 md:p-8 shadow-sm">
            <h2 className="font-serif text-xl font-medium text-[#2B2A26] mb-1 flex items-center gap-2">
              <span className="text-[#C9552F]">✦</span> Feedback &amp; Feature Requests
            </h2>
            <p className="text-xs text-[#5B584F] mb-5">
              Noticed something off? Have an idea for a new generator, device, or workflow? Let us know — responses are saved locally and help shape the roadmap.
            </p>

            {/* Type toggle */}
            <div className="mb-4 flex gap-1 rounded-xl border border-[#E4DFD3] bg-[#FAF8F4] p-1">
              {(["feedback", "feature"] as const).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setFeedbackType(t)}
                  className={`flex-1 rounded-lg py-2 text-xs font-medium transition ${
                    feedbackType === t
                      ? "bg-[#2B2A26] text-white shadow"
                      : "text-[#5B584F] hover:text-[#2B2A26]"
                  }`}
                >
                  {t === "feedback" ? "🐛 Bug / Feedback" : "💡 Request a Feature"}
                </button>
              ))}
            </div>

            <div className="mb-3 text-xs text-[#5B584F]">
              {feedbackType === "feedback"
                ? "Describe the issue or share your thoughts:"
                : "What feature would you like added? Be as specific as you like:"}
            </div>

            <textarea
              value={feedbackText}
              onChange={(e) => setFeedbackText(e.target.value)}
              rows={4}
              maxLength={1000}
              placeholder={
                feedbackType === "feedback"
                  ? "e.g. The waveform generator sometimes misaligns on export…"
                  : "e.g. Add Google Pixel 9a to the device catalogue, or support GIF export…"
              }
              className="w-full resize-none rounded-xl border border-[#D4CDBC] bg-[#FAF8F4] px-4 py-3 text-xs text-[#2B2A26] placeholder-[#8A8579] focus:border-[#C9552F] focus:outline-none"
            />

            <div className="mt-2 flex items-center justify-between">
              <span className="text-[10px] text-[#8A8579]">{feedbackText.length}/1000</span>
              <button
                type="button"
                disabled={!feedbackText.trim()}
                onClick={handleSubmit}
                className="rounded-xl bg-[#2B2A26] px-5 py-2.5 text-xs font-medium text-white shadow transition hover:bg-[#1a1917] disabled:opacity-40"
              >
                {submitted ? "✓ Saved!" : "Submit"}
              </button>
            </div>

            {submitted && (
              <div className="mt-3 rounded-xl bg-green-50 border border-green-200 px-4 py-3 text-xs text-green-700">
                Thank you! Your {feedbackType} has been saved locally and will be reviewed.
              </div>
            )}

            {/* Quick links */}
            <div className="mt-6 border-t border-[#E4DFD3] pt-4">
              <p className="text-xs font-medium text-[#2B2A26] mb-2">Also reach us via</p>
              <div className="flex flex-wrap gap-2">
                <a
                  href="https://github.com/Sundaram6/WallMyDevice/issues"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-lg border border-[#D4CDBC] bg-[#FAF8F4] px-3 py-1.5 text-[11px] text-[#5B584F] hover:bg-[#F0EBE2] transition"
                >
                  🐙 GitHub Issues
                </a>
                <a
                  href="https://github.com/Sundaram6/WallMyDevice/discussions"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-lg border border-[#D4CDBC] bg-[#FAF8F4] px-3 py-1.5 text-[11px] text-[#5B584F] hover:bg-[#F0EBE2] transition"
                >
                  💬 GitHub Discussions
                </a>
                <Link
                  href="/inspiration"
                  className="rounded-lg border border-[#D4CDBC] bg-[#FAF8F4] px-3 py-1.5 text-[11px] text-[#5B584F] hover:bg-[#F0EBE2] transition"
                >
                  ✦ Inspiration Gallery
                </Link>
              </div>
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
