import React, { type ReactNode } from "react";

type Props = {
  children: ReactNode;
};

export function IPhoneProFrame({ children }: Props) {
  return (
    <div className="relative group flex items-center justify-center">
      {/* Volumetric Underglow */}
      <div className="absolute -inset-4 bg-gradient-to-tr from-brand-accent/20 via-purple-900/10 to-amber-900/10 rounded-[3rem] blur-2xl opacity-60 group-hover:opacity-80 transition-opacity pointer-events-none" />

      {/* iPhone Pro Titanium Chassis Container */}
      <div className="relative rounded-[2.8rem] p-[3px] bg-gradient-to-b from-[#C4B5A5] via-[#635B53] to-[#2B2724] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.85),0_0_3px_1px_rgba(255,255,255,0.2)]">
        
        {/* Outer Titanium Bezel & Action Button Cutouts */}
        <div className="relative rounded-[2.65rem] p-[8px] bg-[#1E1C1A] ring-1 ring-white/15 shadow-inner overflow-hidden flex flex-col justify-between">
          
          {/* Side Buttons */}
          <div className="absolute top-16 -left-[3px] w-[3px] h-6 bg-[#8C8074] rounded-l-xs" />
          <div className="absolute top-26 -left-[3px] w-[3px] h-9 bg-[#8C8074] rounded-l-xs" />
          <div className="absolute top-38 -left-[3px] w-[3px] h-9 bg-[#8C8074] rounded-l-xs" />
          <div className="absolute top-22 -right-[3px] w-[3px] h-12 bg-[#8C8074] rounded-r-xs" />

          {/* Screen Container (OLED Display) */}
          <div className="relative rounded-[2.3rem] bg-black overflow-hidden shadow-2xl ring-1 ring-black/90">
            {children}

            {/* Photorealistic Dynamic Island */}
            <div className="pointer-events-none absolute top-3 left-1/2 -translate-x-1/2 z-30 w-24 h-6 bg-black rounded-full ring-1 ring-white/10 flex items-center justify-between px-2.5 shadow-md">
              {/* Front Camera Lens with Blue Coating */}
              <div className="w-3 h-3 rounded-full bg-[#050A14] ring-1 ring-[#1A2535] flex items-center justify-center">
                <div className="w-1.2 h-1.2 rounded-full bg-[#0F2840] ring-1 ring-[#3A75B4]/50" />
              </div>
              {/* Face ID Sensor optics */}
              <div className="w-2 h-2 rounded-full bg-[#08080C] ring-1 ring-white/10 flex items-center justify-center">
                <div className="w-0.8 h-0.8 rounded-full bg-[#181020]" />
              </div>
            </div>

            {/* Specular Ceramic Shield Glass Reflection */}
            <div className="pointer-events-none absolute inset-0 z-20 bg-gradient-to-tr from-transparent via-white/[0.05] to-transparent transform -rotate-12 scale-150" />
            <div className="pointer-events-none absolute top-0 inset-x-0 h-24 z-20 bg-gradient-to-b from-black/40 via-transparent to-transparent" />
            
            {/* iOS Home Indicator Bar */}
            <div className="pointer-events-none absolute bottom-1.5 left-1/2 -translate-x-1/2 z-30 w-24 h-1 bg-white/70 rounded-full shadow-xs" />
            
            <div className="pointer-events-none absolute inset-0 z-20 rounded-[2.3rem] ring-1 ring-inset ring-white/10" />
          </div>
        </div>
      </div>
    </div>
  );
}
