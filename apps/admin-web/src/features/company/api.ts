import { apiJson } from "../../shared/api/client";

export type Company = {
  id: string;
  name: string;
  slug: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

type CompanyResponse = {
  company: Company;
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

export async function getCompany(): Promise<Company> {
  const data = await authedJson<CompanyResponse>("/api/company");
  return data.company;
}

export async function updateCompanyName(name: string): Promise<Company> {
  const data = await authedJson<CompanyResponse>("/api/company", {
    method: "PATCH",
    body: JSON.stringify({ name }),
  });

  return data.company;
}
