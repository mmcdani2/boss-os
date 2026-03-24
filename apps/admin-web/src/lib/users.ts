import { API_BASE, getStoredToken } from "./auth";

export type AdminUser = {
  id: string;
  email: string;
  fullName: string;
  role: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

export type CreateUserInput = {
  fullName: string;
  email: string;
  password: string;
  role: "admin" | "tech";
};

async function authedFetch(path: string, init?: RequestInit) {
  const token = getStoredToken();

  const res = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...(init?.headers ?? {}),
    },
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    const message =
      typeof data?.error === "string" ? data.error : "Request failed.";
    throw new Error(message);
  }

  return data;
}

export async function listUsers() {
  const data = await authedFetch("/api/users");
  return (data.users ?? []) as AdminUser[];
}

export async function createUser(input: CreateUserInput) {
  const data = await authedFetch("/api/users", {
    method: "POST",
    body: JSON.stringify(input),
  });

  return data.user as AdminUser;
}

export async function updateUserStatus(id: string, isActive: boolean) {
  const data = await authedFetch(`/api/users/${id}/status`, {
    method: "PATCH",
    body: JSON.stringify({ isActive }),
  });

  return data.user as AdminUser;
}

export async function resetUserPassword(id: string, password: string) {
  const data = await authedFetch(`/api/users/${id}/password`, {
    method: "PATCH",
    body: JSON.stringify({ password }),
  });

  return data.user as AdminUser;
}
