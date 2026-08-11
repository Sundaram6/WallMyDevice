"use client";

import { useRef, useCallback, useEffect, type ReactNode } from "react";
import type { SheetSnap } from "@/store/useEditorStore";

// ─── Snap heights ────────────────────────────────────────────────────────────
// "peek"    — 72 px fixed. Shows handle + quick-action row only.
// "control" — 40dvh. Main editing surface. Wallpaper still >55% visible.
// "full"    — 86dvh. Deep controls / history. Near-full-screen.
const PEEK_PX = 72;

// Returns the pixel height for a given snap state at current viewport height.
function snapToPx(snap: SheetSnap, vh: number): number {
  if (snap === "peek") return PEEK_PX;
  if (snap === "control") return Math.round(vh * 0.40);
  return Math.round(vh * 0.86);
}

// All snap states in order from smallest to largest.
const SNAPS: SheetSnap[] = ["peek", "control", "full"];

// ─── Velocity ring buffer ────────────────────────────────────────────────────
// Stores the last N pointermove samples {y, t}. Used for least-squares
// linear regression over the trailing 100 ms to get smoothed velocity.
interface Sample { y: number; t: number }
const RING_SIZE = 10;
const VELOCITY_WINDOW_MS = 100;
const SNAP_VELOCITY_THRESHOLD = 350; // px/s

function computeVelocity(samples: Sample[], releaseTime: number): number {
  const recent = samples.filter(s => s.t >= releaseTime - VELOCITY_WINDOW_MS);
  if (recent.length < 2) return 0;

  // Least-squares linear regression: slope = (n·Σxy - Σx·Σy) / (n·Σx² - (Σx)²)
  // x = time (ms), y = position (px) — slope gives px/ms, multiply by 1000 → px/s
  const n = recent.length;
  let sumX = 0, sumY = 0, sumXY = 0, sumX2 = 0;
  for (const { y, t } of recent) {
    sumX += t; sumY += y; sumXY += t * y; sumX2 += t * t;
  }
  const denom = n * sumX2 - sumX * sumX;
  if (denom === 0) return 0;
  return ((n * sumXY - sumX * sumY) / denom) * 1000; // convert ms→s
}

// ─── Snap logic ──────────────────────────────────────────────────────────────
function resolveSnap(
  currentSnap: SheetSnap,
  velocity: number,          // px/s, positive = downward (closing)
  currentHeightPx: number,
  vh: number,
): SheetSnap {
  const isFast = Math.abs(velocity) > SNAP_VELOCITY_THRESHOLD;

  if (isFast) {
    const currentIdx = SNAPS.indexOf(currentSnap);
    if (velocity > 0) {
      // Moving down (closing). Full → Control guard: never skip straight to Peek.
      const target = currentSnap === "full" ? "control" : SNAPS[Math.max(0, currentIdx - 1)];
      return target;
    } else {
      // Moving up (opening).
      return SNAPS[Math.min(SNAPS.length - 1, currentIdx + 1)];
    }
  }

  // Slow drag — snap to nearest by distance.
  let nearest: SheetSnap = "peek";
  let minDist = Infinity;
  for (const snap of SNAPS) {
    const dist = Math.abs(snapToPx(snap, vh) - currentHeightPx);
    if (dist < minDist) { minDist = dist; nearest = snap; }
  }
  return nearest;
}

// ─── Props ───────────────────────────────────────────────────────────────────
type Props = {
  snap: SheetSnap;
  onSnap: (snap: SheetSnap) => void;
  children: ReactNode;
};

