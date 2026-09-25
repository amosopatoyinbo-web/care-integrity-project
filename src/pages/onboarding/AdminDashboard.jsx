import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { authApi, agencyApi, auth } from '../../lib/api'
import trainingApi from '../../lib/trainingApi'
import './AgencyDashboard.css'

export default function AdminDashboard() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [agencies, setAgencies] = useState([])
  const [trainingStats, setTrainingStats] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    const loadData = async () => {
      try {
        const user = auth.getUser()
        if (!user || user.role !== 'admin') {
          navigate('/admin/login', { replace: true })
          return
        }

        // Load all agencies
        const agencyData = await agencyApi.list()
        setAgencies(agencyData.agencies || [])
        
        // Load training statistics
        try {
          const stats = await trainingApi.adminGetStats()
          setTrainingStats(stats)
        } catch (err) {
          console.error('Failed to load training stats:', err)
          // Don't fail the whole page if training stats fail
        }
        
        setLoading(false)
      } catch (err) {
        if (err.status === 401) {
          auth.clearTokens()
          navigate('/admin/login', { replace: true })
        } else {
          setError('Failed to load data. Please refresh.')
          setLoading(false)
        }
      }
    }
    loadData()
  }, [navigate])

  async function handleVerifyAgency(agencyId, newStatus) {
    try {
      // Call backend to update verification status
      await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:4000/api'}/agencies/${agencyId}/verification`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${auth.getAccess()}`
        },
        body: JSON.stringify({ verificationStatus: newStatus })
      })

      // Update local state
      setAgencies(agencies.map(a => 
        a._id === agencyId ? { ...a, verificationStatus: newStatus } : a
      ))
    } catch (err) {
      alert('Failed to update verification status')
    }
  }

  if (loading) {
    return (
      <div className="adb-page">
        <div className="adb-container">
          <p style={{ textAlign: 'center', padding: '40px' }}>Loading...</p>
        </div>
      </div>
    )
  }

  const pendingAgencies = agencies.filter(a => a.verificationStatus === 'pending')
  const verifiedAgencies = agencies.filter(a => a.verificationStatus === 'verified')
  const underReviewAgencies = agencies.filter(a => a.verificationStatus === 'under_review')
  const attentionAgencies = agencies.filter(a => a.verificationStatus === 'attention_required')

  return (
    <div className="adb-page">
      <div className="adb-topbar">
        <Link to="/" className="adb-topbar__logo"><img src="/Main Logo.png" alt="The Care Integrity Project" /></Link>
        <div className="adb-topbar__right">
          <h2 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 600 }}>Admin Dashboard</h2>
          <button className="btn btn-sm cgd-logout-btn" onClick={async () => {
            await authApi.logout().catch(() => {})
            auth.clearTokens()
            navigate('/admin/login', { replace: true })
          }}>Sign Out</button>
        </div>
      </div>

      <div className="adb-container" style={{ padding: '40px', maxWidth: '1200px', margin: '0 auto' }}>
        
        {error && <div className="cgd-error" role="alert">{error}</div>}

        {/* Training Statistics */}
        {trainingStats && (
          <section style={{ marginBottom: '48px' }}>
            <h1 style={{ marginBottom: '8px' }}>Training System Overview</h1>
            <p style={{ color: 'var(--charcoal-pale)', marginBottom: '24px' }}>
              Care Integrity Standards training completion statistics
            </p>

            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', 
              gap: '20px',
              marginBottom: '32px'
            }}>
              {/* Total Lessons */}
              <div style={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                borderRadius: '12px',
                padding: '24px',
                color: 'white',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
              }}>
                <div style={{ fontSize: '0.85rem', opacity: 0.9, marginBottom: '8px' }}>Total Lessons</div>
                <div style={{ fontSize: '2.5rem', fontWeight: 700 }}>{trainingStats.totalLessons}</div>
                <div style={{ fontSize: '0.8rem', opacity: 0.85, marginTop: '4px' }}>
                  Available for caregivers
                </div>
              </div>

              {/* Total Certificates */}
              <div style={{
                background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                borderRadius: '12px',
                padding: '24px',
                color: 'white',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
              }}>
                <div style={{ fontSize: '0.85rem', opacity: 0.9, marginBottom: '8px' }}>Certificates Issued</div>
                <div style={{ fontSize: '2.5rem', fontWeight: 700 }}>{trainingStats.totalCertificates}</div>
                <div style={{ fontSize: '0.8rem', opacity: 0.85, marginTop: '4px' }}>
                  Active certifications
                </div>
              </div>

              {/* Completion Rate */}
              <div style={{
                background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                borderRadius: '12px',
                padding: '24px',
                color: 'white',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
              }}>
                <div style={{ fontSize: '0.85rem', opacity: 0.9, marginBottom: '8px' }}>Completion Rate</div>
                <div style={{ fontSize: '2.5rem', fontWeight: 700 }}>
                  {trainingStats.completionRate ? Math.round(trainingStats.completionRate) : 0}%
                </div>
                <div style={{ fontSize: '0.8rem', opacity: 0.85, marginTop: '4px' }}>
                  Of started lessons
                </div>
              </div>

              {/* In Progress */}
              <div style={{
                background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
                borderRadius: '12px',
                padding: '24px',
                color: 'white',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
              }}>
                <div style={{ fontSize: '0.85rem', opacity: 0.9, marginBottom: '8px' }}>In Progress</div>
                <div style={{ fontSize: '2.5rem', fontWeight: 700 }}>
                  {trainingStats.progressStats?.find(s => s._id === 'in_progress')?.count || 0}
                </div>
                <div style={{ fontSize: '0.8rem', opacity: 0.85, marginTop: '4px' }}>
                  Lessons being taken
                </div>
              </div>
            </div>

            {/* Progress Breakdown */}
            {trainingStats.progressStats && trainingStats.progressStats.length > 0 && (
              <div style={{
                background: 'white',
                borderRadius: '12px',
                padding: '24px',
                border: '1px solid #e0e0e0',
                boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
              }}>
                <h3 style={{ fontSize: '1.1rem', marginBottom: '16px', fontWeight: 600 }}>
                  Lesson Progress Breakdown
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
                  {trainingStats.progressStats.map(stat => {
                    const statusConfig = {
                      completed: { label: 'Completed', color: '#28a745', icon: '✓' },
                      in_progress: { label: 'In Progress', color: '#ffc107', icon: '⏳' },
                      not_started: { label: 'Not Started', color: '#6c757d', icon: '○' },
                      failed: { label: 'Failed', color: '#dc3545', icon: '✗' }
                    }
                    const config = statusConfig[stat._id] || statusConfig.not_started
                    
                    return (
                      <div key={stat._id} style={{
                        padding: '16px',
                        borderRadius: '8px',
                        border: `2px solid ${config.color}20`,
                        backgroundColor: `${config.color}10`
                      }}>
                        <div style={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          gap: '8px',
                          marginBottom: '8px'
                        }}>
                          <span style={{ fontSize: '1.5rem' }}>{config.icon}</span>
                          <span style={{ 
                            fontSize: '0.85rem', 
                            fontWeight: 600,
                            color: config.color
                          }}>
                            {config.label}
                          </span>
                        </div>
                        <div style={{ fontSize: '2rem', fontWeight: 700, color: config.color }}>
                          {stat.count}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}
          </section>
        )}

        <h1 style={{ marginBottom: '8px' }}>Agency Verification</h1>
        <p style={{ color: 'var(--charcoal-pale)', marginBottom: '32px' }}>
          Review and verify agency registrations.
        </p>

        {/* Pending Verification */}
        <section style={{ marginBottom: '40px' }}>
          <h2 style={{ fontSize: '1.3rem', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            Pending Verification
            {pendingAgencies.length > 0 && (
              <span style={{ 
                backgroundColor: '#ffc107', 
                color: '#000', 
                padding: '2px 8px', 
                borderRadius: '12px', 
                fontSize: '0.85rem', 
                fontWeight: 600 
              }}>
                {pendingAgencies.length}
              </span>
            )}
          </h2>
          {pendingAgencies.length > 0 ? (
            <div style={{ display: 'grid', gap: '16px' }}>
              {pendingAgencies.map(agency => (
                <AgencyCard key={agency._id} agency={agency} onVerify={handleVerifyAgency} />
              ))}
            </div>
          ) : (
            <p style={{ color: 'var(--charcoal-pale)', fontStyle: 'italic' }}>No agencies pending verification.</p>
          )}
        </section>

        {/* Under Review */}
        {underReviewAgencies.length > 0 && (
          <section style={{ marginBottom: '40px' }}>
            <h2 style={{ fontSize: '1.3rem', marginBottom: '16px' }}>Under Review ({underReviewAgencies.length})</h2>
            <div style={{ display: 'grid', gap: '16px' }}>
              {underReviewAgencies.map(agency => (
                <AgencyCard key={agency._id} agency={agency} onVerify={handleVerifyAgency} />
              ))}
            </div>
          </section>
        )}

        {/* Attention Required */}
        {attentionAgencies.length > 0 && (
          <section style={{ marginBottom: '40px' }}>
            <h2 style={{ fontSize: '1.3rem', marginBottom: '16px', color: '#dc3545' }}>
              Attention Required ({attentionAgencies.length})
            </h2>
            <div style={{ display: 'grid', gap: '16px' }}>
              {attentionAgencies.map(agency => (
                <AgencyCard key={agency._id} agency={agency} onVerify={handleVerifyAgency} />
              ))}
            </div>
          </section>
        )}

        {/* Verified Agencies */}
        <section>
          <h2 style={{ fontSize: '1.3rem', marginBottom: '16px' }}>Verified Agencies ({verifiedAgencies.length})</h2>
          {verifiedAgencies.length > 0 ? (
            <div style={{ display: 'grid', gap: '16px' }}>
              {verifiedAgencies.map(agency => (
                <AgencyCard key={agency._id} agency={agency} onVerify={handleVerifyAgency} />
              ))}
            </div>
          ) : (
            <p style={{ color: 'var(--charcoal-pale)', fontStyle: 'italic' }}>No verified agencies yet.</p>
          )}
        </section>

      </div>
    </div>
  )
}

function AgencyCard({ agency, onVerify }) {
  const statusColors = {
    pending: '#ffc107',
    under_review: '#0dcaf0',
    verified: '#28a745',
    attention_required: '#dc3545'
  }

  const statusLabels = {
    pending: 'Pending',
    under_review: 'Under Review',
    verified: 'Verified',
    attention_required: 'Attention Required'
  }

  return (
    <div style={{ 
      border: '1px solid #e0e0e0', 
      borderRadius: '8px', 
      padding: '20px',
      backgroundColor: '#fff'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
            {agency.logoUrl && (
              <img src={agency.logoUrl} alt={agency.name} style={{ width: '40px', height: '40px', objectFit: 'contain' }} />
            )}
            <div>
              <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 600 }}>{agency.name}</h3>
              <p style={{ margin: '4px 0 0', fontSize: '0.9rem', color: 'var(--charcoal-pale)' }}>{agency.orgType}</p>
            </div>
          </div>
          <p style={{ margin: '8px 0 0', fontSize: '0.9rem', color: 'var(--charcoal-pale)' }}>
            📍 {agency.location} • {agency.serviceArea}
          </p>
          {agency.website && (
            <p style={{ margin: '4px 0 0', fontSize: '0.9rem' }}>
              🌐 <a href={agency.website} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--trust-blue)' }}>
                {agency.website}
              </a>
            </p>
          )}
        </div>
        <div style={{ 
          padding: '4px 12px', 
          borderRadius: '12px', 
          backgroundColor: statusColors[agency.verificationStatus] + '20',
          color: statusColors[agency.verificationStatus],
          fontSize: '0.85rem',
          fontWeight: 600,
          whiteSpace: 'nowrap'
        }}>
          {statusLabels[agency.verificationStatus]}
        </div>
      </div>

      {agency.description && (
        <p style={{ fontSize: '0.9rem', color: 'var(--charcoal)', marginBottom: '16px' }}>
          {agency.description}
        </p>
      )}

      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
        {agency.verificationStatus !== 'verified' && (
          <button 
            className="btn btn-sm"
            style={{ backgroundColor: '#28a745', color: '#fff' }}
            onClick={() => onVerify(agency._id, 'verified')}
          >
            ✓ Verify
          </button>
        )}
        {agency.verificationStatus !== 'under_review' && (
          <button 
            className="btn btn-sm btn-outline"
            onClick={() => onVerify(agency._id, 'under_review')}
          >
            Under Review
          </button>
        )}
        {agency.verificationStatus !== 'attention_required' && (
          <button 
            className="btn btn-sm"
            style={{ backgroundColor: '#dc3545', color: '#fff' }}
            onClick={() => onVerify(agency._id, 'attention_required')}
          >
            Flag Issue
          </button>
        )}
        {agency.verificationStatus !== 'pending' && (
          <button 
            className="btn btn-sm btn-outline"
            onClick={() => onVerify(agency._id, 'pending')}
          >
            Reset to Pending
          </button>
        )}
      </div>
    </div>
  )
}
