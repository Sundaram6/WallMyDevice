"use client";

import { useState } from "react";
import { ArchiveTopbar } from "@/components/archive/ArchiveTopbar";
import Link from "next/link";

export default function SignInPage() {
  const [tab, setTab] = useState<"archive" | "studio">("archive");
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="min-h-screen bg-[#FAF8F4] text-[#2B2A26] font-sans">
      <ArchiveTopbar
        currentTab={tab}
        onTabChange={(t) => {
          if (t === "studio") {
            window.location.href = "/#studio";
          } else {
            setTab(t);
          }
        }}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        favoriteCount={0}
      />
      <main className="mx-auto max-w-md px-6 py-16 text-center">
        <div className="rounded-2xl border border-[#E4DFD3] bg-white p-8 shadow-sm">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#F3EFE6] text-xl text-[#C9552F]">
            👤
          </div>
          <h1 className="font-serif text-2xl font-medium text-[#2B2A26]">Sign In</h1>
          <p className="mt-2 text-xs text-[#5B584F] leading-relaxed">
            Account authentication service status & configuration guide.
          </p>

          <div className="mt-6 rounded-xl border border-[#E4DFD3] bg-[#FAF8F4] p-4 text-left text-xs text-[#5B584F] space-y-2 font-mono">
            <div className="font-sans font-medium text-[#2B2A26] text-xs">Authentication Not Configured</div>
            <p className="font-sans text-xs">
              WallMyDevice is currently running in local guest mode. All generator features, seed recipes, and wallpaper exports remain fully operational without an account.
            </p>
            <div className="pt-2 border-t border-[#E4DFD3]">
              <span className="block text-[11px] text-[#2B2A26] font-sans font-medium mb-1">Required Environment Setup:</span>
              <div className="bg-white p-2 rounded border border-[#E4DFD3] text-[10px] text-[#8A8579]">
                <code>NEXT_PUBLIC_AUTH_PROVIDER</code><br />
                <code>AUTH_SECRET</code><br />
                <code>NEXT_PUBLIC_CLIENT_ID</code>
              </div>
            </div>
          </div>

          <div className="mt-6 flex flex-col gap-2">
            <Link
              href="/"
              className="w-full rounded-xl bg-[#2B2A26] py-3 text-xs font-medium text-white shadow transition hover:bg-[#1a1917]"
            >
              Continue as Guest
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
