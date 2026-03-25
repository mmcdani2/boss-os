import type { ReactNode } from "react";
import ProtectedRoute from "./ProtectedRoute";
import { usePermissions } from "../../shared/hooks/usePermissions";

type PermissionRouteProps = {
  children: ReactNode;
  require?: string[];
  requireAny?: string[];
  adminOnly?: boolean;
  fallback?: ReactNode;
};

function DefaultForbiddenState() {
  return (
    <div className="min-h-screen bg-black text-white">
      <div className="mx-auto flex min-h-screen max-w-2xl items-center justify-center px-6">
        <div className="rounded-3xl border border-white/10 bg-[#111111] px-6 py-5 text-sm font-medium text-white/70 shadow-[0_20px_80px_rgba(0,0,0,0.45)]">
          You do not have permission to view this page.
        </div>
      </div>
    </div>
  );
}

function PermissionGate({
  children,
  require = [],
  requireAny = [],
  adminOnly = false,
  fallback,
}: PermissionRouteProps) {
  const { isAdmin, canAll, canAny } = usePermissions();

  const passesAdmin = adminOnly ? isAdmin : true;
  const passesAll = require.length === 0 ? true : canAll(require);
  const passesAny = requireAny.length === 0 ? true : canAny(requireAny);
  const allowed = passesAdmin && passesAll && passesAny;

  if (!allowed) {
    return <>{fallback ?? <DefaultForbiddenState />}</>;
  }

  return <>{children}</>;
}

export default function PermissionRoute(props: PermissionRouteProps) {
  return (
    <ProtectedRoute>
      <PermissionGate {...props} />
    </ProtectedRoute>
  );
}
