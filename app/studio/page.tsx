"use client";

import { useEffect, useState } from "react";
import { StudioCore } from "@/components/studio/StudioCore";
import { ArchiveTopbar } from "@/components/archive/ArchiveTopbar";
import { parseShareParams } from "@/lib/share/shareUrl";
import { useEditorStore } from "@/store/useEditorStore";

export default function StudioPage() {
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = parseShareParams(window.location.search);
    const store = useEditorStore.getState();

    if (params.g) {
      store.setGenerator(params.g);
    }
    if (params.s) {
      store.setSeed(params.s);
    }
    if (params.p && params.p.length > 0) {
      store.setPalette(params.p);
    }
    if (params.d) {
      store.setDeviceType(params.d as any);
    }
  }, []);

  return (
    <div className="h-screen bg-paper-50 text-ink-900 font-sans flex flex-col overflow-hidden">
      <ArchiveTopbar
        activeRoute="studio"
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        favoriteCount={0}
      />
      <main className="w-full flex-1 min-h-0">
        <StudioCore layout="full" />
      </main>
    </div>
  );
}
