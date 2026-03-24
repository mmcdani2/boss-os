import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { CompanyProvider } from "../context/CompanyContext";
import { getStoredToken } from "../lib/auth";

type ProtectedRouteProps = {
  children: ReactNode;
};

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const token = getStoredToken();

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return <CompanyProvider>{children}</CompanyProvider>;
}
