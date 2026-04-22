'use client'

import { useEffect, useMemo, useState } from 'react'
import { apiFetch, apiJson } from '@/lib/api/client'
import InventoryRow from './_components/InventoryRow'
import LocationsModal from './_components/LocationsModal'
import HistoryModal from './_components/HistoryModal'
import ItemFormModal from './_components/ItemFormModal'
import InventoryToolbar from './_components/InventoryToolbar'

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
  value = 'ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÂ¢Ã¢â‚¬Å¾Ã‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¦ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¡ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã¢â‚¬Â¦Ãƒâ€šÃ‚Â¡ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â'
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

        <div className='grid min-h-0 flex-1 gap-4 lg:grid-cols-[180px_minmax(0,1fr)]'>
          <div className='flex min-h-0 flex-col gap-4'>
            <Card className='shrink-0 p-4'>
              <div className='grid gap-3'>
                <StatTile label='Total Items' value={stats.totalItems} />
                <StatTile label='Low Stock' value={stats.lowStockCount} />
                <StatTile label='Categories' value={stats.categoryCount} />
              </div>
            </Card>
          </div>

          <Card className='flex min-h-0 flex-col overflow-hidden'>
            <InventoryToolbar
              searchTerm={searchTerm}
              onSearchTermChange={setSearchTerm}
              selectedCategory={selectedCategory}
              onSelectedCategoryChange={setSelectedCategory}
              categoryOptions={categoryOptions}
              lowStockOnly={lowStockOnly}
              onLowStockOnlyChange={setLowStockOnly}
              sortBy={sortBy}
              onSortByChange={setSortBy}
              onRefresh={() => void loadInventory()}
            />

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
        <LocationsModal
          item={locationsItem}
          locations={locations}
          loading={locationsLoading}
          error={locationsError}
          onClose={closeLocationsModal}
        />
      ) : null}
      {showHistoryModal ? (
        <HistoryModal
          item={historyItem}
          history={history}
          loading={historyLoading}
          error={historyError}
          onClose={closeHistoryModal}
        />
      ) : null}
      <ItemFormModal
        isOpen={showItemModal}
        editingItem={editingItem}
        name={name}
        sku={sku}
        category={category}
        unitOfMeasure={unitOfMeasure}
        quantityOnHand={quantityOnHand}
        reorderThreshold={reorderThreshold}
        storageLocation={storageLocation}
        notes={notes}
        submitting={submitting}
        error={error}
        onClose={closeItemModal}
        onSubmit={handleSubmitItem}
        setName={setName}
        setSku={setSku}
        setCategory={setCategory}
        setUnitOfMeasure={setUnitOfMeasure}
        setQuantityOnHand={setQuantityOnHand}
        setReorderThreshold={setReorderThreshold}
        setStorageLocation={setStorageLocation}
        setNotes={setNotes}
      />
    </div>
  )
}
