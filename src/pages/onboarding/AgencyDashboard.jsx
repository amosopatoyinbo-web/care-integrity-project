import { useState, useEffect, useCallback } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { agencyApi, requestApi, recognitionApi, verificationApi, accountabilityApi, auth, authApi } from '../../lib/api'
import './AgencyDashboard.css'

/* ── Badges ───────────────────────────────────────────── */
const REQ_STATUS = {
  pending:  { label: 'Pending',   cls: 'adb-badge--pending'  },
  accepted: { label: 'Accepted',  cls: 'adb-badge--accepted' },
  declined: { label: 'Declined',  cls: 'adb-badge--declined' },
  withdrawn:{ label: 'Withdrawn', cls: 'adb-badge--grey'     },
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

/* ── Accountability form ──────────────────────────────── */
function AccountabilityForm({ agencyId, caregiverId, onDone, onRefresh }) {
  const [fact, setFact]         = useState('')
  const [evidence, setEvidence] = useState('')
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      await accountabilityApi.create({ caregiverId, fact, evidence })
      onRefresh()
      onDone()
    } catch (err) {
      setError(err.message || 'Could not submit.')
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14, marginTop: 16 }}>
      <div>
        <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 600, marginBottom: 5 }}>
          Caregiver ID <span style={{ color: '#c0392b' }}>*</span>
        </label>
        <input className="adb-input" value={caregiverId || ''} readOnly placeholder="Caregiver profile ID" style={{ background: 'var(--soft-cream)' }} />
      </div>
      <div>
        <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 600, marginBottom: 5 }}>
          Fact — what happened <span style={{ color: '#c0392b' }}>*</span>
        </label>
        <textarea className="adb-textarea" rows={4} placeholder="Describe what was observed…" value={fact} onChange={e => setFact(e.target.value)} required />
      </div>
      <div>
        <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 600, marginBottom: 5 }}>Supporting Evidence (optional)</label>
        <textarea className="adb-textarea" rows={3} placeholder="Any additional context or documentation…" value={evidence} onChange={e => setEvidence(e.target.value)} />
      </div>
      {error && <p style={{ color: '#c0392b', fontSize: '0.82rem' }}>{error}</p>}
      <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
        <button type="button" className="btn btn-blue-outline btn-sm" onClick={onDone}>Cancel</button>
        <button type="submit" className="btn btn-blue btn-sm" disabled={!fact.trim() || loading}>
          {loading ? 'Submitting…' : 'Submit Concern'}
        </button>
      </div>
    </form>
  )
}

