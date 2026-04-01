"use client";

import { useEffect, useMemo, useState } from "react";
import { apiJson } from "@/lib/api/client";

type InventoryItem = {
  id: string;
  name: string;
  sku: string;
  category: string;
  unitOfMeasure: string;
  quantityOnHand: number;
  reorderThreshold: number;
  storageLocation: string;
  notes: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

type InventoryResponse = {
  items: InventoryItem[];
  stats: {
    totalItems: number;
    lowStockCount: number;
    categoryCount: number;
  };
};

function SectionKicker({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-orange-400/80">
      {children}
    </p>
  );
}

function Card({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section
      className={[
        "rounded-[28px] border border-white/10 bg-[#141414] shadow-[0_20px_60px_rgba(0,0,0,0.28)]",
        className,
      ].join(" ")}
    >
      {children}
    </section>
  );
}

function StatTile({
  label,
  value = "—",
}: {
  label: string;
  value?: string | number;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-black/25 px-4 py-3.5">
      <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/35">
        {label}
      </div>
      <div className="mt-2 text-[2rem] font-black leading-none text-white">{value}</div>
    </div>
  );
}

function PlaceholderControl({ label }: { label: string }) {
  return (
    <div className="flex h-11 items-center rounded-2xl border border-white/10 bg-black/30 px-4 text-[15px] text-white/35">
      {label}
    </div>
  );
}

function InventoryRow({ item }: { item: InventoryItem }) {
  const lowStock = item.quantityOnHand <= item.reorderThreshold;

  return (
    <div className="grid gap-4 border-t border-white/10 px-5 py-4 first:border-t-0 lg:grid-cols-[minmax(0,1.4fr)_160px_140px_140px] lg:items-center lg:gap-5">
      <div className="min-w-0">
        <div className="truncate text-[15px] font-semibold text-white">{item.name}</div>
        <div className="mt-1 truncate text-sm text-white/50">{item.sku}</div>
      </div>

      <div className="text-sm text-white/75 lg:text-center">
        <div className="mb-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-white/35 lg:hidden">
          Category
        </div>
        <span className="inline-flex rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-white/75">
          {item.category}
        </span>
      </div>

      <div className="lg:text-center">
        <div className="mb-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-white/35 lg:hidden">
          On Hand
        </div>
        <span
          className={[
            "inline-flex rounded-full px-3 py-1.5 text-xs font-semibold uppercase tracking-wide",
            lowStock
              ? "bg-amber-500/15 text-amber-300"
              : "bg-white/10 text-white/75",
          ].join(" ")}
        >
          {item.quantityOnHand} {item.unitOfMeasure}
        </span>
      </div>

      <div className="text-sm text-white/75 lg:text-center">
        <div className="mb-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-white/35 lg:hidden">
          Location
        </div>
        <span className="truncate">{item.storageLocation}</span>
      </div>
    </div>
  );
}

export default function InventoryPage() {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [stats, setStats] = useState({
    totalItems: 0,
    lowStockCount: 0,
    categoryCount: 0,
  });

  const lowStockItems = useMemo(
    () => items.filter((item) => item.quantityOnHand <= item.reorderThreshold).length,
    [items]
  );

  async function loadInventory() {
    try {
      setLoading(true);
      setError("");

      const data = await apiJson<InventoryResponse>("/api/inventory");
      setItems(data.items);
      setStats(data.stats);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load inventory.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadInventory();
  }, []);

  return (
    <div className="flex h-full min-h-0 w-full flex-col gap-6">
      <div className="flex min-h-0 w-full flex-1 flex-col gap-6">
        <div className="shrink-0 rounded-[28px] border border-white/10 bg-[linear-gradient(180deg,rgba(249,115,22,0.08),rgba(255,255,255,0.02))] px-7 py-6 shadow-[0_20px_60px_rgba(0,0,0,0.25)]">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-3xl">
              <SectionKicker>Inventory</SectionKicker>
              <h1 className="mt-3 text-3xl font-black tracking-tight text-white sm:text-[2.2rem]">
                Inventory
              </h1>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-white/60 sm:text-[15px]">
                Track what you have, where it is stored, and what needs attention.
              </p>
            </div>

            <button
              type="button"
              disabled
              className="inline-flex h-11 items-center justify-center rounded-2xl border border-white/10 bg-white/5 px-4 text-sm font-medium text-white/45"
            >
              New Item
            </button>
          </div>
        </div>

        {error ? (
          <div className="shrink-0 rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm font-medium text-red-200">
            {error}
          </div>
        ) : null}

        <div className="grid min-h-0 flex-1 gap-4 lg:grid-cols-[minmax(320px,0.9fr)_minmax(0,1.6fr)]">
          <Card className="flex min-h-0 flex-col overflow-hidden">
            <div className="shrink-0 border-b border-white/10 px-6 py-5">
              <SectionKicker>Snapshot</SectionKicker>
              <h2 className="mt-2 text-2xl font-bold text-white">Overview</h2>
              <p className="mt-2 text-sm leading-6 text-white/60">
                High-level inventory status for this module.
              </p>
            </div>

            <div className="grid gap-3 px-6 py-5">
              <StatTile label="Total Items" value={stats.totalItems} />
              <StatTile label="Low Stock" value={stats.lowStockCount} />
              <StatTile label="Categories" value={stats.categoryCount} />
            </div>
          </Card>

          <Card className="flex min-h-0 flex-col overflow-hidden">
            <div className="shrink-0 border-b border-white/10 px-6 py-5">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                <div className="lg:text-left">
                  <SectionKicker>Inventory List</SectionKicker>
                  <h2 className="mt-2 text-2xl font-bold text-white">Current Items</h2>
                  <p className="mt-2 text-sm leading-6 text-white/60">
                    Search, filter, and review stock records from one place.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => void loadInventory()}
                  className="inline-flex h-10 items-center justify-center rounded-2xl border border-white/10 bg-white/4 px-4 text-sm font-medium text-white/90 transition hover:bg-white/8"
                >
                  Refresh
                </button>
              </div>

              <div className="mt-5 grid gap-3 lg:grid-cols-[minmax(0,1fr)_200px_160px]">
                <PlaceholderControl label="Search by name or SKU" />
                <PlaceholderControl label="Filter by category" />
                <PlaceholderControl label="Sort" />
              </div>
            </div>

            {loading ? (
              <div className="px-6 py-6">
                <div className="rounded-2xl border border-white/10 bg-black/20 px-4 py-4 text-sm text-white/70">
                  Loading inventory...
                </div>
              </div>
            ) : items.length === 0 ? (
              <div className="px-6 py-10 text-center text-white/50">
                No inventory items found.
              </div>
            ) : (
              <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
                <div className="hidden shrink-0 grid-cols-[minmax(0,1.4fr)_160px_140px_140px] gap-5 px-5 py-3.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/35 lg:grid">
                  <div className="lg:text-center">Item</div>
                  <div className="text-center">Category</div>
                  <div className="text-center">On Hand</div>
                  <div className="text-center">Location</div>
                </div>

                <div className="min-h-0 flex-1 overflow-y-auto">
                  {items.map((item) => (
                    <InventoryRow key={item.id} item={item} />
                  ))}
                </div>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
