"use client";

import { useState, type ReactNode } from "react";
import { GeneratorPicker } from "./GeneratorPicker";
import { PalettePicker } from "./PalettePicker";
import { ModeToggle } from "./ModeToggle";
import { SeedBar } from "./SeedBar";
import { ResolutionPicker } from "./ResolutionPicker";
import { ParamsForm } from "./ParamsForm";
import { FinishControls } from "./FinishControls";
import { OverlayControls } from "./OverlayControls";
import { ExportBar } from "./ExportBar";
import { RecipeLoader } from "./RecipeLoader";
import { useEditorStore } from "@/store/useEditorStore";

type SectionId = "device" | "generator" | "palette" | "style" | "finish" | "recipes";

function PanelSection({
  id,
  label,
  open,
  onToggle,
  children,
  badge,
}: {
  id: SectionId;
  label: string;
  open: boolean;
  onToggle: () => void;
  children: ReactNode;
  badge?: string;
}) {
  return (
    <div style={{ borderBottom: "1px solid var(--paper-200)" }}>
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center justify-between px-6 py-3 text-left group"
        style={{ background: "transparent" }}
      >
        <div className="flex items-center gap-2">
          <span
            style={{
              fontSize: 9,
              fontFamily: "monospace",
              textTransform: "uppercase",
              letterSpacing: "0.1em",
              color: "var(--ink-400)",
              fontWeight: 500,
            }}
          >
            {label}
          </span>
          {badge && (
            <span
              style={{
                fontSize: 8,
                fontFamily: "monospace",
                color: "var(--accent-500)",
                background: "rgba(201,85,47,0.08)",
                borderRadius: 4,
                padding: "1px 5px",
                border: "1px solid rgba(201,85,47,0.2)",
              }}
            >
              {badge}
            </span>
          )}
        </div>
        <span
          style={{
            color: "var(--paper-300)",
            fontSize: 10,
            display: "inline-block",
            transform: open ? "rotate(180deg)" : "rotate(0deg)",
            transition: "transform 0.2s ease",
          }}
        >
          ▾
        </span>
      </button>
      {open && (
        <div className="px-6 pb-5">
          {children}
        </div>
      )}
    </div>
  );
}

