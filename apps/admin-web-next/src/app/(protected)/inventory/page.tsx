'use client'

import { useEffect, useMemo, useState } from 'react'
import { apiFetch, apiJson } from '@/lib/api/client'
import { MapPinned, Pencil, Clock3 } from 'lucide-react'

type InventoryItem = {
  id: string
  name: string
  sku: string
  category: string
  unitOfMeasure: string
  quantityOnHand: number
  reorderThreshold: number
  storageLocation: string
  notes: string | null
  isActive: boolean
  createdAt: string
  updatedAt: string
}

type InventoryLocation = {
  id: string
  locationName: string
  locationType: 'warehouse' | 'truck' | string
  quantity: number
}

type InventoryResponse = {
  items: InventoryItem[]
  stats: {
    totalItems: number
    lowStockCount: number
    categoryCount: number
  }
}

type InventoryLocationsResponse = {
  locations: InventoryLocation[]
}

type InventoryHistoryEntry = {
  id: string
  transactionType: string
  quantityDelta: number
  reason: string
  performedByName: string | null
  performedByEmail: string | null
  createdAt: string
}

type InventoryHistoryResponse = {
  history: InventoryHistoryEntry[]
}


type SortOption = 'name-asc' | 'name-desc' | 'qty-asc' | 'qty-desc'

function SectionKicker ({ children }: { children: React.ReactNode }) {
  return (
    <p className='text-[11px] font-semibold uppercase tracking-[0.22em] text-orange-400/80'>
      {children}
    </p>
  )
}

function Card ({
  children,
  className = ''
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <section
      className={[
        'rounded-[28px] border border-white/10 bg-[#141414] shadow-[0_20px_60px_rgba(0,0,0,0.28)]',
        className
      ].join(' ')}
    >
      {children}
    </section>
  )
}

function StatTile ({
  label,
  value = '—'
}: {
  label: string
  value?: string | number
}) {
  return (
    <div className='rounded-2xl border border-white/10 bg-black/25 px-4 py-3.5'>
      <div className='text-[10px] font-semibold uppercase tracking-[0.18em] text-white/35'>
        {label}
      </div>
      <div className='mt-2 text-[2rem] font-black leading-none text-white'>
        {value}
      </div>
    </div>
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

function FieldLabel ({ children }: { children: React.ReactNode }) {
  return (
    <label className='text-[11px] font-semibold uppercase tracking-[0.18em] text-white/55'>
      {children}
    </label>
  )
}

function TextInput (props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={[
        'h-11 rounded-2xl border border-white/10 bg-black/30 px-4 text-[15px] text-white outline-none transition',
        'placeholder:text-white/25 focus:border-orange-400/60 focus:bg-black/40',
        props.className ?? ''
      ].join(' ')}
    />
  )
}

function TextArea (props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      {...props}
      className={[
        'min-h-[84px] rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-[15px] text-white outline-none transition',
        'placeholder:text-white/25 focus:border-orange-400/60 focus:bg-black/40',
        props.className ?? ''
      ].join(' ')}
    />
  )
}

