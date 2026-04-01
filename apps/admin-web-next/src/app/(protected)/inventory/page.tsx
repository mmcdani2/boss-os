"use client";

import { useEffect, useMemo, useState } from "react";
import { apiFetch, apiJson } from "@/lib/api/client";

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

type SortOption = "name-asc" | "name-desc" | "qty-asc" | "qty-desc";

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

function SearchInput({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder="Search by name or SKU"
      className="h-11 rounded-2xl border border-white/10 bg-black/30 px-4 text-[15px] text-white outline-none transition placeholder:text-white/35 focus:border-orange-400/60 focus:bg-black/40"
    />
  );
}

function CategorySelect({
  value,
  onChange,
  options,
}: {
  value: string;
  onChange: (value: string) => void;
  options: string[];
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="h-11 rounded-2xl border border-white/10 bg-black/30 px-4 text-[15px] text-white outline-none transition focus:border-orange-400/60 focus:bg-black/40"
    >
      <option value="">All categories</option>
      {options.map((option) => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </select>
  );
}

function SortSelect({
  value,
  onChange,
}: {
  value: SortOption;
  onChange: (value: SortOption) => void;
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value as SortOption)}
      className="h-11 rounded-2xl border border-white/10 bg-black/30 px-4 text-[15px] text-white outline-none transition focus:border-orange-400/60 focus:bg-black/40"
    >
      <option value="name-asc">Name A-Z</option>
      <option value="name-desc">Name Z-A</option>
      <option value="qty-asc">Qty Low-High</option>
      <option value="qty-desc">Qty High-Low</option>
    </select>
  );
}

function LowStockToggle({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={[
        "inline-flex h-11 items-center justify-center rounded-2xl border px-4 text-sm font-medium transition",
        checked
          ? "border-amber-500/30 bg-amber-500/10 text-amber-300"
          : "border-white/10 bg-black/30 text-white/65 hover:bg-black/40",
      ].join(" ")}
    >
      Low Stock Only
    </button>
  );
}

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <label className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/55">
      {children}
    </label>
  );
}

function TextInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={[
        "h-11 rounded-2xl border border-white/10 bg-black/30 px-4 text-[15px] text-white outline-none transition",
        "placeholder:text-white/25 focus:border-orange-400/60 focus:bg-black/40",
        props.className ?? "",
      ].join(" ")}
    />
  );
}

