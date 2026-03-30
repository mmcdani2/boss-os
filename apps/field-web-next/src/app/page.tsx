"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getStoredToken } from "@/lib/auth/auth-storage";

export default function RootPage() {
  const router = useRouter();

  useEffect(() => {
    const token = getStoredToken();
    router.replace(token ? "/home" : "/login");
  }, [router]);

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="mx-auto flex min-h-screen max-w-2xl items-center justify-center px-6">
        <div className="rounded-3xl border border-white/10 bg-[#111111] px-6 py-5 text-sm font-medium text-white/70 shadow-[0_20px_80px_rgba(0,0,0,0.45)]">
          Loading...
        </div>
      </div>
    </div>
  );
}
