type Totals = {
  totalBoardFeet: string;
  foamTypeTotals: Array<{
    foamType: string;
    label: string;
    totalSetsUsed: string;
  }>;
};

export default function TotalsSection({ totals }: { totals: Totals }) {
  return (
    <div className="rounded-3xl border border-white/10 bg-[#141414] p-5 shadow-2xl">
      <div className="text-[12px] font-bold uppercase tracking-[0.24em] text-orange-400">
        Job Totals
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <div className="rounded-2xl border border-white/10 bg-black/20 px-4 py-4">
          <div className="text-[11px] font-bold uppercase tracking-[0.22em] text-white/45">
            Total Board Feet
          </div>
          <div className="mt-2 text-base font-semibold text-white">
            {totals.totalBoardFeet}
          </div>
        </div>

        {totals.foamTypeTotals.map((item) => (
          <div
            key={item.foamType}
            className="rounded-2xl border border-white/10 bg-black/20 px-4 py-4"
          >
            <div className="text-[11px] font-bold uppercase tracking-[0.22em] text-white/45">
              {item.label}
            </div>
            <div className="mt-2 text-base font-semibold text-white">
              {item.totalSetsUsed}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
