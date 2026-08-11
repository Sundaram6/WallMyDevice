import { useCallback } from "react";
import { useEditorStore } from "@/store/useEditorStore";

type Props = {
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (v: number) => void;
  ariaLabel?: string;
  label?: string;
  showValue?: boolean;
};

export function Slider({
  value,
  min,
  max,
  step,
  onChange,
  ariaLabel,
  label,
  showValue = false,
}: Props) {
  const percent = Math.min(100, Math.max(0, ((value - min) / (max - min || 1)) * 100));
  const setInteracting = useEditorStore((s) => s.setInteracting);

  const handleInteractionStart = useCallback(() => {
    setInteracting(true);
    const handleInteractionEnd = () => {
      setInteracting(false);
      window.removeEventListener("pointerup", handleInteractionEnd);
      window.removeEventListener("pointercancel", handleInteractionEnd);
      window.removeEventListener("mouseup", handleInteractionEnd);
      window.removeEventListener("touchend", handleInteractionEnd);
    };
    window.addEventListener("pointerup", handleInteractionEnd);
    window.addEventListener("pointercancel", handleInteractionEnd);
    window.addEventListener("mouseup", handleInteractionEnd);
    window.addEventListener("touchend", handleInteractionEnd);
  }, [setInteracting]);

  return (
    <div className="flex flex-col gap-1.5 w-full">
      {(label || showValue) && (
        <div className="flex items-center justify-between text-xs">
          {label && <span className="font-sans font-medium text-ink-700">{label}</span>}
          {showValue && <span className="font-mono text-ink-500 text-[11px] tabular-nums">{value}</span>}
        </div>
      )}
      <div className="relative flex items-center w-full h-5">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          aria-label={ariaLabel || label}
          onPointerDown={handleInteractionStart}
          onTouchStart={handleInteractionStart}
          onChange={(e) => onChange(Number(e.target.value))}
          style={{
            background: `linear-gradient(to right, var(--accent-500) 0%, var(--accent-500) ${percent}%, var(--paper-200) ${percent}%, var(--paper-200) 100%)`,
          }}
          className="w-full h-1 cursor-pointer appearance-none rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-500/50
            [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-paper-0 [&::-webkit-slider-thumb]:border [&::-webkit-slider-thumb]:border-paper-300 [&::-webkit-slider-thumb]:shadow-2 [&::-webkit-slider-thumb]:transition-all [&::-webkit-slider-thumb]:duration-[--dur-fast] [&::-webkit-slider-thumb]:ease-[--ease-out] [&::-webkit-slider-thumb]:active:scale-125
            [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-paper-0 [&::-moz-range-thumb]:border [&::-moz-range-thumb]:border-paper-300 [&::-moz-range-thumb]:shadow-2 [&::-moz-range-thumb]:transition-all [&::-moz-range-thumb]:duration-[--dur-fast] [&::-moz-range-thumb]:ease-[--ease-out] [&::-moz-range-thumb]:active:scale-125"
        />
      </div>
    </div>
  );
}
