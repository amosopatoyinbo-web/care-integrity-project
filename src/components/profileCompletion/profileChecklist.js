/* Profile completion checklists. Computed from the profile the dashboard already loads; no backend change.
   Each item: { key, label, hint, done, to?, tab? } — `to` is a route (edit page + section anchor),
   `tab` is a dashboard tab key. */

const has = v => (Array.isArray(v) ? v.length > 0 : typeof v === 'string' ? v.trim().length > 0 : v != null && v !== '')

export function caregiverChecklist(p) {
  if (!p) return []
  const edit = section => `/caregiver/profile/edit#${section}`
  return [
    { key: 'photo',      label: 'Add a profile photo',              hint: 'Profiles with a photo get more interview requests.', done: has(p.photoUrl), to: edit('sec-photo') },
    { key: 'basics',     label: 'Role, service area and experience', hint: 'Tell agencies what you do and where.',               done: has(p.role) && has(p.serviceArea) && has(p.yearsExp), to: edit('sec-role') },
    { key: 'bio',        label: 'Write your professional bio',      hint: 'A few sentences about your experience.',            done: has(p.bio), to: edit('sec-bio') },
    { key: 'philosophy', label: 'Share your care philosophy',       hint: 'How you approach caregiving.',                      done: has(p.carePhilosophy), to: edit('sec-philosophy') },
    { key: 'care',       label: 'Choose care types and settings',   hint: 'Pick at least one of each.',                        done: has(p.careTypes) && has(p.careSettings), to: edit('sec-caretypes') },
    { key: 'travel',     label: 'Set work areas and travel distance', hint: 'Where you are willing to work.',                  done: has(p.workAreas) && has(p.travelDistance), to: edit('sec-travel') },
    { key: 'creds',      label: 'Add a credential or training',     hint: 'Certifications build trust.',                       done: has(p.credentials), tab: 'credentials' },
    { key: 'employment', label: 'Add employment history',           hint: 'At least one past or current position.',            done: has(p.employment), tab: 'employment' },
  ]
}

export function agencyChecklist(a) {
  if (!a) return []
  const edit = section => `/agency/profile/edit#${section}`
  return [
    { key: 'logo',        label: 'Upload your logo',                 hint: 'Your logo appears on requests caregivers receive.', done: has(a.logoUrl), to: edit('sec-logo') },
    { key: 'details',     label: 'Organization name, type and location', hint: 'The basics caregivers look for.',             done: has(a.name) && has(a.orgType) && has(a.location), to: edit('sec-details') },
    { key: 'description', label: 'Describe your organization',       hint: 'Who you serve and what it is like to work with you.', done: has(a.description), to: edit('sec-description') },
    { key: 'care',        label: 'Care types and service areas',     hint: 'Pick at least one of each.',                       done: has(a.careTypes) && (has(a.serviceAreas) || has(a.serviceArea)), to: edit('sec-caretypes') },
    { key: 'more',        label: 'Website, year established and size', hint: 'Helps caregivers trust your organization.',     done: has(a.website) && has(a.yearEstablished) && has(a.size), to: edit('sec-website') },
  ]
}

export function progress(items) {
  const total = items.length
  const done = items.filter(i => i.done).length
  return { done, total, percent: total ? Math.round((done / total) * 100) : 100, next: items.find(i => !i.done) }
}

/* Per-user, per-device flags (no backend storage). */
const key = (userId, name) => `cip_pc_${name}_${userId || 'anon'}`
export const flags = {
  welcomeSeen:   id => localStorage.getItem(key(id, 'welcome')) === '1',
  setWelcomeSeen: id => localStorage.setItem(key(id, 'welcome'), '1'),
  cardDismissed: id => localStorage.getItem(key(id, 'done')) === '1',
  setCardDismissed: id => localStorage.setItem(key(id, 'done'), '1'),
  cardExpanded:  id => localStorage.getItem(key(id, 'open')) === '1',
  setCardExpanded: (id, open) => localStorage.setItem(key(id, 'open'), open ? '1' : '0'),
}

/* "New user" = profile created in the last 30 days. Profiles without a createdAt are treated as not new. */
export function isNewProfile(p, days = 30) {
  const t = p?.createdAt ? new Date(p.createdAt).getTime() : NaN
  return Number.isFinite(t) && Date.now() - t < days * 24 * 60 * 60 * 1000
}
