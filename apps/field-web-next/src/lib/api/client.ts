import { API_BASE } from "@/lib/config/env";
import { getStoredToken } from "@/lib/auth/auth-storage";

type RequestOptions = Omit<RequestInit, "headers"> & {
  headers?: HeadersInit;
  auth?: boolean;
};

export async function apiFetch(path: string, options: RequestOptions = {}) {
  const { auth = true, headers, ...rest } = options;

  const token = getStoredToken();
  const requestHeaders = new Headers(headers ?? {});

  if (!requestHeaders.has("Content-Type") && rest.body && !(rest.body instanceof FormData)) {
    requestHeaders.set("Content-Type", "application/json");
  }

  if (auth && token) {
    requestHeaders.set("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(`${API_BASE}${path}`, {
    ...rest,
    headers: requestHeaders,
  });

  return response;
}

export async function apiJson<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const response = await apiFetch(path, options);

  if (!response.ok) {
    const text = await response.text().catch(() => "");
    throw new Error(text || `Request failed with status ${response.status}`);
  }

  return response.json() as Promise<T>;
}
