import React from "react";
import { QuickGeneratePanel } from "./QuickGeneratePanel";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onOpenStudio: () => void;
};

export function GenerateBottomSheet({ isOpen, onClose, onOpenStudio }: Props) {
  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 z-40 bg-black/40 backdrop-blur-xs transition-opacity"
      />

      {/* Sheet Content */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Generate Wallpaper Panel"
        className="fixed bottom-0 left-0 right-0 z-50 max-h-[85vh] overflow-y-auto rounded-t-2xl border-t border-[#E4DFD3] bg-[#FAF8F4] p-6 shadow-2xl transition-transform"
      >
        {/* Drag handle */}
        <div className="mx-auto mb-4 h-1.5 w-12 rounded-full bg-[#D4CDBC]" />

        <div className="flex items-center justify-between border-b border-[#E4DFD3] pb-3 mb-4">
          <h2 className="font-serif text-lg font-medium text-[#2B2A26]">Generate Wallpaper</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close generator panel"
            className="flex h-8 w-8 items-center justify-center rounded-full bg-[#F3EFE6] text-sm text-[#5B584F]"
          >
            ✕
          </button>
        </div>

        <QuickGeneratePanel onOpenStudio={onOpenStudio} />
      </div>
    </>
  );
}
