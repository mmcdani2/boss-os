import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import FieldLayout from "../components/FieldLayout";
import {
  DEFAULT_QUICK_ESTIMATE_CALCULATOR_SETTINGS,
  loadQuickEstimateCalculatorSettings,
  type QuickEstimateCalculatorSettings,
} from "../lib/quickEstimateCalculator";

function parseMoneyInput(value: string) {
  const cleaned = value.replace(/[^0-9.]/g, "");
  if (!cleaned) return 0;
  const parsed = Number(cleaned);
  return Number.isFinite(parsed) ? parsed : 0;
}

function formatCurrency(value: number) {
  return value.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
  });
}

function formatMarginLabel(value: number) {
  return `${(value * 100).toFixed(0)}%`;
}

function getDefaultSelectedMargin(settings: QuickEstimateCalculatorSettings) {
  return settings.pricingTiers.includes(0.4)
    ? 0.4
    : settings.pricingTiers[0] ?? 0.4;
}

export default function QuickEstimateCalculatorPage() {
  const [settings, setSettings] = useState<QuickEstimateCalculatorSettings>(
    DEFAULT_QUICK_ESTIMATE_CALCULATOR_SETTINGS
  );
  const [materialCostInput, setMaterialCostInput] = useState("");
  const [laborHoursInput, setLaborHoursInput] = useState("");
  const [tripChargeInput, setTripChargeInput] = useState("");
  const [selectedMargin, setSelectedMargin] = useState(
    getDefaultSelectedMargin(DEFAULT_QUICK_ESTIMATE_CALCULATOR_SETTINGS)
  );

  useEffect(() => {
    let cancelled = false;

    async function hydrateSettings() {
      const nextSettings = await loadQuickEstimateCalculatorSettings();

      if (cancelled) return;

      setSettings(nextSettings);

      setSelectedMargin((current) => {
        if (nextSettings.pricingTiers.includes(current)) {
          return current;
        }

        return getDefaultSelectedMargin(nextSettings);
      });
    }

    void hydrateSettings();

    return () => {
      cancelled = true;
    };
  }, []);

  const materialCost = parseMoneyInput(materialCostInput);
  const laborHours = parseMoneyInput(laborHoursInput);
  const tripCharge = parseMoneyInput(tripChargeInput);

  const laborCost = useMemo(
    () => laborHours * settings.laborRate,
    [laborHours, settings.laborRate]
  );

  const totalCost = useMemo(
    () => materialCost + laborCost + tripCharge,
    [materialCost, laborCost, tripCharge]
  );

  const suggestedQuote = useMemo(() => {
    const denominator = 1 - selectedMargin;
    if (denominator <= 0) return 0;
    return totalCost / denominator;
  }, [selectedMargin, totalCost]);

  function resetCalculator() {
    setMaterialCostInput("");
    setLaborHoursInput("");
    setTripChargeInput("");
    setSelectedMargin(getDefaultSelectedMargin(settings));
  }

  return (
    <FieldLayout
      kicker="BossOS Field"
      title="Quick Estimate Calculator"
      subtitle="Fast HVAC field pricing for rough estimates. Material, labor, trip, margin, done."
    >
      <div className="grid gap-6">
        <div>
          <Link
            to="/division/hvac"
            className="inline-flex rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-white/80 transition hover:bg-white/10 hover:text-white"
          >
            Back to HVAC Modules
          </Link>
        </div>

        <div className="rounded-3xl border border-white/10 bg-[#141414] p-5 shadow-2xl">
          <div className="text-[12px] font-bold uppercase tracking-[0.24em] text-orange-400">
            Pricing Inputs
          </div>
          <h2 className="mt-3 text-2xl font-black tracking-tight text-white">
            Build the estimate
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-white/65 sm:text-base">
            Labor rate is currently {formatCurrency(settings.laborRate)} per hour.
          </p>

          <div className="mt-5 grid gap-4">
            <label className="grid gap-2">
              <span className="text-sm font-semibold text-white/80">Material Cost</span>
              <input
                inputMode="decimal"
                value={materialCostInput}
                onChange={(e) => setMaterialCostInput(e.target.value)}
                placeholder="0.00"
                className="rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-base text-white outline-none transition placeholder:text-white/30 focus:border-orange-400/50"
              />
            </label>

            <label className="grid gap-2">
              <span className="text-sm font-semibold text-white/80">Labor Hours</span>
              <input
                inputMode="decimal"
                value={laborHoursInput}
                onChange={(e) => setLaborHoursInput(e.target.value)}
                placeholder="0.0"
                className="rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-base text-white outline-none transition placeholder:text-white/30 focus:border-orange-400/50"
              />
            </label>

            <label className="grid gap-2">
              <span className="text-sm font-semibold text-white/80">Trip Charge</span>
              <input
                inputMode="decimal"
                value={tripChargeInput}
                onChange={(e) => setTripChargeInput(e.target.value)}
                placeholder="0.00"
                className="rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-base text-white outline-none transition placeholder:text-white/30 focus:border-orange-400/50"
              />
            </label>
          </div>
        </div>

        <div className="rounded-3xl border border-white/10 bg-[#141414] p-5 shadow-2xl">
          <div className="text-[12px] font-bold uppercase tracking-[0.24em] text-orange-400">
            Pricing Tier
          </div>
          <h2 className="mt-3 text-2xl font-black tracking-tight text-white">
            Choose margin
          </h2>

          <div className="mt-5 grid grid-cols-3 gap-3">
            {settings.pricingTiers.map((tier) => {
              const active = selectedMargin === tier;

              return (
                <button
                  key={tier}
                  type="button"
                  onClick={() => setSelectedMargin(tier)}
                  className={[
                    "rounded-2xl border px-4 py-4 text-center text-base font-black tracking-tight transition",
                    active
                      ? "border-orange-400/60 bg-orange-400/10 text-orange-200"
                      : "border-white/10 bg-[#1a1a1a] text-white hover:border-white/20 hover:bg-white/[0.07]",
                  ].join(" ")}
                >
                  {formatMarginLabel(tier)}
                </button>
              );
            })}
          </div>
        </div>

        <div className="rounded-3xl border border-white/10 bg-[#141414] p-5 shadow-2xl">
          <div className="text-[12px] font-bold uppercase tracking-[0.24em] text-orange-400">
            Results
          </div>
          <h2 className="mt-3 text-2xl font-black tracking-tight text-white">
            Suggested pricing
          </h2>

          <div className="mt-5 grid gap-3">
            <div className="rounded-2xl border border-white/10 bg-[#1a1a1a] px-4 py-4">
              <div className="text-xs font-bold uppercase tracking-[0.18em] text-white/45">
                Labor Cost
              </div>
              <div className="mt-2 text-2xl font-black tracking-tight text-white">
                {formatCurrency(laborCost)}
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-[#1a1a1a] px-4 py-4">
              <div className="text-xs font-bold uppercase tracking-[0.18em] text-white/45">
                Total Cost
              </div>
              <div className="mt-2 text-2xl font-black tracking-tight text-white">
                {formatCurrency(totalCost)}
              </div>
            </div>

            <div className="rounded-2xl border border-orange-400/30 bg-orange-400/10 px-4 py-4">
              <div className="text-xs font-bold uppercase tracking-[0.18em] text-orange-200/80">
                Suggested Quote
              </div>
              <div className="mt-2 text-3xl font-black tracking-tight text-white">
                {formatCurrency(suggestedQuote)}
              </div>
            </div>
          </div>

          <div className="mt-5 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={resetCalculator}
              className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-white/80 transition hover:bg-white/10 hover:text-white"
            >
              Reset
            </button>

            <div className="rounded-full border border-white/10 bg-black/20 px-4 py-2 text-sm font-semibold text-white/55">
              Margin: {formatMarginLabel(selectedMargin)} • Labor Rate: {formatCurrency(settings.laborRate)}/hr
            </div>
          </div>
        </div>
      </div>
    </FieldLayout>
  );
}
