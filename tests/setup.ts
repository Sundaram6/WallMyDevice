import '@testing-library/jest-dom/vitest';
import 'vitest-canvas-mock';

if (typeof globalThis.OffscreenCanvas === "undefined") {
  class OffscreenCanvasPolyfill {
    width: number;
    height: number;
    private _canvas: HTMLCanvasElement;
    constructor(width: number, height: number) {
      this.width = width;
      this.height = height;
      this._canvas = document.createElement("canvas");
      this._canvas.width = width;
      this._canvas.height = height;
    }
    getContext(type: string) {
      return this._canvas.getContext(type);
    }
    async convertToBlob(options?: { type?: string; quality?: number }) {
      const canvas = this._canvas;
      const type = options?.type ?? "image/png";
      const quality = options?.quality;
      return new Promise<Blob>((resolve) => {
        canvas.toBlob(
          (blob) => resolve(blob!),
          type,
          quality
        );
      });
    }
  }
  globalThis.OffscreenCanvas = OffscreenCanvasPolyfill as unknown as typeof OffscreenCanvas;
}
