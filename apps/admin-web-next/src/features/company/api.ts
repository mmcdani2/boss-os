import { apiJson } from "@/lib/api/client";

export type Company = {
  id: string;
  name: string;
  slug: string;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
};

type CompanyResponse = {
  company: Company;
};

export async function getCompany(): Promise<Company> {
  const data = await apiJson<CompanyResponse>("/api/company");
  return data.company;
}

export async function updateCompanyName(name: string): Promise<Company> {
  const data = await apiJson<CompanyResponse>("/api/company", {
    method: "PATCH",
    body: JSON.stringify({ name }),
  });

  return data.company;
}
