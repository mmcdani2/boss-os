import { apiJson } from "@/lib/api/client";

export type Company = {
  id: string;
  name: string;
  createdAt?: string;
  updatedAt?: string;
};

export async function getCompany(): Promise<Company> {
  return apiJson<Company>("/api/company");
}

export async function updateCompanyName(name: string): Promise<Company> {
  return apiJson<Company>("/api/company", {
    method: "PATCH",
    body: JSON.stringify({ name })
  });
}
