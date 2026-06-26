"use client";

import { useState } from "react";
import { Aperture } from "lucide-react";
import { signIn } from "next-auth/react";
import Link from "next/link";

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

   const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  setLoading(true);
  setError("");

  const formData = new FormData(e.currentTarget);
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  try {
    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      setError("Invalid email or password");
      setLoading(false);
    } else {
      const session = await fetch("/api/auth/session").then((r) => r.json());
      if (session?.user?.role === "PROFESSIONAL") {
        window.location.href = "/dashboard";
      } else {
        window.location.href = "/";
      }
    }
  } catch (err) {
    setError("Something went wrong. Please try again.");
    setLoading(false);
  }
};

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-6">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-6">
  <div className="w-12 h-12 bg-amber-600 rounded-xl flex items-center justify-center">
    <Aperture className="w-6 h-6 text-white" />
  </div>
  <span style={{ fontSize: 22, fontWeight: 700, color: "#0f172a" }}>Shootly</span>  
</Link>
          
          <h1 className="font-serif text-3xl font-bold text-slate-900">Welcome back</h1>
          <p className="text-sm text-slate-500 mt-2">Log in to your Shootly account</p>
        </div>

        {/* Success Message (from registration) */}
        {typeof window !== "undefined" && new URLSearchParams(window.location.search).get("registered") === "true" && (
          <div className="mb-4 px-4 py-3 bg-green-50 border border-green-200 rounded-xl text-sm text-green-700 flex items-center gap-2">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
            Account created successfully! Please log in.
          </div>
        )}

        {/* Form Card */}
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm space-y-5">
          {error && (
            <div className="px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600 flex items-center gap-2">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
              {error}
            </div>
          )}

          <div>
            <label className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-2 block">
              Email
            </label>
            <input
              type="email"
              name="email"
              placeholder="you@example.com"
              autoComplete="email"
              required
              className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all"
            />
          </div>

          <div>
            <label className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-2 block">
              Password
            </label>
            <input
              type="password"
              name="password"
              placeholder="••••••••"
              autoComplete="current-password"
              required
              className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-amber-600 text-white text-sm font-semibold rounded-xl hover:bg-amber-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="animate-spin"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
                Logging in...
              </>
            ) : (
              "Log In"
            )}
          </button>
        </form>

        {/* Footer */}
        <div className="mt-6 text-center">
          <p className="text-sm text-slate-500">
            Don't have an account?{" "}
            <Link href="/signup" className="text-amber-600 font-semibold hover:text-amber-700">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}