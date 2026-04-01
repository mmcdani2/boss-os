import React from "react";

export type FormState = {
  companyKey: string;
  customerName: string;
  jobNumber: string;
  city: string;
  state: string;
  equipmentType: string;
  refrigerantType: string;
  poundsAdded: string;
  poundsRecovered: string;
  leakSuspected: boolean;
  notes: string;
};

export const initialState: FormState = {
  companyKey: "urban-mechanical",
  customerName: "",
  jobNumber: "",
  city: "",
  state: "TX",
  equipmentType: "",
  refrigerantType: "R-410A",
  poundsAdded: "",
  poundsRecovered: "",
  leakSuspected: false,
  notes: "",
};

export function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <label className="text-sm font-semibold uppercase tracking-[0.18em] text-white/75">
      {children}
    </label>
  );
}

export function FieldInput(
  props: React.InputHTMLAttributes<HTMLInputElement>
) {
  return (
    <input
      {...props}
      className="h-14 w-full rounded-2xl border border-white/10 bg-[#0d0d0d] px-4 text-base text-white outline-none transition placeholder:text-white/30 focus:border-orange-400/60"
    />
  );
}

export function FieldSelect(
  props: React.SelectHTMLAttributes<HTMLSelectElement>
) {
  return (
    <select
      {...props}
      className="h-14 w-full rounded-2xl border border-white/10 bg-[#0d0d0d] px-4 text-base text-white outline-none transition focus:border-orange-400/60"
    />
  );
}

export function FieldTextarea(
  props: React.TextareaHTMLAttributes<HTMLTextAreaElement>
) {
  return (
    <textarea
      {...props}
      className="min-h-30 w-full rounded-2xl border border-white/10 bg-[#0d0d0d] px-4 py-4 text-base text-white outline-none transition placeholder:text-white/30 focus:border-orange-400/60"
    />
  );
}
