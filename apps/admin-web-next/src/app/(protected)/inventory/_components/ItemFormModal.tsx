import type { FormEvent } from 'react'

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

type ItemFormModalProps = {
  isOpen: boolean
  editingItem: InventoryItem | null
  name: string
  sku: string
  category: string
  unitOfMeasure: string
  quantityOnHand: string
  reorderThreshold: string
  storageLocation: string
  notes: string
  submitting: boolean
  error: string
  onClose: () => void
  onSubmit: (event: FormEvent) => void
  setName: (value: string) => void
  setSku: (value: string) => void
  setCategory: (value: string) => void
  setUnitOfMeasure: (value: string) => void
  setQuantityOnHand: (value: string) => void
  setReorderThreshold: (value: string) => void
  setStorageLocation: (value: string) => void
  setNotes: (value: string) => void
}

export default function ItemFormModal ({
  isOpen,
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
  error,
  onClose,
  onSubmit,
  setName,
  setSku,
  setCategory,
  setUnitOfMeasure,
  setQuantityOnHand,
  setReorderThreshold,
  setStorageLocation,
  setNotes
}: ItemFormModalProps) {
  if (!isOpen) return null

  return (
    <div className='fixed inset-0 z-50 flex items-start justify-center overflow-y-auto px-4 py-4 sm:items-center sm:py-6'>
      <button
        type='button'
        aria-label='Close inventory item modal'
        className='absolute inset-0 bg-black/80 backdrop-blur-sm'
        onClick={onClose}
      />
      <div className='relative z-10 flex w-full max-w-4xl flex-col overflow-hidden rounded-[28px] border border-white/10 bg-[#171717] shadow-[0_30px_100px_rgba(0,0,0,0.6)]'>
        <div className='border-b border-white/10 px-6 py-6'>
          <p className='text-[11px] font-semibold uppercase tracking-[0.22em] text-orange-400/80'>
            Inventory
          </p>
          <h3 className='mt-3 text-2xl font-bold text-white'>
            {editingItem ? 'Edit Item' : 'Add Item'}
          </h3>
          <p className='mt-2 text-sm leading-6 text-white/60'>
            {editingItem
              ? 'Update the item details below.'
              : 'Create a new inventory item.'}
          </p>
        </div>

        <form onSubmit={onSubmit} className='flex flex-col'>
          <div className='grid gap-4 px-6 py-6 md:grid-cols-2'>
            <label className='grid gap-2 text-sm'>
              <span className='font-medium text-white/80'>Name</span>
              <input
                value={name}
                onChange={e => setName(e.target.value)}
                required
                className='h-11 rounded-2xl border border-white/10 bg-black/20 px-4 text-sm text-white outline-none transition placeholder:text-white/25 focus:border-orange-400/50'
              />
            </label>

            <label className='grid gap-2 text-sm'>
              <span className='font-medium text-white/80'>SKU</span>
              <input
                value={sku}
                onChange={e => setSku(e.target.value)}
                required
                className='h-11 rounded-2xl border border-white/10 bg-black/20 px-4 text-sm text-white outline-none transition placeholder:text-white/25 focus:border-orange-400/50'
              />
            </label>

            <label className='grid gap-2 text-sm'>
              <span className='font-medium text-white/80'>Category</span>
              <input
                value={category}
                onChange={e => setCategory(e.target.value)}
                required
                className='h-11 rounded-2xl border border-white/10 bg-black/20 px-4 text-sm text-white outline-none transition placeholder:text-white/25 focus:border-orange-400/50'
              />
            </label>

            <label className='grid gap-2 text-sm'>
              <span className='font-medium text-white/80'>Unit of Measure</span>
              <input
                value={unitOfMeasure}
                onChange={e => setUnitOfMeasure(e.target.value)}
                required
                className='h-11 rounded-2xl border border-white/10 bg-black/20 px-4 text-sm text-white outline-none transition placeholder:text-white/25 focus:border-orange-400/50'
              />
            </label>

            <label className='grid gap-2 text-sm'>
              <span className='font-medium text-white/80'>Quantity On Hand</span>
              <input
                type='number'
                inputMode='numeric'
                value={quantityOnHand}
                onChange={e => setQuantityOnHand(e.target.value)}
                required
                className='h-11 rounded-2xl border border-white/10 bg-black/20 px-4 text-sm text-white outline-none transition placeholder:text-white/25 focus:border-orange-400/50'
              />
            </label>

            <label className='grid gap-2 text-sm'>
              <span className='font-medium text-white/80'>Reorder Threshold</span>
              <input
                type='number'
                inputMode='numeric'
                value={reorderThreshold}
                onChange={e => setReorderThreshold(e.target.value)}
                required
                className='h-11 rounded-2xl border border-white/10 bg-black/20 px-4 text-sm text-white outline-none transition placeholder:text-white/25 focus:border-orange-400/50'
              />
            </label>

            <label className='grid gap-2 text-sm md:col-span-2'>
              <span className='font-medium text-white/80'>Storage Location</span>
              <input
                value={storageLocation}
                onChange={e => setStorageLocation(e.target.value)}
                className='h-11 rounded-2xl border border-white/10 bg-black/20 px-4 text-sm text-white outline-none transition placeholder:text-white/25 focus:border-orange-400/50'
              />
            </label>

            <label className='grid gap-2 text-sm md:col-span-2'>
              <span className='font-medium text-white/80'>Notes</span>
              <textarea
                value={notes}
                onChange={e => setNotes(e.target.value)}
                rows={4}
                className='min-h-[112px] rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/25 focus:border-orange-400/50'
              />
            </label>
          </div>

          {error ? (
            <div className='px-6 pb-2'>
              <div className='rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-200'>
                {error}
              </div>
            </div>
          ) : null}

          <div className='border-t border-white/10 px-6 py-5'>
            <div className='flex flex-col-reverse gap-3 sm:flex-row sm:justify-end'>
              <button
                type='button'
                onClick={onClose}
                disabled={submitting}
                className='inline-flex h-11 items-center justify-center rounded-2xl border border-white/10 bg-white/5 px-4 text-sm font-medium text-white transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-60'
              >
                Cancel
              </button>
              <button
                type='submit'
                disabled={submitting}
                className='inline-flex h-11 items-center justify-center rounded-2xl bg-orange-500 px-4 text-sm font-semibold text-white transition hover:bg-orange-400 disabled:cursor-not-allowed disabled:opacity-60'
              >
                {submitting ? 'Saving...' : editingItem ? 'Save Changes' : 'Create Item'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}