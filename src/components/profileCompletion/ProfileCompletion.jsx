import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { FiCheck, FiChevronRight, FiChevronDown, FiX } from 'react-icons/fi'
import { progress, flags } from './profileChecklist'
import './ProfileCompletion.css'

/* One checklist row: a link to an edit section, or a button that opens a dashboard tab. */
function ItemAction({ item, onTab, onClick, className, children }) {
  if (item.to) return <Link to={item.to} className={className} onClick={onClick}>{children}</Link>
  return <button type="button" className={className} onClick={() => { onClick?.(); onTab?.(item.tab) }}>{children}</button>
}

/* "Complete your profile" card for the dashboard Overview. */
export function ProfileCompletionCard({ items, userId, onTab, title = 'Complete your profile' }) {
  const { done, total, percent, next } = progress(items)
  const [dismissed, setDismissed] = useState(() => flags.cardDismissed(userId))
  // Collapsed by default; the user's choice is remembered on this device.
  const [expanded, setExpanded] = useState(() => flags.cardExpanded(userId))
  if (!items.length) return null
  const complete = done === total
  if (complete && dismissed) return null
  const listId = `pc-list-${userId || 'me'}`

  function toggle() {
    setExpanded(v => { flags.setCardExpanded(userId, !v); return !v })
  }

  return (
    <section className={`pc-card${complete ? ' pc-card--complete' : ''}${expanded ? ' is-open' : ''}`} aria-label="Profile completion">
      <div className="pc-card__head">
        {complete ? (
          <div>
            <h2 className="pc-card__title">Profile complete ✓</h2>
            <p className="pc-card__sub">Great work. Your full profile is now visible.</p>
          </div>
        ) : (
          <button type="button" className="pc-card__toggle" onClick={toggle} aria-expanded={expanded} aria-controls={listId}>
            <span className="pc-card__toggle-text">
              <span className="pc-card__title">{title}</span>
              <span className="pc-card__sub">{done} of {total} steps done</span>
            </span>
            <span className="pc-card__percent">{percent}%</span>
            <FiChevronDown className="pc-card__chevron" aria-hidden="true" />
            <span className="pc-sr">{expanded ? 'Hide steps' : 'Show all steps'}</span>
          </button>
        )}
        {complete && (
          <button type="button" className="pc-card__close" aria-label="Dismiss" onClick={() => { flags.setCardDismissed(userId); setDismissed(true) }}><FiX /></button>
        )}
      </div>
      <div className="pc-bar" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={percent}>
        <span className="pc-bar__fill" style={{ width: `${percent}%` }} />
      </div>

      {/* Collapsed: only the next step */}
      {!complete && !expanded && next && (
        <div className="pc-next">
          <span className="pc-next__label"><span className="pc-next__tag">Next</span>{next.label}</span>
          <ItemAction item={next} onTab={onTab} className="pc-item__btn">
            Add <FiChevronRight aria-hidden="true" />
          </ItemAction>
        </div>
      )}

      {!complete && expanded && (
        <ul className="pc-list" id={listId}>
          {items.map(item => (
            <li key={item.key} className={`pc-item${item.done ? ' pc-item--done' : ''}`}>
              <span className="pc-item__check" aria-hidden="true">{item.done ? <FiCheck /> : null}</span>
              <span className="pc-item__text">
                <span className="pc-item__label">{item.label}</span>
                {!item.done && <span className="pc-item__hint">{item.hint}</span>}
              </span>
              {!item.done && (
                <ItemAction item={item} onTab={onTab} className="pc-item__btn">
                  Add <FiChevronRight aria-hidden="true" />
                </ItemAction>
              )}
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}

/* First-login welcome pop-up for new users with an incomplete profile. Shown once per user per device. */
export function WelcomeGuide({ items, userId, show, heading, intro, onTab }) {
  const [open, setOpen] = useState(false)
  const { done, total, next } = progress(items)

  useEffect(() => {
    if (show && items.length && done < total && !flags.welcomeSeen(userId)) setOpen(true)
  }, [show, items.length, done, total, userId])

  useEffect(() => {
    if (!open) return
    const onKey = e => { if (e.key === 'Escape') close() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  function close() { flags.setWelcomeSeen(userId); setOpen(false) }
  if (!open) return null
  const missing = items.filter(i => !i.done)

  return (
    <div className="pc-modal" role="dialog" aria-modal="true" aria-labelledby="pc-modal-title">
      <div className="pc-modal__backdrop" onClick={close} />
      <div className="pc-modal__box">
        <button type="button" className="pc-modal__x" aria-label="Close" onClick={close}><FiX /></button>
        <h2 id="pc-modal-title" className="pc-modal__title">{heading}</h2>
        <p className="pc-modal__intro">{intro}</p>
        <p className="pc-modal__count">{missing.length} {missing.length === 1 ? 'step' : 'steps'} left:</p>
        <ul className="pc-modal__list">
          {missing.slice(0, 6).map(i => <li key={i.key}>{i.label}</li>)}
          {missing.length > 6 && <li>and {missing.length - 6} more</li>}
        </ul>
        <div className="pc-modal__actions">
          {next && (
            <ItemAction item={next} onClick={close} onTab={onTab} className="btn btn-green pc-modal__start">
              Start: {next.label}
            </ItemAction>
          )}
          <button type="button" className="btn btn-outline pc-modal__later" onClick={close}>I'll do it later</button>
        </div>
      </div>
    </div>
  )
}
