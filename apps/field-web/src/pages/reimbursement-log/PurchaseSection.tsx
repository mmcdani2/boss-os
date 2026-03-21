import type { FormState } from "../../lib/reimbursement-form";

type Props = {
  form: FormState;
  update: <K extends keyof FormState>(key: K, value: FormState[K]) => void;
};

export default function PurchaseSection({ form, update }: Props) {
  return (
    <div className="rounded-3xl border border-white/10 bg-[#141414] p-5 shadow-2xl">
      <div className="text-[12px] font-bold uppercase tracking-[0.24em] text-orange-400">
        Purchase
      </div>

      <div className="mt-4 grid gap-4">
        <label className="grid gap-2">
          <span className="text-sm font-semibold text-white/80">Amount Spent</span>
          <input
            inputMode="decimal"
            value={form.amountSpent}
            onChange={(e) => update("amountSpent", e.target.value)}
            placeholder="0.00"
            className="h-14 rounded-2xl border border-white/10 bg-[#0d0d0d] px-4 text-base text-white outline-none transition placeholder:text-white/30 focus:border-orange-400/60"
          />
        </label>

        <label className="grid gap-2">
          <span className="text-sm font-semibold text-white/80">Purchase Date</span>
          <input
            type="date"
            value={form.purchaseDate}
            onChange={(e) => update("purchaseDate", e.target.value)}
            className="h-14 rounded-2xl border border-white/10 bg-[#0d0d0d] px-4 text-base text-white outline-none transition focus:border-orange-400/60"
          />
        </label>

        <label className="grid gap-2">
          <span className="text-sm font-semibold text-white/80">Vendor / Store</span>
          <input
            value={form.vendor}
            onChange={(e) => update("vendor", e.target.value)}
            placeholder="Home Depot, gas station, supply house..."
            className="h-14 rounded-2xl border border-white/10 bg-[#0d0d0d] px-4 text-base text-white outline-none transition placeholder:text-white/30 focus:border-orange-400/60"
          />
        </label>
      </div>
    </div>
  );
}
