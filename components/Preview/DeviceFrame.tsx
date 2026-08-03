import type { ReactNode } from "react";
import type { FrameStyle } from "@/lib/devices/presets";
import { findModel } from "@/lib/devices/phones";
import { S25UltraFrame } from "./S25UltraFrame";
import { IPadProFrame } from "./IPadProFrame";
import { IPhoneProFrame } from "./IPhoneProFrame";

type Props = {
  frame?: FrameStyle;
  aspect: number;
  deviceType?: string;
  phoneModel?: string;
  children: ReactNode;
  metrics?: any; // Will refine type later
};

export function DeviceFrame({ frame = "iphone", aspect, deviceType, phoneModel, children, metrics }: Props) {
  // Determine effective frame based on deviceType or preset frame
  let effectiveFrame: FrameStyle = frame;
  if (deviceType === "phone") {
    const model = phoneModel ? findModel(phoneModel) : null;
    effectiveFrame = model ? model.frame : "iphone";
  } else if (deviceType === "tablet") {
    effectiveFrame = "ipad";
  } else if (deviceType === "laptop") {
    // Graceful fallback for legacy URLs
    effectiveFrame = "desktop-monitor";
  } else if (deviceType === "desktop") {
    effectiveFrame = frame === "ultrawide" ? "ultrawide" : "desktop-monitor";
  } else if (deviceType === "custom") {
    effectiveFrame = "none";
  }

  if (effectiveFrame === "none") {
    return (
      <div data-frame={effectiveFrame} className="relative group flex items-center justify-center">
        {/* Volumetric Underglow driven by --glow-color */}
        <div 
          className="absolute -inset-6 blur-2xl opacity-75 group-hover:opacity-100 transition-all duration-[--dur-slow] pointer-events-none" 
          style={{ 
            borderRadius: metrics ? metrics.cornerRadiusLayout + 12 : 16,
            backgroundColor: "var(--glow-color, rgba(217, 84, 31, 0.3))",
            boxShadow: "var(--shadow-glow)",
          }}
        />
        <div
          className="relative overflow-hidden rounded-md bg-zinc-900 shadow-2xl ring-1 ring-white/10"
          style={{ borderRadius: metrics ? metrics.cornerRadiusLayout : undefined }}
        >
          {children}
        </div>
      </div>
    );
  }

  // Dedicated photorealistic frame for iPhone selections
  if (effectiveFrame === "iphone") {
    return (
      <div data-frame={effectiveFrame} className="flex items-center justify-center">
        <IPhoneProFrame metrics={metrics}>
          <div
            className="relative overflow-hidden bg-black"
            style={{ borderRadius: metrics ? metrics.cornerRadiusLayout : undefined }}
          >
            {children}
            <SafeZoneHint frame={effectiveFrame} metrics={metrics} />
          </div>
        </IPhoneProFrame>
      </div>
    );
  }

  // Dedicated S25 Ultra photorealistic frame for Android / Samsung phone selections
  if (effectiveFrame === "android") {
    return (
      <div data-frame={effectiveFrame} className="flex items-center justify-center">
        <S25UltraFrame metrics={metrics}>
          <div
            className="relative overflow-hidden bg-black"
            style={{ borderRadius: metrics ? metrics.cornerRadiusLayout : undefined }}
          >
            {children}
            <SafeZoneHint frame={effectiveFrame} metrics={metrics} />
          </div>
        </S25UltraFrame>
      </div>
    );
  }

  // Use dedicated iPad Pro frame for Tablet selections
  if (effectiveFrame === "ipad") {
    return (
      <div data-frame={effectiveFrame} className="flex items-center justify-center">
        <IPadProFrame metrics={metrics}>
          <div
            className="relative overflow-hidden bg-black"
            style={{ borderRadius: metrics ? metrics.cornerRadiusLayout : undefined }}
          >
            {children}
            <SafeZoneHint frame={effectiveFrame} metrics={metrics} />
          </div>
        </IPadProFrame>
      </div>
    );
  }

  return (
    <div data-frame={effectiveFrame} className="relative group flex items-center justify-center">
      {/* Volumetric Underglow driven by --glow-color */}
      <div 
        className="absolute -inset-6 blur-2xl opacity-75 group-hover:opacity-100 transition-all duration-[--dur-slow] pointer-events-none" 
        style={{ 
          borderRadius: metrics ? metrics.cornerRadiusLayout + 20 : 32,
          backgroundColor: "var(--glow-color, rgba(217, 84, 31, 0.3))",
          boxShadow: "var(--shadow-glow)",
        }}
      />
      <FrameShell frame={effectiveFrame} metrics={metrics}>
        <div
          className="relative overflow-hidden bg-black shadow-2xl"
          style={{ borderRadius: metrics ? metrics.cornerRadiusLayout : undefined }}
        >
          {children}
          {effectiveFrame === "desktop-monitor" ? <MonitorStand /> : null}
          <SafeZoneHint frame={effectiveFrame} metrics={metrics} />

          {/* Glass Specular Overlay */}
          <div className="pointer-events-none absolute inset-0 z-20 bg-gradient-to-tr from-transparent via-white/[0.04] to-transparent" />
          <div className="pointer-events-none absolute inset-0 z-20 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.1)]" />
        </div>
      </FrameShell>
    </div>
  );
}

