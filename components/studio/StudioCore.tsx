"use client";

import Link from "next/link";
import { TopToolbar } from "./TopToolbar";
import { LeftSidebar } from "./LeftSidebar";
import { CenterWorkspace } from "./CenterWorkspace";
import { RightSidebar } from "./RightSidebar";
import { BottomBar } from "./BottomBar";
import { ControlPanel } from "@/components/Panel/ControlPanel";
import { BottomSheet } from "@/components/Preview/BottomSheet";
import { KeyboardShortcuts } from "@/components/KeyboardShortcuts";
import { DropZone } from "@/components/DropZone";
import { CURRENT_VERSION } from "@/lib/changelog/data";
import { useStudioCore } from "./useStudioCore";

export function StudioCore({ layout = "full" }: { layout?: "inline" | "full" }) {
  const {
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
        className={`relative flex flex-col w-full font-sans overflow-hidden ${
          isInline
            ? "h-[680px] rounded-3xl border border-brand-border"
            : "h-full"
        }`}
        style={{ background: "var(--color-bg)", color: "var(--color-ink)" }}
      >
        <KeyboardShortcuts />

        {/* ── Top Toolbar ────────────────────────────────────────── */}
        {!isInline && <TopToolbar />}

        {/* Notification banners */}
        {(whatsNewBanner || deviceNotice) && (
          <div className="shrink-0 flex flex-col gap-1 px-4 pt-2 z-30">
            {whatsNewBanner && (
              <div className="flex items-center justify-between gap-2 rounded-lg border border-brand-accent/30 bg-brand-accent/10 px-3 py-1.5 text-[11px] font-mono text-brand-accent">
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
              <div className="flex items-center justify-between gap-2 rounded-lg border border-brand-border bg-brand-surface px-3 py-1.5 text-[11px] font-mono text-brand-muted">
                <span>📱 {deviceNotice}</span>
                <button type="button" onClick={() => setDeviceNotice(null)} aria-label="Dismiss" className="opacity-50 hover:opacity-100">✕</button>
              </div>
            )}
          </div>
        )}

        {/* ── 3-Pane Editor Body ───────────────────────────────────── */}
        <div className="flex flex-1 min-h-0 w-full overflow-hidden">
          {/* Left Sidebar: Assets & Device Library */}
          <LeftSidebar />

          {/* Center Workspace: Infinite Canvas & Auto-fit Viewport */}
          <CenterWorkspace isInline={isInline} />

          {/* Right Sidebar: Properties & Controls */}
          <RightSidebar />
        </div>

        {/* ── Bottom Bar ───────────────────────────────────────────── */}
        {!isInline && <BottomBar />}

        {/* Mobile Bottom Sheet Handoff */}
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