function InventoryRow ({
  item,
  onEdit,
  onViewLocations,
  onViewHistory
}: {
  item: InventoryItem
  onEdit: (item: InventoryItem) => void
  onViewLocations: (item: InventoryItem) => void
  onViewHistory: (item: InventoryItem) => void
}) {
  const lowStock = item.quantityOnHand <= item.reorderThreshold

  return (
    <div className='grid w-full gap-4 border-t border-white/10 px-5 py-4 transition hover:bg-white/[0.03] first:border-t-0 lg:grid-cols-[minmax(0,1.4fr)_160px_140px_140px] lg:items-center lg:gap-5'>
      <div className='min-w-0'>
        <button
          type='button'
          onClick={() => onEdit(item)}
          className='min-w-0 text-left'
        >
          <div className='truncate text-[15px] font-semibold text-white transition hover:text-orange-300'>
            {item.name}
          </div>
          <div className='mt-1 truncate text-sm text-white/50'>{item.sku}</div>
        </button>
      </div>

      <div className='text-sm text-white/75 lg:text-center'>
        <div className='mb-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-white/35 lg:hidden'>
          Category
        </div>
        <span className='inline-flex rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-white/75'>
          {item.category}
        </span>
      </div>

      <div className='lg:text-center'>
        <div className='mb-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-white/35 lg:hidden'>
          On Hand
        </div>
        <span
          className={[
            'inline-flex rounded-full px-3 py-1.5 text-xs font-semibold uppercase tracking-wide',
            lowStock
              ? 'bg-amber-500/15 text-amber-300'
              : 'bg-white/10 text-white/75'
          ].join(' ')}
        >
          {item.quantityOnHand} {item.unitOfMeasure}
        </span>
      </div>

      <div className='text-sm lg:text-center'>
        <div className='mb-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-white/35 lg:hidden'>
          Actions
        </div>
        <div className='inline-flex w-fit rounded-xl shadow-[0_8px_24px_rgba(0,0,0,0.22)]'>
          <button
            type='button'
            title='Edit Item'
            aria-label='Edit Item'
            onClick={() => onEdit(item)}
            className='inline-flex h-9 w-9 items-center justify-center rounded-l-xl border border-white/10 bg-white/5 text-white/75 transition hover:border-orange-400/40 hover:bg-orange-500/10 hover:text-orange-200'
          >
            <Pencil className='h-[15px] w-[15px]' />
          </button>

          <button
            type='button'
            title='View Locations'
            aria-label='View Locations'
            onClick={() => onViewLocations(item)}
            className='-ml-px inline-flex h-9 w-9 items-center justify-center border border-white/10 bg-white/5 text-white/75 transition hover:border-orange-400/40 hover:bg-orange-500/10 hover:text-orange-200'
          >
            <MapPinned className='h-[15px] w-[15px]' />
          </button>

          <button
            type='button'
            title='View History'
            aria-label='View History'
            onClick={() => onViewHistory(item)}
            className='-ml-px inline-flex h-9 w-9 items-center justify-center rounded-r-xl border border-white/10 bg-white/5 text-white/75 transition hover:border-orange-400/40 hover:bg-orange-500/10 hover:text-orange-200'
          >
            <Clock3 className='h-[15px] w-[15px]' />
          </button>
        </div>
      </div>
    </div>
  )
}

