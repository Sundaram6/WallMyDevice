"use client";

import { useState } from "react";
import { ArchiveTopbar } from "@/components/archive/ArchiveTopbar";
import Link from "next/link";
import { CURRENT_VERSION } from "@/lib/changelog/data";

export default function AboutPage() {
  const [tab, setTab] = useState<"archive" | "studio">("archive");
  const [searchQuery, setSearchQuery] = useState("");
  const [feedbackText, setFeedbackText] = useState("");
  const [feedbackType, setFeedbackType] = useState<"feedback" | "feature">("feedback");
  const [userEmail, setUserEmail] = useState("");

  function handleSubmit() {
    if (!feedbackText.trim()) return;
    const title = encodeURIComponent(`[${feedbackType.toUpperCase()}] WallMyDevice ${CURRENT_VERSION}`);
    const body = encodeURIComponent(
      `**Category**: ${feedbackType}\n**Version**: ${CURRENT_VERSION}\n**User Email**: ${
        userEmail || "Not provided"
      }\n\n**Description**:\n${feedbackText.trim()}`
    );
    const githubUrl = `https://github.com/Sundaram6/WallMyDevice/issues/new?title=${title}&body=${body}`;
    window.open(githubUrl, "_blank");
  }

  return (
    <div className="min-h-screen bg-paper-50 text-ink-900 font-sans">
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
          <span className="font-mono text-xs uppercase tracking-widest text-accent-500">
            Documentation &amp; Guide · {CURRENT_VERSION}
          </span>
          <h1 className="mt-2 font-serif text-3xl font-medium tracking-tight text-ink-900 md:text-4xl">
            About WallMyDevice
          </h1>
          <p className="mt-3 text-sm text-ink-700 max-w-xl mx-auto">
            High-precision, procedural wallpaper creation tailored for modern device displays.
          </p>
          <div className="mt-4 flex justify-center gap-3">
            <Link
              href="/changelog"
              className="rounded-xl border border-accent-500 bg-accent-500/10 px-4 py-2 text-xs font-medium text-accent-500 hover:bg-accent-500 hover:text-white transition"
            >
              ✦ Read Release Changelog ({CURRENT_VERSION})
            </Link>
          </div>
        </div>

        <div className="space-y-8 text-sm leading-relaxed text-ink-900">
          <section className="rounded-2xl border border-paper-200 bg-white p-6 md:p-8 shadow-sm">
            <h2 className="font-serif text-xl font-medium text-ink-900 mb-3 flex items-center gap-2">
              <span className="text-accent-500">✦</span> What WallMyDevice Does
            </h2>
            <p className="text-ink-700">
              WallMyDevice is an interactive procedural wallpaper laboratory built for digital artists and device enthusiasts. It synthesizes geometric patterns, fluid gradients, and typography directly on-device using canvas and WebGL shaders, ensuring pixel-perfect resolution without compression artifacts.
            </p>
          </section>

          <section className="rounded-2xl border border-paper-200 bg-white p-6 md:p-8 shadow-sm">
            <h2 className="font-serif text-xl font-medium text-ink-900 mb-3 flex items-center gap-2">
              <span className="text-accent-500">✦</span> Deterministic Seeds &amp; Reproducibility
            </h2>
            <p className="text-ink-700">
              Every generated wallpaper is powered by a pseudo-random seed string. Re-entering the exact seed along with matching parameters, palette, and resolution will reconstruct the identical artwork deterministically. You can easily save and share your creations via recipe hashes or state snapshots.
            </p>
          </section>

          <section className="rounded-2xl border border-paper-200 bg-white p-6 md:p-8 shadow-sm">
            <h2 className="font-serif text-xl font-medium text-ink-900 mb-3 flex items-center gap-2">
              <span className="text-accent-500">⚠️</span> Accurate Product Boundaries &amp; Limitations
            </h2>
            <ul className="space-y-2 text-xs text-ink-700 list-disc list-inside">
              <li><b>Local Profile Only:</b> Favourites, collections, and settings reside in your browser&apos;s localStorage (no cloud accounts or authentication).</li>
              <li><b>Active Generators:</b> Supports Waveform, Fluid Gradient, Geometric, and Typography generators.</li>
              <li><b>WebGL &amp; Canvas:</b> WebGL hardware acceleration is used for fluid shaders with automatic CPU canvas fallbacks.</li>
              <li><b>Browser-Based Export:</b> High-resolution PNG/SVG images and ZIP multi-device packs generate directly in-browser.</li>
              <li><b>Animated Export:</b> Live Wallpaper MP4/WebM export is a documented future capability boundary.</li>
            </ul>
          </section>

          {/* Feedback Form Section */}
          <section className="rounded-2xl border border-paper-200 bg-white p-6 md:p-8 shadow-sm">
            <h2 className="font-serif text-xl font-medium text-ink-900 mb-2">
              Feedback &amp; Feature Requests
            </h2>
            <p className="text-xs text-ink-700 mb-6">
              Submissions open a prefilled GitHub issue directly so feedback reaches the developer immediately.
            </p>

            <div className="mb-4 flex gap-1 rounded-xl border border-paper-200 bg-paper-50 p-1">
              {(["feedback", "feature"] as const).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setFeedbackType(t)}
                  className={`flex-1 rounded-lg py-2 text-xs font-medium transition ${
                    feedbackType === t
                      ? "bg-ink-900 text-white shadow"
                      : "text-ink-700 hover:text-ink-900"
                  }`}
                >
                  {t === "feedback" ? "🐛 Bug / Feedback" : "💡 Request a Feature"}
                </button>
              ))}
            </div>

            <div className="mb-3 space-y-2">
              <input
                type="email"
                value={userEmail}
                onChange={(e) => setUserEmail(e.target.value)}
                placeholder="Optional contact email..."
                className="w-full rounded-xl border border-paper-300 bg-paper-50 px-4 py-2.5 text-xs text-ink-900 placeholder-[var(--ink-500)] focus:border-accent-500 focus:outline-none"
              />
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
                className="w-full resize-none rounded-xl border border-paper-300 bg-paper-50 px-4 py-3 text-xs text-ink-900 placeholder-[var(--ink-500)] focus:border-accent-500 focus:outline-none"
              />
            </div>

            <div className="mt-2 flex items-center justify-between">
              <span className="text-[10px] text-ink-500">{feedbackText.length}/1000</span>
              <button
                type="button"
                disabled={!feedbackText.trim()}
                onClick={handleSubmit}
                className="rounded-xl bg-ink-900 px-5 py-2.5 text-xs font-medium text-white shadow transition-colors duration-[--dur-fast] hover:bg-accent-500 disabled:opacity-40"
              >
                Submit via GitHub Issue →
              </button>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
