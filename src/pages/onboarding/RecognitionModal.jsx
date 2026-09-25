import { useState } from 'react'
import { recognitionApi } from '../../lib/api'
import './InterviewRequestModal.css'

const STANDARDS = [
  'Respect Dignity & Autonomy',
  'Person-Centered Care',
  'Clear Communication',
  'Reliable & Accountable',
  'Safety First',
  'Cultural Sensitivity',
  'Professional Boundaries',
  'Collaborate with Families',
  'Lifelong Learning',
  'Self-Care & Wellbeing'
]

export default function RecognitionModal({ caregiver, onClose, onSuccess }) {
  const [selectedStandards, setSelectedStandards] = useState([])
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  function toggleStandard(standard) {
    if (selectedStandards.includes(standard)) {
      setSelectedStandards(selectedStandards.filter(s => s !== standard))
    } else {
      setSelectedStandards([...selectedStandards, standard])
    }
  }

  async function handleSubmit(e) {
    e.preventDefault()
    
    if (selectedStandards.length === 0) {
      setError('Please select at least one standard.')
      return
    }

    setLoading(true)
    setError('')

    try {
      await recognitionApi.give({
        caregiverId: caregiver._id,
        standards: selectedStandards,
        message: message.trim()
      })
      
      if (onSuccess) onSuccess()
      onClose()
    } catch (err) {
      setError(err.message || 'Failed to submit recognition. Please try again.')
      setLoading(false)
    }
  }

  return (
    <div className="irm-overlay" onClick={onClose}>
      <div className="irm-modal" onClick={e => e.stopPropagation()}>
        
        <div className="irm-header">
          <div>
            <h2 className="irm-title">Recognize {caregiver.fullName}</h2>
            <p className="irm-subtitle">
              Publicly acknowledge this caregiver for demonstrating The Care Integrity Standards.
            </p>
          </div>
          <button className="irm-close" onClick={onClose}>✕</button>
        </div>

        {error && <div className="irm-error" role="alert">{error}</div>}

        <form className="irm-form" onSubmit={handleSubmit}>
          
          {/* Standards Selection */}
          <div className="irm-field">
            <label className="irm-label">
              Select Standards Demonstrated *
              <span style={{ fontWeight: 400, fontSize: '0.85rem', color: 'var(--charcoal-pale)' }}>
                {' '}(Choose 1 or more)
              </span>
            </label>
            <div style={{ 
              display: 'grid', 
              gap: '8px',
              marginTop: '8px'
            }}>
              {STANDARDS.map(standard => (
                <label 
                  key={standard}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '12px',
                    border: selectedStandards.includes(standard) 
                      ? '2px solid var(--integrity-green)' 
                      : '1px solid #e0e0e0',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    backgroundColor: selectedStandards.includes(standard) 
                      ? '#f0f9f4' 
                      : '#fff',
                    transition: 'all 0.2s'
                  }}
                >
                  <input
                    type="checkbox"
                    checked={selectedStandards.includes(standard)}
                    onChange={() => toggleStandard(standard)}
                    style={{ 
                      width: '18px', 
                      height: '18px',
                      cursor: 'pointer',
                      accentColor: 'var(--integrity-green)'
                    }}
                  />
                  <span style={{ 
                    fontSize: '0.95rem',
                    fontWeight: selectedStandards.includes(standard) ? 600 : 400
                  }}>
                    {standard}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Optional Message */}
          <div className="irm-field">
            <label className="irm-label" htmlFor="recognition-message">
              Message (Optional)
              <span style={{ fontWeight: 400, fontSize: '0.85rem', color: 'var(--charcoal-pale)' }}>
                {' '}Share specific examples or appreciation
              </span>
            </label>
            <textarea
              id="recognition-message"
              className="irm-textarea"
              rows={4}
              value={message}
              onChange={e => setMessage(e.target.value)}
              placeholder="Example: Sarah consistently demonstrates respect for client autonomy by involving them in daily care decisions..."
              maxLength={500}
            />
            <div style={{ 
              fontSize: '0.75rem', 
              color: 'var(--charcoal-pale)', 
              textAlign: 'right',
              marginTop: '4px'
            }}>
              {message.length}/500
            </div>
          </div>

          {/* Info Notice */}
          <div style={{
            padding: '12px',
            backgroundColor: '#e7f3ff',
            border: '1px solid #0dcaf0',
            borderRadius: '6px',
            fontSize: '0.85rem',
            color: 'var(--charcoal)',
            marginBottom: '16px'
          }}>
            ℹ️ This recognition will be publicly visible on {caregiver.fullName}'s profile and permanently associated with your agency.
          </div>

          {/* Actions */}
          <div className="irm-actions">
            <button 
              type="button" 
              className="btn btn-outline" 
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="btn btn-green"
              disabled={loading || selectedStandards.length === 0}
            >
              {loading ? 'Submitting...' : `Submit Recognition`}
            </button>
          </div>
        </form>

      </div>
    </div>
  )
}
