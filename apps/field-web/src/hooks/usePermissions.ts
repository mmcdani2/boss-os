import { useMemo } from "react";
import { useAuth } from "../context/AuthContext";
import {
  hasAllCapabilities,
  hasAnyCapability,
  hasCapability,
} from "../lib/permissions";

export function usePermissions() {
  const { permissions } = useAuth();

  return useMemo(() => {
    const capabilities = permissions?.capabilities ?? [];

    return {
      role: permissions?.role ?? null,
      isAdmin: !!permissions?.isAdmin,
      capabilities,
      can: (capability: string) => hasCapability(capabilities, capability),
      canAny: (required: string[]) => hasAnyCapability(capabilities, required),
      canAll: (required: string[]) => hasAllCapabilities(capabilities, required),
    };
  }, [permissions]);
}
