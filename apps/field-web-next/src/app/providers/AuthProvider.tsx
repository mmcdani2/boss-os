"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { apiJson } from "@/lib/api/client";
import { clearStoredToken, getStoredToken } from "@/lib/auth/auth-storage";

type AuthUser = {
  id: string;
  email: string;
  fullName: string;
  role: string;
  isActive?: boolean;
};

type AuthSession = {
  authenticated: boolean;
  role: string;
};

type AuthPermissions = {
  role: string;
  isAdmin: boolean;
  capabilities: string[];
};

type AuthMeResponse = {
  user: AuthUser | null;
  session: AuthSession | null;
  permissions: AuthPermissions | null;
};

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

export function AuthProvider({ children }: { children: ReactNode }) {
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
      const data = await apiJson<AuthMeResponse>("/api/auth/me");
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
  const ctx = useContext(AuthContext);

  if (!ctx) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return ctx;
}
