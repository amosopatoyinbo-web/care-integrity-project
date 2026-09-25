import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { caregiverApi, auth, authApi } from '../../lib/api'
import RecognitionModal from './RecognitionModal'
import './CaregiverBrowse.css'

function Badge({ status }) {
  const map = {
    verified:           { label: 'Verified',           cls: 'cbr-badge--verified' },
    caregiver_reported: { label: 'Caregiver Reported', cls: 'cbr-badge--reported' },
    pending_verification:{ label: 'Pending',           cls: 'cbr-badge--pending' },
  }
  const s = map[status] || map.caregiver_reported
  return <span className={`cbr-badge ${s.cls}`}>{s.label}</span>
}

export default function CaregiverBrowse() {
  const [caregivers, setCaregivers] = useState([])
  const [page,       setPage]       = useState(1)
  const [total,      setTotal]      = useState(0)
  const [loading,    setLoading]    = useState(true)
  const [error,      setError]      = useState('')
  const [search,     setSearch]     = useState('')
  const [recognitionCaregiver, setRecognitionCaregiver] = useState(null)
  const navigate = useNavigate()
  const limit = 12

  useEffect(() => {
    async function load() {
      setLoading(true)
      setError('')
      try {
        const res = await caregiverApi.list(page)
        setCaregivers(res.data || [])
        setTotal(res.pagination?.total || 0)
      } catch (err) {
        setError(err.message || 'Could not load caregivers.')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [page])

  const filtered = search.trim()
    ? caregivers.filter(c =>
        c.fullName?.toLowerCase().includes(search.toLowerCase()) ||
        c.serviceArea?.toLowerCase().includes(search.toLowerCase()) ||
        c.role?.toLowerCase().includes(search.toLowerCase())
      )
    : caregivers

  const totalPages = Math.ceil(total / limit)

  return (
    <div className="cbr-page">

      {/* Topbar */}
      <div className="cbr-topbar">
        <Link to="/" className="cbr-topbar__logo">
          <img src="/Main Logo.png" alt="The Care Integrity Project" />
        </Link>
        <div className="cbr-topbar__right">
          <Link to="/agency/dashboard" className="btn btn-blue-outline btn-sm">← Dashboard</Link>
          <button className="btn btn-sm cbr-logout-btn" onClick={async () => {
            await authApi.logout().catch(() => {})
            auth.clearTokens()
            navigate('/login?role=agency', { replace: true })
          }}>Sign Out</button>
        </div>
      </div>

      <div className="cbr-inner">
        <div className="cbr-header">
          <h1 className="cbr-heading">Professional Caregivers</h1>
          <p className="cbr-sub">Browse caregiver profiles. Contact caregivers through the interview request system.</p>
          <div className="cbr-privacy-note" role="note">
            🔒 Personal contact information is private. Use <strong>Request an Interview</strong> to connect.
          </div>
        </div>

        {/* Search */}
        <div className="cbr-search-wrap">
          <input
            type="search"
            className="cbr-search"
            placeholder="Search by name, role, or service area…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            aria-label="Search caregivers"
          />
        </div>

        {loading && <div className="cbr-state">Loading caregivers…</div>}
        {error   && <div className="cbr-state cbr-state--error">{error}</div>}

        {!loading && !error && filtered.length === 0 && (
          <div className="cbr-state">No caregivers found{search ? ` matching "${search}"` : ''}.</div>
        )}

        {!loading && !error && (
          <div className="cbr-grid">
            {filtered.map(cg => (
              <div key={cg._id} className="cbr-card">
                <div className="cbr-card__avatar">
                  {cg.photoUrl
                    ? <img src={cg.photoUrl} alt={cg.fullName} className="cbr-card__photo" />
                    : <span className="cbr-card__initials">
                        {cg.fullName?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                      </span>
                  }
                </div>
                <div className="cbr-card__body">
                  <h3 className="cbr-card__name">{cg.fullName}</h3>
                  <p className="cbr-card__role">{cg.role}</p>
                  <p className="cbr-card__area">{cg.serviceArea}</p>
                  {cg.yearsExp && <p className="cbr-card__years">{cg.yearsExp} experience</p>}

                  {cg.standards?.length > 0 && (
                    <div className="cbr-card__standards">
                      {cg.standards.slice(0, 3).map(s => (
                        <span key={s} className="cbr-card__std-chip">{s}</span>
                      ))}
                      {cg.standards.length > 3 && (
                        <span className="cbr-card__std-more">+{cg.standards.length - 3}</span>
                      )}
                    </div>
                  )}

                  {cg.skills?.length > 0 && (
                    <div className="cbr-card__skills">
                      {cg.skills.slice(0, 3).map(s => (
                        <span key={s} className="cbr-card__skill">{s}</span>
                      ))}
                    </div>
                  )}

                  {cg.certificateCount > 0 && (
                    <div className="cbr-card__certificates">
                      <svg style={{ width: '18px', height: '18px', color: '#764ba2' }} fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span>{cg.certificateCount} Training {cg.certificateCount === 1 ? 'Certificate' : 'Certificates'}</span>
                    </div>
                  )}
                </div>
                <div className="cbr-card__footer">
                  <Link
                    to={`/caregiver/profile?view=agency&id=${cg._id}`}
                    className="btn btn-blue-outline btn-sm"
                    style={{ flex: 1 }}
                  >
                    View Profile
                  </Link>
                  <button
                    className="btn btn-green btn-sm"
                    style={{ flex: 1 }}
                    onClick={() => setRecognitionCaregiver(cg)}
                  >
                    Give Recognition
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="cbr-pagination" role="navigation" aria-label="Pagination">
            <button
              className="btn btn-blue-outline btn-sm"
              disabled={page <= 1}
              onClick={() => setPage(p => p - 1)}
            >
              ← Previous
            </button>
            <span className="cbr-pagination__label">
              Page {page} of {totalPages} ({total} total)
            </span>
            <button
              className="btn btn-blue-outline btn-sm"
              disabled={page >= totalPages}
              onClick={() => setPage(p => p + 1)}
            >
              Next →
            </button>
          </div>
        )}
      </div>

      {/* Recognition Modal */}
      {recognitionCaregiver && (
        <RecognitionModal
          caregiver={recognitionCaregiver}
          onClose={() => setRecognitionCaregiver(null)}
          onSuccess={() => {
            // Could refresh caregiver data or show success message
            setRecognitionCaregiver(null)
          }}
        />
      )}
    </div>
  )
}
