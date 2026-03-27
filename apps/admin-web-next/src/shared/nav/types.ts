export type AdminNavItem = {
  label: string;
  to: string;
  match: (pathname: string) => boolean;
  disabled?: boolean;
  badge?: string;
};
