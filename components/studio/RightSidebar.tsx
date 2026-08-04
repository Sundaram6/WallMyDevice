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
      className="hidden lg:flex h-full w-[350px] shrink-0 flex-col overflow-hidden text-xs z-10 shadow-1 border-l border-paper-200"
      style={{
        background: "var(--paper-100)",
        color: "var(--ink-900)",
      }}
    >
      {/* Navigation Header */}
      <div className="flex border-b border-paper-200 bg-paper-100 p-1 gap-1">
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
            className={`flex flex-1 min-w-0 items-center justify-center gap-1 rounded-md py-1.5 px-1.5 text-[10.5px] font-medium whitespace-nowrap transition-all duration-[--dur-fast] ${
              activeTab === tab.id
                ? "bg-ink-900 text-paper-0 shadow-1 font-semibold"
                : "text-ink-700 hover:text-ink-900 hover:bg-paper-200"
            }`}
          >
            <span className="shrink-0">{tab.icon}</span>
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
      <h3 className="text-[10px] font-mono font-medium uppercase tracking-wider text-ink-500">
        {title}
      </h3>
      <div className="space-y-3">{children}</div>
    </section>
  );
}
