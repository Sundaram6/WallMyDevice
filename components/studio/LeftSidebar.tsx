"use client";

import { useState } from "react";
import { GeneratorPicker } from "../Panel/GeneratorPicker";
import { RecipeLoader } from "../Panel/RecipeLoader";
import { DEVICE_METADATA_CATALOG } from "@/lib/devices/metadataCatalog";
import { useEditorStore } from "@/store/useEditorStore";

type LeftTab = "devices" | "generators" | "templates" | "history";

export function LeftSidebar() {
  const [activeTab, setActiveTab] = useState<LeftTab>("generators");
  const deviceType = useEditorStore((s) => s.deviceType);
  const setDeviceType = useEditorStore((s) => s.setDeviceType);
  const setPhoneSelection = useEditorStore((s) => s.setPhoneSelection);
  const setCustomSize = useEditorStore((s) => s.setCustomSize);

  return (
    <aside
      className="hidden md:flex h-full w-80 shrink-0 flex-col overflow-hidden text-xs z-10"
      style={{
        background: "var(--color-bg)",
        borderRight: "1px solid var(--color-border)",
        color: "var(--color-ink)",
      }}
    >
      {/* Tab Navigation Header */}
      <div className="flex border-b border-brand-border bg-brand-surface p-1 gap-1">
        {(
          [
            { id: "generators", label: "Generators", icon: "🎨" },
            { id: "devices", label: "Devices", icon: "📱" },
            { id: "templates", label: "Presets", icon: "💎" },
            { id: "history", label: "History", icon: "⏱️" },
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

      {/* Tab Content Panel */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {activeTab === "generators" && (
          <div className="space-y-3">
            <h3 className="text-[10px] font-mono uppercase tracking-wider text-brand-faint">
              Procedural Generators
            </h3>
            <GeneratorPicker />
          </div>
        )}

        {activeTab === "devices" && (
          <div className="space-y-4">
            <h3 className="text-[10px] font-mono uppercase tracking-wider text-brand-faint">
              Metadata Device Library
            </h3>
            <div className="space-y-2">
              {DEVICE_METADATA_CATALOG.map((device) => (
                <button
                  key={device.id}
                  type="button"
                  onClick={() => {
                    if (device.category === "phone") {
                      setDeviceType("phone");
                      setPhoneSelection(device.brand.toLowerCase(), device.id);
                    } else if (device.category === "tablet") {
                      setDeviceType("tablet");
                    } else {
                      setDeviceType("desktop");
                    }
                    setCustomSize(device.screenWidthPx, device.screenHeightPx);
                  }}
                  className="w-full text-left rounded-xl p-3 border border-brand-border bg-brand-surface hover:border-brand-accent transition-all group"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-brand-ink group-hover:text-brand-accent">
                      {device.model}
                    </span>
                    <span className="text-[10px] font-mono text-brand-faint uppercase bg-brand-bg px-1.5 py-0.5 rounded border border-brand-border">
                      {device.brand}
                    </span>
                  </div>
                  <div className="mt-1 flex items-center gap-2 text-[10.5px] font-mono text-brand-muted">
                    <span>{device.resolutionLabel}</span>
                    <span>•</span>
                    <span className="capitalize">{device.cutout.type}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {activeTab === "templates" && (
          <div className="space-y-3">
            <h3 className="text-[10px] font-mono uppercase tracking-wider text-brand-faint">
              Recipes & Presets
            </h3>
            <RecipeLoader />
          </div>
        )}

        {activeTab === "history" && (
          <div className="space-y-3">
            <h3 className="text-[10px] font-mono uppercase tracking-wider text-brand-faint">
              Session History
            </h3>
            <div className="rounded-xl border border-brand-border bg-brand-surface p-4 text-center text-brand-muted text-xs">
              <p>History snapshots record automatically on every edit.</p>
              <p className="mt-2 text-[10px] font-mono text-brand-faint">Press ⌘Z to Undo, ⌘⇧Z to Redo</p>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
