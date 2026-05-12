import { useEffect, useMemo, useState } from 'react'
import { apiFetch, apiJson } from '@/lib/api/client'

export type InventoryItem = {
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

export type InventoryLocation = {
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

export type InventoryHistoryEntry = {
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

export type SortOption = 'name-asc' | 'name-desc' | 'qty-asc' | 'qty-desc'

export function useInventoryPage () {
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

  return {
    loading,
    error,
    success,
    searchTerm,
    setSearchTerm,
    selectedCategory,
    setSelectedCategory,
    lowStockOnly,
    setLowStockOnly,
    sortBy,
    setSortBy,
    stats,
    filteredItems,
    categoryOptions,
    openCreateModal,
    openEditModal,
    loadInventory,
    showLocationsModal,
    locationsItem,
    locations,
    locationsLoading,
    locationsError,
    openLocationsModal,
    closeLocationsModal,
    showHistoryModal,
    historyItem,
    history,
    historyLoading,
    historyError,
    openHistoryModal,
    closeHistoryModal,
    showItemModal,
    editingItem,
    name,
    sku,
    category,
    unitOfMeasure,
    quantityOnHand,
    reorderThreshold,
    storageLocation,
    notes,
    submitting,
    closeItemModal,
    handleSubmitItem,
    setName,
    setSku,
    setCategory,
    setUnitOfMeasure,
    setQuantityOnHand,
    setReorderThreshold,
    setStorageLocation,
    setNotes
  }
}