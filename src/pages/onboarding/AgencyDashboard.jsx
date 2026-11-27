import { useState, useEffect, useCallback } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import {
  FiSearch, FiUsers, FiCalendar, FiCheckSquare, FiAward, FiFileText,
  FiMenu, FiX, FiUpload, FiVideo, FiLink,
} from 'react-icons/fi'
import { agencyApi, requestApi, recognitionApi, verificationApi, accountabilityApi, caregiverApi, uploadApi, auth, authApi } from '../../lib/api'
import ProfileAvatar from '../../components/ProfileAvatar'
import SubNav from '../../components/SubNav'
import { homePath } from '../../lib/navTrail'
import './AgencyDashboard.css'
import { fixMojibake } from '../../lib/fixText'
import JourneyStepper from '../../components/hiring/JourneyStepper'
import AgencyJourneyPanel from '../../components/hiring/AgencyJourneyPanel'
import { REQUEST_TAB_DEFS, matchesTab, needsAction } from '../../components/hiring/hiringJourney'
import { ProfileCompletionCard, WelcomeGuide } from '../../components/profileCompletion/ProfileCompletion'
import { agencyChecklist, progress, isNewProfile } from '../../components/profileCompletion/profileChecklist'

/* ── Helpers ─────────────────────────────────────────── */
const pad = n => String(n).padStart(2, '0')
/** Local-time value for <input type="datetime-local">, offset by `hours` from now. */
function localInputValue(date) {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`
}
const minScheduleValue = () => localInputValue(new Date(Date.now() + 60 * 60 * 1000))
const fmtDate = d => new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
const fmtDateTime = d => new Date(d).toLocaleString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit' })
const isHttpUrl = v => { try { const u = new URL(v); return u.protocol === 'http:' || u.protocol === 'https:' } catch { return false } }

/* ── Badges ──────────────────────────────────────────── */
const REQ_STATUS = {
  pending:  { label: 'Pending',   cls: 'adb-badge--pending'  },
  accepted: { label: 'Accepted',  cls: 'adb-badge--accepted' },
  declined: { label: 'Declined',  cls: 'adb-badge--declined' },
  withdrawn:{ label: 'Withdrawn', cls: 'adb-badge--grey'     },
  scheduled:{ label: 'Scheduled', cls: 'adb-badge--accepted' },
  completed:{ label: 'Completed', cls: 'adb-badge--review'   },
  hired:    { label: 'Hired',     cls: 'adb-badge--accepted' },
  offer_sent:     { label: 'Offer Sent',     cls: 'adb-badge--review'   },
  offer_accepted: { label: 'Offer Accepted', cls: 'adb-badge--accepted' },
  offer_declined: { label: 'Offer Declined', cls: 'adb-badge--declined' },
  not_selected:   { label: 'Not Selected',   cls: 'adb-badge--grey'     },
}
function RequestBadge({ status }) {
  const s = REQ_STATUS[status] || REQ_STATUS.pending
  return <span className={`adb-badge ${s.cls}`}>{s.label}</span>
}

const VERIF_STATUS = {
  pending:            { label: 'Verification Pending',            cls: 'adb-badge--pending'  },
  under_review:       { label: 'Under Review',                    cls: 'adb-badge--review'   },
  verified:           { label: 'Verified',                        cls: 'adb-badge--accepted' },
  attention_required: { label: 'Verification Requires Attention', cls: 'adb-badge--declined' },
}
function VerifBadge({ status }) {
  const s = VERIF_STATUS[status] || VERIF_STATUS.pending
  return <span className={`adb-badge ${s.cls}`}>{s.label}</span>
}

/* ── Interview request card ──────────────────────────── */
function AgencyRequestCard({ req, onUpdated }) {
  const [scheduling, setScheduling]   = useState(false)
  const [when, setWhen]               = useState('')
  const [busy, setBusy]               = useState(false)
  const [error, setError]             = useState('')

  const cg = req.caregiverId || {}

  async function schedule(isoValue) {
    setBusy(true)
    setError('')
    try {
      const updated = await requestApi.schedule(req._id, { scheduledAt: isoValue })
      onUpdated(updated.data || updated)
      setScheduling(false)
      setWhen('')
    } catch (err) {
      setError(err.message || 'Failed to schedule interview')
    } finally {
      setBusy(false)
    }
  }

  function submitSchedule() {
    if (!when) return
    const d = new Date(when)
    if (isNaN(d.getTime()) || d.getTime() < Date.now() + 60 * 60 * 1000) {
      setError('Please choose a time at least one hour from now.')
      return
    }
    schedule(d.toISOString())
  }

  return (
    <div className="adb-req-card">
      <div className="adb-req-card__main">
        <ProfileAvatar photoUrl={cg.photoUrl} fullName={cg.fullName} size="small" alt={cg.fullName || 'Caregiver'} />
        <div className="adb-req-card__body">
          <div className="adb-req-card__name">{cg.fullName || 'Caregiver'}</div>
          {cg.role && <div className="adb-req-card__role">{cg.role}</div>}
          <div className="adb-req-card__meta">{req.reason} · Sent {fmtDate(req.createdAt)}</div>
          {req.caregiverResponse && <div className="adb-caregiver-response">{req.caregiverResponse}</div>}
        </div>
        <div className="adb-req-card__side">
          <RequestBadge status={req.status} />
        </div>
      </div>

      {req.status === 'accepted' && req.caregiverProposedTime && !scheduling && (
        <div className="adb-proposal">
          <div>
            <strong>Caregiver suggested:</strong> {fmtDateTime(req.caregiverProposedTime)}
            {req.caregiverProposedNote && <div className="adb-proposal__note">"{req.caregiverProposedNote}"</div>}
          </div>
          <button
            className="btn btn-green btn-sm"
            disabled={busy}
            onClick={() => schedule(new Date(req.caregiverProposedTime).toISOString())}
          >
            {busy ? 'Scheduling…' : 'Use this time'}
          </button>
        </div>
      )}

      {req.status === 'accepted' && !scheduling && (
        <div className="adb-req-card__actions">
          <button className="btn btn-blue btn-sm adb-tap" onClick={() => { setScheduling(true); setError('') }}>
            <FiCalendar aria-hidden="true" /> Schedule Interview
          </button>
        </div>
      )}

      {req.status === 'accepted' && scheduling && (
        <div className="adb-schedule-form">
          <label htmlFor={`scheduledAt-${req._id}`}>Interview date &amp; time</label>
          <input
            id={`scheduledAt-${req._id}`}
            className="adb-input"
            type="datetime-local"
            value={when}
            min={minScheduleValue()}
            onChange={e => setWhen(e.target.value)}
          />
          <p className="adb-hint">The caregiver must confirm this time before they receive the meeting link.</p>
          <div className="adb-req-card__actions">
            <button className="btn btn-blue btn-sm adb-tap" onClick={submitSchedule} disabled={busy || !when}>
              {busy ? 'Scheduling…' : 'Confirm Schedule'}
            </button>
            <button className="btn btn-blue-outline btn-sm adb-tap" onClick={() => { setScheduling(false); setWhen(''); setError('') }}>
              Cancel
            </button>
          </div>
        </div>
      )}

      <JourneyStepper req={req} />
      <AgencyJourneyPanel req={req} onUpdated={onUpdated} />

      {error && <p className="adb-error">{error}</p>}
    </div>
  )
}

/* ── Accountability report form ──────────────────────── */
const OBJECT_ID = /^[a-f0-9]{24}$/i

function AccountabilityForm({ knownCaregivers, onDone, onRefresh }) {
  const [who, setWho]           = useState('')
  const [fact, setFact]         = useState('')
  const [evidence, setEvidence] = useState('')
  const [link, setLink]         = useState('')
  const [file, setFile]         = useState(null)
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState('')

  async function resolveCaregiverId(input) {
    const term = input.trim()
    if (OBJECT_ID.test(term)) return term
    const lower = term.toLowerCase()
    const exact = knownCaregivers.filter(c => c.fullName?.toLowerCase() === lower)
    if (exact.length === 1) return exact[0]._id
    if (exact.length > 1) throw new Error('More than one caregiver has that name. Please enter the caregiver ID.')
    // Fall back to searching the caregiver directory (first few pages)
    const matches = []
    for (let page = 1; page <= 5; page++) {
      const res = await caregiverApi.list({ page })
      const rows = res?.data || []
      rows.forEach(c => { if (c.fullName?.toLowerCase() === lower) matches.push(c) })
      if (rows.length === 0 || page >= Math.ceil((res?.pagination?.total || 0) / 12)) break
    }
    if (matches.length === 1) return matches[0]._id
    if (matches.length > 1) throw new Error('More than one caregiver has that name. Please enter the caregiver ID.')
    throw new Error('No caregiver found with that name. Enter their full name as shown on their profile, or their caregiver ID.')
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    if (link.trim() && !isHttpUrl(link.trim())) {
      setError('The evidence link must start with http:// or https://')
      return
    }
    setLoading(true)
    try {
      const caregiverId = await resolveCaregiverId(who)
      const payload = { caregiverId, fact, evidence }
      if (link.trim()) payload.evidenceLink = link.trim()
      if (file) {
        const uploaded = await uploadApi.document(file)
        if (uploaded?.url) payload.evidenceDocUrl = uploaded.url
      }
      await accountabilityApi.create(payload)
      onRefresh()
      onDone()
    } catch (err) {
      setError(err.message || 'Could not submit.')
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="adb-form">
      <div className="adb-field">
        <label className="adb-label" htmlFor="acct-who">Caregiver Name or ID <span className="adb-req">*</span></label>
        <input
          id="acct-who"
          className="adb-input"
          list="acct-known-caregivers"
          value={who}
          onChange={e => setWho(e.target.value)}
          placeholder="Full name or caregiver ID"
          required
        />
        <datalist id="acct-known-caregivers">
          {knownCaregivers.map(c => <option key={c._id} value={c.fullName} />)}
        </datalist>
      </div>
      <div className="adb-field">
        <label className="adb-label" htmlFor="acct-fact">Fact: what happened <span className="adb-req">*</span></label>
        <textarea id="acct-fact" className="adb-textarea" rows={4} placeholder="Describe what was observed…" value={fact} onChange={e => setFact(e.target.value)} required />
      </div>
      <div className="adb-field">
        <label className="adb-label" htmlFor="acct-evidence">Supporting Evidence (optional)</label>
        <textarea id="acct-evidence" className="adb-textarea" rows={3} placeholder="Any additional context or documentation…" value={evidence} onChange={e => setEvidence(e.target.value)} />
      </div>
      <div className="adb-evidence-box">
        <div className="adb-field">
          <label className="adb-label" htmlFor="acct-file">Upload a document (optional)</label>
          <input id="acct-file" className="adb-file" type="file" accept=".pdf,.png,.jpg,.jpeg,.webp,.doc,.docx" onChange={e => setFile(e.target.files?.[0] || null)} />
          {file && <p className="adb-hint">Selected: {file.name}</p>}
        </div>
        <div className="adb-evidence-or">or</div>
        <div className="adb-field">
          <label className="adb-label" htmlFor="acct-link">Link to evidence (optional)</label>
          <input id="acct-link" className="adb-input" type="url" value={link} onChange={e => setLink(e.target.value)} placeholder="Google Drive, Dropbox or other shared link" />
          <p className="adb-hint">Prefer not to upload? Share a link to where the evidence is stored.</p>
        </div>
      </div>
      {error && <p className="adb-error">{error}</p>}
      <div className="adb-form__actions">
        <button type="button" className="btn btn-blue-outline btn-sm adb-tap" onClick={onDone}>Cancel</button>
        <button type="submit" className="btn btn-blue btn-sm adb-tap" disabled={!fact.trim() || !who.trim() || loading}>
          {loading ? 'Submitting…' : 'Submit Report'}
        </button>
      </div>
    </form>
  )
}

/* ── Main dashboard ──────────────────────────────────── */
const REQUEST_TABS = REQUEST_TAB_DEFS

export default function AgencyDashboard() {
  const [tab, setTab]                   = useState('overview')
  const [reqTab, setReqTab]             = useState('all')
  const [navOpen, setNavOpen]           = useState(false)
  const navigate                        = useNavigate()
  const location                        = useLocation()
  const [agency, setAgency]             = useState(null)
  const [requests, setRequests]         = useState([])
  const [recognition, setRecognition]   = useState([])
  const [accountability, setAcct]       = useState([])
  const [pendingVerif, setPendingVerif] = useState([])
  const [loading, setLoading]           = useState(true)
  const [error, setError]               = useState('')
  const [showAcctForm, setShowAcctForm] = useState(false)
  const [searchTerm, setSearchTerm]     = useState('')
  const [logoBusy, setLogoBusy]         = useState(false)
  const [logoError, setLogoError]       = useState('')

  const loadData = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      // Check location state for an updated profile first (avoids stale cache)
      const updatedProfile = location.state?.updatedProfile

      if (updatedProfile) {
        setAgency(updatedProfile)

        const [reqs, acct, pv] = await Promise.all([
          requestApi.list(),
          accountabilityApi.list(),
          verificationApi.getPending(),
        ])
        setRequests(reqs || [])
        setAcct(acct || [])
        setPendingVerif(pv || [])

        // Clear navigation state to prevent persistence
        window.history.replaceState({}, document.title)
      } else {
        const [ag, reqs2, acct2, pv2] = await Promise.all([
          agencyApi.getMe(),
          requestApi.list(),
          accountabilityApi.list(),
          verificationApi.getPending(),
        ])
        setAgency(ag)
        setRequests(reqs2 || [])
        setAcct(acct2 || [])
        setPendingVerif(pv2 || [])

        if (ag?._id) {
          const rec = await recognitionApi.getByAgencyId(ag._id).catch(() => [])
          setRecognition(rec || [])
        }
      }
    } catch (err) {
      // 404 = user logged in but never completed agency onboarding, so send them to finish it
      if (err.status === 404 || err.message?.toLowerCase().includes('not found')) {
        navigate('/agency/register', { replace: true })
        return
      }
      setError(err.message || 'Could not load dashboard.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { loadData() }, [loadData, location])

  // Lock page scroll while the mobile drawer is open
  useEffect(() => {
    document.body.style.overflow = navOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [navOpen])

  const replaceRequest = updated => setRequests(prev => prev.map(r => r._id === updated._id ? { ...r, ...updated } : r))

  const goTab = key => { setTab(key); setNavOpen(false) }

  const signOut = async () => {
    await authApi.logout().catch(() => {})
    auth.clearTokens()
    navigate('/agency/login', { replace: true })
  }

  const handleSearch = e => {
    e.preventDefault()
    const q = searchTerm.trim()
    navigate(q ? `/caregivers/browse?q=${encodeURIComponent(q)}` : '/caregivers/browse')
  }

  async function handleLogoChange(e) {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return
    if (!file.type.startsWith('image/')) {
      setLogoError('Please choose an image file (JPG, PNG or WEBP).')
      return
    }
    setLogoBusy(true)
    setLogoError('')
    try {
      const { url } = await uploadApi.logo(file)
      const updated = await agencyApi.updateMe({ logoUrl: url })
      setAgency(prev => ({ ...prev, ...(updated || {}), logoUrl: updated?.logoUrl || url }))
    } catch (err) {
      setLogoError(err.message || 'Could not upload logo. Please try again.')
    } finally {
      setLogoBusy(false)
    }
  }

  const byStatus = s => requests.filter(r => r.status === s)
  const pending  = byStatus('pending')
  const hired    = byStatus('hired')
  const tabFilter = Object.fromEntries(REQUEST_TABS.map(t => [t.key, r => matchesTab(t.key, r)]))
  const visibleRequests = requests.filter(tabFilter[reqTab])

  // Caregivers the agency already knows about (for the accountability lookup)
  const knownCaregivers = Object.values(
    requests.reduce((acc, r) => {
      if (r.caregiverId?._id) acc[r.caregiverId._id] = r.caregiverId
      return acc
    }, {})
  )

  // Hired caregivers, one card per caregiver
  const hiredCaregivers = Object.values(
    hired.reduce((acc, r) => {
      const id = r.caregiverId?._id || r._id
      if (!acc[id] || new Date(r.hiredAt || 0) > new Date(acc[id].hiredAt || 0)) acc[id] = r
      return acc
    }, {})
  )

  const STAT_CARDS = [
    { key: 'caregivers',     label: 'Caregivers',              value: hiredCaregivers.length,      sub: 'Hired by you',                 color: 'var(--trust-blue)' },
    { key: 'requests',       label: 'Interview Requests',      value: requests.length,             sub: `${pending.length} awaiting`,   color: 'var(--integrity-green)' },
    { key: 'verifications',  label: 'Employment Verifications',value: pendingVerif.length,         sub: 'Pending review',               color: 'var(--calm-aqua)' },
    { key: 'recognition',    label: 'Recognition Given',       value: recognition.length,          sub: 'All time',                     color: 'var(--accent-gold)' },
    { key: 'accountability', label: 'Accountability Reports',  value: accountability.length,       sub: 'Documented',                   color: '#c0392b' },
  ]

  const QUICK_ACTIONS = [
    { label: 'Browse Caregivers',      icon: FiUsers,       to: '/caregivers/browse', primary: true },
    { label: 'Verify Employment',      icon: FiCheckSquare, tab: 'verifications' },
    { label: 'Recognize a Caregiver',  icon: FiAward,       tab: 'recognition' },
    { label: 'Interview Requests',     icon: FiCalendar,    tab: 'requests' },
    { label: 'Accountability Reports', icon: FiFileText,    tab: 'accountability' },
  ]

  const checklist = agencyChecklist(agency)
  const profileIncomplete = checklist.length > 0 && progress(checklist).done < checklist.length
  const pcUser = auth.getUser()
  const pcUserId = pcUser?.id || pcUser?._id || agency?._id

  const NAV_ITEMS = [
    { key: 'overview',       label: 'Overview' },
    { key: 'caregivers',     label: 'Caregivers' },
    { key: 'requests',       label: 'Interview Requests', count: pending.length },
    { key: 'verifications',  label: 'Employment Verification', count: pendingVerif.length },
    { key: 'recognition',    label: 'Professional Recognition' },
    { key: 'accountability', label: 'Accountability Reports' },
    { key: 'profile',        label: 'Organization Profile', dot: profileIncomplete },
  ]

  if (loading) return (
    <div className="adb-page">
      <div className="adb-topbar"><Link to={homePath()}><img src="/Main Logo.png" alt="The Care Integrity Project" style={{ height: 42 }} /></Link></div>
      <SubNav />
      <div style={{ textAlign: 'center', padding: '80px 24px', color: 'var(--charcoal-light)' }}>Loading dashboard…</div>
    </div>
  )

  if (error) return (
    <div className="adb-page">
      <div className="adb-topbar"><Link to={homePath()}><img src="/Main Logo.png" alt="The Care Integrity Project" style={{ height: 42 }} /></Link></div>
      <SubNav />
      <div style={{ textAlign: 'center', padding: '80px 24px', color: '#c0392b' }}>{error}</div>
    </div>
  )

  return (
    <div className="adb-page">

      {/* Topbar */}
      <div className="adb-topbar">
        <div className="adb-topbar__left">
          <button
            className="adb-hamburger"
            aria-label={navOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={navOpen}
            onClick={() => setNavOpen(o => !o)}
          >
            {navOpen ? <FiX aria-hidden="true" /> : <FiMenu aria-hidden="true" />}
          </button>
          <Link to={homePath()} className="adb-topbar__logo"><img src="/Main Logo.png" alt="The Care Integrity Project" /></Link>
        </div>
        <div className="adb-topbar__right">
          {agency && <span className="adb-topbar__verif"><VerifBadge status={agency.verificationStatus} /></span>}
          <ProfileAvatar photoUrl={agency?.logoUrl} fullName={agency?.name} size="small" alt={`${agency?.name || 'Agency'} logo`} />
          <div className="adb-topbar__org">
            <span className="adb-topbar__org-name">{agency?.name || 'Agency'}</span>
            <span className="adb-topbar__org-type">{agency?.orgType || ''}</span>
          </div>
          <Link to="/agency/profile/edit" className="btn btn-blue-outline btn-sm adb-topbar__desktop">Edit Profile</Link>
          <button className="btn btn-sm cgd-logout-btn adb-topbar__desktop" onClick={signOut}>Sign Out</button>
        </div>
      </div>

      {/* Overview is the dashboard "home": no Back there; elsewhere Back and the Dashboard crumb return to it. */}
      <SubNav
        showBack={tab !== 'overview'}
        onBack={() => goTab('overview')}
        trail={tab === 'overview'
          ? [{ label: 'Dashboard' }]
          : [{ label: 'Dashboard', onClick: () => goTab('overview') }, { label: NAV_ITEMS.find(n => n.key === tab)?.label || 'Overview' }]}
      />

      {navOpen && <div className="adb-backdrop" onClick={() => setNavOpen(false)} aria-hidden="true" />}

      <WelcomeGuide
        items={checklist}
        userId={pcUserId}
        show={isNewProfile(agency)}
        onTab={goTab}
        heading={`Welcome to The Care Integrity Project${agency?.name ? `, ${agency.name}` : ''}`}
        intro="Let's finish your organization profile so caregivers know who they are talking to. It only takes a few minutes."
      />

      <div className="adb-layout">

        {/* Sidebar nav (slides in as an overlay on mobile) */}
        <nav className={`adb-nav${navOpen ? ' adb-nav--open' : ''}`} aria-label="Dashboard navigation">
          {NAV_ITEMS.map(item => (
            <button key={item.key} className={`adb-nav__item${tab === item.key ? ' active' : ''}`} onClick={() => goTab(item.key)}>
              {item.label}
              {item.count > 0 && <span className="adb-nav__count">{item.count}</span>}
              {item.dot && <span className="adb-nav__dot" aria-label="Profile incomplete" />}
            </button>
          ))}
          <div className="adb-nav__mobile-only">
            <Link to="/agency/profile/edit" className="adb-nav__item" onClick={() => setNavOpen(false)}>Edit Profile</Link>
            <button className="adb-nav__item adb-nav__item--danger" onClick={signOut}>Sign Out</button>
          </div>
        </nav>

        <main className="adb-main">

          {/* ── Overview ── */}
          {tab === 'overview' && (
            <>
              <div className="adb-welcome">
                <h1 className="adb-welcome__heading">Welcome, {agency?.name}</h1>
                <p className="adb-welcome__sub">{agency?.location} · {agency?.size}</p>
              </div>

              <ProfileCompletionCard items={checklist} userId={pcUserId} onTab={goTab} title="Complete your organization profile" />

              <div className="adb-stat-grid">
                {STAT_CARDS.map(c => (
                  <button key={c.key} className="adb-stat-card" onClick={() => setTab(c.key)} style={{ '--card-color': c.color }}>
                    <div className="adb-stat-card__value" style={{ color: c.color }}>{c.value}</div>
                    <div className="adb-stat-card__label">{c.label}</div>
                    <div className="adb-stat-card__sub">{c.sub}</div>
                    <div className="adb-stat-card__bar" style={{ background: c.color }} />
                  </button>
                ))}
              </div>

              <form className="adb-search" onSubmit={handleSearch} role="search">
                <div className="adb-search__title">Find a caregiver</div>
                <div className="adb-search__row">
                  <div className="adb-search__field">
                    <FiSearch aria-hidden="true" />
                    <input
                      type="search"
                      className="adb-search__input"
                      placeholder="Search by name, role or service area…"
                      value={searchTerm}
                      onChange={e => setSearchTerm(e.target.value)}
                      aria-label="Search caregivers"
                    />
                  </div>
                  <button type="submit" className="btn btn-blue adb-tap">Search</button>
                </div>
              </form>

              <div className="adb-actions-section">
                <div className="adb-section-title">Quick Actions</div>
                <div className="adb-quick-grid">
                  {QUICK_ACTIONS.map(a => {
                    const Icon = a.icon
                    const inner = (
                      <>
                        <span className="adb-quick__icon"><Icon aria-hidden="true" /></span>
                        <span className="adb-quick__label">{a.label}</span>
                      </>
                    )
                    return a.to
                      ? <Link key={a.label} to={a.to} className={`adb-quick${a.primary ? ' adb-quick--primary' : ''}`}>{inner}</Link>
                      : <button key={a.label} className="adb-quick" onClick={() => setTab(a.tab)}>{inner}</button>
                  })}
                </div>
              </div>

              <div className="adb-panel">
                <div className="adb-panel__header">
                  <span className="adb-section-title">Recent Interview Requests</span>
                  <button className="adb-panel__viewall" onClick={() => setTab('requests')}>View all →</button>
                </div>
                {requests.slice(0, 3).map(r => (
                  <div key={r._id} className="adb-list-item">
                    <div className="adb-list-item__avatar">{r.caregiverId?.fullName?.split(' ').map(n=>n[0]).join('') || 'CG'}</div>
                    <div className="adb-list-item__body">
                      <div className="adb-list-item__name">{r.caregiverId?.fullName}</div>
                      <div className="adb-list-item__meta">{r.reason} · {new Date(r.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</div>
                    </div>
                    <RequestBadge status={r.status} />
                  </div>
                ))}
                {requests.length === 0 && <p className="adb-panel__note">No interview requests sent yet.</p>}
              </div>
            </>
          )}

          {/* ── Requests ── */}
          {tab === 'requests' && (
            <div className="adb-panel">
              <div className="adb-panel__header"><span className="adb-section-title">Interview Requests</span></div>
              <p className="adb-panel__note">Caregiver contact information remains private until they accept your request.</p>

              <div className="adb-tabs" role="tablist" aria-label="Interview request status">
                {REQUEST_TABS.map(t => {
                  const count = requests.filter(tabFilter[t.key]).length
                  return (
                    <button
                      key={t.key}
                      role="tab"
                      aria-selected={reqTab === t.key}
                      className={`adb-tabs__tab${reqTab === t.key ? ' active' : ''}`}
                      onClick={() => setReqTab(t.key)}
                    >
                      {t.label}
                      <span className="adb-tabs__count">{count}</span>
                      {requests.some(r => tabFilter[t.key](r) && needsAction(r, 'agency')) && (
                        <span className="adb-tabs__dot" aria-label="Needs your action" style={{ width: 8, height: 8, borderRadius: '50%', background: '#c0392b', display: 'inline-block', marginLeft: 6 }} />
                      )}
                    </button>
                  )
                })}
              </div>

              <div className="adb-req-list">
                {visibleRequests.map(req => (
                  <AgencyRequestCard key={req._id} req={req} onUpdated={replaceRequest} />
                ))}
              </div>
              {visibleRequests.length === 0 && (
                <div className="adb-empty">
                  {requests.length === 0 ? 'No interview requests sent yet.' : 'No requests in this category.'}
                </div>
              )}
              <div style={{ marginTop: 20 }}>
                <Link to="/caregivers/browse" className="btn btn-blue adb-tap">Browse Caregiver Profiles</Link>
              </div>
            </div>
          )}

          {/* ── Verifications ── */}
          {tab === 'verifications' && (
            <div className="adb-panel">
              <div className="adb-section-title" style={{ marginBottom: 12 }}>Employment Verification</div>
              <p className="adb-panel__note">Verify caregivers who have listed your organization. Verified positions strengthen their professional profile.</p>
              {pendingVerif.length > 0 ? pendingVerif.map((item, i) => (
                <div key={i} className="adb-list-item">
                  <div className="adb-list-item__avatar">{item.caregiverName?.split(' ').map(n=>n[0]).join('') || 'CG'}</div>
                  <div className="adb-list-item__body">
                    <div className="adb-list-item__name">{item.caregiverName}</div>
                    <div className="adb-list-item__meta">{item.employment?.role} · {item.employment?.startDate} – {item.employment?.endDate || 'Present'}</div>
                  </div>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button className="btn btn-green btn-sm" onClick={async () => {
                      await verificationApi.action(item.caregiverId, item.employment._id, 'verify')
                      loadData()
                    }}>Verify</button>
                    <button className="btn btn-sm" style={{ border: '1.5px solid #c0392b', color: '#c0392b', background: 'transparent' }} onClick={async () => {
                      await verificationApi.action(item.caregiverId, item.employment._id, 'dispute')
                      loadData()
                    }}>Dispute</button>
                  </div>
                </div>
              )) : <div className="adb-empty">No pending verifications.</div>}
            </div>
          )}

          {/* ── Recognition ── */}
          {tab === 'recognition' && (
            <div className="adb-panel">
              <div className="adb-section-title" style={{ marginBottom: 12 }}>Professional Recognition</div>
              <p className="adb-panel__note">Recognize caregivers for specific Care Integrity Standards. Recognition becomes a permanent part of their profile.</p>
              {recognition.length > 0 ? recognition.map((r, i) => (
                <div key={i} className="adb-list-item">
                  <div className="adb-list-item__avatar">{r.caregiverId?.fullName?.split(' ').map(n=>n[0]).join('') || 'CG'}</div>
                  <div className="adb-list-item__body">
                    <div className="adb-list-item__name">{r.caregiverId?.fullName}</div>
                    <div className="adb-list-item__meta">Standard: <strong>{r.standard}</strong> · {new Date(r.createdAt).toLocaleDateString()}</div>
                  </div>
                  <span className="adb-badge adb-badge--accepted">Recognized</span>
                </div>
              )) : <div className="adb-empty">No recognitions given yet.</div>}
              <p style={{ marginTop: 20, fontSize: '0.84rem', color: 'var(--charcoal-light)' }}>
                To recognize a caregiver, visit their profile and use the recognition action from there.
              </p>
            </div>
          )}

          {/* ── Accountability Reports ── */}
          {tab === 'accountability' && (
            <div className="adb-panel">
              <div className="adb-section-title" style={{ marginBottom: 12 }}>Accountability Reports</div>
              <p className="adb-panel__note">Document concerns using the FACT → EVIDENCE → RESPONSE → RESOLUTION process. Caregivers are always given an opportunity to respond.</p>
              {accountability.length > 0 ? accountability.map((a, i) => (
                <div key={i} className="adb-list-item">
                  <div className="adb-list-item__avatar">{a.caregiverId?.fullName?.split(' ').map(n=>n[0]).join('') || 'CG'}</div>
                  <div className="adb-list-item__body">
                    <div className="adb-list-item__name">{a.caregiverId?.fullName}</div>
                    <div className="adb-list-item__meta">Status: <strong>{a.status?.replace('_', ' ')}</strong> · {new Date(a.createdAt).toLocaleDateString()}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--charcoal-light)', marginTop: 3 }}>{a.fact?.slice(0, 80)}{a.fact?.length > 80 ? '…' : ''}</div>
                    {(a.evidenceDocUrl || a.evidenceLink) && (
                      <div className="adb-evidence-links">
                        {a.evidenceDocUrl && isHttpUrl(a.evidenceDocUrl) && <a href={a.evidenceDocUrl} target="_blank" rel="noopener noreferrer"><FiFileText aria-hidden="true" /> Document</a>}
                        {a.evidenceLink && isHttpUrl(a.evidenceLink) && <a href={a.evidenceLink} target="_blank" rel="noopener noreferrer"><FiLink aria-hidden="true" /> Evidence link</a>}
                      </div>
                    )}
                  </div>
                  <span className={`adb-badge ${a.status === 'resolved' ? 'adb-badge--accepted' : 'adb-badge--pending'}`}>
                    {a.status === 'resolved' ? 'Resolved' : 'Pending'}
                  </span>
                </div>
              )) : <div className="adb-empty">No accountability reports documented.</div>}
              {!showAcctForm ? (
                <button className="btn btn-blue-outline adb-tap" style={{ marginTop: 20 }} onClick={() => setShowAcctForm(true)}>
                  + Document a Concern
                </button>
              ) : (
                <AccountabilityForm
                  knownCaregivers={knownCaregivers}
                  onDone={() => setShowAcctForm(false)}
                  onRefresh={loadData}
                />
              )}
            </div>
          )}

          {/* ── Caregivers (hired) ── */}
          {tab === 'caregivers' && (
            <div className="adb-panel">
              <div className="adb-panel__header">
                <span className="adb-section-title">Your Caregivers</span>
                <Link to="/caregivers/browse" className="adb-panel__viewall">Browse all caregivers →</Link>
              </div>
              {hiredCaregivers.length > 0 ? (
                <div className="adb-cg-grid">
                  {hiredCaregivers.map(r => {
                    const cg = r.caregiverId || {}
                    return (
                      <div key={r._id} className="adb-cg-card">
                        <ProfileAvatar photoUrl={cg.photoUrl} fullName={cg.fullName} size="medium" alt={cg.fullName || 'Caregiver'} />
                        <div className="adb-cg-card__name">{cg.fullName}</div>
                        {cg.role && <div className="adb-cg-card__role">{cg.role}</div>}
                        {r.hiredAt && <div className="adb-cg-card__meta">Hired {fmtDate(r.hiredAt)}</div>}
                        {cg._id && <Link to={`/caregiver/profile?id=${cg._id}`} className="btn btn-blue-outline btn-sm adb-tap">View Profile</Link>}
                      </div>
                    )
                  })}
                </div>
              ) : (
                <div className="adb-empty">
                  <p style={{ marginBottom: 14 }}>You have not hired any caregivers yet.</p>
                  <Link to="/caregivers/browse" className="btn btn-blue adb-tap">Browse Caregivers</Link>
                </div>
              )}
              <p className="adb-hint" style={{ marginTop: 16 }}>
                Personal contact information is never exposed while browsing. Reach out through interview requests.
              </p>
            </div>
          )}

          {/* ── Profile ── */}
          {tab === 'profile' && agency && (
            <div className="adb-panel">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap', marginBottom: 16 }}>
                <div className="adb-section-title" style={{ marginBottom: 0 }}>Organization Profile</div>
                <Link to="/agency/profile/edit" className="btn btn-blue btn-sm adb-tap">Edit Profile</Link>
              </div>
              <div className="adb-org-profile-card">
                <div className="adb-org-profile-card__top">
                  <div className="adb-logo-upload">
                    <div className="adb-logo-circle">
                      <ProfileAvatar
                        key={agency.logoUrl || 'none'}
                        photoUrl={agency.logoUrl}
                        fullName={agency.name}
                        size="large"
                        alt={`${agency.name} logo`}
                      />
                    </div>
                    <label className={`btn btn-blue-outline btn-sm adb-tap adb-upload-btn${logoBusy ? ' is-busy' : ''}`}>
                      <FiUpload aria-hidden="true" /> {logoBusy ? 'Uploading…' : 'Upload Logo'}
                      <input type="file" accept="image/*" onChange={handleLogoChange} disabled={logoBusy} hidden />
                    </label>
                  </div>
                  <div className="adb-org-profile-card__info">
                    <div className="adb-org-card__name">{agency.name}</div>
                    <div className="adb-org-card__meta">{agency.orgType} · {agency.location}</div>
                    <VerifBadge status={agency.verificationStatus} />
                  </div>
                </div>
                {logoError && <p className="adb-error">{logoError}</p>}
                {agency.description && <p className="adb-org-profile-card__desc">{agency.description}</p>}
                {agency.careTypes?.length > 0 && (
                  <div className="adb-org-profile-card__chips">
                    {agency.careTypes.map(t => <span key={t} className="adb-chip adb-chip--blue">{t}</span>)}
                  </div>
                )}
                <div className="adb-org-profile-card__meta-row">
                  {agency.serviceArea    && <span><strong>Service Area:</strong> {fixMojibake(agency.serviceArea)}</span>}
                  {agency.yearEstablished && <span><strong>Est.</strong> {agency.yearEstablished}</span>}
                  {agency.size           && <span><strong>Size:</strong> {agency.size}</span>}
                  {agency.website        && <a
                    href={agency.website.startsWith('http') ? agency.website : `https://${agency.website}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="adb-org-profile-card__website"
                  >
                    {agency.website}
                  </a>}
                </div>
                {agency.focus?.length > 0 && (
                  <div className="adb-org-profile-card__focus">
                    {agency.focus.map(f => <span key={f} className="adb-chip adb-chip--green">{f}</span>)}
                  </div>
                )}
              </div>
              <div className="adb-panel__actions" style={{ marginTop: 16 }}>
                <Link to="/agency/profile/edit" className="btn btn-blue-outline btn-sm adb-tap">Edit Organization Profile</Link>
              </div>
            </div>
          )}

        </main>
      </div>
    </div>
  )
}
