import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import AdminSidebar from "../components/shell/AdminSidebar";
import AdminTopbar from "../components/shell/AdminTopbar";
import { useCompany } from "../context/CompanyContext";
import { clearStoredToken } from "../lib/auth";
import { adminNavItems } from "../lib/nav";

type AdminShellLayoutProps = {
  children: ReactNode;
  kicker?: string;
  title?: string;
  subtitle?: string;
};

export default function AdminShellLayout({
  children,
  kicker,
  title,
  subtitle,
}: AdminShellLayoutProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { company } = useCompany();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  useEffect(() => {
    setMobileNavOpen(false);
  }, [location.pathname]);

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
    clearStoredToken();
    navigate("/login", { replace: true });
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="mx-auto max-w-[1600px] px-3 py-3 sm:px-5 sm:py-5">
        <div className="overflow-hidden rounded-[28px] border border-white/10 bg-[#111111] shadow-[0_20px_80px_rgba(0,0,0,0.45)]">
          <div className="lg:grid lg:grid-cols-[260px_minmax(0,1fr)]">
            <aside className="hidden border-r border-white/10 lg:block">
              <AdminSidebar items={adminNavItems} pathname={location.pathname} />
            </aside>

            <div className="min-w-0">
              <AdminTopbar
                kicker={kicker}
                title={title}
                subtitle={subtitle}
                companyName={company?.name}
                onLogout={handleLogout}
                onOpenMobileNav={() => setMobileNavOpen(true)}
              />

              <main className="min-w-0 px-4 py-5 sm:px-6 sm:py-6 lg:px-8 lg:py-8">
                <div className="mx-auto w-full max-w-[1200px] min-w-0">
                  {children}
                </div>
              </main>
            </div>
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
          <div className="absolute inset-y-0 left-0 w-[88vw] max-w-[320px] border-r border-white/10 bg-[#0f0f0f] shadow-[0_20px_80px_rgba(0,0,0,0.55)]">
            <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
              <div>
                <div className="text-[11px] font-semibold uppercase tracking-[0.22em] text-orange-400/80">
                  BossOS
                </div>
                <div className="mt-1 text-lg font-semibold tracking-tight text-white">
                  Navigation
                </div>
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

            <AdminSidebar
              items={adminNavItems}
              pathname={location.pathname}
              onNavigate={() => setMobileNavOpen(false)}
            />
          </div>
        </div>
      ) : null}
    </div>
  );
}
