import { useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import FieldLayout from '../../../components/FieldLayout'
import { API_BASE, getStoredToken } from '../../../shared/api/auth-storage'
import { getModuleContext } from '../../../features/launcher/lib/getModuleContext'
import JobNotesSection from '../components/JobNotesSection'
import PurchaseSection from '../components/PurchaseSection'
import ReimbursementDetailsSection from '../components/ReimbursementDetailsSection'
import StatusMessage from '../components/StatusMessage'
import SubmitButton from '../components/SubmitButton'
import {
  cleanString,
  createInitialState,
  type FormState
} from '../api'

export default function ReimbursementRequestPage () {
  const { divisionKey } = useParams()
  const context = useMemo(
    () => getModuleContext('reimbursement-request', divisionKey),
    [divisionKey]
  )

  const [form, setForm] = useState<FormState>(createInitialState())
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

    const amountSpent = form.amountSpent.trim()
    const vendor = form.vendor.trim()
    const category = form.category.trim()
    const paymentMethod = form.paymentMethod.trim()
    const purpose = form.purpose.trim()

    if (!amountSpent) {
      setError('Amount spent is required.')
      setLoading(false)
      return
    }

    if (!form.purchaseDate) {
      setError('Purchase date is required.')
      setLoading(false)
      return
    }

    if (!vendor) {
      setError('Vendor / Store is required.')
      setLoading(false)
      return
    }

    if (!category) {
      setError('Category is required.')
      setLoading(false)
      return
    }

    if (!paymentMethod) {
      setError('Payment method is required.')
      setLoading(false)
      return
    }

    if (!purpose) {
      setError('What Was It For? is required.')
      setLoading(false)
      return
    }

    try {
      const token = getStoredToken()

      const res = await fetch(`${API_BASE}/api/reimbursement-requests`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          companyKey: context.companyKey,
          divisionKey: context.divisionKey,
          amountSpent,
          purchaseDate: form.purchaseDate,
          vendor,
          category,
          paymentMethod,
          purpose,
          tiedToJob: form.tiedToJob,
          jobNumber: form.tiedToJob ? cleanString(form.jobNumber) : null,
          notes: cleanString(form.notes),
          receiptUploaded: form.receiptUploaded,
          urgentReimbursementNeeded: form.urgentReimbursementNeeded
        })
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data?.error || 'Failed to submit reimbursement request.')
        return
      }

      setMessage('Reimbursement request submitted.')
      setForm(createInitialState())
    } catch {
      setError('Could not reach API.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <FieldLayout
      kicker='BossOS Field'
      title='Reimbursement Request'
      subtitle='Submit out-of-pocket field purchases for review and reimbursement.'
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
          <PurchaseSection form={form} update={update} />
          <ReimbursementDetailsSection form={form} update={update} />
          <JobNotesSection form={form} update={update} />
          <StatusMessage tone='success' message={message} />
          <StatusMessage tone='error' message={error} />
          <SubmitButton loading={loading} />
        </form>
      </div>
    </FieldLayout>
  )
}




