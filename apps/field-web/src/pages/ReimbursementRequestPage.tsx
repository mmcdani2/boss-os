import { useState } from 'react'
import { Link } from 'react-router-dom'
import FieldLayout from '../components/FieldLayout'
import { API_BASE, getStoredToken } from '../lib/auth'
import JobNotesSection from './reimbursement-log/JobNotesSection'
import PurchaseSection from './reimbursement-log/PurchaseSection'
import ReimbursementDetailsSection from './reimbursement-log/ReimbursementDetailsSection'
import StatusMessage from './reimbursement-log/StatusMessage'
import SubmitButton from './reimbursement-log/SubmitButton'
import {
  cleanString,
  createInitialState,
  type FormState
} from '../lib/reimbursement-form'

export default function ReimbursementRequestPage () {
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
          companyKey: 'urban-mechanical',
          divisionKey: 'hvac',
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
            to='/division/hvac'
            className='inline-flex rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-white/80 transition hover:bg-white/10 hover:text-white'
          >
            Back to HVAC Modules
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
