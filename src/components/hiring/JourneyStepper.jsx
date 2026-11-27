import { FiCheck } from 'react-icons/fi'
import './hiring.css'
import { JOURNEY_STEPS, journeyPosition, useNow } from './hiringJourney'

/** Horizontal progress stepper. On narrow screens it collapses to "Step n of 7" plus a bar. */
export default function JourneyStepper({ req }) {
  const now = useNow()
  const { current, closed, complete } = journeyPosition(req, now)
  const total = JOURNEY_STEPS.length
  const pct = Math.round(((complete ? total : current + (closed ? 0 : 0.5)) / total) * 100)

  return (
    <div className={`hj-stepper${closed ? ' hj-stepper--closed' : ''}`} aria-label="Hiring progress">
      <ol className="hj-stepper__list">
        {JOURNEY_STEPS.map((label, i) => {
          const done = i < current || (complete && i === current)
          const isCurrent = i === current && !complete
          const cls = done ? 'is-done' : isCurrent ? (closed ? 'is-stopped' : 'is-current') : ''
          return (
            <li key={label} className={`hj-step ${cls}`} aria-current={isCurrent ? 'step' : undefined}>
              <span className="hj-step__dot">{done ? <FiCheck aria-hidden="true" /> : i + 1}</span>
              <span className="hj-step__label">{label}</span>
            </li>
          )
        })}
      </ol>
      <div className="hj-stepper__compact">
        <span>
          Step {Math.min(current + 1, total)} of {total}: {JOURNEY_STEPS[current]}
          {closed ? ' (closed)' : ''}
        </span>
        <div className="hj-bar"><div className="hj-bar__fill" style={{ width: `${pct}%` }} /></div>
      </div>
    </div>
  )
}
