import { employmentLabel, formatPay, fmtDate } from './hiringJourney'

/** Read-only summary of an offer. */
export default function OfferTerms({ offer }) {
  if (!offer) return null
  const rows = [
    ['Role', offer.role],
    ['Type', employmentLabel(offer.employmentType)],
    ['Pay', formatPay(offer)],
    ['Hours per week', offer.hoursPerWeek],
    ['Schedule', offer.scheduleNotes],
    ['Start date', offer.startDate && fmtDate(offer.startDate)],
    ['Location', offer.location],
  ].filter(([, v]) => v !== undefined && v !== null && v !== '')

  return (
    <div className="hj-terms">
      <dl>
        {rows.map(([k, v]) => (
          <div key={k} className="hj-terms__row">
            <dt>{k}</dt>
            <dd>{v}</dd>
          </div>
        ))}
      </dl>
      {offer.message && <p className="hj-terms__msg">“{offer.message}”</p>}
      {offer.responseNote && <p className="hj-terms__msg">Response note: “{offer.responseNote}”</p>}
      {offer.declineReason && <p className="hj-terms__msg">Reason given: {offer.declineReason}</p>}
    </div>
  )
}
