import { API_BASE, getStoredToken } from "./auth";

export type QuickEstimateCalculatorSettings = {
  laborRate: number;
  pricingTiers: number[];
};

export const DEFAULT_QUICK_ESTIMATE_CALCULATOR_SETTINGS: QuickEstimateCalculatorSettings = {
  laborRate: 40,
  pricingTiers: [0.35, 0.4, 0.5],
};

function normalizePricingTiers(value: unknown) {
  if (!Array.isArray(value)) {
    return DEFAULT_QUICK_ESTIMATE_CALCULATOR_SETTINGS.pricingTiers;
  }

  const cleaned = value
    .map((item) => Number(item))
    .filter((item) => Number.isFinite(item) && item > 0 && item < 1);

  const unique = Array.from(new Set(cleaned));

  return unique.length > 0
    ? unique.sort((a, b) => a - b)
    : DEFAULT_QUICK_ESTIMATE_CALCULATOR_SETTINGS.pricingTiers;
}

export function normalizeQuickEstimateCalculatorSettings(
  value: unknown
): QuickEstimateCalculatorSettings {
  const input = value && typeof value === "object" ? (value as Record<string, unknown>) : {};

  const laborRateValue = Number(input.laborRate);
  const laborRate =
    Number.isFinite(laborRateValue) && laborRateValue > 0
      ? laborRateValue
      : DEFAULT_QUICK_ESTIMATE_CALCULATOR_SETTINGS.laborRate;

  const pricingTiers = normalizePricingTiers(input.pricingTiers);

  return {
    laborRate,
    pricingTiers,
  };
}

export async function loadQuickEstimateCalculatorSettings() {
  const token = getStoredToken();

  if (!token) {
    return DEFAULT_QUICK_ESTIMATE_CALCULATOR_SETTINGS;
  }

  try {
    const res = await fetch(`${API_BASE}/api/field-config/quick-estimate-calculator`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      return DEFAULT_QUICK_ESTIMATE_CALCULATOR_SETTINGS;
    }

    const data = await res.json();

    return normalizeQuickEstimateCalculatorSettings(data?.settings ?? data);
  } catch {
    return DEFAULT_QUICK_ESTIMATE_CALCULATOR_SETTINGS;
  }
}
