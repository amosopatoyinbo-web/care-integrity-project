import { useState } from 'react'
import MeetingDetails from './MeetingDetails'
import OfferReviewModal from './OfferReviewModal'
import OfferTerms from './OfferTerms'
import { Accordion } from './AgencyJourneyPanel'
import { interviewEndedAt, useNow, fmtDate } from './hiringJourney'

/** Caregiver-side stage block for confirmed interviews through hire. */
export default function CaregiverJourneyPanel({ req, onUpdated, onOpenEmployment }) {
  const now = useNow()
  const [reviewOpen, setReviewOpen] = useState(false)
  const s = req.status
  const agency = req.agencyId?.orgName || req.agencyId?.name || 'the agency'
  const ended = interviewEndedAt(req, now)
  const confirmedInterview = (s === 'scheduled' && req.caregiverConfirmed) || s === 'completed'

  return (
    <div className="hj-panel">
      {confirmedInterview && (
        <>
          <Accordion title="Interview details" defaultOpen={!ended}>
            <MeetingDetails req={req} role="caregiver" />
            {!ended && <p className="hj-hint">Check your email for reminders before the interview.</p>}
          </Accordion>
          {ended && <div className="hj-note">Interview finished. Waiting for {agency} to decide on the next step.</div>}
        </>
      )}

      {s === 'not_selected' && (
        <div className="hj-note hj-note--closed">{agency} decided not to move forward this time. Thank you for interviewing.</div>
      )}

      {s === 'offer_sent' && (
        <div className="hj-prompt">
          <h4>You have a job offer</h4>
          <p>{agency} sent you an offer{req.offer?.role ? ` for ${req.offer.role}` : ''}. Review the terms and respond.</p>
          <div className="hj-actions">
            <button className="btn btn-green btn-sm hj-tap" onClick={() => setReviewOpen(true)}>Review Offer</button>
          </div>
        </div>
      )}

      {s === 'offer_declined' && (
        <>
          <div className="hj-note hj-note--closed">You declined this offer.</div>
          <Accordion title="Offer details"><OfferTerms offer={req.offer} /></Accordion>
        </>
      )}

      {s === 'offer_accepted' && (
        <>
          <div className="hj-note hj-note--good">You accepted the offer. Waiting for {agency} to confirm your hire.</div>
          <Accordion title="Offer details"><OfferTerms offer={req.offer} /></Accordion>
        </>
      )}

      {s === 'hired' && (
        <>
          <div className="hj-note hj-note--good">
            Congratulations! You have been hired by <strong>{agency}</strong>{req.hiredAt ? ` on ${fmtDate(req.hiredAt)}` : ''}.
            {onOpenEmployment && (
              <div><button className="hj-link-btn" onClick={onOpenEmployment}>View Employment History →</button></div>
            )}
          </div>
          {req.offer && <Accordion title="Offer details"><OfferTerms offer={req.offer} /></Accordion>}
        </>
      )}

      {reviewOpen && <OfferReviewModal req={req} onClose={() => setReviewOpen(false)} onUpdated={onUpdated} />}
    </div>
  )
}
