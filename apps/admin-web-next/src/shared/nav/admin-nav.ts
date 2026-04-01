import type { AdminNavItem } from "./types";

export const adminNavItems: AdminNavItem[] = [
  {
    label: "Dashboard",
    to: "/dashboard",
    match: (pathname) => pathname === "/dashboard",
  },
  {
    label: "Logs",
    to: "/logs",
    match: (pathname) =>
      pathname.startsWith("/logs") ||
      pathname.startsWith("/reimbursement-requests/"),
  },
  {
    label: "Divisions",
    to: "/divisions",
    match: (pathname) =>
      pathname === "/divisions" || pathname.startsWith("/divisions/"),
  },
  {
    label: "Inventory",
    to: "/inventory",
    match: (pathname) => pathname === "/inventory" || pathname.startsWith("/inventory/"),
  },
  {
    label: "Users",
    to: "/users",
    match: (pathname) => pathname === "/users",
  },
  {
    label: "Settings",
    to: "/settings",
    match: (pathname) => pathname === "/settings",
  },
];
