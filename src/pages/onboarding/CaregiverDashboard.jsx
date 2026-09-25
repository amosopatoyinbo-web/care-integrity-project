import { useState, useEffect, useCallback } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { caregiverApi, requestApi, recognitionApi, auth, authApi, verificationApi } from '../../lib/api'
import TrainingTab from '../../components/training/TrainingTab'
import './CaregiverDashboard.css'

/* ── Status badge ─────────────────────────────────────── */
const STATUS_MAP = {
  pending:  { label: 'New Request', cls: 'cgd-badge--pending'  },
  accepted: { label: 'Accepted',    cls: 'cgd-badge--accepted' },
  declined: { label: 'Declined',    cls: 'cgd-badge--declined' },
  withdrawn:{ label: 'Withdrawn',   cls: 'cgd-badge--grey'     },
}
function StatusBadge({ status }) {
  const s = STATUS_MAP[status] || STATUS_MAP.pending
  return <span className={`cgd-badge ${s.cls}`}>{s.label}</span>
}

/* ── Decline dialog ───────────────────────────────────── */
function DeclineDialog({ onConfirm, onCancel }) {
  const [reason, setReason] = useState('')
  const reasons = ['Not interested', 'Not available', 'Opportunity not suitable', 'Other']
  return (
    <div className="cgd-dialog-overlay" role="dialog" aria-modal="true" aria-labelledby="decline-title">
      <div className="cgd-dialog">
        <h3 className="cgd-dialog__title" id="decline-title">Decline this request?</h3>
        <p className="cgd-dialog__body">Are you sure you want to decline this interview request?</p>
        <div className="cgd-dialog__reasons">
          <label className="cgd-dialog__reason-label">Reason (optional)</label>
          {reasons.map(r => (
            <label key={r} className="cgd-dialog__reason-option">
              <input type="radio" name="declineReason" value={r} checked={reason === r} onChange={() => setReason(r)} />
              <span>{r}</span>
            </label>
          ))}
        </div>
        <div className="cgd-dialog__actions">
          <button className="btn btn-blue-outline" onClick={onCancel}>Cancel</button>
          <button className="btn" style={{ background: '#c0392b', color: '#fff', borderColor: '#c0392b' }} onClick={() => onConfirm(reason)}>
            Decline Request
          </button>
        </div>
      </div>
    </div>
  )
}

/* ── Respond panel ────────────────────────────────────── */
function RespondPanel({ req, onDone, onRefresh }) {
  const [message, setMessage] = useState('Thank you for reaching out. I would be happy to learn more about this opportunity.')
  const [loading, setLoading] = useState(false)
  const [sent, setSent]       = useState(false)
  const [error, setError]     = useState('')

  async function handleSend() {
    setLoading(true)
    setError('')
    try {
      await requestApi.respond(req._id, { action: 'accept', caregiverResponse: message })
      setSent(true)
      onRefresh()
    } catch (err) {
      setError(err.message || 'Could not send response.')
    } finally {
      setLoading(false)
    }
  }

  if (sent) return (
    <div className="cgd-respond-success">
      <div className="cgd-respond-success__icon" aria-hidden="true">✓</div>
      <p><strong>Your request has been accepted.</strong> Your response has been sent.</p>
      <button className="btn btn-blue btn-sm" onClick={onDone}>Done</button>
    </div>
  )

  return (
    <div className="cgd-respond-panel">
      <div className="cgd-respond-panel__info">
        <div className="cgd-avatar">{req.agencyId?.name?.slice(0, 2).toUpperCase() || 'AG'}</div>
        <div>
          <div className="cgd-respond-panel__agency">{req.agencyId?.name}</div>
          <div className="cgd-respond-panel__reason">{req.reason}</div>
        </div>
      </div>
      <p className="cgd-respond-panel__msg-label">Your response:</p>
      <textarea className="cgd-respond-textarea" rows={4} value={message} onChange={e => setMessage(e.target.value)} />
      {error && <p style={{ color: '#c0392b', fontSize: '0.82rem', marginTop: 6 }}>{error}</p>}
      <div className="cgd-respond-panel__actions">
        <button className="btn btn-blue-outline btn-sm" onClick={onDone}>Cancel</button>
        <button className="btn btn-green btn-sm" disabled={!message.trim() || loading} onClick={handleSend}>
          {loading ? 'Sending…' : 'Accept & Send Response'}
        </button>
      </div>
    </div>
  )
}

