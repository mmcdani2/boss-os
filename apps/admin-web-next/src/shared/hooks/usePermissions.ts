"use client";

import { useMemo } from "react";
import { useAuth } from "@/components/auth/AuthBootstrap";

export function usePermissions() {
  const { permissions } = useAuth();

  return useMemo(() => {
    const capabilities = permissions?.capabilities ?? [];

    return {
      role: permissions?.role ?? null,
      isAdmin: !!permissions?.isAdmin,
      capabilities,
      has: (capability: string) => capabilities.includes(capability),
      hasAny: (required: string[]) => required.some((capability) => capabilities.includes(capability)),
      hasAll: (required: string[]) => required.every((capability) => capabilities.includes(capability)),
    };
  }, [permissions]);
}
