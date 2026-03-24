import { NavLink } from "react-router-dom";
import type { AdminNavItem } from "../../types/nav";

type AdminSidebarProps = {
  items: AdminNavItem[];
  pathname: string;
  onNavigate?: () => void;
  onLogout: () => void;
};

export default function AdminSidebar({
  items,
  pathname,
  onNavigate,
  onLogout,
}: AdminSidebarProps) {
  return (
    <div className="flex h-full flex-col bg-[#0f0f0f] text-white">
      <div className="border-b border-white/10 px-5 py-5">
        <div className="text-[11px] font-semibold uppercase tracking-[0.22em] text-orange-400/80">
          BossOS
        </div>
        <div className="mt-2 text-2xl font-semibold tracking-tight text-white">
          Admin
        </div>
        <p className="mt-2 text-sm text-white/60">
          Operations, logs, divisions, and settings.
        </p>
      </div>

      <nav className="flex-1 space-y-2 px-3 py-4">
        {items.map((item) => {
          const isActive = item.match(pathname);

          return (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={onNavigate}
              className={[
                "flex items-center justify-between rounded-2xl px-4 py-3 text-sm font-medium transition",
                isActive
                  ? "bg-orange-500 text-black shadow-[0_10px_30px_rgba(249,115,22,0.25)]"
                  : "text-white/75 hover:bg-white/5 hover:text-white",
                item.disabled ? "pointer-events-none opacity-50" : "",
              ].join(" ")}
            >
              <span>{item.label}</span>
              {item.badge ? (
                <span
                  className={[
                    "rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide",
                    isActive ? "bg-black/15 text-black" : "bg-white/10 text-white/70",
                  ].join(" ")}
                >
                  {item.badge}
                </span>
              ) : null}
            </NavLink>
          );
        })}
      </nav>

      <div className="border-t border-white/10 px-4 py-4">
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3">
          <div className="text-xs font-semibold uppercase tracking-[0.18em] text-white/45">
            Current shell
          </div>
          <p className="mt-2 text-sm text-white/65">
            Compatibility wrapper around the current admin workflows.
          </p>

          <button
            type="button"
            onClick={onLogout}
            className="mt-4 inline-flex w-full items-center justify-center rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-medium text-white transition hover:bg-white/10"
          >
            Log out
          </button>
        </div>
      </div>
    </div>
  );
}
