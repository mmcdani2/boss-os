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

type LocationsModalProps = {
  item: InventoryItem | null
  locations: InventoryLocation[]
  loading: boolean
  error: string
  onClose: () => void
}

export default function LocationsModal ({
  item,
  locations,
  loading,
  error,
  onClose
}: LocationsModalProps) {
  if (!item) return null

  return (
    <div className='fixed inset-0 z-50 flex items-start justify-center overflow-y-auto px-4 py-4 sm:items-center sm:py-6'>
      <button
        type='button'
        aria-label='Close item locations modal'
        className='absolute inset-0 bg-black/80 backdrop-blur-sm'
        onClick={onClose}
      />
      <div className='relative z-10 flex w-full max-w-2xl flex-col overflow-hidden rounded-[28px] border border-white/10 bg-[#171717] shadow-[0_30px_100px_rgba(0,0,0,0.6)]'>
        <div className='border-b border-white/10 px-6 py-6'>
          <p className='text-[11px] font-semibold uppercase tracking-[0.22em] text-orange-400/80'>
            Locations
          </p>
          <h3 className='mt-3 text-2xl font-bold text-white'>
            {item.name}
          </h3>
          <p className='mt-2 text-sm leading-6 text-white/60'>
            Quantity by storage location for this item.
          </p>
        </div>

        <div className='px-6 py-6'>
          {loading ? (
            <div className='rounded-2xl border border-white/10 bg-black/20 px-4 py-4 text-sm text-white/70'>
              Loading locations...
            </div>
          ) : error ? (
            <div className='rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-4 text-sm text-red-200'>
              {error}
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