function TextArea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      {...props}
      className={[
        "min-h-[110px] rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-[15px] text-white outline-none transition",
        "placeholder:text-white/25 focus:border-orange-400/60 focus:bg-black/40",
        props.className ?? "",
      ].join(" ")}
    />
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
  const [success, setSuccess] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [lowStockOnly, setLowStockOnly] = useState(false);
  const [sortBy, setSortBy] = useState<SortOption>("name-asc");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [name, setName] = useState("");
  const [sku, setSku] = useState("");
  const [category, setCategory] = useState("");
  const [unitOfMeasure, setUnitOfMeasure] = useState("");
  const [quantityOnHand, setQuantityOnHand] = useState("0");
  const [reorderThreshold, setReorderThreshold] = useState("0");
  const [storageLocation, setStorageLocation] = useState("");
  const [notes, setNotes] = useState("");

  const [stats, setStats] = useState({
    totalItems: 0,
    lowStockCount: 0,
    categoryCount: 0,
  });

  const categoryOptions = useMemo(() => {
    return Array.from(new Set(items.map((item) => item.category))).sort((a, b) =>
      a.localeCompare(b)
    );
  }, [items]);

  const filteredItems = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();

    const filtered = items.filter((item) => {
      const matchesSearch =
        !term ||
        item.name.toLowerCase().includes(term) ||
        item.sku.toLowerCase().includes(term);

      const matchesCategory =
        !selectedCategory || item.category === selectedCategory;

      const matchesLowStock =
        !lowStockOnly || item.quantityOnHand <= item.reorderThreshold;

      return matchesSearch && matchesCategory && matchesLowStock;
    });

    return [...filtered].sort((a, b) => {
      switch (sortBy) {
        case "name-desc":
          return b.name.localeCompare(a.name);
        case "qty-asc":
          return a.quantityOnHand - b.quantityOnHand;
        case "qty-desc":
          return b.quantityOnHand - a.quantityOnHand;
        case "name-asc":
        default:
          return a.name.localeCompare(b.name);
      }
    });
  }, [items, searchTerm, selectedCategory, lowStockOnly, sortBy]);

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

  function resetCreateForm() {
    setName("");
    setSku("");
    setCategory("");
    setUnitOfMeasure("");
    setQuantityOnHand("0");
    setReorderThreshold("0");
    setStorageLocation("");
    setNotes("");
  }

  function openCreateModal() {
    setError("");
    setSuccess("");
    resetCreateForm();
    setShowCreateModal(true);
  }

  function closeCreateModal() {
    if (submitting) return;
    setShowCreateModal(false);
    resetCreateForm();
  }

  async function handleCreateItem(e: React.FormEvent) {
    e.preventDefault();

    try {
      setSubmitting(true);
      setError("");
      setSuccess("");

      const response = await apiFetch("/api/inventory", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          sku,
          category,
          unitOfMeasure,
          quantityOnHand: Number(quantityOnHand),
          reorderThreshold: Number(reorderThreshold),
          storageLocation,
          notes,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data?.error || "Failed to create inventory item.");
        return;
      }

      setSuccess("Inventory item created successfully.");
      setShowCreateModal(false);
      resetCreateForm();
      await loadInventory();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create inventory item.");
    } finally {
      setSubmitting(false);
    }
  }

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
              onClick={openCreateModal}
              className="inline-flex h-11 items-center justify-center rounded-2xl border border-white/10 bg-white/5 px-4 text-sm font-medium text-white transition hover:bg-white/10"
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

        {success ? (
          <div className="shrink-0 rounded-2xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm font-medium text-emerald-200">
            {success}
          </div>
        ) : null}

        <div className="grid min-h-0 flex-1 gap-4 lg:grid-cols-[minmax(320px,0.9fr)_minmax(0,1.6fr)]">
          <Card className="flex min-h-0 flex-col overflow-hidden">
            <div className="shrink-0 border-b border-white/10 px-6 py-5">
              <SectionKicker>Snapshot</SectionKicker>
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

              <div className="mt-5 grid gap-3 lg:grid-cols-[minmax(0,1fr)_200px_160px_160px]">
                <SearchInput value={searchTerm} onChange={setSearchTerm} />
                <CategorySelect
                  value={selectedCategory}
                  onChange={setSelectedCategory}
                  options={categoryOptions}
                />
                <LowStockToggle
                  checked={lowStockOnly}
                  onChange={setLowStockOnly}
                />
                <SortSelect value={sortBy} onChange={setSortBy} />
              </div>
            </div>

            {loading ? (
              <div className="px-6 py-6">
                <div className="rounded-2xl border border-white/10 bg-black/20 px-4 py-4 text-sm text-white/70">
                  Loading inventory...
                </div>
              </div>
            ) : filteredItems.length === 0 ? (
              <div className="px-6 py-10 text-center text-white/50">
                {searchTerm.trim() || selectedCategory || lowStockOnly
                  ? "No inventory items match your current filters."
                  : "No inventory items found."}
              </div>
            ) : (
              <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
                <div className="hidden shrink-0 grid-cols-[minmax(0,1.4fr)_160px_140px_140px] gap-5 px-5 py-3.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/35 lg:grid">
                  <div>Item</div>
                  <div className="text-center">Category</div>
                  <div className="text-center">On Hand</div>
                  <div className="text-center">Location</div>
                </div>

                <div className="min-h-0 flex-1 overflow-y-auto">
                  {filteredItems.map((item) => (
                    <InventoryRow key={item.id} item={item} />
                  ))}
                </div>
              </div>
            )}
          </Card>
        </div>
      </div>

      {showCreateModal ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <button
            type="button"
            aria-label="Close create inventory item modal"
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            onClick={closeCreateModal}
          />
          <div className="relative z-10 w-full max-w-2xl overflow-hidden rounded-[28px] border border-white/10 bg-[#171717] shadow-[0_30px_100px_rgba(0,0,0,0.6)]">
            <div className="border-b border-white/10 px-6 py-6">
              <SectionKicker>Inventory</SectionKicker>
              <h3 className="mt-3 text-2xl font-bold text-white">New Item</h3>
              <p className="mt-2 text-sm leading-6 text-white/60">
                Add a new inventory item to the internal stock list.
              </p>
            </div>

            <form onSubmit={handleCreateItem} className="grid gap-5 px-6 py-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="grid gap-2">
                  <FieldLabel>Name</FieldLabel>
                  <TextInput
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="3/4 Copper Coupling"
                  />
                </div>

                <div className="grid gap-2">
                  <FieldLabel>SKU</FieldLabel>
                  <TextInput
                    value={sku}
                    onChange={(e) => setSku(e.target.value)}
                    placeholder="COP-075-COUP"
                  />
                </div>

                <div className="grid gap-2">
                  <FieldLabel>Category</FieldLabel>
                  <TextInput
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    placeholder="Copper"
                  />
                </div>

                <div className="grid gap-2">
                  <FieldLabel>Unit of Measure</FieldLabel>
                  <TextInput
                    value={unitOfMeasure}
                    onChange={(e) => setUnitOfMeasure(e.target.value)}
                    placeholder="each"
                  />
                </div>

                <div className="grid gap-2">
                  <FieldLabel>Quantity on Hand</FieldLabel>
                  <TextInput
                    value={quantityOnHand}
                    onChange={(e) => setQuantityOnHand(e.target.value)}
                    inputMode="numeric"
                    placeholder="0"
                  />
                </div>

                <div className="grid gap-2">
                  <FieldLabel>Reorder Threshold</FieldLabel>
                  <TextInput
                    value={reorderThreshold}
                    onChange={(e) => setReorderThreshold(e.target.value)}
                    inputMode="numeric"
                    placeholder="0"
                  />
                </div>
              </div>

              <div className="grid gap-4">
                <div className="grid gap-2">
                  <FieldLabel>Storage Location</FieldLabel>
                  <TextInput
                    value={storageLocation}
                    onChange={(e) => setStorageLocation(e.target.value)}
                    placeholder="Warehouse A - Bin 12"
                  />
                </div>

                <div className="grid gap-2">
                  <FieldLabel>Notes</FieldLabel>
                  <TextArea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Optional notes"
                  />
                </div>
              </div>

              <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={closeCreateModal}
                  disabled={submitting}
                  className="inline-flex h-11 items-center justify-center rounded-2xl border border-white/10 bg-white/5 px-4 text-sm font-medium text-white transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex h-11 items-center justify-center rounded-2xl bg-orange-500 px-4 text-sm font-bold text-black transition hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {submitting ? "Creating..." : "Create Item"}
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </div>
  );
}

