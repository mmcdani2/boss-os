import { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import FieldLayout from '../components/FieldLayout'
import { API_BASE, getStoredToken } from '../lib/auth'
import { getModuleContext } from '../lib/getModuleContext'
import AreaMaterialLineCard from './spray-foam-job-log/AreaMaterialLineCard'
import JobHeaderSection from './spray-foam-job-log/JobHeaderSection'
import StatusMessage from './spray-foam-job-log/StatusMessage'
import SubmitButton from './spray-foam-job-log/SubmitButton'
import SuccessPrompt from './spray-foam-job-log/SuccessPrompt'
import TotalsSection from './spray-foam-job-log/TotalsSection'
import {
  buildNormalizedAreaLines,
  buildNormalizedMaterialLines,
  buildSprayFoamTotals,
  cleanString,
  createInitialState,
  emptyAreaLine,
  emptyMaterialLine,
  type AreaLine,
  type FormState,
  type MaterialLine
} from '../lib/spray-foam-job-log-form'

export default function SprayFoamJobLogPage () {
  const navigate = useNavigate()
  const context = useMemo(
    () => getModuleContext('spray-foam-job-log'),
    []
  )

  const [form, setForm] = useState<FormState>(createInitialState)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [showSuccessPrompt, setShowSuccessPrompt] = useState(false)

  const totals = useMemo(() => buildSprayFoamTotals(form), [form])

  function updateField<K extends keyof FormState> (key: K, value: FormState[K]) {
    setForm(prev => ({ ...prev, [key]: value }))
  }

  function updateAreaLine (index: number, key: keyof AreaLine, value: string) {
    setForm(prev => ({
      ...prev,
      areaLines: prev.areaLines.map((line, i) =>
        i === index ? { ...line, [key]: value } : line
      )
    }))
  }

  function updateMaterialLine (
    index: number,
    key: keyof MaterialLine,
    value: string
  ) {
    setForm(prev => ({
      ...prev,
      materialLines: prev.materialLines.map((line, i) =>
        i === index ? { ...line, [key]: value } : line
      )
    }))
  }

  function addAreaLine () {
    setForm(prev => ({
      ...prev,
      areaLines: [...prev.areaLines, emptyAreaLine()],
      materialLines: [...prev.materialLines, emptyMaterialLine()]
    }))
  }

  function removeAreaLine (index: number) {
    setForm(prev => {
      if (prev.areaLines.length === 1) {
        return prev
      }

      return {
        ...prev,
        areaLines: prev.areaLines.filter((_, i) => i !== index),
        materialLines: prev.materialLines.filter((_, i) => i !== index)
      }
    })
  }

  function handleSubmitAnotherLog () {
    setForm(createInitialState())
    setMessage('')
    setError('')
    setShowSuccessPrompt(false)
  }

  function handleReturnToModules () {
    setShowSuccessPrompt(false)
    navigate(context.returnPath)
  }

  async function handleSubmit (e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setMessage('')
    setError('')
    setShowSuccessPrompt(false)

    const normalizedAreaLines = buildNormalizedAreaLines(form)

    if (normalizedAreaLines.length === 0) {
      setError('Add at least one area line.')
      setLoading(false)
      return
    }

    const invalidAreaLine = normalizedAreaLines.find(
      line =>
        !line.areaName ||
        !line.applicationType ||
        !line.foamType ||
        !line.squareFeet ||
        !line.averageThicknessIn
    )

    if (invalidAreaLine) {
      setError(
        'Each area line needs area name, application type, foam type, square feet, and average thickness.'
      )
      setLoading(false)
      return
    }

    const normalizedMaterialLines = buildNormalizedMaterialLines(form)

    if (normalizedMaterialLines.length === 0) {
      setError('Add at least one material line.')
      setLoading(false)
      return
    }

    const invalidMaterialLine = normalizedMaterialLines.find(
      line =>
        !line.manufacturer ||
        !line.lotNumber ||
        !line.setsUsed ||
        !line.theoreticalYieldPerSet
    )

    if (invalidMaterialLine) {
      setError(
        'Each material line needs manufacturer, lot number, sets used, and theoretical yield per set.'
      )
      setLoading(false)
      return
    }

    try {
      const token = getStoredToken()

      const res = await fetch(`${API_BASE}/api/spray-foam-logs`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          companyKey: context.companyKey,
          divisionKey: context.divisionKey,
          jobDate: cleanString(form.jobDate),
          customerName: cleanString(form.customerName),
          jobNumber: cleanString(form.jobNumber),
          crewLead: cleanString(form.crewLead),
          helpersText: cleanString(form.helpersText),
          rigName: cleanString(form.rigName),
          timeOnJob: cleanString(form.timeOnJob),
          ambientTempF: form.ambientTempF.trim() || null,
          substrateTempF: form.substrateTempF.trim() || null,
          humidityPercent: form.humidityPercent.trim() || null,
          downtimeMinutes: form.downtimeMinutes.trim() || null,
          downtimeReason: cleanString(form.downtimeReason),
          otherNotes: cleanString(form.otherNotes),
          photosUploadedToHcp: form.photosUploadedToHcp,
          areaLines: normalizedAreaLines,
          materialLines: normalizedMaterialLines
        })
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data?.error || 'Failed to submit spray foam job log.')
        return
      }

      setMessage('Spray foam job log submitted.')
      setShowSuccessPrompt(true)
    } catch {
      setError('Could not reach API.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <FieldLayout
      kicker='BossOS Field'
      title='New Spray Foam Job Log'
      subtitle='Log one job, its sprayed areas, and the material usage tied to those areas.'
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
          <JobHeaderSection form={form} updateField={updateField} />

          {form.areaLines.map((line, index) => (
            <AreaMaterialLineCard
              key={index}
              index={index}
              line={line}
              material={form.materialLines[index]}
              lineCount={form.areaLines.length}
              updateAreaLine={updateAreaLine}
              updateMaterialLine={updateMaterialLine}
              removeAreaLine={removeAreaLine}
            />
          ))}

          <button
            type='button'
            onClick={addAreaLine}
            className='h-14 rounded-2xl border border-white/10 bg-white/5 px-5 text-base font-black text-white transition hover:bg-white/10'
          >
            Add Another Area
          </button>

          <TotalsSection totals={totals} />
          <StatusMessage tone='success' message={message} />
          <StatusMessage tone='error' message={error} />
          <SubmitButton loading={loading} />
        </form>
      </div>

      <SuccessPrompt
        open={showSuccessPrompt}
        onSubmitAnother={handleSubmitAnotherLog}
        onReturnToModules={handleReturnToModules}
      />
    </FieldLayout>
  )
}