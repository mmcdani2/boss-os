export type AuthUser = {
  id: string;
  email: string;
  fullName: string;
  role: string;
  isActive?: boolean;
};

export type AuthSession = {
  authenticated: boolean;
  role: string;
};

export type AuthPermissions = {
  role: string;
  isAdmin: boolean;
  capabilities: string[];
};

export type MeResponse = {
  user: AuthUser | null;
  session: AuthSession | null;
  permissions: AuthPermissions | null;
};
