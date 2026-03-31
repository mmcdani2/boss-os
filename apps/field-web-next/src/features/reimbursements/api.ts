export const CATEGORIES = [
  { value: "materials", label: "Materials" },
  { value: "parts", label: "Parts" },
  { value: "fuel", label: "Fuel" },
  { value: "tools", label: "Tools" },
  { value: "meals", label: "Meals" },
  { value: "lodging", label: "Lodging" },
  { value: "misc", label: "Misc" },
];

export const PAYMENT_METHODS = [
  { value: "personal-card", label: "Personal Card" },
  { value: "personal-cash", label: "Personal Cash" },
  { value: "other-personal-funds", label: "Other Personal Funds" },
];

export type FormState = {
  amountSpent: string;
  purchaseDate: string;
  vendor: string;
  category: string;
  paymentMethod: string;
  purpose: string;
  tiedToJob: boolean;
  jobNumber: string;
  notes: string;
  receiptUploaded: boolean;
  urgentReimbursementNeeded: boolean;
};

export function todayValue() {
  return new Date().toISOString().slice(0, 10);
}

export function createInitialState(): FormState {
  return {
    amountSpent: "",
    purchaseDate: todayValue(),
    vendor: "",
    category: "",
    paymentMethod: "",
    purpose: "",
    tiedToJob: false,
    jobNumber: "",
    notes: "",
    receiptUploaded: false,
    urgentReimbursementNeeded: false,
  };
}

export function cleanString(value: string) {
  const trimmed = value.trim();
  return trimmed.length ? trimmed : null;
}