/* ── Main dashboard ───────────────────────────────────── */
export default function AgencyDashboard() {
  const [tab, setTab]                   = useState('overview')
  const navigate                        = useNavigate()
  const [agency, setAgency]             = useState(null)
  const [requests, setRequests]         = useState([])
  const [recognition, setRecognition]   = useState([])
  const [accountability, setAcct]       = useState([])
  const [pendingVerif, setPendingVerif] = useState([])
  const [loading, setLoading]           = useState(true)
  const [error, setError]               = useState('')
  const [showAcctForm, setShowAcctForm] = useState(false)
  const [acctCaregiverId, setAcctCgId]  = useState('')

  const loadData = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const [ag, reqs, acct, pv] = await Promise.all([
        agencyApi.getMe(),
        requestApi.list(),
        accountabilityApi.list(),
        verificationApi.getPending(),
      ])
      setAgency(ag)
      setRequests(reqs || [])
      setAcct(acct || [])
      setPendingVerif(pv || [])

      if (ag?._id) {
        const rec = await recognitionApi.getByAgencyId(ag._id).catch(() => [])
        setRecognition(rec || [])
      }
    } catch (err) {
      // 404 = user logged in but never completed agency onboarding — send them to finish it
      if (err.status === 404 || err.message?.toLowerCase().includes('not found')) {
        navigate('/agency/register', { replace: true })
        return
      }
      setError(err.message || 'Could not load dashboard.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { loadData() }, [loadData])

  const pending  = requests.filter(r => r.status === 'pending')
  const accepted = requests.filter(r => r.status === 'accepted')
  const declined = requests.filter(r => r.status === 'declined')

  const STAT_CARDS = [
    { key: 'caregivers',     label: 'Caregivers',              value: '—',                        sub: 'Browse profiles',              color: 'var(--trust-blue)' },
    { key: 'requests',       label: 'Interview Requests',      value: requests.length,             sub: `${pending.length} awaiting`,   color: 'var(--integrity-green)' },
    { key: 'verifications',  label: 'Employment Verifications',value: pendingVerif.length,         sub: 'Pending review',               color: 'var(--calm-aqua)' },
    { key: 'recognition',    label: 'Recognition Given',       value: recognition.length,          sub: 'All time',                     color: 'var(--accent-gold)' },
    { key: 'accountability', label: 'Accountability Matters',  value: accountability.length,       sub: 'Documented',                   color: '#c0392b' },
  ]

  if (loading) return (
    <div className="adb-page">
      <div className="adb-topbar"><Link to="/"><img src="/Main Logo.png" alt="The Care Integrity Project" style={{ height: 42 }} /></Link></div>
      <div style={{ textAlign: 'center', padding: '80px 24px', color: 'var(--charcoal-light)' }}>Loading dashboard…</div>
    </div>
  )

  if (error) return (
    <div className="adb-page">
      <div className="adb-topbar"><Link to="/"><img src="/Main Logo.png" alt="The Care Integrity Project" style={{ height: 42 }} /></Link></div>
      <div style={{ textAlign: 'center', padding: '80px 24px', color: '#c0392b' }}>{error}</div>
    </div>
  )

  return (
    <div className="adb-page">

      {/* Topbar */}
      <div className="adb-topbar">
        <Link to="/" className="adb-topbar__logo"><img src="/Main Logo.png" alt="The Care Integrity Project" /></Link>
        <div className="adb-topbar__right">
          {agency && <VerifBadge status={agency.verificationStatus} />}
          <div className="adb-topbar__org">
            <span className="adb-topbar__org-name">{agency?.name || 'Agency'}</span>
            <span className="adb-topbar__org-type">{agency?.orgType || ''}</span>
          </div>
          <Link to="/agency/profile/edit" className="btn btn-blue-outline btn-sm">Edit Profile</Link>
          <button className="btn btn-sm cgd-logout-btn" onClick={async () => {
            await authApi.logout().catch(() => {})
            auth.clearTokens()
            navigate('/agency/login', { replace: true })
          }}>Sign Out</button>
        </div>
      </div>

      <div className="adb-layout">

        {/* Sidebar nav */}
        <nav className="adb-nav" aria-label="Dashboard navigation">
          {[
            { key: 'overview',       label: 'Overview' },
            { key: 'caregivers',     label: 'Caregivers' },
            { key: 'requests',       label: 'Interview Requests', count: pending.length },
            { key: 'verifications',  label: 'Employment Verification', count: pendingVerif.length },
            { key: 'recognition',    label: 'Professional Recognition' },
            { key: 'accountability', label: 'Accountability' },
            { key: 'profile',        label: 'Organization Profile' },
          ].map(item => (
            <button key={item.key} className={`adb-nav__item${tab === item.key ? ' active' : ''}`} onClick={() => setTab(item.key)}>
              {item.label}
              {item.count > 0 && <span className="adb-nav__count">{item.count}</span>}
            </button>
          ))}
        </nav>

        <main className="adb-main">

          {/* ── Overview ── */}
          {tab === 'overview' && (
            <>
              <div className="adb-welcome">
                <h1 className="adb-welcome__heading">Welcome, {agency?.name}</h1>
                <p className="adb-welcome__sub">{agency?.location} · {agency?.size}</p>
              </div>

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

              <div className="adb-actions-section">
                <div className="adb-section-title">Primary Actions</div>
                <div className="adb-actions-grid">
                  <Link to="/caregiver/profile?view=agency" className="btn btn-blue">View Caregivers</Link>
                  <button className="btn btn-blue-outline" onClick={() => setTab('verifications')}>Verify Employment</button>
                  <button className="btn btn-blue-outline" onClick={() => setTab('recognition')}>Recognize a Caregiver</button>
                  <button className="btn btn-blue-outline" onClick={() => setTab('requests')}>View Interview Requests</button>
                  <button className="btn btn-blue-outline" onClick={() => setTab('accountability')}>View Accountability</button>
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
              {[
                { label: `Pending (${pending.length})`, list: pending },
                { label: `Accepted (${accepted.length})`, list: accepted },
                { label: `Declined (${declined.length})`, list: declined },
              ].map(group => group.list.length > 0 && (
                <div key={group.label} className="adb-request-group">
                  <div className="adb-request-group__label">{group.label}</div>
                  {group.list.map(r => (
                    <div key={r._id} className="adb-list-item">
                      <div className="adb-list-item__avatar">{r.caregiverId?.fullName?.split(' ').map(n=>n[0]).join('') || 'CG'}</div>
                      <div className="adb-list-item__body">
                        <div className="adb-list-item__name">{r.caregiverId?.fullName} <span className="adb-list-item__role">— {r.caregiverId?.role}</span></div>
                        <div className="adb-list-item__meta">Reason: {r.reason} · Sent: {new Date(r.createdAt).toLocaleDateString()}</div>
                        {r.caregiverResponse && <div className="adb-caregiver-response">{r.caregiverResponse}</div>}
                      </div>
                      <RequestBadge status={r.status} />
                    </div>
                  ))}
                </div>
              ))}
              {requests.length === 0 && <div className="adb-empty">No interview requests sent yet.</div>}
              <div style={{ marginTop: 20 }}>
                <Link to="/caregiver/profile?view=agency" className="btn btn-blue">Browse Caregiver Profiles</Link>
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

          {/* ── Accountability ── */}
          {tab === 'accountability' && (
            <div className="adb-panel">
              <div className="adb-section-title" style={{ marginBottom: 12 }}>Accountability</div>
              <p className="adb-panel__note">Document concerns using the FACT → EVIDENCE → RESPONSE → RESOLUTION process. Caregivers are always given an opportunity to respond.</p>
              {accountability.length > 0 ? accountability.map((a, i) => (
                <div key={i} className="adb-list-item">
                  <div className="adb-list-item__avatar">{a.caregiverId?.fullName?.split(' ').map(n=>n[0]).join('') || 'CG'}</div>
                  <div className="adb-list-item__body">
                    <div className="adb-list-item__name">{a.caregiverId?.fullName}</div>
                    <div className="adb-list-item__meta">Status: <strong>{a.status?.replace('_', ' ')}</strong> · {new Date(a.createdAt).toLocaleDateString()}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--charcoal-light)', marginTop: 3 }}>{a.fact?.slice(0, 80)}…</div>
                  </div>
                  <span className={`adb-badge ${a.status === 'resolved' ? 'adb-badge--accepted' : 'adb-badge--pending'}`}>
                    {a.status === 'resolved' ? 'Resolved' : 'Pending'}
                  </span>
                </div>
              )) : <div className="adb-empty">No accountability matters documented.</div>}
              {!showAcctForm ? (
                <button className="btn btn-blue-outline" style={{ marginTop: 20 }} onClick={() => setShowAcctForm(true)}>
                  + Document a Concern
                </button>
              ) : (
                <>
                  <div className="ob-field" style={{ marginTop: 16 }}>
                    <label className="ob-label">Caregiver Profile ID</label>
                    <input className="adb-input" placeholder="Paste caregiver _id here" value={acctCaregiverId} onChange={e => setAcctCgId(e.target.value)} />
                  </div>
                  <AccountabilityForm
                    caregiverId={acctCaregiverId}
                    onDone={() => { setShowAcctForm(false); setAcctCgId('') }}
                    onRefresh={loadData}
                  />
                </>
              )}
            </div>
          )}

          {/* ── Caregivers ── */}
          {tab === 'caregivers' && (
            <div className="adb-panel">
              <div className="adb-section-title" style={{ marginBottom: 12 }}>Caregivers</div>
              <p className="adb-panel__note">Browse caregiver profiles. Contact caregivers through the Request an Interview system. Personal contact information is never exposed during browsing.</p>
              <div style={{ display: 'flex', gap: 12, marginTop: 16, flexWrap: 'wrap' }}>
                <Link to="/caregivers/browse" className="btn btn-blue">Browse All Caregivers</Link>
                <Link to="/caregiver/profile?view=agency" className="btn btn-blue-outline">View Single Profile</Link>
              </div>
            </div>
          )}

          {/* ── Profile ── */}
          {tab === 'profile' && agency && (
            <div className="adb-panel">
              <div className="adb-section-title" style={{ marginBottom: 16 }}>Organization Profile</div>
              <div className="adb-org-profile-card">
                <div className="adb-org-profile-card__top">
                  <div className="adb-org-card__logo">
                    {agency.logoUrl ? <img src={agency.logoUrl} alt={agency.name} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 'inherit' }} /> : agency.name?.slice(0, 2).toUpperCase()}
                  </div>
                  <div className="adb-org-profile-card__info">
                    <div className="adb-org-card__name">{agency.name}</div>
                    <div className="adb-org-card__meta">{agency.orgType} · {agency.location}</div>
                    <VerifBadge status={agency.verificationStatus} />
                  </div>
                </div>
                {agency.description && <p className="adb-org-profile-card__desc">{agency.description}</p>}
                {agency.careTypes?.length > 0 && (
                  <div className="adb-org-profile-card__chips">
                    {agency.careTypes.map(t => <span key={t} className="adb-chip adb-chip--blue">{t}</span>)}
                  </div>
                )}
                <div className="adb-org-profile-card__meta-row">
                  {agency.serviceArea    && <span><strong>Service Area:</strong> {agency.serviceArea}</span>}
                  {agency.yearEstablished && <span><strong>Est.</strong> {agency.yearEstablished}</span>}
                  {agency.size           && <span><strong>Size:</strong> {agency.size}</span>}
                  {agency.website        && <a href={agency.website} target="_blank" rel="noreferrer" className="adb-org-profile-card__website">{agency.website}</a>}
                </div>
                {agency.focus?.length > 0 && (
                  <div className="adb-org-profile-card__focus">
                    {agency.focus.map(f => <span key={f} className="adb-chip adb-chip--green">{f}</span>)}
                  </div>
                )}
              </div>
              <div className="adb-panel__actions" style={{ marginTop: 16 }}>
                <Link to="/agency/register" className="btn btn-blue-outline btn-sm">Edit Organization Profile</Link>
              </div>
            </div>
          )}

        </main>
      </div>
    </div>
  )
}
