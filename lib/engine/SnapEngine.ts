/**
 * SnapEngine — Manages alignment snapping, guidelines calculation,
 * center snapping, and safe area boundary snapping.
 */

export interface SnapGuide {
  type: "vertical" | "horizontal";
  positionPx: number;
  label: string;
}

export interface SnapResult {
  x: number;
  y: number;
  snappedX: boolean;
  snappedY: boolean;
  guides: SnapGuide[];
}

export class SnapEngine {
  private static instance: SnapEngine;
  private snapThresholdPx: number = 8;

  private constructor() {}

  public static getInstance(): SnapEngine {
    if (!SnapEngine.instance) {
      SnapEngine.instance = new SnapEngine();
    }
    return SnapEngine.instance;
  }

  /**
   * Calculates snap adjustments against canvas center, edges, and safe areas.
   */
  public calculateSnap(
    x: number,
    y: number,
    width: number,
    height: number,
    canvasWidth: number,
    canvasHeight: number,
    safeAreaTopPx: number = 0,
    safeAreaBottomPx: number = 0
  ): SnapResult {
    let finalX = x;
    let finalY = y;
    let snappedX = false;
    let snappedY = false;
    const guides: SnapGuide[] = [];

    const centerX = canvasWidth / 2;
    const centerY = canvasHeight / 2;
    const objCenterX = x + width / 2;
    const objCenterY = y + height / 2;

    // Horizontal Center Snap
    if (Math.abs(objCenterX - centerX) < this.snapThresholdPx) {
      finalX = centerX - width / 2;
      snappedX = true;
      guides.push({ type: "vertical", positionPx: centerX, label: "Center X" });
    }

    // Vertical Center Snap
    if (Math.abs(objCenterY - centerY) < this.snapThresholdPx) {
      finalY = centerY - height / 2;
      snappedY = true;
      guides.push({ type: "horizontal", positionPx: centerY, label: "Center Y" });
    }

    // Safe Area Top Snap
    if (safeAreaTopPx > 0 && Math.abs(y - safeAreaTopPx) < this.snapThresholdPx) {
      finalY = safeAreaTopPx;
      snappedY = true;
      guides.push({ type: "horizontal", positionPx: safeAreaTopPx, label: "Safe Area Top" });
    }

    // Safe Area Bottom Snap
    const safeBottomBoundary = canvasHeight - safeAreaBottomPx - height;
    if (safeAreaBottomPx > 0 && Math.abs(y - safeBottomBoundary) < this.snapThresholdPx) {
      finalY = safeBottomBoundary;
      snappedY = true;
      guides.push({ type: "horizontal", positionPx: canvasHeight - safeAreaBottomPx, label: "Safe Area Bottom" });
    }

    return { x: finalX, y: finalY, snappedX, snappedY, guides };
  }
}

export const snapEngine = SnapEngine.getInstance();
