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

type InventoryHistoryEntry = {
  id: string
  transactionType: string
  quantityDelta: number
  reason: string
  performedByName: string | null
  performedByEmail: string | null
  createdAt: string
}

type HistoryModalProps = {
  item: InventoryItem | null
  history: InventoryHistoryEntry[]
  loading: boolean
  error: string
  onClose: () => void
}

export default function HistoryModal ({
  item,
  history,
  loading,
  error,
  onClose
}: HistoryModalProps) {
  if (!item) return null

  return (
    <div className='fixed inset-0 z-50 flex items-start justify-center overflow-y-auto px-4 py-4 sm:items-center sm:py-6'>
      <button
        type='button'
        aria-label='Close inventory history modal'
        className='absolute inset-0 bg-black/80 backdrop-blur-sm'
        onClick={onClose}
      />
      <div className='relative z-10 flex w-full max-w-3xl max-h-[calc(100vh-2rem)] flex-col overflow-hidden rounded-[28px] border border-white/10 bg-[#171717] shadow-[0_30px_100px_rgba(0,0,0,0.6)] sm:max-h-[90vh]'>
        <div className='border-b border-white/10 px-6 py-6'>
          <p className='text-[11px] font-semibold uppercase tracking-[0.22em] text-orange-400/80'>
            Inventory
          </p>
          <h3 className='mt-3 text-2xl font-bold text-white'>
            {item.name}
          </h3>
          <p className='mt-2 text-sm leading-6 text-white/60'>
            Stock movement history for this item.
          </p>
        </div>

        <div className='min-h-0 flex-1 overflow-y-auto px-6 py-6'>
          {loading ? (
            <div className='rounded-2xl border border-white/10 bg-black/20 px-4 py-4 text-sm text-white/70'>
              Loading history...
            </div>
          ) : error ? (
            <div className='rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-4 text-sm text-red-200'>
              {error}
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
              onClick={onClose}
              disabled={loading}
              className='inline-flex h-11 items-center justify-center rounded-2xl border border-white/10 bg-white/5 px-4 text-sm font-medium text-white transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-60'
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}