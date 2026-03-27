"use client";

import type { ReactNode } from "react";
import AuthBootstrap from "@/components/auth/AuthBootstrap";
import RequireAdmin from "@/components/auth/RequireAdmin";
import { CompanyProvider } from "@/app/providers/CompanyProvider";
import AdminShellLayout from "@/shell/AdminShellLayout";

export default function ProtectedLayout({ children }: { children: ReactNode }) {
  return (
    <AuthBootstrap>
      <RequireAdmin>
        <CompanyProvider>
          <AdminShellLayout>{children}</AdminShellLayout>
        </CompanyProvider>
      </RequireAdmin>
    </AuthBootstrap>
  );
}
