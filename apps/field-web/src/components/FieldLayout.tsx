import type { ReactNode } from "react";
import FieldShellLayout from "../shell/FieldShellLayout";

type FieldLayoutProps = {
  children: ReactNode;
  kicker?: string;
  title?: string;
  subtitle?: string;
};

export default function FieldLayout(props: FieldLayoutProps) {
  return <FieldShellLayout {...props} />;
}
