import React, { useEffect, useRef } from "react";
import { QuickGeneratePanel } from "./QuickGeneratePanel";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onOpenStudio: () => void;
};

export function GenerateBottomSheet({ isOpen, onClose, onOpenStudio }: Props) {
  const sheetRef = useRef<HTMLDivElement | null>(null);
  const previousActiveElement = useRef<HTMLElement | null>(null);

  // Focus trap, body scroll lock, initial focus, focus restoration, and Escape listener
  useEffect(() => {
    if (!isOpen) return;

    // Store triggering element for restoration
    previousActiveElement.current = document.activeElement as HTMLElement;

    // Lock body scroll
    document.body.style.overflow = "hidden";

    // Escape key handler
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    document.addEventListener("keydown", handleKeyDown);

    // Focus trap setup
    let cleanupFocusTrap: (() => void) | undefined;
    if (sheetRef.current) {
      const focusable = sheetRef.current.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      if (focusable.length > 0) {
        // Initial focus on close button (safe non-text control to avoid triggering keyboard unexpectedly)
        focusable[0].focus();

        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        const trapHandler = (e: KeyboardEvent) => {
          if (e.key !== "Tab") return;
          if (e.shiftKey) {
            if (document.activeElement === first) {
              e.preventDefault();
              last.focus();
            }
          } else {
            if (document.activeElement === last) {
              e.preventDefault();
              first.focus();
            }
          }
        };

        document.addEventListener("keydown", trapHandler);
        cleanupFocusTrap = () => document.removeEventListener("keydown", trapHandler);
      }
    }

    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", handleKeyDown);
      if (cleanupFocusTrap) cleanupFocusTrap();

      // Restore focus to trigger element on close
      if (previousActiveElement.current) {
        previousActiveElement.current.focus();
      }
    };
  }, [isOpen, onClose]);

  // Visual Viewport API handling for keyboard scrolling
  useEffect(() => {
    if (!isOpen || typeof window === "undefined" || !window.visualViewport) return;

    const handleViewportResize = () => {
      const activeEl = document.activeElement as HTMLElement;
      if (activeEl && (activeEl.tagName === "INPUT" || activeEl.tagName === "SELECT" || activeEl.tagName === "TEXTAREA")) {
        activeEl.scrollIntoView({ block: "nearest", behavior: "smooth" });
      }
    };

    window.visualViewport.addEventListener("resize", handleViewportResize);
    window.visualViewport.addEventListener("scroll", handleViewportResize);

    return () => {
      window.visualViewport?.removeEventListener("resize", handleViewportResize);
      window.visualViewport?.removeEventListener("scroll", handleViewportResize);
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 z-40 bg-black/40 backdrop-blur-xs transition-opacity"
        aria-hidden="true"
      />

      {/* Sheet Content */}
      <div
        ref={sheetRef}
        role="dialog"
        aria-modal="true"
        aria-label="Generate Wallpaper Panel"
        className="fixed bottom-0 left-0 right-0 z-50 max-h-[85dvh] overflow-y-auto rounded-t-2xl border-t border-[#E4DFD3] bg-[#FAF8F4] p-4 sm:p-6 shadow-2xl transition-transform"
      >
        {/* Drag handle */}
        <div className="mx-auto mb-3 h-1.5 w-12 rounded-full bg-[#D4CDBC]" />

        {/* Single Heading */}
        <div className="flex items-center justify-between border-b border-[#E4DFD3] pb-3 mb-3">
          <h2 className="font-serif text-lg font-medium text-[#2B2A26]">Generate Wallpaper</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close generator panel"
            className="flex h-11 w-11 items-center justify-center rounded-full bg-[#F3EFE6] text-sm text-[#5B584F] hover:text-[#2B2A26]"
          >
            ✕
          </button>
        </div>

        {/* Mobile-optimized QuickGeneratePanel with hidden internal header */}
        <QuickGeneratePanel
          variant="mobile"
          hideHeading={true}
          onOpenStudio={() => {
            onClose();
            onOpenStudio();
          }}
        />
      </div>
    </>
  );
}
