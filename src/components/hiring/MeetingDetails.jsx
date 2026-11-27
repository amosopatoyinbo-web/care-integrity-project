import { useState } from 'react'
import { FiCalendar, FiVideo, FiLink } from 'react-icons/fi'
import { requestApi } from '../../lib/api'
import { fmtDateTime, errorMessage } from './hiringJourney'

/**
 * Scheduled time plus the join link, or a "link pending" state.
 * Agencies can paste their own link while the request is `scheduled`.
 */
export default function MeetingDetails({ req, role, onUpdated }) {
  const [editing, setEditing] = useState(false)
  const [link, setLink]       = useState('')
  const [busy, setBusy]       = useState(false)
  const [error, setError]     = useState('')

  const isAgency = role === 'agency'
  const canSetLink = isAgency && req.status === 'scheduled'
  const showLink = !!req.meetLink && (isAgency || req.caregiverConfirmed)

  async function saveLink() {
    const v = link.trim()
    if (!/^https:\/\//i.test(v)) {
      setError('The meeting link must start with https://')
      return
    }
    setBusy(true)
    setError('')
    try {
      const updated = await requestApi.setMeetingLink(req._id, { meetLink: v })
      onUpdated?.(updated.data || updated)
      setEditing(false)
      setLink('')
    } catch (err) {
      setError(errorMessage(err, 'Could not save the meeting link.'))
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="hj-meeting">
      <p className="hj-meeting__time">
        <FiCalendar aria-hidden="true" />
        <span>{req.scheduledAt ? fmtDateTime(req.scheduledAt) : 'Time to be confirmed'}</span>
      </p>

      {showLink ? (
        <a href={req.meetLink} target="_blank" rel="noopener noreferrer" className="btn btn-green btn-sm hj-tap">
          <FiVideo aria-hidden="true" /> Join Meeting
        </a>
      ) : (
        <p className="hj-pill hj-pill--wait">
          <FiLink aria-hidden="true" /> Meeting link pending
          {!isAgency && ' (the agency will add one)'}
        </p>
      )}

      {isAgency && req.meetLink && !req.caregiverConfirmed && (
        <p className="hj-hint">The caregiver receives this link after they confirm the time.</p>
      )}

      {canSetLink && !editing && (
        <button className="hj-link-btn" onClick={() => { setEditing(true); setError('') }}>
          {req.meetLink ? 'Replace meeting link' : 'Paste your own meeting link'}
        </button>
      )}
      {canSetLink && editing && (
        <div className="hj-inline-form">
          <label htmlFor={`hj-link-${req._id}`}>Meeting link (Zoom, Teams, Meet…)</label>
          <input
            id={`hj-link-${req._id}`}
            className="hj-input"
            type="url"
            placeholder="https://"
            value={link}
            onChange={e => setLink(e.target.value)}
          />
          <div className="hj-actions">
            <button className="btn btn-blue btn-sm hj-tap" onClick={saveLink} disabled={busy || !link.trim()}>
              {busy ? 'Saving…' : 'Save link'}
            </button>
            <button className="btn btn-blue-outline btn-sm hj-tap" onClick={() => { setEditing(false); setError('') }} disabled={busy}>
              Cancel
            </button>
          </div>
        </div>
      )}
      {error && <p className="hj-error">{error}</p>}
    </div>
  )
}
