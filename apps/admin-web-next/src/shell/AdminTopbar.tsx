type AdminTopbarProps = {
  title?: string;
  onOpenMobileNav: () => void;
};

export default function AdminTopbar({
  title,
  onOpenMobileNav,
}: AdminTopbarProps) {
  return (
    <header className="sticky top-0 z-20 border-b border-white/10 bg-[#111111]/92 px-4 py-4 backdrop-blur lg:hidden">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onOpenMobileNav}
          aria-label="Open navigation"
          className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-white transition hover:bg-white/10"
        >
          <span className="flex flex-col gap-1.5">
            <span className="block h-0.5 w-4 rounded-full bg-current" />
            <span className="block h-0.5 w-4 rounded-full bg-current" />
            <span className="block h-0.5 w-4 rounded-full bg-current" />
          </span>
        </button>

        <div className="min-w-0">
          <div className="truncate text-base font-semibold tracking-tight text-white">
            {title || "Admin"}
          </div>
        </div>
      </div>
    </header>
  );
}
