import { useState } from 'react'
import { FiChevronDown } from 'react-icons/fi'
import { requestApi } from '../../lib/api'
import MeetingDetails from './MeetingDetails'
import OfferModal from './OfferModal'
import OfferTerms from './OfferTerms'
import { interviewEndedAt, useNow, fmtDate, fmtDateTime, errorMessage } from './hiringJourney'

export function Accordion({ title, defaultOpen = false, children }) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div className={`hj-acc${open ? ' is-open' : ''}`}>
      <button className="hj-acc__head" aria-expanded={open} onClick={() => setOpen(o => !o)}>
        <span>{title}</span>
        <FiChevronDown aria-hidden="true" />
      </button>
      {open && <div className="hj-acc__body">{children}</div>}
    </div>
  )
}

/** Agency-side stage block for scheduled interviews through hire. */
export default function AgencyJourneyPanel({ req, onUpdated }) {
  const now = useNow()
  const [offerOpen, setOfferOpen]     = useState(false)
  const [hireConfirm, setHireConfirm] = useState(false)
  const [passConfirm, setPassConfirm] = useState(false)
  const [busy, setBusy]               = useState(false)
  const [error, setError]             = useState('')
  const name = req.caregiverId?.fullName || 'this caregiver'
  const ended = interviewEndedAt(req, now)
  const s = req.status
  const inInterview = s === 'scheduled' || s === 'completed'

  async function run(fn, after) {
    setBusy(true)
    setError('')
    try {
      const updated = await fn()
      onUpdated(updated.data || updated)
      after?.()
    } catch (err) {
      setError(errorMessage(err, 'Something went wrong. Please try again.'))
    } finally {
      setBusy(false)
    }
  }

  const confirmHire  = () => run(() => requestApi.hire(req._id), () => setHireConfirm(false))
  const notSelected  = () => run(() => requestApi.notSelected(req._id), () => setPassConfirm(false))

  return (
    <div className="hj-panel">
      {inInterview && (
        <>
          <Accordion title="Interview details" defaultOpen={!ended}>
            <MeetingDetails req={req} role="agency" onUpdated={onUpdated} />
            {s === 'scheduled' && (
              <p className="hj-hint">
                {req.caregiverConfirmed ? 'The caregiver confirmed this time.' : 'Waiting for the caregiver to confirm this time.'}
              </p>
            )}
          </Accordion>

          {!ended ? (
            <div className="hj-note">
              <p>The hire decision opens after the interview.</p>
              <button className="btn btn-blue btn-sm hj-tap" disabled title="Available after the interview time has passed">
                Confirm Hire
              </button>
            </div>
          ) : (
            <div className="hj-prompt">
              <h4>Proceed with this candidate?</h4>
              <p>The interview with {name} has ended. Would you like to move forward with a job offer?</p>
              {!passConfirm ? (
                <div className="hj-actions">
                  <button className="btn btn-green btn-sm hj-tap" onClick={() => setOfferOpen(true)} disabled={busy}>Yes, make an offer</button>
                  <button className="btn btn-blue-outline btn-sm hj-tap" onClick={() => setPassConfirm(true)} disabled={busy}>Not a fit</button>
                </div>
              ) : (
                <div className="hj-confirm">
                  <span>Close this request without an offer? {name} will be told politely.</span>
                  <div className="hj-actions">
                    <button className="btn btn-blue btn-sm hj-tap" onClick={notSelected} disabled={busy}>{busy ? 'Saving…' : 'Yes, close it'}</button>
                    <button className="btn btn-blue-outline btn-sm hj-tap" onClick={() => setPassConfirm(false)} disabled={busy}>Cancel</button>
                  </div>
                </div>
              )}
            </div>
          )}
        </>
      )}

      {s === 'not_selected' && (
        <div className="hj-note hj-note--closed">
          You decided not to move forward with {name}{req.decisionAt ? ` on ${fmtDate(req.decisionAt)}` : ''}.
        </div>
      )}

      {s === 'offer_sent' && (
        <>
          <div className="hj-note">
            <p>Offer sent{req.offer?.sentAt ? ` on ${fmtDate(req.offer.sentAt)}` : ''}. Waiting for {name} to respond.</p>
            <button className="btn btn-blue-outline btn-sm hj-tap" onClick={() => setOfferOpen(true)}>Edit offer</button>
          </div>
          <Accordion title="Offer details"><OfferTerms offer={req.offer} /></Accordion>
        </>
      )}

      {s === 'offer_declined' && (
        <>
          <div className="hj-note hj-note--closed">{name} declined the offer.</div>
          <Accordion title="Offer details" defaultOpen><OfferTerms offer={req.offer} /></Accordion>
        </>
      )}

      {s === 'offer_accepted' && (
        <>
          <div className="hj-prompt hj-prompt--good">
            <h4>{name} accepted your offer</h4>
            <p>Confirm the hire to complete the process.</p>
            {!hireConfirm ? (
              <div className="hj-actions">
                <button className="btn btn-blue btn-sm hj-tap" onClick={() => setHireConfirm(true)}>Confirm Hire</button>
              </div>
            ) : (
              <div className="hj-confirm">
                <span>Confirm that you want to hire {name}?</span>
                <div className="hj-actions">
                  <button className="btn btn-blue btn-sm hj-tap" onClick={confirmHire} disabled={busy}>{busy ? 'Hiring…' : 'Yes, Confirm Hire'}</button>
                  <button className="btn btn-blue-outline btn-sm hj-tap" onClick={() => setHireConfirm(false)} disabled={busy}>Cancel</button>
                </div>
              </div>
            )}
          </div>
          <Accordion title="Offer details"><OfferTerms offer={req.offer} /></Accordion>
        </>
      )}

      {s === 'hired' && (
        <>
          <div className="hj-note hj-note--good">
            Hired{req.hiredAt ? ` on ${fmtDate(req.hiredAt)}` : ''}.
          </div>
          {req.offer && <Accordion title="Offer details"><OfferTerms offer={req.offer} /></Accordion>}
          {req.scheduledAt && <Accordion title="Interview details"><p className="hj-hint">{fmtDateTime(req.scheduledAt)}</p></Accordion>}
        </>
      )}

      {error && <p className="hj-error" role="alert">{error}</p>}
      {offerOpen && <OfferModal req={req} onClose={() => setOfferOpen(false)} onUpdated={onUpdated} />}
    </div>
  )
}
