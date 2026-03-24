import type { ReactNode } from "react";
import AdminShellLayout from "../layouts/AdminShellLayout";

type LayoutProps = {
  children: ReactNode;
  kicker?: string;
  title?: string;
  subtitle?: string;
};

export default function Layout(props: LayoutProps) {
  return <AdminShellLayout {...props} />;
}
