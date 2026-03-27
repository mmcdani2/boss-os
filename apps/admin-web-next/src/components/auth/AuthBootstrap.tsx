"use client";

import { createContext, ReactNode, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { apiJson } from "@/lib/api/client";
import { clearStoredToken, getStoredToken } from "@/lib/auth/auth-storage";
import type { AuthPermissions, AuthSession, AuthUser, MeResponse } from "@/lib/auth/auth-types";

type AuthContextValue = {
  user: AuthUser | null;
  session: AuthSession | null;
  permissions: AuthPermissions | null;
  loading: boolean;
  isAuthenticated: boolean;
  refreshAuth: () => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export default function AuthBootstrap({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [session, setSession] = useState<AuthSession | null>(null);
  const [permissions, setPermissions] = useState<AuthPermissions | null>(null);
  const [loading, setLoading] = useState(true);

  const logout = useCallback(() => {
    clearStoredToken();
    setUser(null);
    setSession(null);
    setPermissions(null);
  }, []);

  const refreshAuth = useCallback(async () => {
    const token = getStoredToken();

    if (!token) {
      setUser(null);
      setSession(null);
      setPermissions(null);
      setLoading(false);
      return;
    }

    setLoading(true);

    try {
      const data = await apiJson<MeResponse>("/api/auth/me");
      setUser(data.user ?? null);
      setSession(data.session ?? null);
      setPermissions(data.permissions ?? null);
    } catch {
      logout();
    } finally {
      setLoading(false);
    }
  }, [logout]);

  useEffect(() => {
    void refreshAuth();
  }, [refreshAuth]);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      session,
      permissions,
      loading,
      isAuthenticated: !!session?.authenticated && !!user,
      refreshAuth,
      logout,
    }),
    [user, session, permissions, loading, refreshAuth, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within AuthBootstrap");
  }

  return context;
}
