export function gcd(a: number, b: number): number {
  a = Math.abs(a); b = Math.abs(b);
  while (b) { [a, b] = [b, a % b]; }
  return a;
}

export type AspectState = { w: number; h: number; locked: boolean };

export function applyAspectLock(state: AspectState, changed: "w" | "h"): { w: number; h: number } {
  if (!state.locked) return { w: state.w, h: state.h };
  if (changed === "w" && state.w > 0) {
    const ratio = state.h / state.w;
    return { w: state.w, h: Math.max(1, Math.round(state.w * ratio)) };
  }
  if (changed === "h" && state.h > 0) {
    const ratio = state.w / state.h;
    return { w: Math.max(1, Math.round(state.h * ratio)), h: state.h };
  }
  return { w: state.w, h: state.h };
}
