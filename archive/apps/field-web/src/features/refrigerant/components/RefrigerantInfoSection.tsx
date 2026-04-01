import {
  FieldInput,
  FieldLabel,
  FieldSelect,
  FieldTextarea,
} from "./RefrigerantLogFormFields";
import type { FormState } from "./RefrigerantLogFormFields";

type Props = {
  form: FormState;
  update: <K extends keyof FormState>(key: K, value: FormState[K]) => void;
};

export default function RefrigerantInfoSection({ form, update }: Props) {
  return (
    <div className="rounded-3xl border border-white/10 bg-[#1a1a1a] p-5 shadow-2xl">
      <div className="grid gap-4">
        <div className="grid gap-2">
          <FieldLabel>Refrigerant Type</FieldLabel>
          <FieldSelect
            value={form.refrigerantType}
            onChange={(e) => update("refrigerantType", e.target.value)}
          >
            <option value="R-410A">R-410A</option>
            <option value="R-22">R-22</option>
            <option value="R-32">R-32</option>
            <option value="R-454B">R-454B</option>
          </FieldSelect>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="grid gap-2">
            <FieldLabel>Pounds Added</FieldLabel>
            <FieldInput
              type="number"
              step="0.01"
              value={form.poundsAdded}
              onChange={(e) => update("poundsAdded", e.target.value)}
              placeholder="0.00"
            />
          </div>

          <div className="grid gap-2">
            <FieldLabel>Pounds Recovered</FieldLabel>
            <FieldInput
              type="number"
              step="0.01"
              value={form.poundsRecovered}
              onChange={(e) => update("poundsRecovered", e.target.value)}
              placeholder="0.00"
            />
          </div>
        </div>

        <label className="flex items-center gap-3 rounded-2xl border border-white/10 bg-black/20 px-4 py-4">
          <input
            type="checkbox"
            checked={form.leakSuspected}
            onChange={(e) => update("leakSuspected", e.target.checked)}
            className="h-5 w-5 rounded border-white/20 bg-black"
          />
          <span className="text-base font-medium text-white/85">Leak suspected</span>
        </label>

        <div className="grid gap-2">
          <FieldLabel>Notes</FieldLabel>
          <FieldTextarea
            value={form.notes}
            onChange={(e) => update("notes", e.target.value)}
            placeholder="Add details from the service call"
          />
        </div>
      </div>
    </div>
  );
}
