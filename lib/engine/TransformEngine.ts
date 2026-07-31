/**
 * TransformEngine — Handles transformation matrices, aspect-lock calculations,
 * bounds resizing, rotation, and proportional scaling across devices.
 */

export interface RectBounds {
  x: number;
  y: number;
  width: number;
  height: number;
  rotationDeg: number;
}

export class TransformEngine {
  private static instance: TransformEngine;

  private constructor() {}

  public static getInstance(): TransformEngine {
    if (!TransformEngine.instance) {
      TransformEngine.instance = new TransformEngine();
    }
    return TransformEngine.instance;
  }

  /**
   * Resizes bounds while respecting aspect ratio lock.
   */
  public resizeWithAspect(
    current: RectBounds,
    newWidth: number,
    newHeight: number,
    preserveAspect: boolean,
    aspectRatio: number
  ): RectBounds {
    if (!preserveAspect) {
      return { ...current, width: Math.max(1, newWidth), height: Math.max(1, newHeight) };
    }

    let w = newWidth;
    let h = Math.round(newWidth / aspectRatio);

    if (Math.abs(newHeight - current.height) > Math.abs(newWidth - current.width)) {
      h = newHeight;
      w = Math.round(newHeight * aspectRatio);
    }

    return {
      ...current,
      width: Math.max(1, w),
      height: Math.max(1, h),
    };
  }

  /**
   * Maps a bounding box proportionally when switching between device sizes.
   */
  public scaleBoundsToTargetDevice(
    sourceBounds: RectBounds,
    sourceCanvasW: number,
    sourceCanvasH: number,
    targetCanvasW: number,
    targetCanvasH: number
  ): RectBounds {
    const scaleX = targetCanvasW / (sourceCanvasW || 1);
    const scaleY = targetCanvasH / (sourceCanvasH || 1);

    return {
      x: Math.round(sourceBounds.x * scaleX),
      y: Math.round(sourceBounds.y * scaleY),
      width: Math.round(sourceBounds.width * scaleX),
      height: Math.round(sourceBounds.height * scaleY),
      rotationDeg: sourceBounds.rotationDeg,
    };
  }
}

export const transformEngine = TransformEngine.getInstance();
