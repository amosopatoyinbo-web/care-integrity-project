import { useState, useEffect } from 'react'

/* Shared helpers for the hiring journey UI (interview request -> hire). */

export const INTERVIEW_END_DELAY_MS = 30 * 60 * 1000

export const JOURNEY_STEPS = ['Request', 'Accepted', 'Scheduled', 'Interview', 'Decision', 'Offer', 'Hired']

/** Re-renders every `ms` so time-based gates unlock without a reload. */
export function useNow(ms = 60000) {
  const [now, setNow] = useState(() => Date.now())
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), ms)
    return () => clearInterval(t)
  }, [ms])
  return now
}

/** The server's `interviewEnded` flag, or the same 30-minute rule checked on the client clock. */
export function interviewEndedAt(req, now = Date.now()) {
  if (req?.interviewEnded) return true
  if (!req?.scheduledAt) return false
  const start = new Date(req.scheduledAt).getTime()
  return !Number.isNaN(start) && now >= start + INTERVIEW_END_DELAY_MS
}

const CLOSED = ['declined', 'withdrawn', 'cancelled', 'not_selected', 'offer_declined']

/** Where a request sits on the stepper. `current` is a step index; `closed` means the journey stopped there. */
export function journeyPosition(req, now = Date.now()) {
  const s = req?.status
  const closed = CLOSED.includes(s)
  let current = 0
  if (s === 'accepted') current = 1
  else if (s === 'scheduled') {
    if (!req.caregiverConfirmed) current = 2
    else current = interviewEndedAt(req, now) ? 4 : 3
  }
  else if (s === 'completed' || s === 'not_selected') current = 4
  else if (s === 'offer_sent' || s === 'offer_declined') current = 5
  else if (s === 'offer_accepted') current = 6
  else if (s === 'hired') current = 6
  return { current, closed, complete: s === 'hired' }
}

/** True when this user has something to do on the card. */
export function needsAction(req, role, now = Date.now()) {
  const s = req?.status
  if (role === 'agency') {
    if (s === 'accepted') return true
    if (s === 'scheduled' || s === 'completed') return interviewEndedAt(req, now)
    return s === 'offer_accepted'
  }
  if (s === 'pending' || s === 'offer_sent') return true
  return s === 'scheduled' && !req.caregiverConfirmed
}

const TAB_STATUSES = {
  all:       null,
  pending:   ['pending'],
  accepted:  ['accepted'],
  interviews:['scheduled', 'completed'],
  offers:    ['offer_sent', 'offer_accepted'],
  hired:     ['hired'],
  closed:    ['declined', 'not_selected', 'offer_declined'],
}

export const REQUEST_TAB_DEFS = [
  { key: 'all',        label: 'All' },
  { key: 'pending',    label: 'Pending' },
  { key: 'accepted',   label: 'Accepted' },
  { key: 'interviews', label: 'Interviews' },
  { key: 'offers',     label: 'Offers' },
  { key: 'hired',      label: 'Hired' },
  { key: 'closed',     label: 'Closed' },
]

export function matchesTab(key, req) {
  const list = TAB_STATUSES[key]
  return !list || list.includes(req.status)
}

export const EMPLOYMENT_TYPES = [
  { value: 'full_time', label: 'Full time' },
  { value: 'part_time', label: 'Part time' },
  { value: 'live_in',   label: 'Live-in' },
  { value: 'per_diem',  label: 'Per diem' },
]
export const PAY_UNITS = [
  { value: 'hour',  label: 'per hour' },
  { value: 'week',  label: 'per week' },
  { value: 'month', label: 'per month' },
  { value: 'year',  label: 'per year' },
]
export const CURRENCIES = ['USD', 'GBP', 'CAD', 'EUR']

export const employmentLabel = v => EMPLOYMENT_TYPES.find(t => t.value === v)?.label || v || ''

export function formatPay(offer) {
  if (!offer || offer.payRate == null) return ''
  const unit = PAY_UNITS.find(u => u.value === offer.payUnit)?.label || ''
  let amount = String(offer.payRate)
  try {
    amount = new Intl.NumberFormat('en-US', { style: 'currency', currency: offer.currency || 'USD' }).format(offer.payRate)
  } catch { /* unknown currency code: show the plain number */ }
  return `${amount} ${unit}`.trim()
}

export const fmtDate = d => new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
export const fmtDateTime = d => new Date(d).toLocaleString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit' })

/** Readable message from an API error (includes field errors from validation). */
export function errorMessage(err, fallback) {
  if (Array.isArray(err?.errors) && err.errors.length) {
    return err.errors.map(e => e.message).join(' ')
  }
  return err?.message || fallback
}
