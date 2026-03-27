import { apiJson } from "@/lib/api/client";

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

type UsersListResponse = {
  users?: AdminUser[];
};

type UserResponse = {
  user: AdminUser;
};

async function authedJson<T>(path: string, init?: RequestInit): Promise<T> {
  try {
    return await apiJson<T>(path, init);
  } catch (error) {
    const message =
      error instanceof Error && error.message.trim().length > 0
        ? error.message
        : "Request failed.";

    throw new Error(message);
  }
}

export async function listUsers() {
  const data = await authedJson<UsersListResponse>("/api/users");
  return (data.users ?? []) as AdminUser[];
}

export async function createUser(input: CreateUserInput) {
  const data = await authedJson<UserResponse>("/api/users", {
    method: "POST",
    body: JSON.stringify(input),
  });

  return data.user as AdminUser;
}

export async function updateUserStatus(id: string, isActive: boolean) {
  const data = await authedJson<UserResponse>(`/api/users/${id}/status`, {
    method: "PATCH",
    body: JSON.stringify({ isActive }),
  });

  return data.user as AdminUser;
}

export async function resetUserPassword(id: string, password: string) {
  const data = await authedJson<UserResponse>(`/api/users/${id}/password`, {
    method: "PATCH",
    body: JSON.stringify({ password }),
  });

  return data.user as AdminUser;
}
