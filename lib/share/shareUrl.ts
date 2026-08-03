import { getGenerator } from "@/lib/generators/registry";

export type ShareParams = {
  g?: string;
  s?: string;
  p?: string[];
  d?: string;
};

/**
 * Parses query parameters from window.location.search or a query string.
 * Example: ?g=starfield-nebula&s=k3p9x2a7&p=0f172a-f59e0b-ff0055&d=phone
 */
export function parseShareParams(queryString: string): ShareParams {
  if (!queryString) return {};
  const search = queryString.startsWith("?") ? queryString.substring(1) : queryString;
  const params = new URLSearchParams(search);

  const result: ShareParams = {};

  const g = params.get("g");
  if (g && getGenerator(g)) {
    result.g = g;
  }

  const s = params.get("s");
  if (s && /^[0-9a-z]{1,16}$/i.test(s)) {
    result.s = s;
  }

  const p = params.get("p");
  if (p) {
    const rawColors = p.split("-").filter(Boolean);
    const validColors = rawColors
      .map((hex) => {
        const clean = hex.replace(/^#/, "");
        if (/^[0-9a-fA-F]{3,8}$/.test(clean)) {
          return `#${clean}`;
        }
        return null;
      })
      .filter((c): c is string => c !== null);

    if (validColors.length > 0) {
      result.p = validColors;
    }
  }

  const d = params.get("d");
  if (d && ["desktop", "laptop", "tablet", "phone", "custom"].includes(d)) {
    result.d = d;
  }

  return result;
}

/**
 * Builds a shareable query string from EditorState values.
 * Format: ?g=waveform&s=k3p9x2a7&p=0f172a-f59e0b&d=desktop
 */
export function buildShareQueryString(state: {
  generatorId: string;
  seed: string;
  palette: string[];
  deviceType: string;
}): string {
  const params = new URLSearchParams();

  if (state.generatorId) params.set("g", state.generatorId);
  if (state.seed) params.set("s", state.seed);

  if (state.palette && state.palette.length > 0) {
    const pStr = state.palette.map((c) => c.replace(/^#/, "")).join("-");
    params.set("p", pStr);
  }

  if (state.deviceType) params.set("d", state.deviceType);

  return params.toString();
}

/**
 * Synchronizes current EditorState values into window.history.replaceState.
 */
export function syncStateToUrl(state: {
  generatorId: string;
  seed: string;
  palette: string[];
  deviceType: string;
}): void {
  if (typeof window === "undefined") return;
  const query = buildShareQueryString(state);
  const targetSearch = query ? `?${query}` : "";
  if (window.location.search !== targetSearch) {
    const newUrl = targetSearch
      ? `${window.location.pathname}${targetSearch}${window.location.hash}`
      : `${window.location.pathname}${window.location.hash}`;
    try {
      window.history.replaceState(null, "", newUrl);
    } catch (_) {}
  }
}
export function buildShareUrl(
  state: {
    generatorId: string;
    seed: string;
    palette: string[];
    deviceType: string;
  },
  baseUrl?: string
): string {
  const query = buildShareQueryString(state);
  const origin =
    baseUrl || (typeof window !== "undefined" ? window.location.origin + "/studio" : "https://wallmydevice.vercel.app/studio");
  return query ? `${origin}?${query}` : origin;
}

/**
 * Single centralized function to copy the current Studio URL to clipboard with toast notification callback.
 */
export async function copyStudioLink(
  state: {
    generatorId: string;
    seed: string;
    palette: string[];
    deviceType: string;
  },
  onToast?: (msg: string) => void
): Promise<boolean> {
  const url = buildShareUrl(state);
  const msg = "✦ Wallpaper link copied to clipboard!";
  try {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      await navigator.clipboard.writeText(url);
    } else if (typeof document !== "undefined") {
      const textarea = document.createElement("textarea");
      textarea.value = url;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
    }
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("wmd-toast", { detail: { message: msg } }));
    }
    if (onToast) onToast(msg);
    return true;
  } catch (err) {
    const errMsg = "⚠️ Failed to copy link to clipboard";
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("wmd-toast", { detail: { message: errMsg } }));
    }
    if (onToast) onToast(errMsg);
    return false;
  }
}
