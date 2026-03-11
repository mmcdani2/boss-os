import { Link } from "react-router-dom";
import FieldLayout from "../components/FieldLayout";

function ModuleCard({
  to,
  eyebrow,
  title,
  description,
}: {
  to: string;
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <Link
      to={to}
      className="block rounded-[24px] border border-white/10 bg-[#1a1a1a] p-5 shadow-2xl transition hover:border-white/20 hover:bg-white/[0.07]"
    >
      <div className="text-[12px] font-bold uppercase tracking-[0.24em] text-orange-400">
        {eyebrow}
      </div>
      <h2 className="mt-3 text-2xl font-black tracking-tight text-white">
        {title}
      </h2>
      <p className="mt-2 text-sm leading-relaxed text-white/65 sm:text-base">
        {description}
      </p>
    </Link>
  );
}

export default function HomePage() {
  return (
    <FieldLayout
      kicker="Urban Field"
      title="Modules"
      subtitle="Choose a tool and get in, get it done, and move on."
    >
      <div className="grid gap-4">
        <ModuleCard
          to="/refrigerant-log"
          eyebrow="HVAC"
          title="Refrigerant Log"
          description="Submit refrigerant usage, recovery, leak notes, and service call details."
        />

        <ModuleCard
          to="/my-logs"
          eyebrow="History"
          title="My Logs"
          description="Review your recent refrigerant submissions from the field."
        />

        <div className="rounded-[24px] border border-white/10 bg-[#1a1a1a] p-5 shadow-2xl">
          <div className="text-[12px] font-bold uppercase tracking-[0.24em] text-orange-400">
            Coming Soon
          </div>
          <h2 className="mt-3 text-2xl font-black tracking-tight text-white">
            More Modules
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-white/65 sm:text-base">
            Spray foam logs, checklists, calculators, drafts, and offline queue tools will live here next.
          </p>
        </div>
      </div>
    </FieldLayout>
  );
}