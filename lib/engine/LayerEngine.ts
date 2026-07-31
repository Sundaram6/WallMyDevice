/**
 * LayerEngine — Manages layer stack composition, ordering, opacity,
 * visibility, and overlay layers.
 */

export type LayerType = "generator" | "grain" | "overlay-clock" | "overlay-text" | "custom-image";

export interface LayerItem {
  id: string;
  type: LayerType;
  name: string;
  visible: boolean;
  opacity: number; // 0 to 1
  locked: boolean;
  zIndex: number;
  data: Record<string, unknown>;
}

export class LayerEngine {
  private static instance: LayerEngine;
  private layers: LayerItem[] = [];

  private constructor() {
    this.initializeDefaultStack();
  }

  public static getInstance(): LayerEngine {
    if (!LayerEngine.instance) {
      LayerEngine.instance = new LayerEngine();
    }
    return LayerEngine.instance;
  }

  public initializeDefaultStack(): void {
    this.layers = [
      {
        id: "layer-bg-generator",
        type: "generator",
        name: "Procedural Background",
        visible: true,
        opacity: 1.0,
        locked: true,
        zIndex: 0,
        data: {},
      },
      {
        id: "layer-grain",
        type: "grain",
        name: "Analog Grain",
        visible: true,
        opacity: 0.15,
        locked: false,
        zIndex: 10,
        data: { intensity: 15 },
      },
      {
        id: "layer-overlay",
        type: "overlay-clock",
        name: "Device Clock & Date",
        visible: false,
        opacity: 1.0,
        locked: false,
        zIndex: 20,
        data: {},
      },
    ];
  }

  public getLayers(): ReadonlyArray<LayerItem> {
    return [...this.layers].sort((a, b) => a.zIndex - b.zIndex);
  }

  public setVisibility(id: string, visible: boolean): void {
    const layer = this.layers.find((l) => l.id === id);
    if (layer) {
      layer.visible = visible;
    }
  }

  public setOpacity(id: string, opacity: number): void {
    const layer = this.layers.find((l) => l.id === id);
    if (layer) {
      layer.opacity = Math.max(0, Math.min(1, opacity));
    }
  }

  public reorder(id: string, newZIndex: number): void {
    const layer = this.layers.find((l) => l.id === id);
    if (layer && !layer.locked) {
      layer.zIndex = newZIndex;
    }
  }
}

export const layerEngine = LayerEngine.getInstance();
