import React, { type ReactNode } from "react";

type Props = {
  children: ReactNode;
};

export function IPadProFrame({ children }: Props) {
  return (
    <div className="relative group flex items-center justify-center">
      {/* Volumetric Underglow */}
      <div className="absolute -inset-4 bg-gradient-to-tr from-brand-accent/15 via-purple-900/10 to-blue-900/10 rounded-[2.5rem] blur-2xl opacity-60 group-hover:opacity-80 transition-opacity pointer-events-none" />

      {/* Space Black iPad Chassis (Ultra-thin 4px bezel, Face ID pill, Apple Pencil ledge) */}
      <div className="relative rounded-[2.2rem] p-[3px] bg-gradient-to-b from-[#383A40] via-[#1B1C20] to-[#0F1012] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8),0_0_2px_1px_rgba(255,255,255,0.1)]">
        
        {/* Right Edge: Magnetic Apple Pencil Ledge */}
        <div className="absolute top-1/3 -right-[4px] w-[3px] h-20 bg-[#2A2B30] rounded-r-md border-r border-white/10" />

        {/* Chassis Frame Shell */}
        <div className="relative rounded-[2.05rem] p-[10px] bg-[#141518] ring-1 ring-white/10 shadow-inner overflow-hidden flex flex-col justify-between">
          
          {/* Screen Container */}
          <div className="relative rounded-[1.6rem] bg-black overflow-hidden shadow-2xl ring-1 ring-black/80">
            {children}

            {/* Top Face ID Camera Bar & Ambient Light Sensor */}
            <div className="pointer-events-none absolute top-2.5 left-1/2 -translate-x-1/2 z-30 w-16 h-2.5 rounded-full bg-black ring-1 ring-[#25262B] flex items-center justify-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-[#08121E]" />
              <div className="w-1 h-1 rounded-full bg-[#050B12]" />
            </div>

            {/* Specular Glass Sheen */}
            <div className="pointer-events-none absolute inset-0 z-20 bg-gradient-to-tr from-transparent via-white/[0.03] to-transparent transform -rotate-6 scale-150" />
            <div className="pointer-events-none absolute inset-0 z-20 rounded-[1.6rem] ring-1 ring-inset ring-white/10" />
          </div>
        </div>
      </div>
    </div>
  );
}
