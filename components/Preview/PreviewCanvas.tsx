import { useEffect, useRef } from "react";
import { ensureRegistered } from "@/lib/generators";
import { renderPreview } from "@/lib/render/renderPreview";
import { useEditorStore } from "@/store/useEditorStore";
import type { FrameStyle } from "@/lib/devices/presets";

type Props = {
  frame: FrameStyle;
  aspect: number;
  maxWidth: number;
  maxHeight: number;
};

export function PreviewCanvas({ frame, aspect, maxWidth, maxHeight }: Props) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => { ensureRegistered(); }, []);

  useEffect(() => {
    let raf = 0;
    const unsub = useEditorStore.subscribe(() => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        renderIfReady();
      });
    });
    renderIfReady();
    function renderIfReady() {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      const s = useEditorStore.getState();
      const w = Math.min(maxWidth, Math.floor(maxHeight * aspect));
      const h = Math.min(maxHeight, Math.floor(maxWidth / aspect));
      renderPreview(canvas, ctx, {
        generatorId: s.generatorId,
        params: s.params[s.generatorId] ?? {},
        palette: s.palette,
        mode: s.mode,
        seed: s.seed,
        grainEnabled: s.grainEnabled,
        grainIntensity: s.grainIntensity,
        blurIntensity: s.blurIntensity,
        overlays: {
          clock: s.overlayClock,
          date: s.overlayDate,
          text: s.overlayText,
          textValue: s.overlayTextValue,
          font: s.overlayFont,
          size: s.overlaySize,
        },
      }, { width: w, height: h, dpr: 1 });
    }
    return () => { unsub(); if (raf) cancelAnimationFrame(raf); };
  }, [aspect, maxWidth, maxHeight]);

  return (
    <div data-frame={frame} className="flex h-full w-full items-center justify-center">
      <canvas ref={canvasRef} className="block max-h-full max-w-full" />
    </div>
  );
}
