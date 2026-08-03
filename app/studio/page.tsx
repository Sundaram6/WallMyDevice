"use client";

import { StudioCore } from "@/components/studio/StudioCore";
import { ArchiveTopbar } from "@/components/archive/ArchiveTopbar";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function StudioPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

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

// Turbopack HMR cache clear
