import { PHONE_MODELS } from "./phones";

export type DevicePreset = {
  id: string;
  label: string;
  w: number;
  h: number;
  frame: FrameStyle;
};

export type FrameStyle = "desktop-monitor" | "iphone" | "ipad" | "macbook" | "android" | "ultrawide" | "none";

// Preserve the existing top-level preset list for backward compatibility and batch export.
export const DEVICE_PRESETS: DevicePreset[] = [
  { id: "desktop-1080p",       label: "Desktop 1080p",     w: 1920, h: 1080, frame: "desktop-monitor" },
  { id: "desktop-1440p",       label: "Desktop 1440p",     w: 2560, h: 1440, frame: "desktop-monitor" },
  { id: "desktop-4k",          label: "Desktop 4K",        w: 3840, h: 2160, frame: "desktop-monitor" },
  { id: "ultrawide-3440x1440", label: "Ultrawide 21:9",    w: 3440, h: 1440, frame: "ultrawide" },
  { id: "macbook-14",          label: "MacBook 14\"",       w: 3024, h: 1964, frame: "macbook" },
  // Keep the historically supported phone presets here for recipe/backwards compatibility
  { id: "iphone-15-pro",       label: "iPhone 15 Pro",     w: 1179, h: 2556, frame: "iphone" },
  { id: "iphone-15",           label: "iPhone 15",         w: 1170, h: 2532, frame: "iphone" },
  { id: "pixel-8-pro",         label: "Pixel 8 Pro",       w: 1344, h: 2992, frame: "android" },
  { id: "ipad-air-11",         label: "iPad Air 11\"",      w: 1640, h: 2360, frame: "ipad" },
  { id: "custom",              label: "Custom...",           w: 1920, h: 1080, frame: "none" },
];

export function findPreset(id: string): DevicePreset | undefined {
  return DEVICE_PRESETS.find(p => p.id === id);
}

export const ASPECT_PRESETS: Array<{ id: string; label: string; w: number; h: number }> = [
  { id: "16-9", label: "16:9",  w: 1920, h: 1080 },
  { id: "9-16", label: "9:16",  w: 1080, h: 1920 },
  { id: "4-3",  label: "4:3",   w: 1600, h: 1200 },
  { id: "3-4",  label: "3:4",   w: 1200, h: 1600 },
  { id: "21-9", label: "21:9",  w: 2560, h: 1080 },
  { id: "1-1",  label: "1:1",   w: 1080, h: 1080 },
];

// Expose the phone catalogue for UI pickers
export const PHONE_CATALOGUE = PHONE_MODELS;

