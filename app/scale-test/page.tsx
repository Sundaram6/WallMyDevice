"use client";

import { useEffect, useRef, useState } from "react";
import { ensureRegistered } from "@/lib/generators";
import { listGenerators } from "@/lib/generators/registry";
import { ARCHIVE_PRESETS } from "@/lib/presets/archive-presets";
import { resolvePalette } from "@/lib/render/renderToTarget";
import { createRng } from "@/lib/prng";
import type { WebGLTarget, Canvas2DTarget } from "@/lib/generators/types";

function renderToCanvas(
  canvas: HTMLCanvasElement,
  generator: any,
  preset: any,
  width: number,
  height: number
) {
  const needsWebGL = generator.kind === "shader";
  const palette = resolvePalette(preset.palette, "dark");
  const rng = createRng("12345");
  const context = { blur: 0, grain: { enabled: false, intensity: 0 } };

  canvas.width = width;
  canvas.height = height;

  if (needsWebGL) {
    let gl = canvas.getContext("webgl2", { preserveDrawingBuffer: true }) || 
             canvas.getContext("webgl", { preserveDrawingBuffer: true });
    
    if (gl) {
      const target: WebGLTarget = { kind: "webgl", canvas, ctx: gl as WebGLRenderingContext, width, height, dpr: 1 };
      generator.render(target, preset.params, "12345", palette, rng, context);
    }
  } else {
    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.fillStyle = palette[0] ?? "#000000";
      ctx.fillRect(0, 0, width, height);
      const target: Canvas2DTarget = { kind: "canvas2d", canvas, ctx, width, height, dpr: 1 };
      generator.render(target, preset.params, "12345", palette, rng, context);
    }
  }
}

function GeneratorRow({ gen }: { gen: any }) {
  const smallRef = useRef<HTMLCanvasElement>(null);
  const largeRef = useRef<HTMLCanvasElement>(null);
  const [rendered, setRendered] = useState(false);

  useEffect(() => {
    if (!smallRef.current || !largeRef.current) return;
    
    const preset = ARCHIVE_PRESETS.find((p) => p.generatorId === gen.id) || {
      params: gen.schema.defaults,
      palette: ["#111111", "#ff0000", "#0000ff"],
    };

    try {
      renderToCanvas(smallRef.current, gen, preset, 960, 540);
      renderToCanvas(largeRef.current, gen, preset, 3840, 2160);
      setRendered(true);
    } catch (e) {
      console.error("Failed rendering", gen.id, e);
    }
  }, [gen]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', marginBottom: 40 }}>
      <h2 style={{ color: 'white', marginBottom: 10, fontSize: 24, fontWeight: 'bold' }}>{gen.id}</h2>
      <div style={{ display: 'flex', gap: 20 }}>
        <div>
          <h3 style={{ color: '#ccc', marginBottom: 5 }}>960x540 (Preview)</h3>
          <canvas 
            ref={smallRef} 
            className="generator-small"
            style={{ width: 960, height: 540, border: '2px solid red' }} 
          />
        </div>
        <div>
          <h3 style={{ color: '#ccc', marginBottom: 5 }}>3840x2160 (4K Export scaled via CSS)</h3>
          <canvas 
            ref={largeRef} 
            className="generator-large"
            style={{ width: 960, height: 540, border: '2px solid blue' }} 
          />
        </div>
      </div>
    </div>
  );
}

export default function ScaleTest() {
  const [generators, setGenerators] = useState<any[]>([]);

  useEffect(() => {
    ensureRegistered();
    setGenerators(listGenerators());
  }, []);

  return (
    <div style={{ padding: 40, background: '#000', minHeight: '100vh', fontFamily: 'sans-serif' }}>
      <h1 style={{ color: 'white', fontSize: 32, marginBottom: 20 }}>Generator Scaling Test</h1>
      {generators.length > 0 && <div id="test-ready">READY</div>}
      {generators.map(g => (
        <GeneratorRow key={g.id} gen={g} />
      ))}
    </div>
  );
}