// ─── Component ───────────────────────────────────────────────────────────────
export function BottomSheet({ snap, onSnap, children }: Props) {
  // Refs — all mutable drag state lives here, not in React state,
  // so updates don't trigger re-renders during drag (they would cause jank).
  const sheetRef = useRef<HTMLDivElement>(null);
  const handleRef = useRef<HTMLDivElement>(null);

  // Current live height in px (set via inline style, not state).
  const liveHeightRef = useRef<number>(PEEK_PX);
  // Drag bookkeeping.
  const dragging = useRef(false);
  const startY = useRef(0);
  const startHeight = useRef(PEEK_PX);
  const ringBuffer = useRef<Sample[]>([]);
  const didDrag = useRef(false); // distinguish tap from drag
  // Track current snap so we can read it inside pointer handlers.
  const snapRef = useRef<SheetSnap>(snap);

  // Sync snapRef when prop changes.
  useEffect(() => { snapRef.current = snap; }, [snap]);

  // ── Set sheet height (bypasses React render for perf) ─────────────────────
  const setHeight = useCallback((px: number) => {
    liveHeightRef.current = px;
    if (sheetRef.current) {
      sheetRef.current.style.height = `${px}px`;
    }
  }, []);

  // ── Initialise height on mount / snap prop changes ────────────────────────
  useEffect(() => {
    if (dragging.current) return; // don't fight an active drag
    const vh = window.innerHeight;
    const target = snapToPx(snap, vh);
    liveHeightRef.current = target;
    if (sheetRef.current) {
      // Re-enable spring transition for programmatic changes.
      sheetRef.current.style.transition =
        "height 0.4s cubic-bezier(0.32,0.72,0,1)";
      sheetRef.current.style.height = `${target}px`;
    }
  }, [snap, setHeight]);

  // ── Pointer handlers ──────────────────────────────────────────────────────
  const onPointerDown = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    if (!sheetRef.current || !handleRef.current) return;

    // Pointer capture on the handle element — all subsequent pointermove /
    // pointerup / pointercancel events are routed here, even if the pointer
    // moves outside the sheet bounds. No global window listeners needed.
    handleRef.current.setPointerCapture(e.pointerId);

    dragging.current = true;
    didDrag.current = false;
    startY.current = e.clientY;
    startHeight.current = liveHeightRef.current;
    ringBuffer.current = [{ y: e.clientY, t: e.timeStamp }];

    // Disable spring transition while tracking the finger.
    sheetRef.current.style.transition = "none";
    // will-change only during drag — remove after snap.
    sheetRef.current.style.willChange = "height";
  }, []);

  const onPointerMove = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    if (!dragging.current || !sheetRef.current) return;
    e.preventDefault();

    // Accumulate samples in ring buffer (drop oldest beyond RING_SIZE).
    const buf = ringBuffer.current;
    buf.push({ y: e.clientY, t: e.timeStamp });
    if (buf.length > RING_SIZE) buf.shift();

    const delta = startY.current - e.clientY; // positive = dragging up (opening)
    const newHeight = Math.max(PEEK_PX, Math.min(
      Math.round(window.innerHeight * 0.92),
      startHeight.current + delta,
    ));
    if (Math.abs(e.clientY - startY.current) > 4) didDrag.current = true;
    setHeight(newHeight);
  }, [setHeight]);

  const finalizeDrag = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    if (!dragging.current || !sheetRef.current || !handleRef.current) return;
    dragging.current = false;

    // Release pointer capture.
    handleRef.current.releasePointerCapture(e.pointerId);

    const vh = window.innerHeight;
    const velocity = computeVelocity(ringBuffer.current, e.timeStamp);
    const nextSnap = resolveSnap(snapRef.current, velocity, liveHeightRef.current, vh);

    // Re-enable spring transition for the snap animation.
    sheetRef.current.style.transition =
      "height 0.4s cubic-bezier(0.32,0.72,0,1)";
    setHeight(snapToPx(nextSnap, vh));

    // Remove will-change once the transition settles.
    const el = sheetRef.current;
    const onEnd = () => {
      el.style.willChange = "auto";
      el.removeEventListener("transitionend", onEnd);
    };
    el.addEventListener("transitionend", onEnd);

    // Update React state — triggers a re-render but that's fine post-drag.
    onSnap(nextSnap);
    snapRef.current = nextSnap;
  }, [onSnap, setHeight]);

  const onPointerUp = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    // Tap (no real drag) on handle → cycle snap states: peek → control → full → control
    if (!didDrag.current) {
      if (handleRef.current) handleRef.current.releasePointerCapture(e.pointerId);
      dragging.current = false;
      if (snapRef.current === "peek") {
        onSnap("control");
      } else if (snapRef.current === "control") {
        onSnap("full");
      } else {
        onSnap("control");
      }
      return;
    }
    finalizeDrag(e);
  }, [finalizeDrag, onSnap]);

  const onPointerCancel = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    // On cancel, snap to nearest so the sheet doesn't freeze mid-drag.
    finalizeDrag(e);
  }, [finalizeDrag]);

  // ─────────────────────────────────────────────────────────────────────────
  const isPeek = snap === "peek";

  return (
    <div
      ref={sheetRef}
      data-testid="bottom-sheet"
      data-snap={snap}
      aria-expanded={snap !== "peek"}
      className="absolute inset-x-0 bottom-0 z-30 rounded-t-2xl border-t border-paper-300 bg-paper-100 text-ink-900 shadow-2 flex flex-col"
      style={{
        height: `${PEEK_PX}px`,
        // Smooth iOS spring transition initial state; overridden during drag.
        transition: "height 0.4s cubic-bezier(0.32,0.72,0,1)",
        // Safe-area inset — respects notch/home-indicator devices.
        paddingBottom: "env(safe-area-inset-bottom, 0px)",
      }}
    >
      {/* ── Drag Handle ──────────────────────────────────────────────────── */}
      {/*
        data-testid="sheet-handle" — this is the named pointer-capture element.
        The handle covers the full width so there is no dead zone.
        Pointer capture is set here on pointerdown (see onPointerDown handler).
      */}
      <div
        ref={handleRef}
        data-testid="sheet-handle"
        role="button"
        aria-label={isPeek ? "Expand controls" : "Drag to resize controls"}
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            if (snap === "peek") onSnap("control");
            else if (snap === "control") onSnap("full");
            else onSnap("peek");
          }
          if (e.key === "Escape") onSnap("peek");
        }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerCancel}
        className="flex shrink-0 w-full items-center justify-center border-b border-paper-200 bg-paper-100 rounded-t-2xl group cursor-grab active:cursor-grabbing select-none touch-none"
        style={{ height: PEEK_PX, minHeight: PEEK_PX }}
      >
        <div className="flex flex-col items-center gap-1 pointer-events-none">
          <div className="h-1.5 w-10 rounded-full bg-paper-300 group-hover:bg-ink-400 transition-colors duration-150" />
          <span className="text-[11px] font-medium text-ink-600 tracking-wide flex items-center gap-1">
            Studio Controls
            <svg
              className={`w-3 h-3 text-ink-400 transition-transform duration-300 ${
                snap === "full" ? "rotate-180" : snap === "control" ? "rotate-90" : "rotate-0"
              }`}
              fill="none" viewBox="0 0 24 24" stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </span>
        </div>
      </div>

      {/* ── Sheet Content ─────────────────────────────────────────────────── */}
      {/*
        Content is ALWAYS mounted — no conditional rendering between states.
        This keeps generator/picker state alive across drag gestures.
        Only overflow and opacity are adjusted based on snap state.
      */}
      <div
        className="flex-1 min-h-0 overflow-y-auto overscroll-contain"
        style={{
          // Prevent content area from interfering with sheet drag.
          touchAction: "pan-y",
        }}
      >
        {children}
      </div>
    </div>
  );
}
