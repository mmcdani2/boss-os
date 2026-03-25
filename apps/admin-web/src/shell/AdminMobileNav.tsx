import { NavLink } from "react-router-dom";
import type { AdminNavItem } from "../shared/nav/types";

type AdminMobileNavProps = {
  items: AdminNavItem[];
  pathname: string;
};

export default function AdminMobileNav({ items, pathname }: AdminMobileNavProps) {
  return (
    <nav className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {items.map((item) => {
        const isActive = item.match(pathname);

        return (
          <NavLink
            key={item.to}
            to={item.to}
            className={[
              "rounded-2xl border px-4 py-3 text-center text-sm font-medium transition",
              isActive
                ? "border-orange-400 bg-orange-500 text-black"
                : "border-white/10 bg-[#111111] text-white/75 hover:bg-white/5 hover:text-white",
              item.disabled ? "pointer-events-none opacity-50" : "",
            ].join(" ")}
          >
            {item.label}
          </NavLink>
        );
      })}
    </nav>
  );
}

