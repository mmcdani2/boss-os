import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import FieldLayout from '../../../components/FieldLayout'
import { API_BASE, getStoredToken } from '../../../shared/api/auth-storage'
import { getModuleContext } from '../../../features/launcher/lib/getModuleContext'
import JobInfoSection from '../components/JobInfoSection'
import RefrigerantInfoSection from '../components/RefrigerantInfoSection'
import StatusMessage from '../components/StatusMessage'
import SubmitButton from '../components/SubmitButton'
import { initialState } from '../components/RefrigerantLogFormFields'
import type { FormState } from '../components/RefrigerantLogFormFields'

function cleanString (value: string) {
  const trimmed = value.trim()
  return trimmed.length ? trimmed : null
}

export default function RefrigerantLogPage () {
  const context = useMemo(
    () => getModuleContext('refrigerant-log'),
    []
  )

  const [form, setForm] = useState<FormState>({
    ...initialState,
    companyKey: context.companyKey
  })
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  function update<K extends keyof FormState> (key: K, value: FormState[K]) {
    setForm(prev => ({ ...prev, [key]: value }))
  }

  async function handleSubmit (e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setMessage('')
    setError('')

    const refrigerantType = form.refrigerantType.trim()
    const poundsAdded = form.poundsAdded.trim()
    const poundsRecovered = form.poundsRecovered.trim()
    const state = form.state.trim().toUpperCase()

    if (!refrigerantType) {
      setError('Refrigerant type is required.')
      setLoading(false)
      return
    }

    if (!poundsAdded && !poundsRecovered) {
      setError('Enter pounds added or pounds recovered.')
      setLoading(false)
      return
    }

    try {
      const token = getStoredToken()

      const res = await fetch(`${API_BASE}/api/refrigerant-logs`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          companyKey: context.companyKey,
          divisionKey: context.divisionKey,
          customerName: cleanString(form.customerName),
          jobNumber: cleanString(form.jobNumber),
          city: cleanString(form.city),
          state: cleanString(state),
          equipmentType: cleanString(form.equipmentType),
          refrigerantType,
          poundsAdded: poundsAdded || null,
          poundsRecovered: poundsRecovered || null,
          leakSuspected: form.leakSuspected,
          notes: cleanString(form.notes)
        })
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data?.error || 'Failed to submit log.')
        return
      }

      setMessage('Refrigerant log submitted.')
      setForm({
        ...initialState,
        companyKey: context.companyKey
      })
    } catch {
      setError('Could not reach API.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <FieldLayout
      kicker='BossOS Field'
      title='New Refrigerant Log'
      subtitle='Enter job details and submit HVAC refrigerant activity from the field.'
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
        <form onSubmit={handleSubmit} className='grid gap-5'>
          <JobInfoSection form={form} update={update} />
          <RefrigerantInfoSection form={form} update={update} />
          <StatusMessage tone='success' message={message} />
          <StatusMessage tone='error' message={error} />
          <SubmitButton loading={loading} />
        </form>
      </div>
    </FieldLayout>
  )
}




