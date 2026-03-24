type FieldTopbarProps = {
  kicker?: string;
  title?: string;
  subtitle?: string;
  onOpenMobileNav: () => void;
};

export default function FieldTopbar({
  kicker,
  title,
  subtitle,
  onOpenMobileNav,
}: FieldTopbarProps) {
  return (
    <header className="border-b border-white/10 bg-[#141414]/95 px-5 py-5 backdrop-blur sm:px-6">
      <div className="flex flex-col gap-4">
        <div className="min-w-0">
          <div className="mb-3 flex items-center gap-3 lg:hidden">
            <button
              type="button"
              onClick={onOpenMobileNav}
              aria-label="Open navigation"
              className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-white transition hover:bg-white/10"
            >
              <span className="flex flex-col gap-1.5">
                <span className="block h-0.5 w-5 rounded-full bg-current" />
                <span className="block h-0.5 w-5 rounded-full bg-current" />
                <span className="block h-0.5 w-5 rounded-full bg-current" />
              </span>
            </button>

            <div className="text-[11px] font-semibold uppercase tracking-[0.22em] text-orange-400/80">
              BossOS Field
            </div>
          </div>

          <div className="text-[11px] font-semibold uppercase tracking-[0.22em] text-orange-400/80">
            {kicker || "BossOS Field"}
          </div>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight text-white sm:text-3xl">
            {title || "Field"}
          </h1>
          {subtitle ? (
            <p className="mt-2 max-w-3xl text-sm leading-6 text-white/60 sm:text-[15px]">
              {subtitle}
            </p>
          ) : null}
        </div>
      </div>
    </header>
  );
}
