import { FieldInput, FieldLabel, FieldTextarea } from "./FieldControls";
import type { FormState } from "../../../features/spray-foam/api";

type Props = {
  form: FormState;
  updateField: <K extends keyof FormState>(key: K, value: FormState[K]) => void;
};

export default function JobHeaderSection({ form, updateField }: Props) {
  return (
    <div className="rounded-3xl border border-white/10 bg-[#1a1a1a] p-5 shadow-2xl">
      <div className="mb-4 text-[12px] font-bold uppercase tracking-[0.24em] text-orange-400">
        Job Header
      </div>

      <div className="grid gap-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="grid gap-2">
            <FieldLabel>Job Date</FieldLabel>
            <FieldInput
              type="date"
              value={form.jobDate}
              onChange={(e) => updateField("jobDate", e.target.value)}
            />
          </div>

          <div className="grid gap-2">
            <FieldLabel>Job Number</FieldLabel>
            <FieldInput
              value={form.jobNumber}
              onChange={(e) => updateField("jobNumber", e.target.value)}
              placeholder="WO-12345"
            />
          </div>
        </div>

        <div className="grid gap-2">
          <FieldLabel>Customer Name</FieldLabel>
          <FieldInput
            value={form.customerName}
            onChange={(e) => updateField("customerName", e.target.value)}
            placeholder="Customer or builder"
          />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="grid gap-2">
            <FieldLabel>Crew Lead</FieldLabel>
            <FieldInput
              value={form.crewLead}
              onChange={(e) => updateField("crewLead", e.target.value)}
              placeholder="Lead sprayer"
            />
          </div>

          <div className="grid gap-2">
            <FieldLabel>Rig Name</FieldLabel>
            <FieldInput
              value={form.rigName}
              onChange={(e) => updateField("rigName", e.target.value)}
              placeholder="Truck or rig"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="grid gap-2">
            <FieldLabel>Helpers</FieldLabel>
            <FieldInput
              value={form.helpersText}
              onChange={(e) => updateField("helpersText", e.target.value)}
              placeholder="Helper names"
            />
          </div>

          <div className="grid gap-2">
            <FieldLabel>Time On Job</FieldLabel>
            <FieldInput
              value={form.timeOnJob}
              onChange={(e) => updateField("timeOnJob", e.target.value)}
              placeholder="6.5 hours"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="grid gap-2">
            <FieldLabel>Ambient Temp (F)</FieldLabel>
            <FieldInput
              type="number"
              step="0.01"
              value={form.ambientTempF}
              onChange={(e) => updateField("ambientTempF", e.target.value)}
              placeholder="0.00"
            />
          </div>

          <div className="grid gap-2">
            <FieldLabel>Substrate Temp (F)</FieldLabel>
            <FieldInput
              type="number"
              step="0.01"
              value={form.substrateTempF}
              onChange={(e) => updateField("substrateTempF", e.target.value)}
              placeholder="0.00"
            />
          </div>

          <div className="grid gap-2">
            <FieldLabel>Humidity (%)</FieldLabel>
            <FieldInput
              type="number"
              step="0.01"
              value={form.humidityPercent}
              onChange={(e) => updateField("humidityPercent", e.target.value)}
              placeholder="0.00"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="grid gap-2">
            <FieldLabel>Downtime Minutes</FieldLabel>
            <FieldInput
              type="number"
              step="1"
              value={form.downtimeMinutes}
              onChange={(e) => updateField("downtimeMinutes", e.target.value)}
              placeholder="0"
            />
          </div>

          <div className="grid gap-2">
            <FieldLabel>Downtime Reason</FieldLabel>
            <FieldInput
              value={form.downtimeReason}
              onChange={(e) => updateField("downtimeReason", e.target.value)}
              placeholder="Weather, machine, access, etc."
            />
          </div>
        </div>

        <div className="grid gap-2">
          <FieldLabel>Other Notes</FieldLabel>
          <FieldTextarea
            value={form.otherNotes}
            onChange={(e) => updateField("otherNotes", e.target.value)}
            placeholder="Overall job notes"
          />
        </div>

        <label className="flex items-center gap-3 rounded-2xl border border-white/10 bg-black/20 px-4 py-4 text-sm font-semibold text-white">
          <input
            type="checkbox"
            checked={form.photosUploadedToHcp}
            onChange={(e) => updateField("photosUploadedToHcp", e.target.checked)}
          />
          Photos uploaded to Housecall Pro
        </label>
      </div>
    </div>
  );
}

