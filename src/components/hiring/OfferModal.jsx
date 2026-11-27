import { useState } from 'react'
import { FiX } from 'react-icons/fi'
import { requestApi } from '../../lib/api'
import { EMPLOYMENT_TYPES, PAY_UNITS, CURRENCIES, errorMessage } from './hiringJourney'

const pad = n => String(n).padStart(2, '0')
const toDateInput = d => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`

/** Agency job offer form (also used to revise an offer that is still open). */
export default function OfferModal({ req, onClose, onUpdated }) {
  const existing = req.offer || {}
  const today = toDateInput(new Date())
  const [form, setForm] = useState({
    role:           existing.role || req.caregiverId?.role || '',
    employmentType: existing.employmentType || 'full_time',
    payRate:        existing.payRate ?? '',
    payUnit:        existing.payUnit || 'hour',
    currency:       existing.currency || 'USD',
    hoursPerWeek:   existing.hoursPerWeek ?? '',
    scheduleNotes:  existing.scheduleNotes || '',
    startDate:      existing.startDate ? toDateInput(new Date(existing.startDate)) : '',
    location:       existing.location || '',
    message:        existing.message || '',
  })
  const [busy, setBusy]   = useState(false)
  const [error, setError] = useState('')
  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }))
  const revising = req.status === 'offer_sent'
  const name = req.caregiverId?.fullName || 'the caregiver'

  async function submit(e) {
    e.preventDefault()
    setError('')
    const rate = Number(form.payRate)
    if (!form.role.trim() || !form.location.trim() || !form.startDate || !(rate > 0)) {
      setError('Please fill in the role, pay rate, start date and location.')
      return
    }
    if (form.startDate < today) {
      setError('The start date must be today or later.')
      return
    }
    const payload = {
      role: form.role.trim(),
      employmentType: form.employmentType,
      payRate: rate,
      payUnit: form.payUnit,
      currency: form.currency,
      startDate: form.startDate,
      location: form.location.trim(),
    }
    if (form.hoursPerWeek !== '' && Number(form.hoursPerWeek) > 0) payload.hoursPerWeek = Number(form.hoursPerWeek)
    if (form.scheduleNotes.trim()) payload.scheduleNotes = form.scheduleNotes.trim()
    if (form.message.trim()) payload.message = form.message.trim()

    setBusy(true)
    try {
      const updated = await requestApi.sendOffer(req._id, payload)
      onUpdated(updated.data || updated)
      onClose()
    } catch (err) {
      setError(errorMessage(err, 'Could not send the offer.'))
      setBusy(false)
    }
  }

  return (
    <div className="hj-overlay" role="dialog" aria-modal="true" aria-labelledby="hj-offer-title" onClick={e => { if (e.target === e.currentTarget && !busy) onClose() }}>
      <form className="hj-modal" onSubmit={submit}>
        <div className="hj-modal__head">
          <h3 id="hj-offer-title">{revising ? 'Edit job offer' : 'Make a job offer'}</h3>
          <button type="button" className="hj-icon-btn" onClick={onClose} aria-label="Close" disabled={busy}><FiX /></button>
        </div>
        <div className="hj-modal__body">
          <p className="hj-hint">Offer for {name}. {revising ? 'Saving sends the updated offer to the caregiver.' : 'The caregiver can accept or decline.'}</p>

          <label className="hj-label" htmlFor="hj-role">Role *</label>
          <input id="hj-role" className="hj-input" value={form.role} onChange={set('role')} maxLength={120} required />

          <div className="hj-row">
            <div>
              <label className="hj-label" htmlFor="hj-type">Employment type *</label>
              <select id="hj-type" className="hj-input" value={form.employmentType} onChange={set('employmentType')}>
                {EMPLOYMENT_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
              </select>
            </div>
            <div>
              <label className="hj-label" htmlFor="hj-hours">Hours per week</label>
              <input id="hj-hours" className="hj-input" type="number" min="1" max="168" value={form.hoursPerWeek} onChange={set('hoursPerWeek')} />
            </div>
          </div>

          <div className="hj-row hj-row--3">
            <div>
              <label className="hj-label" htmlFor="hj-rate">Pay rate *</label>
              <input id="hj-rate" className="hj-input" type="number" min="0" step="0.01" value={form.payRate} onChange={set('payRate')} required />
            </div>
            <div>
              <label className="hj-label" htmlFor="hj-unit">Per</label>
              <select id="hj-unit" className="hj-input" value={form.payUnit} onChange={set('payUnit')}>
                {PAY_UNITS.map(u => <option key={u.value} value={u.value}>{u.label}</option>)}
              </select>
            </div>
            <div>
              <label className="hj-label" htmlFor="hj-cur">Currency</label>
              <select id="hj-cur" className="hj-input" value={form.currency} onChange={set('currency')}>
                {CURRENCIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>

          <div className="hj-row">
            <div>
              <label className="hj-label" htmlFor="hj-start">Start date *</label>
              <input id="hj-start" className="hj-input" type="date" min={today} value={form.startDate} onChange={set('startDate')} required />
            </div>
            <div>
              <label className="hj-label" htmlFor="hj-loc">Work location *</label>
              <input id="hj-loc" className="hj-input" value={form.location} onChange={set('location')} maxLength={200} required />
            </div>
          </div>

          <label className="hj-label" htmlFor="hj-sched">Schedule notes</label>
          <textarea id="hj-sched" className="hj-input" rows={2} maxLength={1000} value={form.scheduleNotes} onChange={set('scheduleNotes')} placeholder="For example: Mon to Fri, 8am to 4pm" />

          <label className="hj-label" htmlFor="hj-msg">Personal message</label>
          <textarea id="hj-msg" className="hj-input" rows={3} maxLength={2000} value={form.message} onChange={set('message')} />

          {error && <p className="hj-error" role="alert">{error}</p>}
        </div>
        <div className="hj-modal__foot">
          <button type="button" className="btn btn-blue-outline btn-sm hj-tap" onClick={onClose} disabled={busy}>Cancel</button>
          <button type="submit" className="btn btn-blue btn-sm hj-tap" disabled={busy}>
            {busy ? 'Sending…' : revising ? 'Send updated offer' : 'Send offer'}
          </button>
        </div>
      </form>
    </div>
  )
}
