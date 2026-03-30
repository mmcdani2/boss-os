"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import FieldShellLayout from "@/shell/FieldShellLayout";
import { useAuth } from "@/app/providers/AuthProvider";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { loading, isAuthenticated } = useAuth();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.replace("/login");
    }
  }, [loading, isAuthenticated, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white">
        <div className="mx-auto flex min-h-screen max-w-2xl items-center justify-center px-6">
          <div className="rounded-3xl border border-white/10 bg-[#111111] px-6 py-5 text-sm font-medium text-white/70 shadow-[0_20px_80px_rgba(0,0,0,0.45)]">
            Loading session...
          </div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return <FieldShellLayout>{children}</FieldShellLayout>;
}
