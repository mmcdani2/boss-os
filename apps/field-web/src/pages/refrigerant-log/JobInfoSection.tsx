import { FieldInput, FieldLabel, FieldSelect } from "./RefrigerantLogFormFields";
import type { FormState } from "./RefrigerantLogFormFields";

type Props = {
  form: FormState;
  update: <K extends keyof FormState>(key: K, value: FormState[K]) => void;
};

export default function JobInfoSection({ form, update }: Props) {
  return (
    <div className="rounded-3xl border border-white/10 bg-[#1a1a1a] p-5 shadow-2xl">
      <div className="grid gap-4">
        <div className="grid gap-2">
          <FieldLabel>Company</FieldLabel>
          <FieldSelect
            value={form.companyKey}
            onChange={(e) => update("companyKey", e.target.value)}
          >
            <option value="urban-mechanical">Urban Mechanical</option>
            <option value="urban-spray-foam">Urban Spray Foam</option>
          </FieldSelect>
        </div>

        <div className="grid gap-2">
          <FieldLabel>Customer Name</FieldLabel>
          <FieldInput
            value={form.customerName}
            onChange={(e) => update("customerName", e.target.value)}
            placeholder="Customer or site name"
          />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="grid gap-2">
            <FieldLabel>Job Number</FieldLabel>
            <FieldInput
              value={form.jobNumber}
              onChange={(e) => update("jobNumber", e.target.value)}
              placeholder="WO-12345"
            />
          </div>

          <div className="grid gap-2">
            <FieldLabel>Equipment Type</FieldLabel>
            <FieldInput
              value={form.equipmentType}
              onChange={(e) => update("equipmentType", e.target.value)}
              placeholder="Split System"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="grid gap-2">
            <FieldLabel>City</FieldLabel>
            <FieldInput
              value={form.city}
              onChange={(e) => update("city", e.target.value)}
              placeholder="Texarkana"
            />
          </div>

          <div className="grid gap-2">
            <FieldLabel>State</FieldLabel>
            <FieldInput
              value={form.state}
              onChange={(e) => update("state", e.target.value.toUpperCase())}
              placeholder="TX"
              maxLength={2}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
