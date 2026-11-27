import { useState } from 'react'
import { FiX } from 'react-icons/fi'
import { requestApi } from '../../lib/api'
import OfferTerms from './OfferTerms'
import { errorMessage } from './hiringJourney'

/** Caregiver view of the offer with Accept or Decline. */
export default function OfferReviewModal({ req, onClose, onUpdated }) {
  const [declining, setDeclining] = useState(false)
  const [note, setNote]           = useState('')
  const [reason, setReason]       = useState('')
  const [busy, setBusy]           = useState(false)
  const [error, setError]         = useState('')
  const agencyName = req.agencyId?.name || 'The agency'

  async function respond(action) {
    setBusy(true)
    setError('')
    const body = { action }
    if (note.trim()) body.note = note.trim()
    if (action === 'decline' && reason.trim()) body.declineReason = reason.trim()
    try {
      const updated = await requestApi.respondOffer(req._id, body)
      onUpdated(updated.data || updated)
      onClose()
    } catch (err) {
      setError(errorMessage(err, 'Could not send your response.'))
      setBusy(false)
    }
  }

  return (
    <div className="hj-overlay" role="dialog" aria-modal="true" aria-labelledby="hj-review-title" onClick={e => { if (e.target === e.currentTarget && !busy) onClose() }}>
      <div className="hj-modal">
        <div className="hj-modal__head">
          <h3 id="hj-review-title">Job offer from {agencyName}</h3>
          <button type="button" className="hj-icon-btn" onClick={onClose} aria-label="Close" disabled={busy}><FiX /></button>
        </div>
        <div className="hj-modal__body">
          <OfferTerms offer={req.offer} />

          {declining ? (
            <>
              <label className="hj-label" htmlFor="hj-reason">Reason (optional)</label>
              <input id="hj-reason" className="hj-input" maxLength={500} value={reason} onChange={e => setReason(e.target.value)} />
              <label className="hj-label" htmlFor="hj-dnote">Note to the agency (optional)</label>
              <textarea id="hj-dnote" className="hj-input" rows={3} maxLength={1000} value={note} onChange={e => setNote(e.target.value)} />
            </>
          ) : (
            <>
              <label className="hj-label" htmlFor="hj-anote">Note to the agency (optional)</label>
              <textarea id="hj-anote" className="hj-input" rows={2} maxLength={1000} value={note} onChange={e => setNote(e.target.value)} />
            </>
          )}
          {error && <p className="hj-error" role="alert">{error}</p>}
        </div>
        <div className="hj-modal__foot">
          {declining ? (
            <>
              <button className="btn btn-blue-outline btn-sm hj-tap" onClick={() => { setDeclining(false); setError('') }} disabled={busy}>Back</button>
              <button className="btn btn-sm hj-tap hj-btn-danger" onClick={() => respond('decline')} disabled={busy}>
                {busy ? 'Sending…' : 'Decline offer'}
              </button>
            </>
          ) : (
            <>
              <button className="btn btn-sm hj-tap hj-btn-danger-outline" onClick={() => setDeclining(true)} disabled={busy}>Decline</button>
              <button className="btn btn-green btn-sm hj-tap" onClick={() => respond('accept')} disabled={busy}>
                {busy ? 'Sending…' : 'Accept offer'}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
