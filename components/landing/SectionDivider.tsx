import React from "react";

type Props = {
  label?: string;
  sublabel?: string;
  className?: string;
};

export function SectionDivider({ label = "✦", sublabel, className = "" }: Props) {
  return (
    <div className={`relative w-full py-8 flex items-center justify-center ${className}`}>
      {/* Horizontal Line */}
      <div className="absolute inset-0 flex items-center px-6 sm:px-12">
        <div className="w-full border-t border-[#E4DFD3]/70" />
      </div>

      {/* Center Editorial Pill */}
      <div className="relative z-10 flex items-center gap-2 bg-[#FAF8F4] px-4 text-[#8A8579] font-mono text-[10px] uppercase tracking-widest">
        <span className="text-[#C9552F] font-serif italic text-sm">{label}</span>
        {sublabel && (
          <>
            <span>·</span>
            <span>{sublabel}</span>
          </>
        )}
      </div>
    </div>
  );
}
