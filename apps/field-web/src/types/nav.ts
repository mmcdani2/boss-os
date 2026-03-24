export type FieldNavItem = {
  label: string;
  to: string;
  match: (pathname: string) => boolean;
  disabled?: boolean;
  badge?: string;
};