function FrameShell({ frame, children, metrics }: { frame: FrameStyle; children: ReactNode; metrics?: any }) {
  const isMonitor = frame === "desktop-monitor" || frame === "ultrawide";
  const bezel = isMonitor
    ? "bg-gradient-to-b from-[#2B2823] to-[#12110F] ring-1 ring-white/15 transition-shadow duration-[--dur-slow]"
    : "bg-gradient-to-b from-[#2B2823] to-[#12110F] ring-1 ring-white/15 transition-shadow duration-[--dur-slow]";
  
  return (
    <div 
      className={bezel}
      style={{
        padding: metrics ? metrics.frameThicknessLayout : (isMonitor ? 12 : 24),
        borderRadius: metrics ? metrics.cornerRadiusLayout + metrics.frameThicknessLayout : (isMonitor ? 12 : 40),
        boxShadow: "var(--shadow-glow), 0 25px 50px -12px rgba(0, 0, 0, 0.7)",
      }}
    >
      {children}
    </div>
  );
}

function IPhoneChrome() {
  return (
    <>
      <div className="pointer-events-none absolute left-1/2 top-2 z-30 h-5 w-24 -translate-x-1/2 rounded-full bg-black ring-1 ring-[#2A2B30] flex items-center justify-center">
        <div className="w-2.5 h-2.5 rounded-full bg-[#08121E]" />
      </div>
      <div className="pointer-events-none absolute bottom-1.5 left-1/2 z-30 h-1 w-24 -translate-x-1/2 rounded-full bg-white/40 mix-blend-difference" />
    </>
  );
}

function MonitorStand() {
  return (
    <>
      <div className="pointer-events-none absolute -bottom-6 left-1/2 z-10 h-6 w-32 -translate-x-1/2 bg-gradient-to-b from-zinc-700 to-zinc-900 border-x border-white/10" />
      <div className="pointer-events-none absolute -bottom-9 left-1/2 z-10 h-3 w-48 -translate-x-1/2 rounded-full bg-gradient-to-b from-zinc-800 to-zinc-950 ring-1 ring-white/10 shadow-xl" />
    </>
  );
}

function SafeZoneHint({ frame, metrics }: { frame: FrameStyle; metrics?: any }) {
  if (frame !== "iphone" && frame !== "android" && frame !== "ipad") return null;
  return (
    <>
      {/* Top Status Bar UI Overlay Hint */}
      <div className="pointer-events-none absolute top-0 inset-x-0 h-[10%] z-30 flex items-start justify-between px-5 pt-2 mix-blend-difference text-white/50 text-[10px] font-mono font-medium">
        <span>9:41</span>
        <div className="flex items-center gap-1.5 opacity-60">
          <span>5G</span>
          <span className="inline-block w-4 h-2 rounded-xs border border-white/60 relative"><span className="absolute inset-0.5 bg-white/80 rounded-2xs" /></span>
        </div>
      </div>

      {/* Bottom Home Indicator Bar Overlay Hint */}
      <div className="pointer-events-none absolute bottom-2 left-1/2 -translate-x-1/2 z-30 w-1/3 h-1 bg-white/50 rounded-full mix-blend-difference" />
    </>
  );
}