export function ControlPanel({ variant = "sidebar" }: { variant?: "sidebar" | "sheet" }) {
  const [open, setOpen] = useState<Record<SectionId, boolean>>({
    device: false,
    generator: true,
    palette: true,
    style: false,
    finish: false,
    recipes: false,
  });

  const [safeZone, setSafeZone] = useState(false);

  function toggle(id: SectionId) {
    setOpen((prev) => ({ ...prev, [id]: !prev[id] }));
  }

  const surpriseMe = useEditorStore((s) => s.surpriseMe);
  const customWidth = useEditorStore((s) => s.customWidth);
  const customHeight = useEditorStore((s) => s.customHeight);
  const generatorId = useEditorStore((s) => s.generatorId);

  const sidebarContent = (
    <div className="flex flex-col h-full">
      {/* ── Header ─────────────────────────────────────────────── */}
      <div className="px-6 pt-7 pb-5 shrink-0" style={{ borderBottom: "1px solid var(--paper-200)" }}>
        <p
          style={{
            fontSize: 9,
            fontFamily: "monospace",
            textTransform: "uppercase",
            letterSpacing: "0.12em",
            color: "var(--accent-500)",
            marginBottom: 10,
            fontWeight: 500,
          }}
        >
          Wallpaper Studio
        </p>
        <h1
          style={{
            fontFamily: "var(--font-fraunces, Georgia, serif)",
            fontSize: 22,
            fontWeight: 500,
            fontStyle: "italic",
            color: "var(--ink-900)",
            lineHeight: 1.25,
            marginBottom: 8,
          }}
        >
          Compose your<br />wallpaper.
        </h1>
        <p style={{ fontSize: 11, color: "var(--ink-500)", lineHeight: 1.55 }}>
          Choose a generator, pick a palette, select a device. Every change re-renders live.
        </p>
      </div>

      {/* ── Scrollable sections ────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto no-scrollbar">

        {/* DEVICE */}
        <PanelSection id="device" label="Device" open={open.device} onToggle={() => toggle("device")}>
          <ResolutionPicker />
        </PanelSection>

        {/* GENERATOR */}
        <PanelSection id="generator" label="Generator" open={open.generator} onToggle={() => toggle("generator")} badge={generatorId.replace(/-/g, " ")}>
          <GeneratorPicker />
        </PanelSection>

        {/* PALETTE */}
        <PanelSection id="palette" label="Palette" open={open.palette} onToggle={() => toggle("palette")}>
          <PalettePicker />
        </PanelSection>

        {/* STYLE */}
        <PanelSection id="style" label="Style & Parameters" open={open.style} onToggle={() => toggle("style")}>
          <div className="space-y-4">
            <ModeToggle />
            <ParamsForm />
          </div>
        </PanelSection>

        {/* FINISH */}
        <PanelSection id="finish" label="Finish & Overlays" open={open.finish} onToggle={() => toggle("finish")}>
          <div className="space-y-4">
            <FinishControls />
            <OverlayControls />
          </div>
        </PanelSection>

        {/* RECIPES */}
        <PanelSection id="recipes" label="Recipes" open={open.recipes} onToggle={() => toggle("recipes")}>
          <RecipeLoader />
        </PanelSection>

        {/* SEED — always visible */}
        <div className="px-6 py-4" style={{ borderBottom: "1px solid var(--paper-200)" }}>
          <p
            style={{
              fontSize: 9,
              fontFamily: "monospace",
              textTransform: "uppercase",
              letterSpacing: "0.1em",
              color: "var(--ink-400)",
              marginBottom: 8,
            }}
          >
            Seed
          </p>
          <SeedBar />
          <label
            className="flex items-center gap-2 mt-2.5 cursor-pointer select-none"
            style={{ fontSize: 11, color: "var(--ink-700)" }}
          >
            <input
              type="checkbox"
              checked={safeZone}
              onChange={(e) => setSafeZone(e.target.checked)}
              style={{ accentColor: "var(--accent-500)" }}
            />
            Safe-zone overlay
          </label>
        </div>

        {/* SURPRISE ME */}
        <div className="px-6 py-4" style={{ borderBottom: "1px solid var(--paper-200)" }}>
          <button
            type="button"
            onClick={surpriseMe}
            className="w-full flex items-center justify-between rounded-xl px-4 py-3 transition-all"
            style={{
              fontSize: 12,
              fontWeight: 500,
              color: "var(--ink-900)",
              border: "1px solid var(--paper-300)",
              background: "var(--paper-50)",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--accent-500)";
              (e.currentTarget as HTMLButtonElement).style.color = "var(--accent-500)";
              (e.currentTarget as HTMLButtonElement).style.background = "rgba(201,85,47,0.04)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--paper-200)";
              (e.currentTarget as HTMLButtonElement).style.color = "var(--ink-900)";
              (e.currentTarget as HTMLButtonElement).style.background = "var(--paper-50)";
            }}
          >
            <span>✦ Surprise Me</span>
            <kbd
              style={{
                fontSize: 9,
                fontFamily: "monospace",
                color: "var(--ink-400)",
                border: "1px solid var(--paper-300)",
                borderRadius: 4,
                padding: "1px 5px",
                background: "var(--paper-50)",
              }}
            >
              ⌘K
            </kbd>
          </button>
        </div>
      </div>

      {/* ── Sticky Export ──────────────────────────────────────── */}
      <div
        className="shrink-0 px-6 py-4"
        style={{
          borderTop: "1px solid var(--paper-200)",
          background: "var(--paper-0)",
        }}
      >
        <ExportBar compact />
      </div>
    </div>
  );

  /* ── Mobile sheet variant ──────────────────────────────────── */
  if (variant === "sheet") {
    return <MobilePanel />;
  }

  return sidebarContent;
}

function MobilePanel() {
  const [tab, setTab] = useState<"style" | "device" | "export">("style");
  const surpriseMe = useEditorStore((s) => s.surpriseMe);

  return (
    <div className="flex flex-col gap-4 pb-8" style={{ color: "var(--ink-900)" }}>
      {/* 3-tab selector */}
      <div
        className="flex rounded-xl p-1 text-xs"
        style={{ background: "var(--paper-50)", border: "1px solid var(--paper-300)" }}
      >
        {(["style", "device", "export"] as const).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            className="flex-1 rounded-lg py-2 capitalize font-medium transition-all"
            style={{
              fontSize: 11,
              background: tab === t ? "var(--paper-0)" : "transparent",
              color: tab === t ? "var(--ink-900)" : "var(--ink-500)",
              boxShadow: tab === t ? "0 1px 3px rgba(0,0,0,0.08)" : "none",
            }}
          >
            {t === "style" ? "🎨 Style" : t === "device" ? "📱 Device" : "📤 Export"}
          </button>
        ))}
      </div>

      {tab === "style" && (
        <div className="space-y-5" data-testid="mobile-style-tab">
          <GeneratorPicker />
          <PalettePicker />
          <ModeToggle />
          <SeedBar />
          <ParamsForm />
          <button
            type="button"
            onClick={surpriseMe}
            className="w-full rounded-xl py-3 text-sm font-medium transition-all"
            style={{ border: "1px solid var(--paper-300)", background: "var(--paper-50)", color: "var(--ink-900)" }}
          >
            ✦ Surprise Me
          </button>
        </div>
      )}
      {tab === "device" && (
        <div className="space-y-4">
          <ResolutionPicker />
          <FinishControls />
          <OverlayControls />
        </div>
      )}
      {tab === "export" && (
        <div className="space-y-4">
          <ExportBar />
          <RecipeLoader />
        </div>
      )}
    </div>
  );
}