export default function InventoryPage () {
  const [items, setItems] = useState<InventoryItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [lowStockOnly, setLowStockOnly] = useState(false)
  const [sortBy, setSortBy] = useState<SortOption>('name-asc')
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const [locationsItem, setLocationsItem] = useState<InventoryItem | null>(null)
  const [locations, setLocations] = useState<InventoryLocation[]>([])
  const [locationsLoading, setLocationsLoading] = useState(false)
  const [locationsError, setLocationsError] = useState('')

  const [historyItem, setHistoryItem] = useState<InventoryItem | null>(null)
  const [history, setHistory] = useState<InventoryHistoryEntry[]>([])
  const [historyLoading, setHistoryLoading] = useState(false)
  const [historyError, setHistoryError] = useState('')

  const [name, setName] = useState('')
  const [sku, setSku] = useState('')
  const [category, setCategory] = useState('')
  const [unitOfMeasure, setUnitOfMeasure] = useState('')
  const [quantityOnHand, setQuantityOnHand] = useState('0')
  const [reorderThreshold, setReorderThreshold] = useState('0')
  const [storageLocation, setStorageLocation] = useState('')
  const [notes, setNotes] = useState('')

  const [stats, setStats] = useState({
    totalItems: 0,
    lowStockCount: 0,
    categoryCount: 0
  })

  const showItemModal = showCreateModal || editingItem !== null
  const showLocationsModal = locationsItem !== null
  const showHistoryModal = historyItem !== null

  const categoryOptions = useMemo(() => {
    return Array.from(new Set(items.map(item => item.category))).sort((a, b) =>
      a.localeCompare(b)
    )
  }, [items])

  const filteredItems = useMemo(() => {
    const term = searchTerm.trim().toLowerCase()

    const filtered = items.filter(item => {
      const matchesSearch =
        !term ||
        item.name.toLowerCase().includes(term) ||
        item.sku.toLowerCase().includes(term)

      const matchesCategory =
        !selectedCategory || item.category === selectedCategory

      const matchesLowStock =
        !lowStockOnly || item.quantityOnHand <= item.reorderThreshold

      return matchesSearch && matchesCategory && matchesLowStock
    })

    return [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'name-desc':
          return b.name.localeCompare(a.name)
        case 'qty-asc':
          return a.quantityOnHand - b.quantityOnHand
        case 'qty-desc':
          return b.quantityOnHand - a.quantityOnHand
        case 'name-asc':
        default:
          return a.name.localeCompare(b.name)
      }
    })
  }, [items, searchTerm, selectedCategory, lowStockOnly, sortBy])

  async function loadInventory () {
    try {
      setLoading(true)
      setError('')

      const data = await apiJson<InventoryResponse>('/api/inventory')
      setItems(data.items)
      setStats(data.stats)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load inventory.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void loadInventory()
  }, [])

  function resetItemForm () {
    setName('')
    setSku('')
    setCategory('')
    setUnitOfMeasure('')
    setQuantityOnHand('0')
    setReorderThreshold('0')
    setStorageLocation('')
    setNotes('')
  }

  function openCreateModal () {
    setError('')
    setSuccess('')
    setEditingItem(null)
    resetItemForm()
    setShowCreateModal(true)
  }

  function openEditModal (item: InventoryItem) {
    setError('')
    setSuccess('')
    setShowCreateModal(false)
    setEditingItem(item)
    setName(item.name)
    setSku(item.sku)
    setCategory(item.category)
    setUnitOfMeasure(item.unitOfMeasure)
    setQuantityOnHand(String(item.quantityOnHand))
    setReorderThreshold(String(item.reorderThreshold))
    setStorageLocation(item.storageLocation)
    setNotes(item.notes ?? '')
  }

  function closeItemModal () {
    if (submitting) return
    setShowCreateModal(false)
    setEditingItem(null)
    resetItemForm()
  }

  async function openLocationsModal (item: InventoryItem) {
    try {
      setLocationsItem(item)
      setLocations([])
      setLocationsError('')
      setLocationsLoading(true)

      const data = await apiJson<InventoryLocationsResponse>(
        `/api/inventory/${item.id}/locations`
      )

      setLocations(data.locations)
    } catch (err) {
      setLocationsError(
        err instanceof Error ? err.message : 'Failed to load item locations.'
      )
    } finally {
      setLocationsLoading(false)
    }
  }

  function closeLocationsModal () {
    if (locationsLoading) return
    setLocationsItem(null)
    setLocations([])
    setLocationsError('')
  }

  async function openHistoryModal (item: InventoryItem) {
    try {
      setHistoryItem(item)
      setHistory([])
      setHistoryError('')
      setHistoryLoading(true)

      const data = await apiJson<InventoryHistoryResponse>(
        `/api/inventory/${item.id}/history`
      )

      setHistory(data.history)
    } catch (err) {
      setHistoryError(
        err instanceof Error ? err.message : 'Failed to load item history.'
      )
    } finally {
      setHistoryLoading(false)
    }
  }

  function closeHistoryModal () {
    if (historyLoading) return
    setHistoryItem(null)
    setHistory([])
    setHistoryError('')
  }

  async function handleSubmitItem (e: React.FormEvent) {
    e.preventDefault()

    try {
      setSubmitting(true)
      setError('')
      setSuccess('')

      const isEditing = Boolean(editingItem)
      const url = isEditing ? `/api/inventory/${editingItem!.id}` : '/api/inventory'
      const method = isEditing ? 'PATCH' : 'POST'

      const response = await apiFetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name,
          sku,
          category,
          unitOfMeasure,
          quantityOnHand: Number(quantityOnHand),
          reorderThreshold: Number(reorderThreshold),
          storageLocation,
          notes
        })
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data?.error || `Failed to ${isEditing ? 'update' : 'create'} inventory item.`)
        return
      }

      setSuccess(
        isEditing
          ? 'Inventory item updated successfully.'
          : 'Inventory item created successfully.'
      )
      closeItemModal()
      await loadInventory()
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : `Failed to ${editingItem ? 'update' : 'create'} inventory item.`
      )
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className='flex h-full min-h-0 w-full flex-col gap-6'>
      <div className='flex min-h-0 w-full flex-1 flex-col gap-6'>
        <div className='shrink-0 rounded-[28px] border border-white/10 bg-[linear-gradient(180deg,rgba(249,115,22,0.08),rgba(255,255,255,0.02))] px-7 py-6 shadow-[0_20px_60px_rgba(0,0,0,0.25)]'>
          <div className='flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between'>
            <div className='max-w-3xl'>
              <SectionKicker>Inventory</SectionKicker>
              <h1 className='mt-3 text-3xl font-black tracking-tight text-white sm:text-[2.2rem]'>
                Inventory
              </h1>
              <p className='mt-2 max-w-2xl text-sm leading-6 text-white/60 sm:text-[15px]'>
                Track what you have, where it is stored, and what needs
                attention.
              </p>
            </div>

            <button
              type='button'
              onClick={openCreateModal}
              className='inline-flex h-11 items-center justify-center rounded-2xl border border-white/10 bg-white/5 px-4 text-sm font-medium text-white transition hover:bg-white/10'
            >
              New Item
            </button>
          </div>
        </div>

        {error ? (
          <div className='shrink-0 rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm font-medium text-red-200'>
            {error}
          </div>
        ) : null}

        {success ? (
          <div className='shrink-0 rounded-2xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm font-medium text-emerald-200'>
            {success}
          </div>
        ) : null}

        <div className='grid min-h-0 flex-1 gap-4 lg:grid-cols-[minmax(320px,0.9fr)_minmax(0,1.6fr)]'>
          <Card className='flex min-h-0 flex-col overflow-hidden'>
            <div className='shrink-0 border-b border-white/10 px-6 py-5'>
              <SectionKicker>Snapshot</SectionKicker>
            </div>

            <div className='grid gap-3 px-6 py-5'>
              <StatTile label='Total Items' value={stats.totalItems} />
              <StatTile label='Low Stock' value={stats.lowStockCount} />
              <StatTile label='Categories' value={stats.categoryCount} />
            </div>
          </Card>

          <Card className='flex min-h-0 flex-col overflow-hidden'>
            <div className='shrink-0 border-b border-white/10 px-6 py-5'>
              <div className='flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between'>
                <div className='lg:text-left'>
                  <SectionKicker>Inventory List</SectionKicker>
                  <h2 className='mt-2 text-2xl font-bold text-white'>
                    Current Items
                  </h2>
                  <p className='mt-2 text-sm leading-6 text-white/60'>
                    Search, filter, and review stock records from one place.
                  </p>
                </div>

                <button
                  type='button'
                  onClick={() => void loadInventory()}
                  className='inline-flex h-10 items-center justify-center rounded-2xl border border-white/10 bg-white/4 px-4 text-sm font-medium text-white/90 transition hover:bg-white/8'
                >
                  Refresh
                </button>
              </div>

              <div className='mt-5 grid gap-3 lg:grid-cols-[minmax(0,1fr)_200px_160px_160px]'>
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
              <div className='px-6 py-6'>
                <div className='rounded-2xl border border-white/10 bg-black/20 px-4 py-4 text-sm text-white/70'>
                  Loading inventory...
                </div>
              </div>
            ) : filteredItems.length === 0 ? (
              <div className='px-6 py-10 text-center text-white/50'>
                {searchTerm.trim() || selectedCategory || lowStockOnly
                  ? 'No inventory items match your current filters.'
                  : 'No inventory items found.'}
              </div>
            ) : (
              <div className='flex min-h-0 flex-1 flex-col overflow-hidden'>
                <div className='hidden shrink-0 grid-cols-[minmax(0,1.4fr)_160px_140px_140px] gap-5 px-5 py-3.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/35 lg:grid'>
                  <div>Item</div>
                  <div className='text-center'>Category</div>
                  <div className='text-center'>On Hand</div>
                  <div className='text-center'>Actions</div>
                </div>

                <div className='min-h-0 flex-1 overflow-y-auto'>
                  {filteredItems.map(item => (
                    <InventoryRow
                      key={item.id}
                      item={item}
                      onEdit={openEditModal}
                      onViewLocations={item => void openLocationsModal(item)}
                      onViewHistory={item => void openHistoryModal(item)}
                    />
                  ))}
                </div>
              </div>
            )}
          </Card>
        </div>
      </div>

      {showLocationsModal ? (
        <div className='fixed inset-0 z-50 flex items-start justify-center overflow-y-auto px-4 py-4 sm:items-center sm:py-6'>
          <button
            type='button'
            aria-label='Close item locations modal'
            className='absolute inset-0 bg-black/80 backdrop-blur-sm'
            onClick={closeLocationsModal}
          />
          <div className='relative z-10 flex w-full max-w-2xl flex-col overflow-hidden rounded-[28px] border border-white/10 bg-[#171717] shadow-[0_30px_100px_rgba(0,0,0,0.6)]'>
            <div className='border-b border-white/10 px-6 py-6'>
              <SectionKicker>Locations</SectionKicker>
              <h3 className='mt-3 text-2xl font-bold text-white'>
                {locationsItem?.name}
              </h3>
              <p className='mt-2 text-sm leading-6 text-white/60'>
                Quantity by storage location for this item.
              </p>
            </div>

            <div className='px-6 py-6'>
              {locationsLoading ? (
                <div className='rounded-2xl border border-white/10 bg-black/20 px-4 py-4 text-sm text-white/70'>
                  Loading locations...
                </div>
              ) : locationsError ? (
                <div className='rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-4 text-sm text-red-200'>
                  {locationsError}
                </div>
              ) : locations.length === 0 ? (
                <div className='rounded-2xl border border-white/10 bg-black/20 px-4 py-4 text-sm text-white/60'>
                  No locations found for this item.
                </div>
              ) : (
                <div className='overflow-hidden rounded-2xl border border-white/10'>
                  <div className='grid grid-cols-[minmax(0,1.4fr)_120px_100px] gap-4 border-b border-white/10 bg-white/[0.03] px-4 py-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/35'>
                    <div>Location</div>
                    <div className='text-center'>Type</div>
                    <div className='text-center'>Qty</div>
                  </div>

                  {locations.map(location => (
                    <div
                      key={location.id}
                      className='grid grid-cols-[minmax(0,1.4fr)_120px_100px] gap-4 border-t border-white/10 px-4 py-3 first:border-t-0'
                    >
                      <div className='truncate text-sm text-white'>
                        {location.locationName}
                      </div>
                      <div className='text-center'>
                        <span className='inline-flex rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-white/75'>
                          {location.locationType}
                        </span>
                      </div>
                      <div className='text-center text-sm font-semibold text-white'>
                        {location.quantity}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className='border-t border-white/10 px-6 py-5'>
              <div className='flex justify-end'>
                <button
                  type='button'
                  onClick={closeLocationsModal}
                  disabled={locationsLoading}
                  className='inline-flex h-11 items-center justify-center rounded-2xl border border-white/10 bg-white/5 px-4 text-sm font-medium text-white transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-60'
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : null}

      {showHistoryModal ? (
        <div className='fixed inset-0 z-50 flex items-start justify-center overflow-y-auto px-4 py-4 sm:items-center sm:py-6'>
          <button
            type='button'
            aria-label='Close inventory history modal'
            className='absolute inset-0 bg-black/80 backdrop-blur-sm'
            onClick={closeHistoryModal}
          />
          <div className='relative z-10 flex w-full max-w-3xl max-h-[calc(100vh-2rem)] flex-col overflow-hidden rounded-[28px] border border-white/10 bg-[#171717] shadow-[0_30px_100px_rgba(0,0,0,0.6)] sm:max-h-[90vh]'>
            <div className='border-b border-white/10 px-6 py-6'>
              <SectionKicker>Inventory</SectionKicker>
              <h3 className='mt-3 text-2xl font-bold text-white'>
                {historyItem?.name}
              </h3>
              <p className='mt-2 text-sm leading-6 text-white/60'>
                Stock movement history for this item.
              </p>
            </div>

            <div className='min-h-0 flex-1 overflow-y-auto px-6 py-6'>
              {historyLoading ? (
                <div className='rounded-2xl border border-white/10 bg-black/20 px-4 py-4 text-sm text-white/70'>
                  Loading history...
                </div>
              ) : historyError ? (
                <div className='rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-4 text-sm text-red-200'>
                  {historyError}
                </div>
              ) : history.length === 0 ? (
                <div className='rounded-2xl border border-white/10 bg-black/20 px-4 py-4 text-sm text-white/60'>
                  No history found for this item.
                </div>
              ) : (
                <div className='overflow-hidden rounded-2xl border border-white/10'>
                  <div className='grid grid-cols-[140px_120px_minmax(0,1fr)_160px] gap-4 border-b border-white/10 bg-white/[0.03] px-4 py-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/35'>
                    <div>Date</div>
                    <div className='text-center'>Change</div>
                    <div>Reason</div>
                    <div>User</div>
                  </div>

                  {history.map(entry => (
                    <div
                      key={entry.id}
                      className='grid grid-cols-[140px_120px_minmax(0,1fr)_160px] gap-4 border-t border-white/10 px-4 py-3 first:border-t-0'
                    >
                      <div className='text-sm text-white/75'>
                        {new Date(entry.createdAt).toLocaleDateString()}
                      </div>
                      <div className='text-center text-sm font-semibold text-white'>
                        {entry.quantityDelta > 0 ? '+' : ''}{entry.quantityDelta}
                      </div>
                      <div className='min-w-0 truncate text-sm text-white'>
                        {entry.reason || '—'}
                      </div>
                      <div className='min-w-0 truncate text-sm text-white/75'>
                        {entry.performedByName || entry.performedByEmail || '—'}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className='border-t border-white/10 px-6 py-5'>
              <div className='flex justify-end'>
                <button
                  type='button'
                  onClick={closeHistoryModal}
                  disabled={historyLoading}
                  className='inline-flex h-11 items-center justify-center rounded-2xl border border-white/10 bg-white/5 px-4 text-sm font-medium text-white transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-60'
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : null}

      {showItemModal ? (
        <div className='fixed inset-0 z-50 flex items-start justify-center overflow-y-auto px-4 py-4 sm:items-center sm:py-6'>
          <button
            type='button'
            aria-label='Close inventory item modal'
            className='absolute inset-0 bg-black/80 backdrop-blur-sm'
            onClick={closeItemModal}
          />
          <div className='relative z-10 flex w-full max-w-2xl max-h-[calc(100vh-2rem)] flex-col overflow-hidden rounded-[28px] border border-white/10 bg-[#171717] shadow-[0_30px_100px_rgba(0,0,0,0.6)] sm:max-h-[90vh]'>
            <div className='border-b border-white/10 px-6 py-6'>
              <SectionKicker>Inventory</SectionKicker>
              <h3 className='mt-3 text-2xl font-bold text-white'>
                {editingItem ? 'Edit Item' : 'New Item'}
              </h3>
              <p className='mt-2 text-sm leading-6 text-white/60'>
                {editingItem
                  ? 'Update the inventory item details.'
                  : 'Add a new inventory item to the internal stock list.'}
              </p>
            </div>

            <form
              onSubmit={handleSubmitItem}
              className='grid min-h-0 flex-1 gap-5 overflow-y-auto px-6 py-6'
            >
              <div className='grid gap-3 md:grid-cols-2'>
                <div className='grid gap-2'>
                  <TextInput
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder='NAME'
                  />
                </div>

                <div className='grid gap-2'>
                  <TextInput
                    value={sku}
                    onChange={e => setSku(e.target.value)}
                    placeholder='SKU'
                  />
                </div>

                <div className='grid gap-2'>
                  <TextInput
                    value={category}
                    onChange={e => setCategory(e.target.value)}
                    placeholder='CATEGORY'
                  />
                </div>

                <div className='grid gap-2'>
                  <TextInput
                    value={unitOfMeasure}
                    onChange={e => setUnitOfMeasure(e.target.value)}
                    placeholder='UNIT OF MEASURE'
                  />
                </div>

                <div className='grid gap-2'>
                  <div className='pl-2.5'>
                    <FieldLabel>Quantity on Hand</FieldLabel>
                  </div>
                  <TextInput
                    value={quantityOnHand}
                    onChange={e => setQuantityOnHand(e.target.value)}
                    inputMode='numeric'
                    placeholder='0'
                  />
                </div>

                <div className='grid gap-2'>
                  <div className='pl-2.5'>
                    <FieldLabel>Reorder Threshold</FieldLabel>
                  </div>
                  <TextInput
                    value={reorderThreshold}
                    onChange={e => setReorderThreshold(e.target.value)}
                    inputMode='numeric'
                    placeholder='0'
                  />
                </div>
              </div>

              <div className='grid gap-3'>
                <div className='grid gap-2'>
                  <TextInput
                    value={storageLocation}
                    onChange={e => setStorageLocation(e.target.value)}
                    placeholder='LOCATION'
                  />
                </div>

                <div className='grid gap-2'>
                  <TextArea
                    value={notes}
                    onChange={e => setNotes(e.target.value)}
                    placeholder='Optional notes'
                  />
                </div>
              </div>

              <div className='flex flex-col-reverse gap-2 pt-1 sm:flex-row sm:justify-end'>
                <button
                  type='button'
                  onClick={closeItemModal}
                  disabled={submitting}
                  className='inline-flex h-11 items-center justify-center rounded-2xl border border-white/10 bg-white/5 px-4 text-sm font-medium text-white transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-60'
                >
                  Cancel
                </button>

                <button
                  type='submit'
                  disabled={submitting}
                  className='inline-flex h-11 items-center justify-center rounded-2xl bg-orange-500 px-4 text-sm font-bold text-black transition hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-70'
                >
                  {submitting
                    ? editingItem ? 'Saving...' : 'Creating...'
                    : editingItem ? 'Save Changes' : 'Create Item'}
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </div>
  )
}
