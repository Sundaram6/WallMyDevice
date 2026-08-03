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
      className="hidden md:flex h-full w-[350px] shrink-0 flex-col overflow-hidden text-xs z-10 shadow-1 border-r border-paper-200"
      style={{
        background: "var(--paper-100)",
        color: "var(--ink-900)",
      }}
    >
      {/* Tab Navigation Header */}
      <div className="flex border-b border-paper-200 bg-paper-100 p-1 gap-1">
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

      {/* Tab Content Panel */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {activeTab === "generators" && (
          <div className="space-y-3">
            <h3 className="text-[10px] font-mono uppercase tracking-wider text-ink-500">
              Procedural Generators
            </h3>
            <GeneratorPicker />
          </div>
        )}

        {activeTab === "devices" && (
          <div className="space-y-4">
            <h3 className="text-[10px] font-mono uppercase tracking-wider text-ink-500">
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
                  className="w-full text-left rounded-xl p-3 border border-paper-300 bg-paper-100 hover:border-accent-500 transition-all duration-[--dur-fast] group shadow-1"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-ink-900 group-hover:text-accent-500 transition-colors duration-[--dur-fast]">
                      {device.model}
                    </span>
                    <span className="text-[10px] font-mono text-ink-500 uppercase bg-paper-50 px-1.5 py-0.5 rounded border border-paper-300">
                      {device.brand}
                    </span>
                  </div>
                  <div className="mt-1 flex items-center gap-2 text-[10.5px] font-mono text-ink-500">
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
            <h3 className="text-[10px] font-mono uppercase tracking-wider text-ink-500">
              Recipes & Presets
            </h3>
            <RecipeLoader />
          </div>
        )}

        {activeTab === "history" && (
          <div className="space-y-3">
            <h3 className="text-[10px] font-mono uppercase tracking-wider text-ink-500">
              Session History
            </h3>
            <div className="rounded-xl border border-paper-300 bg-paper-100 p-4 text-center text-ink-500 text-xs shadow-1">
              <p>History snapshots record automatically on every edit.</p>
              <p className="mt-2 text-[10px] font-mono text-ink-500">Press ⌘Z to Undo, ⌘⇧Z to Redo</p>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
