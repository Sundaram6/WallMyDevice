import type { ReactNode } from "react";
import type { FrameStyle } from "@/lib/devices/presets";

type Props = {
  frame: FrameStyle;
  aspect: number;
  deviceType?: string;
  phoneModel?: string;
  children: ReactNode;
};

export function DeviceFrame({ frame, aspect, deviceType, phoneModel, children }: Props) {
  // Determine effective frame based on deviceType if available
  const effectiveFrame: FrameStyle = deviceType === "phone"
    ? "iphone"
    : deviceType === "tablet"
      ? "ipad"
      : deviceType === "laptop"
        ? "macbook"
        : deviceType === "desktop"
          ? "desktop-monitor"
          : frame;

  if (effectiveFrame === "none") {
    return (
      <div data-frame={effectiveFrame} className="flex items-center justify-center">
        <div
          data-aspect={aspect}
          style={{ aspectRatio: `${aspect} / 1` }}
          className="relative overflow-hidden rounded-md bg-zinc-900"
        >
          {children}
        </div>
      </div>
    );
  }
  return (
    <div data-frame={effectiveFrame} className="flex items-center justify-center">
      <FrameShell frame={effectiveFrame}>
        <div
          data-aspect={aspect}
          style={{ aspectRatio: `${aspect} / 1` }}
          className="relative overflow-hidden bg-black"
        >
          {children}
          {effectiveFrame === "iphone" ? <IPhoneChrome /> : null}
          {effectiveFrame === "macbook" ? <MacBookChrome /> : null}
          {effectiveFrame === "desktop-monitor" ? <MonitorStand /> : null}
          {effectiveFrame === "android" ? <AndroidChrome /> : null}
          <SafeZoneHint frame={effectiveFrame} />
        </div>
      </FrameShell>
    </div>
  );
}

function FrameShell({ frame, children }: { frame: FrameStyle; children: ReactNode }) {
  const isMonitor = frame === "desktop-monitor" || frame === "ultrawide";
  const isTablet = frame === "ipad";
  const bezel = isMonitor
    ? "rounded-lg p-3 bg-zinc-800 ring-1 ring-zinc-700"
    : isTablet
      ? "rounded-3xl p-6 bg-zinc-900 ring-1 ring-zinc-800"
      : "rounded-[2.5rem] p-3 bg-zinc-900 ring-1 ring-zinc-800";
  return <div className={bezel}>{children}</div>;
}

function IPhoneChrome() {
  return (
    <>
      <div className="pointer-events-none absolute left-1/2 top-2 z-10 h-6 w-24 -translate-x-1/2 rounded-full bg-black" />
      <div className="pointer-events-none absolute bottom-1.5 left-1/2 z-10 h-1 w-24 -translate-x-1/2 rounded-full bg-zinc-700" />
    </>
  );
}

function MacBookChrome() {
  return (
    <>
      <div className="pointer-events-none absolute left-1/2 top-1.5 z-10 h-5 w-20 -translate-x-1/2 rounded-b-lg bg-black" />
      <div className="pointer-events-none absolute -bottom-2 left-1/2 z-10 h-2 w-3/4 -translate-x-1/2 rounded-b-2xl bg-zinc-800" />
    </>
  );
}

function MonitorStand() {
  return (
    <>
      <div className="pointer-events-none absolute -bottom-6 left-1/2 z-10 h-6 w-32 -translate-x-1/2 bg-zinc-700" />
      <div className="pointer-events-none absolute -bottom-9 left-1/2 z-10 h-3 w-48 -translate-x-1/2 rounded-full bg-zinc-800" />
    </>
  );
}

function AndroidChrome() {
  return <div className="pointer-events-none absolute left-1/2 top-2 z-10 h-3 w-3 -translate-x-1/2 rounded-full bg-black" />;
}

function SafeZoneHint({ frame }: { frame: FrameStyle }) {
  if (frame !== "iphone" && frame !== "android") return null;
  return (
    <>
      <div className="pointer-events-none absolute inset-x-0 top-0 z-20 h-[12%] border-b border-dashed border-white/20" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 h-[8%] border-t border-dashed border-white/20" />
    </>
  );
}
