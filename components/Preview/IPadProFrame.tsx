import React, { type ReactNode } from "react";

type Props = {
  children: ReactNode;
  metrics?: any;
};

export function IPadProFrame({ children, metrics }: Props) {
  // Use metadata-driven metrics
  const cr = metrics?.cornerRadiusLayout ?? 30;
  const bezelW = metrics?.bezelWidthLayout ?? 10;
  const frameT = metrics?.frameThicknessLayout ?? 13;
  
  // Calculate nested radii based on layout specs
  const chassisPadding = Math.max(0, frameT - bezelW);
  const innerRadius = cr + bezelW;
  const outerRadius = innerRadius + chassisPadding;

  return (
    <div className="relative group flex items-center justify-center">
      {/* Volumetric Underglow driven by --glow-color */}
      <div 
        className="absolute -inset-6 blur-2xl opacity-75 group-hover:opacity-100 transition-all duration-[--dur-slow] pointer-events-none" 
        style={{ 
          borderRadius: outerRadius + 12,
          backgroundColor: "var(--glow-color, rgba(217, 84, 31, 0.3))",
          boxShadow: "var(--shadow-glow)",
        }}
      />

      {/* Space Black iPad Chassis (Ultra-thin 4px bezel, Face ID pill, Apple Pencil ledge) */}
      <div 
        className="relative bg-gradient-to-b from-[#383A40] via-[#1B1C20] to-[#0F1012] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8),0_0_2px_1px_rgba(255,255,255,0.1)]"
        style={{ padding: chassisPadding, borderRadius: outerRadius }}
      >
        
        {/* Right Edge: Magnetic Apple Pencil Ledge */}
        <div className="absolute top-1/3 -right-[4px] w-[3px] h-20 bg-[#2A2B30] rounded-r-md border-r border-white/10" />

        {/* Chassis Frame Shell */}
        <div 
          className="relative bg-[#141518] ring-1 ring-white/10 shadow-inner overflow-hidden flex flex-col justify-between"
          style={{ padding: bezelW, borderRadius: innerRadius }}
        >
          
          {/* Screen Container */}
          <div 
            className="relative bg-black overflow-hidden shadow-2xl ring-1 ring-black/80"
            style={{ borderRadius: cr }}
          >
            {children}

            {/* Top Face ID Camera Bar & Ambient Light Sensor */}
            {(!metrics || metrics.cutout?.type === 'notch') && (
              <div className="pointer-events-none absolute top-2.5 left-1/2 -translate-x-1/2 z-30 w-16 h-2.5 rounded-full bg-black ring-1 ring-[#25262B] flex items-center justify-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-[#08121E]" />
                <div className="w-1 h-1 rounded-full bg-[#050B12]" />
              </div>
            )}

            {/* Specular Glass Sheen */}
            <div className="pointer-events-none absolute inset-0 z-20 bg-gradient-to-tr from-transparent via-white/[0.03] to-transparent transform -rotate-6 scale-150" />
            <div 
              className="pointer-events-none absolute inset-0 z-20 ring-1 ring-inset ring-white/10" 
              style={{ borderRadius: cr }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
