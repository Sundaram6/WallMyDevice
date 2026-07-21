import { useEffect, useRef, useState } from "react";
import { ensureRegistered } from "@/lib/generators";
import { getGenerator } from "@/lib/generators/registry";
import { renderToTarget } from "@/lib/render/renderToTarget";
import { useEditorStore } from "@/store/useEditorStore";
import type { FrameStyle } from "@/lib/devices/presets";
import type { RenderTarget } from "@/lib/generators/types";

type Props = {
  frame: FrameStyle;
  aspect: number;
  maxWidth: number;
  maxHeight: number;
};

export function PreviewCanvas({ frame, aspect, maxWidth, maxHeight }: Props) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [webglError, setWebglError] = useState(false);
  const generatorId = useEditorStore(s => s.generatorId);

  useEffect(() => { ensureRegistered(); }, []);

  useEffect(() => {
    setWebglError(false);
  }, [generatorId]);

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
      const s = useEditorStore.getState();
      const w = Math.min(maxWidth, Math.floor(maxHeight * aspect));
      const h = Math.min(maxHeight, Math.floor(maxWidth / aspect));

      const generator = getGenerator(s.generatorId);
      const needsWebGL = generator?.kind === "shader";

      try {
        let target: RenderTarget;

        if (needsWebGL) {
          const gl = (canvas.getContext("webgl", { preserveDrawingBuffer: true }) ||
                      canvas.getContext("webgl2", { preserveDrawingBuffer: true }) ||
                      canvas.getContext("experimental-webgl", { preserveDrawingBuffer: true })) as WebGLRenderingContext | null;
          if (!gl) {
            setWebglError(true);
            return;
          }
          canvas.width = w;
          canvas.height = h;
          target = { kind: "webgl", canvas, ctx: gl, width: w, height: h, dpr: 1 };
        } else {
          const ctx = canvas.getContext("2d");
          if (!ctx) return;
          canvas.width = w;
          canvas.height = h;
          ctx.setTransform(1, 0, 0, 1, 0, 0);
          target = { kind: "canvas2d", canvas, ctx, width: w, height: h, dpr: 1 };
        }

        renderToTarget(target, {
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
        });
        setWebglError(false);
      } catch (e) {
        console.error("PreviewCanvas error:", e);
        if (e instanceof Error && e.message.includes("WebGL")) {
          setWebglError(true);
        }
      }
    }
    return () => { unsub(); if (raf) cancelAnimationFrame(raf); };
  }, [generatorId, aspect, maxWidth, maxHeight]);

  if (webglError) {
    return (
      <div data-frame={frame} className="flex h-full w-full items-center justify-center">
        <p className="text-sm text-zinc-400 text-center p-4">
          WebGL unavailable. Switch to a Canvas2D generator.
        </p>
      </div>
    );
  }

  return (
    <div data-frame={frame} className="flex h-full w-full items-center justify-center">
      <canvas key={generatorId} ref={canvasRef} className="block max-h-full max-w-full" />
    </div>
  );
}