/* ── Request card ─────────────────────────────────────── */
function RequestCard({ req, onRefresh }) {
  const [expanded, setExpanded]     = useState(false)
  const [respondOpen, setRespond]   = useState(false)
  const [declineOpen, setDecline]   = useState(false)
  const [loading, setLoading]       = useState(false)
  const [error, setError]           = useState('')

  async function handleDecline(reason) {
    setLoading(true)
    setError('')
    try {
      await requestApi.respond(req._id, { action: 'decline', declineReason: reason })
      setDecline(false)
      onRefresh()
    } catch (err) {
      setError(err.message || 'Could not decline request.')
      setLoading(false)
    }
  }

  return (
    <>
      <div className="cgd-request-card">
        <div className="cgd-request-card__top">
          <div className="cgd-avatar">{req.agencyId?.name?.slice(0, 2).toUpperCase() || 'AG'}</div>
          <div className="cgd-request-card__body">
            <div className="cgd-request-card__agency">{req.agencyId?.name || 'Unknown Agency'}</div>
            <div className="cgd-request-card__meta">{req.reason} · {new Date(req.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</div>
            <p className="cgd-request-card__preview">{req.message?.slice(0, 100)}{req.message?.length > 100 ? '…' : ''}</p>
          </div>
          <StatusBadge status={req.status} />
        </div>

        {req.caregiverResponse && (
          <div className="cgd-request-card__response">
            <span className="cgd-request-card__response-label">Your response:</span>
            <p>{req.caregiverResponse}</p>
          </div>
        )}
        {req.declineReason && (
          <div className="cgd-request-card__decline-reason">Declined · {req.declineReason}</div>
        )}
        {error && <p style={{ color: '#c0392b', fontSize: '0.8rem', marginTop: 6 }}>{error}</p>}

        <div className="cgd-request-card__actions">
          <button className="cgd-action-link" onClick={() => setExpanded(e => !e)}>
            {expanded ? 'Hide message ↑' : 'View full message ↓'}
          </button>
          {req.status === 'pending' && (
            <>
              <button className="btn btn-green btn-sm" onClick={() => setRespond(true)}>Accept & Respond</button>
              <button className="btn btn-sm" style={{ border: '1.5px solid #c0392b', color: '#c0392b', background: 'transparent' }} onClick={() => setDecline(true)}>Decline</button>
            </>
          )}
        </div>

        {expanded && (
          <div className="cgd-request-card__full-msg">
            <strong>Full message:</strong>
            <p>{req.message}</p>
          </div>
        )}
      </div>

      {respondOpen && <RespondPanel req={req} onDone={() => setRespond(false)} onRefresh={onRefresh} />}
      {declineOpen && <DeclineDialog onConfirm={handleDecline} onCancel={() => setDecline(false)} />}
    </>
  )
}

/* ── Main dashboard ───────────────────────────────────── */
export default function CaregiverDashboard() {
  const [tab, setTab]               = useState('requests')
  const navigate                    = useNavigate()
  const [profile, setProfile]       = useState(null)
  const [requests, setRequests]     = useState([])
  const [recognition, setRecognition] = useState([])
  const [loading, setLoading]       = useState(true)
  const [error, setError]           = useState('')
  const currentUser                 = auth.getUser()

  const loadData = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const [prof, reqs] = await Promise.all([
        caregiverApi.getMe(),
        requestApi.list(),
      ])
      setProfile(prof)
      setRequests(reqs || [])

      if (prof?._id) {
        const rec = await recognitionApi.getByCaregiverId(prof._id)
        setRecognition(rec || [])
      }
    } catch (err) {
      // 404 = user logged in but never completed onboarding — prompt them to finish
      if (err.status === 404 || err.message?.toLowerCase().includes('not found')) {
        navigate('/caregiver/register', { replace: true })
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

  if (loading) return (
    <div className="cgd-page">
      <div className="cgd-topbar"><Link to="/"><img src="/Main Logo.png" alt="The Care Integrity Project" style={{ height: 42 }} /></Link></div>
      <div style={{ textAlign: 'center', padding: '80px 24px', color: 'var(--charcoal-light)' }}>Loading…</div>
    </div>
  )

  if (error) return (
    <div className="cgd-page">
      <div className="cgd-topbar"><Link to="/"><img src="/Main Logo.png" alt="The Care Integrity Project" style={{ height: 42 }} /></Link></div>
      <div style={{ textAlign: 'center', padding: '80px 24px', color: '#c0392b' }}>{error}</div>
    </div>
  )

  return (
    <div className="cgd-page">

      {/* Topbar */}
      <div className="cgd-topbar">
        <Link to="/" className="cgd-topbar__logo"><img src="/Main Logo.png" alt="The Care Integrity Project" /></Link>
        <div className="cgd-topbar__right">
          <Link to="/caregiver/profile/edit" className="btn btn-green-outline btn-sm">Edit Profile</Link>
          <Link to="/caregiver/profile?view=caregiver" className="btn btn-blue-outline btn-sm">My Profile</Link>
          <Link to="/caregiver/profile?view=public" className="btn btn-blue btn-sm">Public Preview</Link>
          <button className="btn btn-sm cgd-logout-btn" onClick={async () => {
            await authApi.logout().catch(() => {})
            auth.clearTokens()
            navigate('/caregiver/login', { replace: true })
          }}>Sign Out</button>
        </div>
      </div>

      <div className="cgd-layout">

        {/* Sidebar nav */}
        <nav className="cgd-nav" aria-label="Caregiver dashboard navigation">
          <div className="cgd-nav__greeting">
            <div className="cgd-nav__avatar">{profile?.fullName?.split(' ').map(n => n[0]).join('').slice(0, 2) || 'CG'}</div>
            <div>
              <div className="cgd-nav__name">{profile?.fullName || 'Caregiver'}</div>
              <div className="cgd-nav__role">{profile?.role || ''}</div>
            </div>
          </div>
          {[
            { key: 'requests',    label: 'Interview Requests', count: pending.length },
            { key: 'profile',     label: 'My Profile' },
            { key: 'credentials', label: 'Credentials & Training' },
            { key: 'employment',  label: 'Employment History' },
            { key: 'recognition', label: 'Recognition' },
            { key: 'standards',   label: 'Care Integrity Standards' },
          ].map(item => (
            <button key={item.key} className={`cgd-nav__item${tab === item.key ? ' active' : ''}`} onClick={() => setTab(item.key)}>
              {item.label}
              {item.count > 0 && <span className="cgd-nav__count">{item.count}</span>}
            </button>
          ))}
        </nav>

        {/* Main content */}
        <main className="cgd-main">

          {/* ── Requests ── */}
          {tab === 'requests' && (
            <div className="cgd-panel">
              <div className="cgd-panel__header">
                <h2 className="cgd-section-title">Interview Requests</h2>
                <p className="cgd-section-sub">You control whether to respond to any request.</p>
              </div>
              {pending.length > 0 && (
                <div className="cgd-request-group">
                  <div className="cgd-request-group__label">New Requests ({pending.length})</div>
                  {pending.map(r => <RequestCard key={r._id} req={r} onRefresh={loadData} />)}
                </div>
              )}
              {accepted.length > 0 && (
                <div className="cgd-request-group">
                  <div className="cgd-request-group__label">Accepted ({accepted.length})</div>
                  {accepted.map(r => <RequestCard key={r._id} req={r} onRefresh={loadData} />)}
                </div>
              )}
              {declined.length > 0 && (
                <div className="cgd-request-group">
                  <div className="cgd-request-group__label">Declined ({declined.length})</div>
                  {declined.map(r => <RequestCard key={r._id} req={r} onRefresh={loadData} />)}
                </div>
              )}
              {requests.length === 0 && (
                <div className="cgd-empty">No interview requests yet. Your profile is visible to agencies who may reach out.</div>
              )}
            </div>
          )}

          {/* ── Profile summary ── */}
          {tab === 'profile' && (
            <div className="cgd-panel">
              <div className="cgd-panel__header"><h2 className="cgd-section-title">My Profile</h2></div>
              <div className="cgd-profile-summary">
                {[
                  ['Name',         profile?.fullName],
                  ['Role',         profile?.role],
                  ['Service Area', profile?.serviceArea],
                  ['Experience',   profile?.yearsExp],
                ].map(([label, val]) => val && (
                  <div key={label} className="cgd-profile-summary__row">
                    <span>{label}</span><strong>{val}</strong>
                  </div>
                ))}
              </div>
              {currentUser && (
                <div className="cgd-private-note" role="note">
                  <strong>Private:</strong> Your email and phone are never shown publicly.
                  <div className="cgd-private-fields"><span>✉ {currentUser.email}</span></div>
                </div>
              )}
              <div className="cgd-panel__actions">
                <Link to="/caregiver/profile?view=caregiver" className="btn btn-blue-outline btn-sm">View Full Profile</Link>
                <Link to="/caregiver/profile?view=public" className="btn btn-blue btn-sm">Preview Public Profile</Link>
              </div>
            </div>
          )}

          {/* ── Credentials ── */}
          {tab === 'credentials' && (
            <div className="cgd-panel">
              <div className="cgd-panel__header">
                <h2 className="cgd-section-title">Credentials & Training</h2>
                <p className="cgd-section-sub">Upload documents to request verification.</p>
              </div>
              {profile?.credentials?.length > 0 ? profile.credentials.map(c => (
                <div key={c._id} className="cgd-entry-card">
                  <div className="cgd-entry-card__left">
                    <div className="cgd-entry-card__title">{c.name}</div>
                    <div className="cgd-entry-card__sub">
                      {c.org}{c.issuedDate ? ` · Issued ${c.issuedDate}` : ''}
                      {c.expiryDate ? ` · Expires ${c.expiryDate}` : ''}
                    </div>
                    {c.documentUrl && (
                      <a 
                        href={c.documentUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="cgd-doc-link"
                        style={{ 
                          display: 'inline-flex', 
                          alignItems: 'center', 
                          gap: '4px',
                          marginTop: '8px',
                          fontSize: '0.85rem',
                          color: 'var(--trust-blue)',
                          textDecoration: 'none'
                        }}
                      >
                        📄 View Document
                      </a>
                    )}
                  </div>
                  <span className={`cgd-badge ${c.status === 'verified' ? 'cgd-badge--accepted' : 'cgd-badge--pending'}`}>
                    {c.status === 'verified' ? 'Verified' : 'Caregiver Reported'}
                  </span>
                </div>
              )) : <div className="cgd-empty">No credentials added yet.</div>}
              <Link to="/caregiver/profile?view=caregiver" className="cgd-add-btn" style={{ marginTop: 12, display: 'inline-flex' }}>+ Add Credential</Link>
            </div>
          )}

          {/* ── Employment ── */}
          {tab === 'employment' && (
            <div className="cgd-panel">
              <div className="cgd-panel__header">
                <h2 className="cgd-section-title">Employment History</h2>
                <p className="cgd-section-sub">Agencies can verify positions you have listed. Use "Request Verification" to link an employment entry to the agency and ask them to confirm it.</p>
              </div>
              {profile?.employment?.length > 0 ? profile.employment.map(e => (
                <div key={e._id} className="cgd-entry-card">
                  <div className="cgd-entry-card__left">
                    <div className="cgd-entry-card__title">{e.role} — {e.orgName}</div>
                    <div className="cgd-entry-card__sub">{e.startDate} – {e.endDate || 'Present'}{e.setting ? ` · ${e.setting}` : ''}</div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6 }}>
                    <span className={`cgd-badge ${e.status === 'verified' ? 'cgd-badge--accepted' : e.status === 'pending_verification' ? 'cgd-badge--pending' : 'cgd-badge--grey'}`}>
                      {e.status === 'verified' ? 'Verified' : e.status === 'pending_verification' ? 'Pending Verification' : 'Caregiver Reported'}
                    </span>
                    {e.status === 'caregiver_reported' && (
                      <button
                        className="btn btn-sm btn-blue-outline"
                        style={{ fontSize: '0.72rem', padding: '4px 10px' }}
                        onClick={async () => {
                          try {
                            await verificationApi.claim(e._id, e.orgName)
                            loadData()
                          } catch (err) {
                            alert(err.message || 'Could not request verification.')
                          }
                        }}
                      >
                        Request Verification
                      </button>
                    )}
                  </div>
                </div>
              )) : <div className="cgd-empty">No employment history added yet.</div>}
              <Link to="/caregiver/profile?view=caregiver" className="cgd-add-btn" style={{ marginTop: 12, display: 'inline-flex' }}>+ Add Position</Link>
            </div>
          )}

          {/* ── Recognition ── */}
          {tab === 'recognition' && (
            <div className="cgd-panel">
              <div className="cgd-panel__header">
                <h2 className="cgd-section-title">Professional Recognition</h2>
                <p className="cgd-section-sub">Recognition from employers becomes a permanent part of your profile.</p>
              </div>
              {recognition.length > 0 ? recognition.map((r, i) => (
                <div key={i} className="cgd-entry-card">
                  <div className="cgd-entry-card__left">
                    <div className="cgd-entry-card__title">{r.standard}</div>
                    <div className="cgd-entry-card__sub">{r.agencyId?.name} · {new Date(r.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</div>
                  </div>
                  <span className="cgd-badge cgd-badge--accepted">Recognized</span>
                </div>
              )) : <div className="cgd-empty">No recognitions yet. Recognition from employers will appear here.</div>}
            </div>
          )}

          {/* ── Standards ── */}
          {tab === 'standards' && <TrainingTab />}

        </main>
      </div>
    </div>
  )
}
