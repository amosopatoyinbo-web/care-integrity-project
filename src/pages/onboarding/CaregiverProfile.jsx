import { useState, useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import InterviewRequestModal from './InterviewRequestModal'
import { caregiverApi, recognitionApi, auth } from '../../lib/api'
import trainingApi from '../../lib/trainingApi'
import './CaregiverProfile.css'

/* ── Status badge map ─────────────────────────────────── */
const STATUS_MAP = {
  'verified':           { label: 'Verified',             cls: 'badge--verified' },
  'caregiver_reported': { label: 'Caregiver Reported',   cls: 'badge--reported' },
  'employer_submitted': { label: 'Employer Submitted',   cls: 'badge--employer' },
  'pending_verification':{ label: 'Pending Verification', cls: 'badge--pending' },
  'disputed':           { label: 'Disputed',             cls: 'badge--disputed' },
  'unresolved':         { label: 'Unresolved',           cls: 'badge--disputed' },
  'corrected':          { label: 'Corrected',            cls: 'badge--verified' },
}
function Badge({ status }) {
  const s = STATUS_MAP[status] || STATUS_MAP['caregiver_reported']
  return <span className={`cp-badge ${s.cls}`}>{s.label}</span>
}

function PrivacyGuard() {
  return (
    <div className="cp-privacy-banner" role="note">
      <span className="cp-privacy-banner__lock" aria-hidden="true">🔒</span>
      <div>
        <strong>Contact information is private.</strong>
        <p>Use <em>Request an Interview</em> to connect with this caregiver. Personal email, phone, and address are never shared publicly.</p>
      </div>
    </div>
  )
}

export default function CaregiverProfile() {
  const [params]          = useSearchParams()
  const viewMode          = params.get('view') ?? 'public'
  const isAgency          = viewMode === 'agency'
  const isCaregiver       = viewMode === 'caregiver'
  const [previewMode, setPreview] = useState(false)

  const [profile, setProfile]       = useState(null)
  const [recognition, setRecognition] = useState([])
  const [certificates, setCertificates] = useState([])
  const [loading, setLoading]       = useState(true)
  const [error, setError]           = useState('')
  const [modalOpen, setModalOpen]   = useState(false)

  const currentUser = auth.getUser()

  useEffect(() => {
    async function load() {
      setLoading(true)
      setError('')
      try {
        let data
        if (isCaregiver) {
          data = await caregiverApi.getMe()
        } else {
          // For public/agency views try to get from URL param or fall back to /me
          const id = params.get('id')
          data = id ? await caregiverApi.getById(id) : await caregiverApi.getMe()
        }
        setProfile(data)

        if (data?._id) {
          const rec = await recognitionApi.getByCaregiverId(data._id)
          setRecognition(rec || [])
          
          // Load certificates if viewing own profile or as agency
          if (isCaregiver || isAgency) {
            try {
              const certs = await trainingApi.getCertificates()
              setCertificates(certs || [])
            } catch (err) {
              // Certificates might not be available for non-caregiver views
              console.log('Could not load certificates:', err.message)
            }
          }
        }
      } catch (err) {
        setError(err.message || 'Could not load profile.')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [viewMode])

  if (loading) return (
    <div className="cp-page">
      <div className="cp-topbar">
        <Link to="/" className="cp-topbar__logo"><img src="/Main Logo.png" alt="The Care Integrity Project" /></Link>
      </div>
      <div style={{ textAlign: 'center', padding: '80px 24px', color: 'var(--charcoal-light)' }}>Loading profile…</div>
    </div>
  )

  if (error || !profile) return (
    <div className="cp-page">
      <div className="cp-topbar">
        <Link to="/" className="cp-topbar__logo"><img src="/Main Logo.png" alt="The Care Integrity Project" /></Link>
      </div>
      <div style={{ textAlign: 'center', padding: '80px 24px', color: '#c0392b' }}>
        {error || 'Profile not found.'}
        {isCaregiver && !profile && (
          <div style={{ marginTop: 16 }}>
            <Link to="/caregiver/register" className="btn btn-blue">Create Your Profile</Link>
          </div>
        )}
      </div>
    </div>
  )

  const showPrivate = isCaregiver && !previewMode
  const initials    = profile.fullName?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() || 'CG'

  return (
    <div className="cp-page">

      {/* Topbar */}
      <div className="cp-topbar">
        <Link to="/" className="cp-topbar__logo">
          <img src="/Main Logo.png" alt="The Care Integrity Project" />
        </Link>
        <div className="cp-topbar__right">
          {isCaregiver && !previewMode && (
            <>
              <button className="btn btn-blue-outline btn-sm" onClick={() => setPreview(true)}>Public Profile Preview</button>
              <Link to="/caregiver/dashboard" className="btn btn-blue btn-sm">My Dashboard</Link>
            </>
          )}
          {(isAgency || !isCaregiver) && (
            <Link to="/agency/dashboard" className="btn btn-blue-outline btn-sm">Agency Dashboard</Link>
          )}
          {previewMode && (
            <button className="btn btn-blue btn-sm" onClick={() => setPreview(false)}>← Exit Preview</button>
          )}
        </div>
      </div>

      {/* Preview banner */}
      {previewMode && (
        <div className="cp-preview-banner" role="status">
          You are previewing your public profile — exactly as agencies see it.
          <button onClick={() => setPreview(false)} className="cp-preview-banner__close">Exit Preview</button>
        </div>
      )}

      <div className="cp-layout">

        {/* Sidebar */}
        <aside className="cp-sidebar">
          <div className="cp-avatar-wrap">
            {profile.photoUrl
              ? <img src={profile.photoUrl} alt={profile.fullName} className="cp-avatar cp-avatar--photo" />
              : <div className="cp-avatar">{initials}</div>
            }
            <div className="cp-verified-ring" aria-label="Profile active" />
          </div>

          <h1 className="cp-name">{profile.fullName}</h1>
          <p className="cp-role">{profile.role}</p>
          <p className="cp-meta">{profile.serviceArea}{profile.yearsExp ? ` · ${profile.yearsExp}` : ''}</p>
          <p className="cp-member">Member since {profile.memberSince || new Date(profile.createdAt).getFullYear()}</p>

          {/* Action button */}
          {(isAgency || previewMode) ? (
            <button className="btn btn-green cp-interview-btn" onClick={() => setModalOpen(true)}>
              Request an Interview
            </button>
          ) : isCaregiver && !previewMode ? (
            <Link to="/caregiver/dashboard" className="btn btn-blue cp-interview-btn">My Dashboard</Link>
          ) : null}

          {/* Private block — caregiver only, not in preview */}
          {showPrivate && currentUser && (
            <div className="cp-private-block" aria-label="Private — only you see this">
              <div className="cp-private-block__label">Private — Only You See This</div>
              <div className="cp-private-block__row"><span>✉</span><span>{currentUser.email}</span></div>
            </div>
          )}

          {/* Standards */}
          {profile.standards?.length > 0 && (
            <div className="cp-sidebar-section">
              <div className="cp-sidebar-label">Standards Demonstrated</div>
              <div className="cp-standards-chips">
                {profile.standards.map(s => <span key={s} className="cp-std-chip">{s}</span>)}
              </div>
            </div>
          )}

          {/* Recognition */}
          {recognition.length > 0 && (
            <div className="cp-sidebar-section">
              <div className="cp-sidebar-label">Professional Recognition</div>
              {recognition.map((r, i) => (
                <div key={i} className="cp-recognition-item">
                  <span className="cp-recognition-standard">{r.standard}</span>
                  <span className="cp-recognition-from">{r.agencyId?.name} · {new Date(r.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</span>
                </div>
              ))}
            </div>
          )}

          {/* Training Certificates Count */}
          {certificates.length > 0 && (
            <div className="cp-sidebar-section">
              <div className="cp-sidebar-label">Training Certificates</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 0' }}>
                <svg style={{ width: '24px', height: '24px', color: '#764ba2' }} fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <div>
                  <div style={{ fontWeight: '700', fontSize: '1.2rem', color: 'var(--charcoal)' }}>
                    {certificates.length} {certificates.length === 1 ? 'Certificate' : 'Certificates'}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--charcoal-light)' }}>
                    Care Integrity Standards
                  </div>
                </div>
              </div>
            </div>
          )}
        </aside>

        {/* Main */}
        <main className="cp-main">

          {/* Bio */}
          <section className="cp-section">
            <h2 className="cp-section-title">Professional Bio</h2>
            <p className="cp-bio">{profile.bio || 'No bio provided yet.'}</p>
            {profile.carePhilosophy && (
              <>
                <h3 className="cp-subsection-title">Care Philosophy</h3>
                <p className="cp-bio">{profile.carePhilosophy}</p>
              </>
            )}
          </section>

          {/* Experience & Skills */}
          {(profile.careTypes?.length > 0 || profile.careSettings?.length > 0 || profile.skills?.length > 0) && (
            <section className="cp-section">
              <h2 className="cp-section-title">Experience & Skills</h2>
              {profile.careTypes?.length > 0 && (
                <div className="cp-chips-group">
                  <div className="cp-chips-label">Care Types</div>
                  <div className="cp-chips">{profile.careTypes.map(t => <span key={t} className="cp-chip cp-chip--blue">{t}</span>)}</div>
                </div>
              )}
              {profile.careSettings?.length > 0 && (
                <div className="cp-chips-group">
                  <div className="cp-chips-label">Care Settings</div>
                  <div className="cp-chips">{profile.careSettings.map(s => <span key={s} className="cp-chip cp-chip--aqua">{s}</span>)}</div>
                </div>
              )}
              {profile.skills?.length > 0 && (
                <div className="cp-chips-group">
                  <div className="cp-chips-label">Professional Skills</div>
                  <div className="cp-chips">{profile.skills.map(s => <span key={s} className="cp-chip cp-chip--green">{s}</span>)}</div>
                </div>
              )}
            </section>
          )}

          {/* Credentials */}
          {profile.credentials?.length > 0 && (
            <section className="cp-section">
              <h2 className="cp-section-title">Training & Credentials</h2>
              {profile.credentials.map(c => (
                <div key={c._id} className="cp-entry-card">
                  <div className="cp-entry-card__top">
                    <div>
                      <div className="cp-entry-card__title">{c.name}</div>
                      <div className="cp-entry-card__sub">{c.org}</div>
                      <div className="cp-entry-card__dates">
                        {c.issuedDate && `Issued ${c.issuedDate}`}{c.expiryDate ? ` · Expires ${c.expiryDate}` : ''}
                      </div>
                    </div>
                    <Badge status={c.status} />
                  </div>
                </div>
              ))}
              {isCaregiver && !previewMode && <Link to="/caregiver/dashboard" className="cp-add-link">+ Add Credential</Link>}
            </section>
          )}

          {/* Care Integrity Standards Certificates */}
          {certificates.length > 0 && (
            <section className="cp-section">
              <h2 className="cp-section-title">Care Integrity Standards Certificates</h2>
              <div className="cp-certificates-grid">
                {certificates.map(cert => (
                  <div key={cert._id} className="cp-certificate-badge">
                    <div className="cp-certificate-badge__icon">
                      <svg fill="currentColor" viewBox="0 0 20 20" style={{ width: '32px', height: '32px' }}>
                        <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="cp-certificate-badge__content">
                      <div className="cp-certificate-badge__title">{cert.title}</div>
                      <div className="cp-certificate-badge__category">{cert.category.charAt(0).toUpperCase() + cert.category.slice(1)}</div>
                      <div className="cp-certificate-badge__meta">
                        <span className="cp-certificate-badge__score">Score: {cert.score}%</span>
                        <span className="cp-certificate-badge__date">
                          {new Date(cert.issuedAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                        </span>
                      </div>
                      <div className="cp-certificate-badge__number">
                        #{cert.certificateNumber}
                      </div>
                    </div>
                    <div className="cp-certificate-badge__status">
                      <span className="cp-badge badge--verified">✓ Verified</span>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Employment */}
          {profile.employment?.length > 0 && (
            <section className="cp-section">
              <h2 className="cp-section-title">Employment History</h2>
              {profile.employment.map(e => (
                <div key={e._id} className="cp-entry-card">
                  <div className="cp-entry-card__top">
                    <div>
                      <div className="cp-entry-card__title">{e.role}</div>
                      <div className="cp-entry-card__sub">{e.orgName}</div>
                      <div className="cp-entry-card__dates">{e.startDate} – {e.endDate || 'Present'}{e.setting ? ` · ${e.setting}` : ''}</div>
                    </div>
                    <Badge status={e.status} />
                  </div>
                </div>
              ))}
              {isCaregiver && !previewMode && <Link to="/caregiver/dashboard" className="cp-add-link">+ Add Position</Link>}
            </section>
          )}

          {/* Privacy guard */}
          {(isAgency || previewMode) && <PrivacyGuard />}

        </main>
      </div>

      {/* Interview modal */}
      {modalOpen && (
        <InterviewRequestModal
          caregiverName={profile.fullName}
          caregiverId={profile._id}
          onClose={() => setModalOpen(false)}
        />
      )}
    </div>
  )
}
