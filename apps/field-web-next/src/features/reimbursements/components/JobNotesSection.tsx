import type { FormState } from "@/features/reimbursements/api";

type Props = {
  form: FormState;
  update: <K extends keyof FormState>(key: K, value: FormState[K]) => void;
};

export default function JobNotesSection({ form, update }: Props) {
  return (
    <div className="rounded-3xl border border-white/10 bg-[#141414] p-5 shadow-2xl">
      <div className="text-[12px] font-bold uppercase tracking-[0.24em] text-orange-400">
        Job + Notes
      </div>

      <div className="mt-4 grid gap-4">
        <label className="flex items-center gap-3 rounded-2xl border border-white/10 bg-black/20 px-4 py-4">
          <input
            type="checkbox"
            checked={form.tiedToJob}
            onChange={(e) => update("tiedToJob", e.target.checked)}
            className="h-4 w-4"
          />
          <span className="text-sm font-semibold text-white/80">Tied to a Job?</span>
        </label>

        {form.tiedToJob ? (
          <label className="grid gap-2">
            <span className="text-sm font-semibold text-white/80">Job Number</span>
            <input
              value={form.jobNumber}
              onChange={(e) => update("jobNumber", e.target.value)}
              placeholder="Enter job number"
              className="h-14 rounded-2xl border border-white/10 bg-[#0d0d0d] px-4 text-base text-white outline-none transition placeholder:text-white/30 focus:border-orange-400/60"
            />
          </label>
        ) : null}

        <label className="grid gap-2">
          <span className="text-sm font-semibold text-white/80">Additional Notes</span>
          <textarea
            value={form.notes}
            onChange={(e) => update("notes", e.target.value)}
            placeholder="Anything accounting or management should know."
            rows={4}
            className="rounded-2xl border border-white/10 bg-[#0d0d0d] px-4 py-3 text-base text-white outline-none transition placeholder:text-white/30 focus:border-orange-400/60"
          />
        </label>

        <label className="flex items-center gap-3 rounded-2xl border border-white/10 bg-black/20 px-4 py-4">
          <input
            type="checkbox"
            checked={form.receiptUploaded}
            onChange={(e) => update("receiptUploaded", e.target.checked)}
            className="h-4 w-4"
          />
          <span className="text-sm font-semibold text-white/80">Receipt Uploaded?</span>
        </label>

        <label className="flex items-center gap-3 rounded-2xl border border-white/10 bg-black/20 px-4 py-4">
          <input
            type="checkbox"
            checked={form.urgentReimbursementNeeded}
            onChange={(e) => update("urgentReimbursementNeeded", e.target.checked)}
            className="h-4 w-4"
          />
          <span className="text-sm font-semibold text-white/80">
            Urgent reimbursement needed?
          </span>
        </label>
      </div>
    </div>
  );
}
