"use client";

import { useState } from "react";
import { PalettePicker } from "../Panel/PalettePicker";
import { ModeToggle } from "../Panel/ModeToggle";
import { SeedBar } from "../Panel/SeedBar";
import { ParamsForm } from "../Panel/ParamsForm";
import { ResolutionPicker } from "../Panel/ResolutionPicker";
import { FinishControls } from "../Panel/FinishControls";
import { OverlayControls } from "../Panel/OverlayControls";
import { ExportBar } from "../Panel/ExportBar";

type RightTab = "properties" | "appearance" | "effects" | "export";

export function RightSidebar() {
  const [activeTab, setActiveTab] = useState<RightTab>("properties");

  return (
    <aside
      className="hidden md:flex h-full w-80 shrink-0 flex-col overflow-hidden text-xs z-10"
      style={{
        background: "var(--color-bg)",
        borderLeft: "1px solid var(--color-border)",
        color: "var(--color-ink)",
      }}
    >
      {/* Navigation Header */}
      <div className="flex border-b border-brand-border bg-brand-surface p-1 gap-1">
        {(
          [
            { id: "properties", label: "Params", icon: "⚙️" },
            { id: "appearance", label: "Colors", icon: "🎨" },
            { id: "effects", label: "Overlays", icon: "✨" },
            { id: "export", label: "Export", icon: "💾" },
          ] as const
        ).map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={`flex flex-1 items-center justify-center gap-1 rounded-md py-1.5 px-2 text-[11px] font-medium transition-all ${
              activeTab === tab.id
                ? "bg-brand-bg text-brand-ink shadow-xs border border-brand-border font-semibold"
                : "text-brand-muted hover:text-brand-ink"
            }`}
          >
            <span>{tab.icon}</span>
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Content Inspector */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {activeTab === "properties" && (
          <div className="space-y-5">
            <Section title="Seed & Variation">
              <SeedBar />
            </Section>

            <Section title="Generator Parameters">
              <ParamsForm />
            </Section>

            <Section title="Resolution & Bounds">
              <ResolutionPicker />
            </Section>
          </div>
        )}

        {activeTab === "appearance" && (
          <div className="space-y-5">
            <Section title="Color Palette Engine">
              <PalettePicker />
              <ModeToggle />
            </Section>
          </div>
        )}

        {activeTab === "effects" && (
          <div className="space-y-5">
            <Section title="Grain & Post-Processing">
              <FinishControls />
            </Section>

            <Section title="Device UI Overlays">
              <OverlayControls />
            </Section>
          </div>
        )}

        {activeTab === "export" && (
          <div className="space-y-5">
            <Section title="High-DPI Output Pipeline">
              <ExportBar />
            </Section>
          </div>
        )}
      </div>
    </aside>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-2">
      <h3 className="text-[10px] font-mono uppercase tracking-wider text-brand-faint">
        {title}
      </h3>
      <div className="space-y-3">{children}</div>
    </section>
  );
}
