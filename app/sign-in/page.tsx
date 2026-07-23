"use client";

import { useState } from "react";
import Link from "next/link";
import { ArchiveTopbar } from "@/components/archive/ArchiveTopbar";
import { useRouter } from "next/navigation";

const AUTH_CONFIGURED =
  typeof process !== "undefined" &&
  !!process.env.NEXT_PUBLIC_AUTH_PROVIDER;

export default function SignInPage() {
  const [tab, setTab] = useState<"archive" | "studio">("archive");
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  return (
    <div className="min-h-screen bg-[#FAF8F4] text-[#2B2A26] font-sans">
      <ArchiveTopbar
        currentTab={tab}
        onTabChange={(t) => {
          if (t === "studio") router.push("/");
          else setTab(t);
        }}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        favoriteCount={0}
      />

      <main className="flex min-h-[calc(100vh-72px)] items-start justify-center px-6 pt-16">
        <div className="w-full max-w-md">
          {/* Card */}
          <div className="rounded-2xl border border-[#E4DFD3] bg-white p-8 shadow-sm">
            {/* Icon */}
            <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-[#F3EFE6] text-2xl">
              👤
            </div>

            {/* Heading */}
            <h1 className="text-center font-serif text-2xl font-medium text-[#2B2A26]">
              {AUTH_CONFIGURED ? "Sign in to WallMyDevice" : "Running as Guest"}
            </h1>
            <p className="mt-2 text-center text-xs text-[#5B584F] leading-relaxed">
              {AUTH_CONFIGURED
                ? "Sign in with your provider to save favourites, sync collections, and access your Studio history."
                : "All generator features, archive recipes, Studio editing, and wallpaper exports are fully available without an account."}
            </p>

            {/* Status banner */}
            {!AUTH_CONFIGURED && (
              <div className="mt-6 rounded-xl border border-amber-200 bg-amber-50 p-4 text-xs text-amber-800">
                <div className="font-semibold mb-1">Authentication not configured</div>
                <p className="leading-relaxed">
                  To enable real sign-in, set the following environment variables and redeploy.
                  See <code className="font-mono">.env.example</code> for the full template.
                </p>
              </div>
            )}

            {/* Env var list */}
            {!AUTH_CONFIGURED && (
              <div className="mt-4 rounded-xl border border-[#E4DFD3] bg-[#FAF8F4] p-4 font-mono text-[11px] text-[#5B584F] space-y-1.5">
                <div className="font-sans font-medium text-xs text-[#2B2A26] mb-2">Required variables</div>
                {[
                  ["NEXT_PUBLIC_AUTH_PROVIDER", "google | github | discord"],
                  ["AUTH_SECRET", "openssl rand -base64 32"],
                  ["GOOGLE_CLIENT_ID", "from Google OAuth console"],
                  ["GOOGLE_CLIENT_SECRET", "from Google OAuth console"],
                ].map(([key, hint]) => (
                  <div key={key} className="flex flex-col gap-0.5">
                    <span className="text-[#2B2A26]">{key}</span>
                    <span className="pl-3 text-[#8A8579]"># {hint}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Actions */}
            <div className="mt-6 flex flex-col gap-3">
              {AUTH_CONFIGURED ? (
                <button
                  type="button"
                  className="w-full rounded-xl bg-[#2B2A26] py-3 text-xs font-medium text-white shadow transition hover:bg-[#1a1917]"
                  onClick={() => {
                    /* connect auth.signIn() here */
                    alert("Redirect to provider…");
                  }}
                >
                  Continue with {process.env.NEXT_PUBLIC_AUTH_PROVIDER ?? "provider"}
                </button>
              ) : null}

              <Link
                href="/"
                className="block w-full rounded-xl border border-[#D4CDBC] bg-white py-3 text-center text-xs font-medium text-[#5B584F] shadow-sm transition hover:bg-[#F3EFE6] hover:text-[#2B2A26]"
              >
                Continue as Guest →
              </Link>
            </div>

            {/* Privacy note */}
            <p className="mt-6 text-center text-[10px] text-[#8A8579]">
              WallMyDevice generates all wallpapers locally. No image data is ever sent to a server. Accounts are optional.
            </p>
          </div>

          {/* Docs link */}
          <p className="mt-4 text-center text-xs text-[#8A8579]">
            Need help setting up auth?{" "}
            <Link href="/about" className="text-[#C9552F] hover:underline">
              Read the About page →
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}
