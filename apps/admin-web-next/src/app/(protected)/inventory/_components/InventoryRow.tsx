import { Clock3, MapPinned, Pencil } from 'lucide-react'

export type InventoryRowItem = {
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

type InventoryRowProps = {
  item: InventoryRowItem
  onEdit: (item: InventoryRowItem) => void
  onViewLocations: (item: InventoryRowItem) => void
  onViewHistory: (item: InventoryRowItem) => void
}

export default function InventoryRow ({
  item,
  onEdit,
  onViewLocations,
  onViewHistory
}: InventoryRowProps) {
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