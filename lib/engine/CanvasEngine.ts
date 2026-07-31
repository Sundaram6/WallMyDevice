/**
 * CanvasEngine — Controls canvas sizing, aspect ratio fitting, DPR scaling,
 * zoom, pan, and coordinate normalization [0..1].
 */

export interface ViewportBounds {
  containerWidth: number;
  containerHeight: number;
  canvasWidth: number;
  canvasHeight: number;
  scaleFactor: number;
  offsetX: number;
  offsetY: number;
}

export interface TransformState {
  zoom: number; // 0.1 to 5.0
  panX: number;
  panY: number;
}

export class CanvasEngine {
  private static instance: CanvasEngine;

  private constructor() {}

  public static getInstance(): CanvasEngine {
    if (!CanvasEngine.instance) {
      CanvasEngine.instance = new CanvasEngine();
    }
    return CanvasEngine.instance;
  }

  /**
   * Calculates optimal canvas render dimensions to fit inside a container
   * while strictly maintaining target aspect ratio and preventing scrolling.
   */
  public calculateFitViewport(
    containerWidth: number,
    containerHeight: number,
    aspectRatio: number,
    paddingPx: number = 32
  ): ViewportBounds {
    const availW = Math.max(100, containerWidth - paddingPx * 2);
    const availH = Math.max(100, containerHeight - paddingPx * 2);

    let canvasW = availW;
    let canvasH = Math.floor(availW / aspectRatio);

    if (canvasH > availH) {
      canvasH = availH;
      canvasW = Math.floor(availH * aspectRatio);
    }

    const scaleFactor = canvasW / availW;
    const offsetX = Math.floor((containerWidth - canvasW) / 2);
    const offsetY = Math.floor((containerHeight - canvasH) / 2);

    return {
      containerWidth,
      containerHeight,
      canvasWidth: canvasW,
      canvasHeight: canvasH,
      scaleFactor,
      offsetX,
      offsetY,
    };
  }

  /**
   * Normalizes canvas coordinates to unit range [0, 1] for device-agnostic scaling.
   */
  public normalizeCoordinates(pxX: number, pxY: number, width: number, height: number): { u: number; v: number } {
    return {
      u: width > 0 ? pxX / width : 0,
      v: height > 0 ? pxY / height : 0,
    };
  }

  /**
   * Denormalizes unit coordinates [0, 1] back to target canvas pixels.
   */
  public denormalizeCoordinates(u: number, v: number, targetWidth: number, targetHeight: number): { x: number; y: number } {
    return {
      x: Math.round(u * targetWidth),
      y: Math.round(v * targetHeight),
    };
  }
}

export const canvasEngine = CanvasEngine.getInstance();
