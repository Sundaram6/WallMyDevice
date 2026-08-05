"use client";

import { useState, useMemo } from "react";
import { GeneratorPicker } from "../Panel/GeneratorPicker";
import { RecipeLoader } from "../Panel/RecipeLoader";
import { DEVICE_METADATA_CATALOG, type CompleteDeviceMetadata } from "@/lib/devices/metadataCatalog";
import { useEditorStore } from "@/store/useEditorStore";
import { Search } from "lucide-react";

type LeftTab = "generators" | "devices" | "templates" | "history";

const POPULAR_FLAGSHIP_IDS = [
  "samsung-galaxy-s26-ultra",
  "samsung-galaxy-s25-ultra",
  "apple-iphone-17-pro-max",
  "apple-iphone-17-pro",
  "apple-iphone-16-pro-max",
  "apple-iphone-16-pro",
  "sony-xperia-1-vi",
  "vivo-x200-pro",
  "oppo-find-x8-pro",
  "google-pixel-9-pro-xl",
  "oneplus-13",
];

const BRAND_FILTERS = [
  { id: "popular", label: "⭐ Popular" },
  { id: "all", label: "All" },
  { id: "samsung", label: "Samsung" },
  { id: "apple", label: "Apple" },
  { id: "sony", label: "Sony" },
  { id: "vivo", label: "Vivo" },
  { id: "oppo", label: "OPPO" },
  { id: "other", label: "Other Brands" },
];

export function LeftSidebar() {
  const [activeTab, setActiveTab] = useState<LeftTab>("generators");
  const [deviceSearch, setDeviceSearch] = useState("");
  const [selectedBrand, setSelectedBrand] = useState<string>("popular");

  const deviceType = useEditorStore((s) => s.deviceType);
  const currentModel = useEditorStore((s) => s.phoneModel);
  const setDeviceType = useEditorStore((s) => s.setDeviceType);
  const setPhoneSelection = useEditorStore((s) => s.setPhoneSelection);
  const setCustomSize = useEditorStore((s) => s.setCustomSize);

  // Filter out any wearable / watch devices completely
  const validDevices = useMemo(() => {
    return DEVICE_METADATA_CATALOG.filter((d) => d.category !== ("wearable" as any) && !d.model.toLowerCase().includes("watch"));
  }, []);

  // Filtered devices based on search and brand filter
  const displayedDevices = useMemo(() => {
    let list = validDevices;

    if (deviceSearch.trim()) {
      const q = deviceSearch.toLowerCase().trim();
      return list.filter(
        (d) => d.model.toLowerCase().includes(q) || d.brand.toLowerCase().includes(q) || d.resolutionLabel.toLowerCase().includes(q)
      );
    }

    if (selectedBrand === "popular") {
      const popular = list.filter((d) => POPULAR_FLAGSHIP_IDS.includes(d.id));
      const rest = list.filter((d) => !POPULAR_FLAGSHIP_IDS.includes(d.id));
      return [...popular, ...rest];
    }

    if (selectedBrand === "all") return list;
    if (selectedBrand === "other") {
      const mainBrands = ["samsung", "apple", "sony", "vivo", "oppo"];
      return list.filter((d) => !mainBrands.includes(d.brand.toLowerCase()));
    }

    return list.filter((d) => d.brand.toLowerCase() === selectedBrand);
  }, [validDevices, deviceSearch, selectedBrand]);

  const handleSelectDevice = (device: CompleteDeviceMetadata) => {
    if (device.category === "phone") {
      setDeviceType("phone");
      setPhoneSelection(device.brand.toLowerCase(), device.id);
    } else if (device.category === "tablet") {
      setDeviceType("tablet");
    } else {
      setDeviceType("desktop");
    }
    setCustomSize(device.screenWidthPx, device.screenHeightPx);
  };

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
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-[10px] font-mono uppercase tracking-wider text-ink-500">
                Flagship & Device Catalog
              </h3>
              <span className="font-mono text-[10px] text-accent-500 font-medium">
                {displayedDevices.length} Models
              </span>
            </div>

            {/* Device Search Box */}
            <div className="relative">
              <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-500" />
              <input
                type="text"
                placeholder="Search S26, iPhone 17, Xperia, Vivo..."
                value={deviceSearch}
                onChange={(e) => setDeviceSearch(e.target.value)}
                className="w-full bg-paper-50 text-ink-900 placeholder:text-ink-400 pl-8 pr-3 py-2 text-xs rounded-xl border border-paper-300 focus:outline-none focus:border-accent-500 transition-colors"
              />
            </div>

            {/* Brand Filter Chips */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              {BRAND_FILTERS.map((b) => (
                <button
                  key={b.id}
                  type="button"
                  onClick={() => {
                    setSelectedBrand(b.id);
                    setDeviceSearch("");
                  }}
                  className={`px-2.5 py-1 text-[10.5px] rounded-full font-medium transition-all ${
                    selectedBrand === b.id && !deviceSearch
                      ? "bg-accent-500 text-white shadow-1 font-semibold"
                      : "bg-paper-50 text-ink-700 hover:bg-paper-200 border border-paper-300"
                  }`}
                >
                  {b.label}
                </button>
              ))}
            </div>

            {/* Device Cards List */}
            <div className="space-y-2 pt-1">
              {displayedDevices.map((device) => {
                const isPopular = POPULAR_FLAGSHIP_IDS.includes(device.id);
                const isActive = currentModel === device.id;

                return (
                  <button
                    key={device.id}
                    type="button"
                    onClick={() => handleSelectDevice(device)}
                    className={`w-full text-left rounded-xl p-3 border transition-all duration-[--dur-fast] group shadow-1 relative overflow-hidden ${
                      isActive
                        ? "border-accent-500 bg-accent-500/10 ring-1 ring-accent-500/40"
                        : "border-paper-300 bg-paper-100 hover:border-accent-500/60"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-medium text-ink-900 group-hover:text-accent-500 transition-colors duration-[--dur-fast] flex items-center gap-1.5">
                        <span>{device.model}</span>
                        {isPopular && (
                          <span className="text-[9px] bg-accent-500/15 text-accent-500 px-1.5 py-0.5 rounded font-mono font-semibold">
                            POPULAR
                          </span>
                        )}
                      </span>
                      <span className="text-[10px] font-mono text-ink-500 uppercase bg-paper-50 px-1.5 py-0.5 rounded border border-paper-300 shrink-0">
                        {device.brand}
                      </span>
                    </div>

                    <div className="mt-1 flex items-center gap-2 text-[10.5px] font-mono text-ink-500">
                      <span>{device.resolutionLabel}</span>
                      <span>•</span>
                      <span className="capitalize">{device.cutout.type}</span>
                    </div>
                  </button>
                );
              })}
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
