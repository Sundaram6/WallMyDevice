"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/Button";
import { TabPill, type TabOption } from "@/components/ui/TabPill";
import { Slider } from "@/components/ui/Slider";
import { SeedInput } from "@/components/ui/SeedInput";
import { Toggle } from "@/components/ui/Toggle";
import Link from "next/link";

const SAMPLE_TABS: readonly TabOption[] = [
  { id: "params", label: "Params" },
  { id: "colors", label: "Colors" },
  { id: "overlays", label: "Overlays", badge: "3" },
  { id: "export", label: "Export" },
];

export default function PrimitivesShowcasePage() {
  const [activeTab, setActiveTab] = useState("params");
  const [sliderVal, setSliderVal] = useState(65);
  const [seedVal, setSeedVal] = useState("8f9a2b");
  const [toggleVal, setToggleVal] = useState(true);

  return (
    <div className="min-h-screen bg-paper-50 text-ink-900 p-6 sm:p-12 font-sans space-y-10 max-w-6xl mx-auto">
      {/* Header */}
      <header className="border-b border-paper-200 pb-6 flex items-center justify-between">
        <div>
          <span className="font-mono text-[11px] uppercase tracking-widest text-accent-500">
            ✦ DESIGN SYSTEM PRIMITIVES
          </span>
          <h1 className="font-serif text-3xl font-medium text-ink-900 mt-1">
            Base UI Component Library
          </h1>
          <p className="text-xs text-ink-500 mt-1">
            Phase 1 primitives rendering side-by-side in Light (Paper) and Stage theme scopes.
          </p>
        </div>
        <Link href="/studio">
          <Button variant="primary">Go to Studio ✦</Button>
        </Link>
      </header>

      {/* Side-by-side Showcase Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Light Theme Scope */}
        <section className="rounded-lg border border-paper-200 bg-paper-100 p-6 shadow-1 space-y-8">
          <div className="border-b border-paper-200 pb-3 flex items-center justify-between">
            <h2 className="font-serif text-lg font-medium text-ink-900">Light Theme Scope</h2>
            <span className="font-mono text-[10px] text-ink-500 bg-paper-0 px-2 py-0.5 rounded-sm border border-paper-200">
              --paper-50 / --ink-900
            </span>
          </div>

          {/* 1. Buttons */}
          <div className="space-y-3">
            <h3 className="font-mono text-[11px] uppercase tracking-wider text-ink-500">1. Buttons</h3>
            <div className="flex flex-wrap items-center gap-3">
              <Button variant="primary">Primary CTA</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="ghost">Ghost Button</Button>
              <Button variant="primary" disabled>Disabled</Button>
            </div>
          </div>

          {/* 2. TabPill Switcher */}
          <div className="space-y-3">
            <h3 className="font-mono text-[11px] uppercase tracking-wider text-ink-500">2. TabPill Switcher</h3>
            <TabPill
              tabs={SAMPLE_TABS}
              activeTab={activeTab}
              onChange={setActiveTab}
              ariaLabel="Light theme tabs"
            />
          </div>

          {/* 3. Custom Range Slider */}
          <div className="space-y-3">
            <h3 className="font-mono text-[11px] uppercase tracking-wider text-ink-500">3. Custom Range Slider</h3>
            <Slider
              value={sliderVal}
              min={0}
              max={100}
              step={1}
              onChange={setSliderVal}
              label="Noise Strength"
              showValue
            />
          </div>

          {/* 4. Monospace Seed Input */}
          <div className="space-y-3">
            <h3 className="font-mono text-[11px] uppercase tracking-wider text-ink-500">4. Monospace Seed Input</h3>
            <SeedInput
              value={seedVal}
              onChange={setSeedVal}
              onShuffle={() => setSeedVal(Math.random().toString(36).substring(2, 8))}
            />
          </div>

          {/* 5. Toggle Switch */}
          <div className="space-y-3">
            <h3 className="font-mono text-[11px] uppercase tracking-wider text-ink-500">5. Toggle Switch</h3>
            <div className="flex items-center gap-4">
              <Toggle checked={toggleVal} onChange={setToggleVal} ariaLabel="Light theme toggle" />
              <span className="text-xs text-ink-700 font-sans">
                Overlay Clock: {toggleVal ? "Enabled" : "Disabled"}
              </span>
            </div>
          </div>
        </section>

        {/* Stage Theme Scope */}
        <section
          data-theme="stage"
          className="rounded-lg border border-stage-700 bg-stage-900 text-stage-ink-100 p-6 shadow-2 space-y-8"
        >
          <div className="border-b border-stage-700 pb-3 flex items-center justify-between">
            <h2 className="font-serif text-lg font-medium text-stage-ink-100">Stage Theme Scope</h2>
            <span className="font-mono text-[10px] text-stage-ink-400 bg-stage-950 px-2 py-0.5 rounded-sm border border-stage-700">
              data-theme="stage"
            </span>
          </div>

          {/* 1. Buttons */}
          <div className="space-y-3">
            <h3 className="font-mono text-[11px] uppercase tracking-wider text-stage-ink-400">1. Buttons</h3>
            <div className="flex flex-wrap items-center gap-3">
              <Button variant="primary">Export 4K ✦</Button>
              <Button variant="secondary" className="border-stage-700 bg-stage-800 text-stage-ink-100 hover:bg-stage-700">
                Secondary
              </Button>
              <Button variant="ghost" className="text-stage-ink-400 hover:bg-stage-800 hover:text-stage-ink-100">
                Ghost
              </Button>
            </div>
          </div>

          {/* 2. TabPill Switcher */}
          <div className="space-y-3">
            <h3 className="font-mono text-[11px] uppercase tracking-wider text-stage-ink-400">2. TabPill Switcher</h3>
            <div className="p-1 rounded-pill bg-stage-950 border border-stage-700">
              <TabPill
                tabs={SAMPLE_TABS}
                activeTab={activeTab}
                onChange={setActiveTab}
                ariaLabel="Stage theme tabs"
                className="bg-transparent border-0 shadow-none"
              />
            </div>
          </div>

          {/* 3. Custom Range Slider */}
          <div className="space-y-3">
            <h3 className="font-mono text-[11px] uppercase tracking-wider text-stage-ink-400">3. Custom Range Slider</h3>
            <Slider
              value={sliderVal}
              min={0}
              max={100}
              step={1}
              onChange={setSliderVal}
              label="Canvas Blur Intensity"
              showValue
            />
          </div>

          {/* 4. Monospace Seed Input */}
          <div className="space-y-3">
            <h3 className="font-mono text-[11px] uppercase tracking-wider text-stage-ink-400">4. Monospace Seed Input</h3>
            <SeedInput
              value={seedVal}
              onChange={setSeedVal}
              onShuffle={() => setSeedVal(Math.random().toString(36).substring(2, 8))}
              className="bg-stage-950 border-stage-700 text-stage-ink-100 placeholder:text-stage-ink-400"
            />
          </div>

          {/* 5. Toggle Switch */}
          <div className="space-y-3">
            <h3 className="font-mono text-[11px] uppercase tracking-wider text-stage-ink-400">5. Toggle Switch</h3>
            <div className="flex items-center gap-4">
              <Toggle checked={toggleVal} onChange={setToggleVal} ariaLabel="Stage theme toggle" />
              <span className="text-xs text-stage-ink-100 font-sans">
                Grain Shimmer: {toggleVal ? "On" : "Off"}
              </span>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
