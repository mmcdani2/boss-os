"use client";

import { ReactNode, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth/AuthBootstrap";
import { usePermissions } from "@/shared/hooks/usePermissions";

export default function RequireAdmin({ children }: { children: ReactNode }) {
  const router = useRouter();
  const { loading, isAuthenticated } = useAuth();
  const { isAdmin } = usePermissions();

  useEffect(() => {
    if (loading) return;

    if (!isAuthenticated || !isAdmin) {
      router.replace("/login");
    }
  }, [loading, isAuthenticated, isAdmin, router]);

  if (loading) {
    return (
      <main className="min-h-screen bg-black text-white">
        <div className="mx-auto flex min-h-screen max-w-[1600px] items-center justify-center px-3 py-3 sm:px-5 sm:py-5">
          <div className="w-full max-w-[520px] overflow-hidden rounded-[28px] border border-white/10 bg-[#111111] shadow-[0_20px_80px_rgba(0,0,0,0.45)]">
            <div className="border-b border-white/10 px-6 py-6 sm:px-8 sm:py-8">
              <div className="text-[11px] font-semibold uppercase tracking-[0.22em] text-orange-400/80">
                BossOS
              </div>
              <h1 className="mt-2 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                Loading Admin
              </h1>
              <p className="mt-3 max-w-md text-sm leading-6 text-white/60 sm:text-[15px]">
                Verifying your session and loading your workspace.
              </p>
            </div>

            <div className="px-6 py-6 sm:px-8 sm:py-8">
              <div className="h-3 overflow-hidden rounded-full bg-white/10">
                <div className="h-full w-1/3 animate-pulse rounded-full bg-orange-500" />
              </div>
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (!isAuthenticated || !isAdmin) {
    return null;
  }

  return <>{children}</>;
}
