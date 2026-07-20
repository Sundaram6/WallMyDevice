import '@testing-library/jest-dom/vitest';
import 'vitest-canvas-mock';

const origGetContext = HTMLCanvasElement.prototype.getContext;

HTMLCanvasElement.prototype.getContext = function (
  ...args: [string, ...unknown[]]
): ReturnType<typeof origGetContext> {
  const contextId = args[0];
  if (contextId !== '2d') return origGetContext.apply(this, args);
  const ctx = origGetContext.apply(this, args) as CanvasRenderingContext2D;
  if (!ctx) return ctx;

  const origGetImageData = ctx.getImageData.bind(ctx);

  ctx.getImageData = function (sx: number, sy: number, sw: number, sh: number) {
    const events = (ctx as Record<string, unknown>).__getEvents;
    const allEvents = typeof events === 'function' ? events.call(ctx) : [];
    const serialized = JSON.stringify(allEvents);
    let hash = 0;
    for (let i = 0; i < serialized.length; i++) {
      hash = ((hash << 5) - hash + serialized.charCodeAt(i)) | 0;
    }
    const data = origGetImageData(sx, sy, sw, sh);
    const pixels = new Uint8ClampedArray(data.data.buffer);
    const len = pixels.length;
    for (let i = 0; i < len; i++) {
      pixels[i] = (hash + i * 37) & 0xff;
    }
    return data;
  };

  return ctx;
};
