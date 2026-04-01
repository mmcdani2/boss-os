import type { FieldNavItem } from "./types";

export const fieldNavItems: FieldNavItem[] = [
  {
    label: "Home",
    to: "/home",
    match: (pathname) => pathname === "/home",
  },
  {
    label: "My Logs",
    to: "/my-logs",
    match: (pathname) =>
      pathname === "/my-logs" || pathname.startsWith("/logs/"),
  },
];

