"use client";

import React, { useState } from "react";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Lock, Mail, User, Sparkles } from "lucide-react";

export default function SignupPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, name }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Registration failed.");
      }

      const signInRes = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (signInRes?.error) {
        throw new Error("Account created! Please sign in.");
      }

      window.location.href = "/saved";
    } catch (err: any) {
      setError(err.message || "An error occurred.");
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-paper-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 text-ink-900 select-none">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link href="/" className="inline-flex items-center gap-1.5 font-serif text-3xl font-medium tracking-tight text-ink-900 mb-2">
          <span>WallMyDevice</span>
          <span className="text-accent-500 font-serif italic text-2xl">✦</span>
        </Link>
        <h2 className="font-serif text-2xl font-medium text-ink-900">Create your account</h2>
        <p className="mt-1 text-xs text-ink-500">
          Already have an account?{" "}
          <Link href="/login" className="text-accent-500 font-semibold hover:underline">
            Sign in
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4">
        <div className="bg-white py-8 px-6 shadow-1 rounded-2xl border border-paper-200 sm:px-10">
          {error && (
            <div className="mb-4 rounded-xl border border-red-500/20 bg-red-500/10 p-3 text-xs text-red-600">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-ink-700 mb-1">Full Name</label>
              <div className="relative flex items-center">
                <User size={16} className="absolute left-3 text-ink-400" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Studio Artist"
                  className="w-full rounded-xl border border-paper-300 bg-paper-50 py-2.5 pl-9 pr-3 text-xs text-ink-900 placeholder-ink-400 focus:border-accent-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-ink-700 mb-1">Email Address</label>
              <div className="relative flex items-center">
                <Mail size={16} className="absolute left-3 text-ink-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full rounded-xl border border-paper-300 bg-paper-50 py-2.5 pl-9 pr-3 text-xs text-ink-900 placeholder-ink-400 focus:border-accent-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-ink-700 mb-1">Password</label>
              <div className="relative flex items-center">
                <Lock size={16} className="absolute left-3 text-ink-400" />
                <input
                  type="password"
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  className="w-full rounded-xl border border-paper-300 bg-paper-50 py-2.5 pl-9 pr-3 text-xs text-ink-900 placeholder-ink-400 focus:border-accent-500 focus:outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-accent-500 py-2.5 text-xs font-semibold text-white shadow-1 hover:bg-accent-600 transition-all cursor-pointer disabled:opacity-50"
            >
              {loading ? "Creating account..." : "Create Account"}
            </button>
          </form>

          <div className="my-6 flex items-center gap-3">
            <div className="h-[1px] flex-1 bg-paper-200" />
            <span className="text-[10px] uppercase font-mono text-ink-400">or continue with</span>
            <div className="h-[1px] flex-1 bg-paper-200" />
          </div>

          <button
            type="button"
            onClick={() => signIn("google", { callbackUrl: "/saved" })}
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-paper-300 bg-white py-2.5 text-xs font-medium text-ink-900 hover:bg-paper-100 transition-all cursor-pointer shadow-xs"
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            Google Account
          </button>
        </div>
      </div>
    </div>
  );
}
