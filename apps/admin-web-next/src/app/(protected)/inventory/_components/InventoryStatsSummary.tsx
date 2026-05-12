type InventoryStatsSummaryProps = {
  totalItems: number
  lowStockCount: number
  categoryCount: number
}

export default function InventoryStatsSummary ({
  totalItems,
  lowStockCount,
  categoryCount
}: InventoryStatsSummaryProps) {
  return (
    <div className='shrink-0 border-b border-white/10 px-6 py-2.5'>
      <div className='flex flex-wrap items-center gap-2'>
        <div className='inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/20 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-white/70'>
          <span className='text-white/45'>Items</span>
          <span className='text-white'>{totalItems}</span>
        </div>
        <div className='inline-flex items-center gap-2 rounded-full border border-amber-500/20 bg-amber-500/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-amber-300'>
          <span className='text-amber-300/70'>Low Stock</span>
          <span>{lowStockCount}</span>
        </div>
        <div className='inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/20 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-white/70'>
          <span className='text-white/45'>Categories</span>
          <span className='text-white'>{categoryCount}</span>
        </div>
      </div>
    </div>
  )
}