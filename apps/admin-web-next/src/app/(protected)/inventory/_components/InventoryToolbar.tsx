import type { ReactNode } from 'react'

type SortOption = 'name-asc' | 'name-desc' | 'qty-asc' | 'qty-desc'

type InventoryToolbarProps = {
  searchTerm: string
  onSearchTermChange: (value: string) => void
  selectedCategory: string
  onSelectedCategoryChange: (value: string) => void
  categoryOptions: string[]
  lowStockOnly: boolean
  onLowStockOnlyChange: (checked: boolean) => void
  sortBy: SortOption
  onSortByChange: (value: SortOption) => void
  onRefresh: () => void
}

function ToolbarKicker ({ children }: { children: ReactNode }) {
  return (
    <p className='text-[11px] font-semibold uppercase tracking-[0.22em] text-orange-400/80'>
      {children}
    </p>
  )
}

function SearchInput ({
  value,
  onChange
}: {
  value: string
  onChange: (value: string) => void
}) {
  return (
    <input
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder='Search by name or SKU'
      className='h-11 rounded-2xl border border-white/10 bg-black/30 px-4 text-[15px] text-white outline-none transition placeholder:text-white/35 focus:border-orange-400/60 focus:bg-black/40'
    />
  )
}

function CategorySelect ({
  value,
  onChange,
  options
}: {
  value: string
  onChange: (value: string) => void
  options: string[]
}) {
  return (
    <select
      value={value}
      onChange={e => onChange(e.target.value)}
      className='h-11 rounded-2xl border border-white/10 bg-black/30 px-4 text-[15px] text-white outline-none transition focus:border-orange-400/60 focus:bg-black/40'
    >
      <option value=''>All categories</option>
      {options.map(option => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </select>
  )
}

function SortSelect ({
  value,
  onChange
}: {
  value: SortOption
  onChange: (value: SortOption) => void
}) {
  return (
    <select
      value={value}
      onChange={e => onChange(e.target.value as SortOption)}
      className='h-11 rounded-2xl border border-white/10 bg-black/30 px-4 text-[15px] text-white outline-none transition focus:border-orange-400/60 focus:bg-black/40'
    >
      <option value='name-asc'>Name A-Z</option>
      <option value='name-desc'>Name Z-A</option>
      <option value='qty-asc'>Qty Low-High</option>
      <option value='qty-desc'>Qty High-Low</option>
    </select>
  )
}

function LowStockToggle ({
  checked,
  onChange
}: {
  checked: boolean
  onChange: (checked: boolean) => void
}) {
  return (
    <button
      type='button'
      onClick={() => onChange(!checked)}
      className={[
        'inline-flex h-11 items-center justify-center rounded-2xl border px-4 text-sm font-medium transition',
        checked
          ? 'border-amber-500/30 bg-amber-500/10 text-amber-300'
          : 'border-white/10 bg-black/30 text-white/65 hover:bg-black/40'
      ].join(' ')}
    >
      Low Stock Only
    </button>
  )
}

export default function InventoryToolbar ({
  searchTerm,
  onSearchTermChange,
  selectedCategory,
  onSelectedCategoryChange,
  categoryOptions,
  lowStockOnly,
  onLowStockOnlyChange,
  sortBy,
  onSortByChange,
  onRefresh
}: InventoryToolbarProps) {
  return (
    <div className='shrink-0 border-b border-white/10 px-6 py-5'>
      <div className='flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between'>
        <div className='lg:text-left'>
          <ToolbarKicker>Inventory List</ToolbarKicker>
          <h2 className='mt-2 text-2xl font-bold text-white'>
            Current Items
          </h2>
          <p className='mt-2 text-sm leading-6 text-white/60'>
            Search, filter, and review stock records from one place.
          </p>
        </div>

        <button
          type='button'
          onClick={onRefresh}
          className='inline-flex h-10 items-center justify-center rounded-2xl border border-white/10 bg-white/4 px-4 text-sm font-medium text-white/90 transition hover:bg-white/8'
        >
          Refresh
        </button>
      </div>

      <div className='mt-5 grid gap-3 lg:grid-cols-[minmax(0,1fr)_200px_160px_160px]'>
        <SearchInput value={searchTerm} onChange={onSearchTermChange} />
        <CategorySelect
          value={selectedCategory}
          onChange={onSelectedCategoryChange}
          options={categoryOptions}
        />
        <LowStockToggle
          checked={lowStockOnly}
          onChange={onLowStockOnlyChange}
        />
        <SortSelect value={sortBy} onChange={onSortByChange} />
      </div>
    </div>
  )
}