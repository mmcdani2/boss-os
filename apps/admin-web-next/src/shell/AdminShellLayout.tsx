"use client";

import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/components/auth/AuthBootstrap";
import { adminNavItems } from "@/shared/nav/admin-nav";
import AdminSidebar from "@/shell/AdminSidebar";
import AdminTopbar from "@/shell/AdminTopbar";

type AdminShellLayoutProps = {
  children: ReactNode;
  title?: string;
};

export default function AdminShellLayout({
  children,
  title,
}: AdminShellLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const appVersion = process.env.NEXT_PUBLIC_APP_VERSION || "v0.1.0";

  useEffect(() => {
    setMobileNavOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!mobileNavOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMobileNavOpen(false);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [mobileNavOpen]);

  const handleLogout = () => {
    logout();
    router.replace("/login");
  };

  return (
    <div className="min-h-screen bg-black text-white lg:h-screen lg:overflow-hidden">
      <div className="mx-auto w-full max-w-[98vw] px-2 py-2 sm:max-w-[97vw] sm:px-3 sm:py-3 lg:h-screen lg:max-w-[96vw] lg:overflow-hidden lg:px-4 lg:py-4">
        <div className="lg:grid lg:h-full lg:grid-cols-[248px_minmax(0,1fr)] lg:gap-4 xl:grid-cols-[256px_minmax(0,1fr)] xl:gap-5">
          <aside className="hidden lg:block lg:min-h-0">
            <div className="sticky top-4 h-[calc(100vh-32px)] overflow-hidden rounded-[28px] border border-white/10 bg-[#111111] shadow-[0_20px_80px_rgba(0,0,0,0.45)]">
              <AdminSidebar
                items={adminNavItems}
                pathname={pathname}
                onLogout={handleLogout}
                currentUserName={user?.fullName}
                currentUserEmail={user?.email}
                appVersion={appVersion}
              />
            </div>
          </aside>

          <div className="min-w-0 rounded-[28px] border border-white/10 bg-[#111111] shadow-[0_20px_80px_rgba(0,0,0,0.45)] lg:flex lg:h-[calc(100vh-32px)] lg:min-h-0 lg:flex-col lg:overflow-hidden">
            <AdminTopbar
              title={title}
              onOpenMobileNav={() => setMobileNavOpen(true)}
            />

            <main className="min-w-0 px-4 py-5 sm:px-5 sm:py-5 lg:flex-1 lg:min-h-0 lg:overflow-hidden lg:px-6 lg:py-6 xl:px-7 xl:py-7">
              <div className="mx-auto w-full min-w-0 lg:flex lg:h-full lg:min-h-0">
                {children}
              </div>
            </main>
          </div>
        </div>
      </div>

      {mobileNavOpen ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            aria-label="Close navigation overlay"
            className="absolute inset-0 bg-black/70 backdrop-blur-[2px]"
            onClick={() => setMobileNavOpen(false)}
          />
          <div className="absolute inset-y-0 left-0 flex w-[88vw] max-w-[320px] min-h-0 flex-col border-r border-white/10 bg-[#0f0f0f] shadow-[0_20px_80px_rgba(0,0,0,0.55)]">
            <div className="shrink-0 flex items-center justify-between border-b border-white/10 px-5 py-4">
              <div className="text-lg font-semibold tracking-tight text-white">
                Navigation
              </div>

              <button
                type="button"
                onClick={() => setMobileNavOpen(false)}
                aria-label="Close navigation"
                className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-white transition hover:bg-white/10"
              >
                <span className="text-lg leading-none">×</span>
              </button>
            </div>

            <div className="min-h-0 flex-1">
              <AdminSidebar
                items={adminNavItems}
                pathname={pathname}
                onNavigate={() => setMobileNavOpen(false)}
                onLogout={handleLogout}
                currentUserName={user?.fullName}
                currentUserEmail={user?.email}
                appVersion={appVersion}
              />
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
