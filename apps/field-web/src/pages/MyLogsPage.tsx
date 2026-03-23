import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import FieldLayout from '../components/FieldLayout'
import { API_BASE, getStoredToken } from '../lib/auth'
import { getModuleContext } from '../lib/getModuleContext'

type RefrigerantLog = {
  id: string
  customerName: string | null
  refrigerantType: string
  techNameSnapshot: string
  jobNumber: string | null
  city: string | null
  state: string | null
  poundsAdded: string | number | null
  poundsRecovered: string | number | null
  submittedAt?: string | null
  createdAt?: string | null
}

function formatSubmittedAt(value?: string | null) {
  if (!value) return 'Unknown time'

  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return 'Unknown time'

  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit'
  }).format(date)
}

function getLogTime(log: RefrigerantLog) {
  const value = log.submittedAt ?? log.createdAt
  if (!value) return 0

  const time = new Date(value).getTime()
  return Number.isNaN(time) ? 0 : time
}

function LogCard ({ log }: { log: RefrigerantLog }) {
  const submittedLabel = formatSubmittedAt(log.submittedAt ?? log.createdAt)

  return (
    <Link
      to={`/logs/${log.id}`}
      className='block rounded-3xl border border-white/10 bg-[#1a1a1a] p-5 shadow-2xl transition hover:border-orange-400/30 hover:bg-[#202020]'
    >
      <div className='flex items-start justify-between gap-4'>
        <div className='min-w-0'>
          <div className='text-xl font-black tracking-tight text-white'>
            {log.customerName || 'No customer name'}
          </div>
          <div className='mt-1 text-sm font-semibold uppercase tracking-[0.18em] text-orange-400'>
            {log.refrigerantType}
          </div>
        </div>

        <div className='shrink-0 text-xs font-bold uppercase tracking-[0.18em] text-white/35'>
          View
        </div>
      </div>

      <div className='mt-3 text-xs font-bold uppercase tracking-[0.18em] text-white/40'>
        Submitted {submittedLabel}
      </div>

      <div className='mt-4 grid gap-2 text-sm text-white/65'>
        <div>
          <span className='font-semibold text-white/85'>Tech:</span>{' '}
          {log.techNameSnapshot}
        </div>
        <div>
          <span className='font-semibold text-white/85'>Job:</span>{' '}
          {log.jobNumber || 'N/A'}
        </div>
        <div>
          <span className='font-semibold text-white/85'>Location:</span>{' '}
          {log.city || 'N/A'}
          {log.state ? `, ${log.state}` : ''}
        </div>
        <div>
          <span className='font-semibold text-white/85'>Added:</span>{' '}
          {log.poundsAdded ?? '0'}
          <span className='mx-2 text-white/30'>|</span>
          <span className='font-semibold text-white/85'>Recovered:</span>{' '}
          {log.poundsRecovered ?? '0'}
        </div>
      </div>
    </Link>
  )
}

export default function MyLogsPage () {
  const context = useMemo(
    () => getModuleContext('my-refrigerant-logs'),
    []
  )

  const [logs, setLogs] = useState<RefrigerantLog[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function loadLogs () {
      try {
        setLoading(true)
        setError('')

        const token = getStoredToken()

        const res = await fetch(`${API_BASE}/api/refrigerant-logs/mine`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })

        const data = await res.json()

        if (!res.ok) {
          setError(data?.error || 'Failed to load logs.')
          return
        }

        const nextLogs = Array.isArray(data.logs) ? data.logs : []
        nextLogs.sort((a: RefrigerantLog, b: RefrigerantLog) => getLogTime(b) - getLogTime(a))

        setLogs(nextLogs)
      } catch {
        setError('Could not reach API.')
      } finally {
        setLoading(false)
      }
    }

    void loadLogs()
  }, [])

  return (
    <FieldLayout
      kicker='Urban Mechanical'
      title='My Refrigerant Logs'
      subtitle='Review your recent refrigerant submissions from the field.'
    >
      <div className='grid gap-6'>
        <div>
          <Link
            to={context.returnPath}
            className='inline-flex rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-white/80 transition hover:bg-white/10 hover:text-white'
          >
            {context.returnLabel}
          </Link>
        </div>

        {loading ? (
          <div className='rounded-3xl border border-white/10 bg-[#1a1a1a] p-5 text-white/70 shadow-2xl'>
            Loading logs...
          </div>
        ) : null}

        {error ? (
          <div className='rounded-3xl border border-red-500/20 bg-red-500/10 p-5 text-sm font-medium text-red-200'>
            {error}
          </div>
        ) : null}

        {!loading && !error ? (
          <div className='grid gap-4'>
            {logs.length === 0 ? (
              <div className='rounded-3xl border border-white/10 bg-[#1a1a1a] p-5 text-white/65 shadow-2xl'>
                No refrigerant logs found.
              </div>
            ) : (
              logs.map(log => <LogCard key={log.id} log={log} />)
            )}
          </div>
        ) : null}
      </div>
    </FieldLayout>
  )
}