import {
  deriveActualYield,
  deriveBoardFeet,
  deriveTheoreticalTotalYield,
  deriveYieldPercent,
  type AreaLine,
  type MaterialLine,
} from "../../lib/spray-foam-job-log-form";
import { FieldInput, FieldLabel, FieldSelect } from "./FieldControls";

type Props = {
  index: number;
  line: AreaLine;
  material: MaterialLine;
  lineCount: number;
  updateAreaLine: (index: number, key: keyof AreaLine, value: string) => void;
  updateMaterialLine: (index: number, key: keyof MaterialLine, value: string) => void;
  removeAreaLine: (index: number) => void;
};

export default function AreaMaterialLineCard({
  index,
  line,
  material,
  lineCount,
  updateAreaLine,
  updateMaterialLine,
  removeAreaLine,
}: Props) {
  const boardFeet = deriveBoardFeet(line.squareFeet, line.averageThicknessIn);
  const theoreticalTotalYield = deriveTheoreticalTotalYield(
    material.setsUsed,
    material.theoreticalYieldPerSet
  );
  const actualYield = deriveActualYield(boardFeet, material.setsUsed);
  const yieldPercent = deriveYieldPercent(boardFeet, theoreticalTotalYield);

  return (
    <div className="rounded-3xl border border-white/10 bg-[#1a1a1a] p-5 shadow-2xl">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <div className="text-[12px] font-bold uppercase tracking-[0.24em] text-orange-400">
            Area + Material Pair
          </div>
          <div className="mt-2 text-xl font-black tracking-tight text-white">
            Line {index + 1}
          </div>
        </div>

        {lineCount > 1 ? (
          <button
            type="button"
            onClick={() => removeAreaLine(index)}
            className="rounded-full border border-red-500/20 bg-red-500/10 px-4 py-2 text-sm font-semibold text-red-200 transition hover:bg-red-500/20"
          >
            Remove
          </button>
        ) : null}
      </div>

      <div className="grid gap-5">
        <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
          <div className="mb-4 text-[11px] font-bold uppercase tracking-[0.22em] text-white/45">
            Area Output
          </div>

          <div className="grid gap-4">
            <div className="grid gap-2">
              <FieldLabel>Area Name</FieldLabel>
              <FieldInput
                value={line.areaName}
                onChange={(e) => updateAreaLine(index, "areaName", e.target.value)}
                placeholder="Attic, walls, crawlspace, etc."
              />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="grid gap-2">
                <FieldLabel>Application Type</FieldLabel>
                <FieldSelect
                  value={line.applicationType}
                  onChange={(e) => updateAreaLine(index, "applicationType", e.target.value)}
                >
                  <option value="">Select application type</option>
                  <option value="attic">Attic</option>
                  <option value="walls">Walls</option>
                  <option value="crawlspace">Crawlspace</option>
                  <option value="metal-building">Metal Building</option>
                  <option value="roof-deck">Roof Deck</option>
                  <option value="other">Other</option>
                </FieldSelect>
              </div>

              <div className="grid gap-2">
                <FieldLabel>Foam Type</FieldLabel>
                <FieldSelect
                  value={line.foamType}
                  onChange={(e) => updateAreaLine(index, "foamType", e.target.value)}
                >
                  <option value="">Select foam type</option>
                  <option value="open-cell">Open Cell</option>
                  <option value="closed-cell">Closed Cell</option>
                </FieldSelect>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="grid gap-2">
                <FieldLabel>Square Feet</FieldLabel>
                <FieldInput
                  type="number"
                  step="0.01"
                  value={line.squareFeet}
                  onChange={(e) => updateAreaLine(index, "squareFeet", e.target.value)}
                  placeholder="0.00"
                />
              </div>

              <div className="grid gap-2">
                <FieldLabel>Average Thickness (Inches)</FieldLabel>
                <FieldInput
                  type="number"
                  step="0.01"
                  value={line.averageThicknessIn}
                  onChange={(e) => updateAreaLine(index, "averageThicknessIn", e.target.value)}
                  placeholder="0.00"
                />
              </div>

              <div className="grid gap-2">
                <FieldLabel>Board Feet</FieldLabel>
                <FieldInput value={boardFeet} readOnly placeholder="0.00" />
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
          <div className="mb-4 text-[11px] font-bold uppercase tracking-[0.22em] text-white/45">
            Material Usage
          </div>

          <div className="grid gap-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="grid gap-2">
                <FieldLabel>Foam Type</FieldLabel>
                <FieldInput value={line.foamType || ""} readOnly placeholder="Auto from area line" />
              </div>

              <div className="grid gap-2">
                <FieldLabel>Board Feet Sprayed</FieldLabel>
                <FieldInput value={boardFeet} readOnly placeholder="Auto from area line" />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="grid gap-2">
                <FieldLabel>Manufacturer</FieldLabel>
                <FieldInput
                  value={material.manufacturer}
                  onChange={(e) => updateMaterialLine(index, "manufacturer", e.target.value)}
                  placeholder="Manufacturer"
                />
              </div>

              <div className="grid gap-2">
                <FieldLabel>Lot Number</FieldLabel>
                <FieldInput
                  value={material.lotNumber}
                  onChange={(e) => updateMaterialLine(index, "lotNumber", e.target.value)}
                  placeholder="Lot number"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="grid gap-2">
                <FieldLabel>Sets Used</FieldLabel>
                <FieldInput
                  type="number"
                  step="0.01"
                  value={material.setsUsed}
                  onChange={(e) => updateMaterialLine(index, "setsUsed", e.target.value)}
                  placeholder="0.00"
                />
              </div>

              <div className="grid gap-2">
                <FieldLabel>Theoretical Yield Per Set</FieldLabel>
                <FieldInput
                  type="number"
                  step="0.01"
                  value={material.theoreticalYieldPerSet}
                  onChange={(e) =>
                    updateMaterialLine(index, "theoreticalYieldPerSet", e.target.value)
                  }
                  placeholder="0.00"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="grid gap-2">
                <FieldLabel>Theoretical Total Yield</FieldLabel>
                <FieldInput value={theoreticalTotalYield} readOnly placeholder="0.00" />
              </div>

              <div className="grid gap-2">
                <FieldLabel>Actual Yield</FieldLabel>
                <FieldInput value={actualYield} readOnly placeholder="0.00" />
              </div>

              <div className="grid gap-2">
                <FieldLabel>Yield Percent</FieldLabel>
                <FieldInput
                  value={yieldPercent ? `${yieldPercent}%` : ""}
                  readOnly
                  placeholder="0.00%"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
