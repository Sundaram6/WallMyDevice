"use client";

import Link from "next/link";
import { ControlPanel } from "@/components/Panel/ControlPanel";
import { PreviewCanvas } from "@/components/Preview/PreviewCanvas";
import { DeviceFrame } from "@/components/Preview/DeviceFrame";
import { BottomSheet } from "@/components/Preview/BottomSheet";
import { KeyboardShortcuts } from "@/components/KeyboardShortcuts";
import { DropZone } from "@/components/DropZone";
import { CURRENT_VERSION } from "@/lib/changelog/data";
import { useStudioCore } from "./useStudioCore";

export function StudioCore({ layout = "full" }: { layout?: "inline" | "full" }) {
  const {
    customWidth,
    customHeight,
    deviceType,
    phoneModel,
    preset,
    aspect,
    sheetCollapsed,
    setSheetCollapsed,
    whatsNewBanner,
    setWhatsNewBanner,
    deviceNotice,
    setDeviceNotice,
  } = useStudioCore();

  const isInline = layout === "inline";

  return (
    <DropZone>
      <div
        className={`relative flex w-full font-sans ${
          isInline
            ? "rounded-3xl border border-[#E4DFD3] overflow-hidden"
            : "h-full"
        }`}
        style={{ background: "#FAF8F4", color: "#2B2A26" }}
      >
        <KeyboardShortcuts />

        {/* ── LEFT: Control Panel ───────────────────────────────────── */}
        <aside
          className="hidden md:flex h-full shrink-0 flex-col overflow-hidden"
          style={{
            width: 340,
            background: "#FFFFFF",
            borderRight: "1px solid #E8E3D9",
          }}
        >
          <ControlPanel variant="sidebar" />
        </aside>

        {/* ── RIGHT: Canvas Area ─────────────────────────────────────── */}
        <main className="relative flex flex-1 min-w-0 flex-col overflow-hidden">

          {/* Notification banners */}
          {(whatsNewBanner || deviceNotice) && (
            <div className="shrink-0 flex flex-col gap-1 px-4 pt-2">
              {whatsNewBanner && (
                <div className="flex items-center justify-between gap-2 rounded-lg border border-[#C9552F]/30 bg-[#C9552F]/8 px-3 py-1.5 text-[11px] font-mono text-[#C9552F]">
                  <span>✦ New in {CURRENT_VERSION}: {whatsNewBanner}</span>
                  <div className="flex items-center gap-2">
                    <Link href="/changelog" className="underline hover:opacity-70">Changelog</Link>
                    <button
                      type="button"
                      onClick={() => {
                        localStorage.setItem("wallmydevice:last_seen_version", CURRENT_VERSION);
                        setWhatsNewBanner(null);
                      }}
                      aria-label="Dismiss"
                      className="opacity-60 hover:opacity-100"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              )}
              {deviceNotice && (
                <div className="flex items-center justify-between gap-2 rounded-lg border border-[#E4DFD3] bg-white px-3 py-1.5 text-[11px] font-mono text-[#5B584F]">
                  <span>📱 {deviceNotice}</span>
                  <button type="button" onClick={() => setDeviceNotice(null)} aria-label="Dismiss" className="opacity-50 hover:opacity-100">✕</button>
                </div>
              )}
            </div>
          )}

          {/* Canvas viewport with dot-grid background */}
          <div
            className="flex flex-1 items-center justify-center overflow-auto"
            style={{
              backgroundColor: "#EEE8DF",
              backgroundImage: "radial-gradient(circle, rgba(180,168,148,0.5) 1px, transparent 1px)",
              backgroundSize: "22px 22px",
            }}
          >
            <div className="relative z-10 p-8 md:p-14">
              <DeviceFrame
                frame={preset.frame}
                aspect={aspect}
                deviceType={deviceType}
                phoneModel={phoneModel}
              >
                <PreviewCanvas
                  frame={preset.frame}
                  aspect={aspect}
                  maxWidth={isInline ? 700 : 940}
                  maxHeight={isInline ? 600 : 820}
                />
              </DeviceFrame>
            </div>
          </div>

          {/* Bottom info strip */}
          <div
            className="shrink-0 flex items-center justify-between px-5 h-10"
            style={{ background: "#FFFFFF", borderTop: "1px solid #E8E3D9" }}
          >
            <div className="flex items-center gap-3 text-[11px] font-mono">
              <span style={{ color: "#A0968C", textTransform: "uppercase", fontSize: 9, letterSpacing: "0.08em" }}>Resolution</span>
              <span style={{ color: "#2B2A26", fontWeight: 600, fontVariantNumeric: "tabular-nums" }}>
                {customWidth}×{customHeight}
              </span>
              <span style={{ color: "#C4BAA8", fontSize: 9 }}>px</span>
            </div>
            <div className="flex items-center gap-3">
              <kbd
                className="inline-flex items-center gap-1 rounded border px-2 py-0.5"
                style={{ fontSize: 9, fontFamily: "monospace", color: "#A0968C", borderColor: "#E4DFD3", background: "#F5F1EB" }}
              >
                ⌘K randomize
              </kbd>
              <kbd
                className="inline-flex items-center gap-1 rounded border px-2 py-0.5"
                style={{ fontSize: 9, fontFamily: "monospace", color: "#A0968C", borderColor: "#E4DFD3", background: "#F5F1EB" }}
              >
                ⌘S export
              </kbd>
            </div>
          </div>
        </main>

        {/* Mobile Bottom Sheet */}
        {!isInline && (
          <div className="md:hidden">
            <BottomSheet
              title="Studio Controls"
              collapsed={sheetCollapsed}
              onSnap={setSheetCollapsed}
            >
              <ControlPanel variant="sheet" />
            </BottomSheet>
          </div>
        )}
      </div>
    </DropZone>
  );
}
