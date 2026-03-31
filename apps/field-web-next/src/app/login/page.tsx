"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/providers/AuthProvider";
import { API_BASE } from "@/lib/config/env";
import { getStoredToken, setStoredToken, type LoginResponse } from "@/lib/auth/auth-storage";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const token = getStoredToken();
  const { refreshAuth } = useAuth();

  useEffect(() => {
    if (token) {
      router.replace("/home");
    }
  }, [token, router]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const raw = await response.text();
      let data: LoginResponse | { error?: string; message?: string } = {};

      try {
        data = raw ? JSON.parse(raw) : {};
      } catch {
        data = {};
      }

      if (!response.ok) {
        setError(
          "error" in data
            ? data.error || data.message || raw || "Login failed."
            : "Login failed."
        );
        return;
      }

      const loginData = data as LoginResponse;

      if (!loginData.token) {
        setError("Login succeeded but no token was returned.");
        return;
      }

      setStoredToken(loginData.token);
      await refreshAuth();
      router.replace("/home");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to reach the server.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen bg-black text-white">
      <div className="mx-auto flex min-h-screen max-w-[1600px] items-center justify-center px-3 py-3 sm:px-5 sm:py-5">
        <div className="w-full max-w-[520px] overflow-hidden rounded-[28px] border border-white/10 bg-[#111111] shadow-[0_20px_80px_rgba(0,0,0,0.45)]">
          <div className="border-b border-white/10 px-6 py-6 sm:px-8 sm:py-8">
            <div className="mx-auto w-fit px-4 py-3">
              <Image
                src="/brand/bossos-wordmark-master.png"
                alt="BossOS"
                width={180}
                height={120}
                priority
                className="h-auto w-[160px] sm:w-[180px]"
              />
            </div>

            <h1 className="mt-5 text-center text-3xl font-semibold tracking-tight text-white sm:text-4xl">
              Tech Login
            </h1>
            <p className="mt-3 max-w-md text-center text-sm leading-6 text-white/60 sm:mx-auto sm:text-[15px]">
              Sign in to access field tools, logs, and daily division workflows.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="grid gap-5 px-6 py-6 sm:px-8 sm:py-8">
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              autoComplete="email"
              required
              placeholder="Email"
              className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition placeholder:text-white/35 focus:border-orange-400/50 focus:bg-white/[0.07]"
            />

            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              autoComplete="current-password"
              required
              placeholder="Password"
              className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition placeholder:text-white/35 focus:border-orange-400/50 focus:bg-white/[0.07]"
            />

            {error ? (
              <div className="rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm font-medium text-red-200">
                {error}
              </div>
            ) : null}

            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center justify-center rounded-2xl bg-orange-500 px-4 py-3 text-sm font-semibold text-black transition hover:bg-orange-400 disabled:cursor-default disabled:opacity-70"
            >
              {submitting ? "Signing in..." : "Sign in"}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
