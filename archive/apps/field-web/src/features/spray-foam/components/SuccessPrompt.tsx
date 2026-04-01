export default function SuccessPrompt({
  open,
  onSubmitAnother,
  onReturnToModules,
}: {
  open: boolean;
  onSubmitAnother: () => void;
  onReturnToModules: () => void;
}) {
  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4">
      <div className="w-full max-w-md rounded-3xl border border-white/10 bg-[#141414] p-6 shadow-2xl">
        <div className="text-[12px] font-bold uppercase tracking-[0.24em] text-orange-400">
          Submission Complete
        </div>
        <h2 className="mt-3 text-2xl font-black tracking-tight text-white">
          Spray foam job log submitted
        </h2>
        <p className="mt-3 text-sm leading-6 text-white/70">
          What do you want to do next?
        </p>

        <div className="mt-6 grid gap-3">
          <button
            type="button"
            onClick={onSubmitAnother}
            className="h-14 rounded-2xl bg-[#fbbf24] px-5 text-base font-black text-black transition hover:brightness-105"
          >
            Submit Another Log
          </button>

          <button
            type="button"
            onClick={onReturnToModules}
            className="h-14 rounded-2xl border border-white/10 bg-white/5 px-5 text-base font-black text-white transition hover:bg-white/10"
          >
            Return to Spray Foam Modules
          </button>
        </div>
      </div>
    </div>
  );
}
