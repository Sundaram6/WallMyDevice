"use client";

import React, { useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ARCHIVE_PRESETS } from "@/lib/presets/archive-presets";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  favorites: Set<string>;
  onToggleFavorite: (id: string) => void;
  onOpenStudio?: () => void;
};

export function FavoritesDrawer({
  isOpen,
  onClose,
  favorites,
  onToggleFavorite,
  onOpenStudio,
}: Props) {
  const drawerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    if (!isOpen) return;

    document.body.style.overflow = "hidden";
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const favList = ARCHIVE_PRESETS.filter((p) => favorites.has(p.id));

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer */}
      <div
        ref={drawerRef}
        className="relative flex w-full max-w-md flex-col bg-brand-bg p-6 shadow-2xl h-full z-10 border-l border-brand-border text-brand-ink"
      >
        <div className="flex items-center justify-between border-b border-brand-border pb-4">
          <div>
            <h2 className="font-serif text-lg font-medium text-brand-ink">Your Favourites</h2>
            <p className="text-[11px] text-brand-muted">Saved on this device ({favList.length})</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close Favourites"
            className="flex h-11 w-11 items-center justify-center rounded-lg text-brand-muted hover:text-brand-ink hover:bg-brand-surface"
          >
            ✕
          </button>
        </div>

        <div className="flex-1 overflow-y-auto py-4 space-y-3">
          {favList.length === 0 ? (
            <div className="py-12 text-center">
              <p className="text-sm text-brand-muted">No favourites saved on this device yet.</p>
              <p className="mt-1 text-xs text-brand-muted">Click ♡ on any wallpaper to add it to your local favourites.</p>
            </div>
          ) : (
            favList.map((swatch) => (
              <div
                key={swatch.id}
                className="group flex items-center gap-3 rounded-xl border border-brand-border bg-brand-surface-2 p-3 shadow-xs"
              >
                <div
                  className="h-12 w-12 shrink-0 rounded-lg border border-black/10"
                  style={{
                    background: `linear-gradient(135deg, ${swatch.palette[0]} 0%, ${swatch.palette[swatch.palette.length - 1]} 100%)`,
                  }}
                />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs font-medium text-brand-ink">{swatch.name}</p>
                  <p className="text-[10px] text-brand-muted">{swatch.category} · {swatch.volume}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      if (onOpenStudio) onOpenStudio();
                      else router.push("/");
                    }}
                    className="text-xs font-medium text-brand-accent hover:underline px-2 py-1"
                  >
                    Open
                  </button>
                  <button
                    type="button"
                    onClick={() => onToggleFavorite(swatch.id)}
                    aria-label={`Remove ${swatch.name} from favourites`}
                    className="text-xs text-brand-muted hover:text-red-500 p-1"
                  >
                    ✕
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="border-t border-brand-border pt-4 flex justify-between items-center text-xs">
          <span className="text-brand-muted">Saved locally in browser</span>
          <Link
            href="/profile"
            onClick={onClose}
            className="text-brand-accent font-medium hover:underline"
          >
            Manage Local Profile →
          </Link>
        </div>
      </div>
    </div>
  );
}
