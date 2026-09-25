import { useState, useEffect, useRef } from 'react'
import { requestApi, agencyApi } from '../../lib/api'
import './InterviewRequestModal.css'

const REASONS = [
  'General Introduction',
  'Caregiving Opportunity',
  'Experience / Qualifications',
  'Availability',
  'Other',
]

export default function InterviewRequestModal({ caregiverName, caregiverId, onClose }) {
  const [form, setForm]     = useState({ org: '', contact: '', reason: '', message: '' })
  const [sent, setSent]     = useState(false)
  const [loading, setLoad]  = useState(false)
  const [error, setError]   = useState('')
  const firstRef = useRef()

  useEffect(() => {
    firstRef.current?.focus()
    document.body.style.overflow = 'hidden'

    // Pre-fill org name only if the viewer is an agency
    agencyApi.getMe().then(p => {
      if (p?.name) setForm(prev => ({ ...prev, org: p.name }))
    }).catch(() => {}) // silently ignore — caregiver/public viewers won't have an agency profile

    return () => { document.body.style.overflow = '' }
  }, [])

  function set(k, v) { setForm(p => ({ ...p, [k]: v })) }

  const canSend = form.org && form.contact && form.reason && form.message

  async function handleSend(e) {
    e.preventDefault()
    if (!caregiverId) { setError('Caregiver ID is missing.'); return }
    setLoad(true)
    setError('')
    try {
      await requestApi.send({
        caregiverId,
        contactPerson: form.contact,
        reason:        form.reason,
        message:       form.message,
      })
      setSent(true)
    } catch (err) {
      setError(err.message || 'Could not send request. Please try again.')
    } finally {
      setLoad(false)
    }
  }

  return (
    <div
      className="irm-overlay"
      role="dialog" aria-modal="true" aria-labelledby="irm-title"
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
    >
      <div className="irm-modal">
        <button className="irm-close" onClick={onClose} aria-label="Close">✕</button>

        {sent ? (
          <div className="irm-success">
            <div className="irm-success__icon" aria-hidden="true">✓</div>
            <h2 className="irm-success__heading">Request Sent</h2>
            <p className="irm-success__body">
              Your interview request has been sent to <strong>{caregiverName}</strong>.
              They will review it and respond at their discretion.
            </p>
            <button className="btn btn-blue" onClick={onClose}>Close</button>
          </div>
        ) : (
          <>
            <div className="irm-header">
              <h2 className="irm-title" id="irm-title">Request an Interview</h2>
              <p className="irm-sub">Connect with <strong>{caregiverName}</strong>. Your message will be shared with this caregiver.</p>
            </div>

            <form onSubmit={handleSend} className="irm-form" noValidate>
              <div className="irm-field">
                <label className="irm-label" htmlFor="irm-org">Organization <span aria-hidden="true">*</span></label>
                <input ref={firstRef} id="irm-org" className="irm-input" type="text" placeholder="Your organization name" value={form.org} onChange={e => set('org', e.target.value)} required />
              </div>
              <div className="irm-field">
                <label className="irm-label" htmlFor="irm-contact">Contact Person <span aria-hidden="true">*</span></label>
                <input id="irm-contact" className="irm-input" type="text" placeholder="Your name" value={form.contact} onChange={e => set('contact', e.target.value)} required />
              </div>
              <div className="irm-field">
                <label className="irm-label" htmlFor="irm-reason">Reason for Contact <span aria-hidden="true">*</span></label>
                <select id="irm-reason" className="irm-select" value={form.reason} onChange={e => set('reason', e.target.value)} required>
                  <option value="">Select a reason…</option>
                  {REASONS.map(r => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>
              <div className="irm-field">
                <label className="irm-label" htmlFor="irm-message">Message <span aria-hidden="true">*</span></label>
                <textarea id="irm-message" className="irm-textarea" rows={4} placeholder="Introduce yourself and describe the opportunity…" value={form.message} onChange={e => set('message', e.target.value)} required />
              </div>

              {error && <p className="irm-error" role="alert">{error}</p>}

              <div className="irm-privacy">
                <span aria-hidden="true">🔒</span>
                <span>The caregiver's personal contact information remains private. They decide whether to accept or decline.</span>
              </div>
              <div className="irm-actions">
                <button type="button" className="btn btn-blue-outline" onClick={onClose}>Cancel</button>
                <button type="submit" className="btn btn-green" disabled={!canSend || loading}>
                  {loading ? 'Sending…' : 'Send Request'}
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  )
}
