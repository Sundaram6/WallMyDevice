export type GenerationStage =
  | "idle"
  | "preparing"
  | "rendering"
  | "ready"
  | "failed"
  | "unsupported";

export type GenerationError = {
  generatorId: string;
  stage: GenerationStage;
  browserCapability: {
    webgl2Supported: boolean;
    canvas2dSupported: boolean;
    maxTextureSize?: number;
  };
  recoverable: boolean;
  userMessage: string;
  suggestedGenerators: string[];
};

export function checkWebGL2Support(): boolean {
  if (typeof window === "undefined" || typeof document === "undefined") return true;
  try {
    const canvas = document.createElement("canvas");
    const gl = canvas.getContext("webgl2") || canvas.getContext("experimental-webgl2");
    return Boolean(gl);
  } catch {
    return false;
  }
}

export function buildRendererError(
  generatorId: string,
  stage: GenerationStage,
  rawError?: unknown
): GenerationError {
  const webgl2Supported = checkWebGL2Support();
  const isShader = generatorId === "fluid-gradient";

  let userMessage = "An unexpected rendering error occurred.";
  let recoverable = true;

  if (isShader && !webgl2Supported) {
    userMessage = "Your browser or device could not render this WebGL wallpaper. Try Waveform or Geometric instead.";
  } else if (stage === "unsupported") {
    userMessage = "Your browser or device does not support this wallpaper rendering engine.";
  } else if (rawError && typeof rawError === "object" && "message" in rawError) {
    const msg = String((rawError as { message?: string }).message || "");
    if (msg.includes("requires a WebGL target") || msg.includes("compile") || msg.includes("WebGL")) {
      userMessage = "Your browser or device could not render this WebGL wallpaper. Try Waveform or Geometric instead.";
    } else {
      userMessage = "Rendering failed due to a device resources issue. Please try another pattern.";
    }
  }

  return {
    generatorId,
    stage,
    browserCapability: {
      webgl2Supported,
      canvas2dSupported: true,
    },
    recoverable,
    userMessage,
    suggestedGenerators: ["waveform", "geometric", "typography"],
  };
}
