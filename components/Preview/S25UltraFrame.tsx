import React, { type ReactNode } from "react";

type Props = {
  children: ReactNode;
  metrics?: any;
};

export function S25UltraFrame({ children, metrics }: Props) {
  // Use metadata-driven metrics
  const cr = metrics?.cornerRadiusLayout ?? 25;
  const bezelW = metrics?.bezelWidthLayout ?? 8;
  const frameT = metrics?.frameThicknessLayout ?? 14;
  
  // Calculate nested radii based on layout specs
  const chassisPadding = Math.max(0, frameT - bezelW);
  const innerRadius = cr + bezelW;
  const outerRadius = innerRadius + chassisPadding;

  return (
    <div className="relative group flex items-center justify-center">
      {/* Volumetric Underglow */}
      <div 
        className="absolute -inset-4 bg-gradient-to-tr from-brand-accent/20 via-blue-900/10 to-emerald-900/10 blur-2xl opacity-60 group-hover:opacity-80 transition-opacity pointer-events-none" 
        style={{ borderRadius: outerRadius + 12 }}
      />

      {/* S25 Ultra Chassis Container (Titanium Chamfer & Sharp 14px Screen Curve) */}
      <div 
        className="relative bg-gradient-to-b from-[#43454A] via-[#1D1E22] to-[#121316] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8),0_0_2px_1px_rgba(255,255,255,0.12)]"
        style={{ padding: chassisPadding, borderRadius: outerRadius }}
      >
        {/* Outer Titanium Bezel & Antenna Lines */}
        <div 
          className="relative bg-[#16171A] ring-1 ring-white/10 shadow-inner overflow-hidden flex flex-col justify-between"
          style={{ padding: bezelW, borderRadius: innerRadius }}
        >
          {/* Side Antenna Lines */}
          <div className="absolute top-12 -left-[2px] w-[2px] h-3 bg-[#3A3B40]" />
          <div className="absolute bottom-16 -left-[2px] w-[2px] h-3 bg-[#3A3B40]" />
          <div className="absolute top-12 -right-[2px] w-[2px] h-3 bg-[#3A3B40]" />
          <div className="absolute bottom-16 -right-[2px] w-[2px] h-3 bg-[#3A3B40]" />

          {/* Screen Container */}
          <div 
            className="relative bg-black overflow-hidden shadow-2xl ring-1 ring-black/80"
            style={{ borderRadius: cr }}
          >
            {children}

            {/* Infinity-O Punch-Hole Camera */}
            {(!metrics || metrics.cutout?.type === 'hole-punch') && (
              <div className="pointer-events-none absolute top-2.5 left-1/2 -translate-x-1/2 z-30 w-3.5 h-3.5 rounded-full bg-black ring-1 ring-[#2A2B30] flex items-center justify-center shadow-xs">
                <div className="w-1.5 h-1.5 rounded-full bg-[#05101A] ring-1 ring-[#1A2535]/60" />
              </div>
            )}

            {/* Specular Glass Sheen */}
            <div className="pointer-events-none absolute inset-0 z-20 bg-gradient-to-tr from-transparent via-white/[0.04] to-transparent transform -rotate-12 scale-150" />
            <div className="pointer-events-none absolute top-0 inset-x-0 h-24 z-20 bg-gradient-to-b from-black/40 via-transparent to-transparent" />
            
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
