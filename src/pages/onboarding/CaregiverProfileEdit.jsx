import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { caregiverApi, uploadApi, auth } from '../../lib/api'
import './CaregiverProfile.css'

export default function CaregiverProfileEdit() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const [profile, setProfile] = useState({
    fullName: '',
    role: '',
    serviceArea: '',
    yearsExp: '',
    bio: '',
    carePhilosophy: '',
    photoUrl: '',
    careTypes: [],
    careSettings: [],
    skills: [],
    standards: [],
  })

  const [photoFile, setPhotoFile] = useState(null)
  const [photoPreview, setPhotoPreview] = useState('')

  // Load existing profile
  useEffect(() => {
    const loadProfile = async () => {
      try {
        const data = await caregiverApi.getMe()
        setProfile(data)
        setPhotoPreview(data.photoUrl || '')
        setLoading(false)
      } catch (err) {
        if (err.status === 404) {
          navigate('/caregiver/register', { replace: true })
        } else {
          setError('Failed to load profile. Please try again.')
          setLoading(false)
        }
      }
    }
    loadProfile()
  }, [navigate])

  function handlePhotoSelect(e) {
    const file = e.target.files?.[0]
    if (!file) return
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file.')
      return
    }
    setPhotoFile(file)
    setPhotoPreview(URL.createObjectURL(file))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setSaving(true)
    setError('')
    setSuccess(false)

    try {
      // Upload new photo if provided
      let photoUrl = profile.photoUrl
      if (photoFile) {
        const { url } = await uploadApi.avatar(photoFile)
        photoUrl = url
      }

      // Update profile
      await caregiverApi.updateMe({
        fullName: profile.fullName,
        role: profile.role,
        serviceArea: profile.serviceArea,
        yearsExp: profile.yearsExp,
        bio: profile.bio,
        carePhilosophy: profile.carePhilosophy,
        photoUrl,
        careTypes: profile.careTypes,
        careSettings: profile.careSettings,
        skills: profile.skills,
        standards: profile.standards,
      })

      setSuccess(true)
      setTimeout(() => navigate('/caregiver/dashboard'), 1500)
    } catch (err) {
      setError(err.message || 'Failed to update profile. Please try again.')
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="cp-page">
        <div className="cp-container">
          <p style={{ textAlign: 'center', padding: '40px' }}>Loading profile...</p>
        </div>
      </div>
    )
  }

  const careTypeOptions = [
    'Elder Care', 'Dementia/Alzheimer\'s', 'Post-Surgery', 'Chronic Illness',
    'Palliative', 'End-of-Life', 'Respite Care', 'Live-In', 'Companionship'
  ]

  const settingOptions = [
    'Private Home', 'Assisted Living', 'Memory Care', 'Nursing Home',
    'Hospital', 'Hospice', 'Adult Day Center'
  ]

  const standardOptions = [
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

  return (
    <div className="cp-page">
      <div className="cp-container">
        <header className="cp-header">
          <button className="cp-back" onClick={() => navigate('/caregiver/dashboard')}>
            ← Back to Dashboard
          </button>
          <h1 className="cp-heading">Edit Your Profile</h1>
          <p className="cp-sub">Update your information to reflect your current experience and qualifications.</p>
        </header>

        {error && <div className="cp-error" role="alert">{error}</div>}
        {success && <div className="cp-success" role="alert">✓ Profile updated successfully! Redirecting...</div>}

        <form className="cp-form" onSubmit={handleSubmit}>
          
          {/* Photo */}
          <div className="cp-field">
            <label className="cp-label">Profile Photo</label>
            <div className="cp-photo-upload">
              {photoPreview ? (
                <img src={photoPreview} alt="Preview" className="cp-photo-preview" />
              ) : (
                <div className="cp-photo-placeholder">No photo</div>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={handlePhotoSelect}
                className="cp-photo-input"
              />
            </div>
          </div>

          {/* Full Name */}
          <div className="cp-field">
            <label className="cp-label">Full Name *</label>
            <input
              type="text"
              className="cp-input"
              value={profile.fullName}
              onChange={e => setProfile({ ...profile, fullName: e.target.value })}
              required
            />
          </div>

          {/* Role */}
          <div className="cp-field">
            <label className="cp-label">Professional Role *</label>
            <input
              type="text"
              className="cp-input"
              value={profile.role}
              onChange={e => setProfile({ ...profile, role: e.target.value })}
              placeholder="e.g., Certified Home Health Aide"
              required
            />
          </div>

          {/* Service Area */}
          <div className="cp-field">
            <label className="cp-label">Service Area *</label>
            <input
              type="text"
              className="cp-input"
              value={profile.serviceArea}
              onChange={e => setProfile({ ...profile, serviceArea: e.target.value })}
              placeholder="e.g., Greater Seattle Area"
              required
            />
          </div>

          {/* Years of Experience */}
          <div className="cp-field">
            <label className="cp-label">Years of Experience</label>
            <input
              type="text"
              className="cp-input"
              value={profile.yearsExp}
              onChange={e => setProfile({ ...profile, yearsExp: e.target.value })}
              placeholder="e.g., 5 years"
            />
          </div>

          {/* Bio */}
          <div className="cp-field">
            <label className="cp-label">Professional Bio</label>
            <textarea
              className="cp-textarea"
              rows={4}
              value={profile.bio}
              onChange={e => setProfile({ ...profile, bio: e.target.value })}
              placeholder="Share a brief overview of your caregiving experience..."
            />
          </div>

          {/* Care Philosophy */}
          <div className="cp-field">
            <label className="cp-label">Care Philosophy</label>
            <textarea
              className="cp-textarea"
              rows={3}
              value={profile.carePhilosophy}
              onChange={e => setProfile({ ...profile, carePhilosophy: e.target.value })}
              placeholder="What guides your approach to care?"
            />
          </div>

          {/* Care Types */}
          <div className="cp-field">
            <label className="cp-label">Care Types You Provide</label>
            <div className="cp-chips">
              {careTypeOptions.map(type => (
                <label key={type} className="cp-chip">
                  <input
                    type="checkbox"
                    checked={profile.careTypes.includes(type)}
                    onChange={e => {
                      if (e.target.checked) {
                        setProfile({ ...profile, careTypes: [...profile.careTypes, type] })
                      } else {
                        setProfile({ ...profile, careTypes: profile.careTypes.filter(t => t !== type) })
                      }
                    }}
                  />
                  {type}
                </label>
              ))}
            </div>
          </div>

          {/* Settings */}
          <div className="cp-field">
            <label className="cp-label">Care Settings</label>
            <div className="cp-chips">
              {settingOptions.map(setting => (
                <label key={setting} className="cp-chip">
                  <input
                    type="checkbox"
                    checked={profile.careSettings.includes(setting)}
                    onChange={e => {
                      if (e.target.checked) {
                        setProfile({ ...profile, careSettings: [...profile.careSettings, setting] })
                      } else {
                        setProfile({ ...profile, careSettings: profile.careSettings.filter(s => s !== setting) })
                      }
                    }}
                  />
                  {setting}
                </label>
              ))}
            </div>
          </div>

          {/* Standards Commitment */}
          <div className="cp-field">
            <label className="cp-label">Care Integrity Standards (10 commitments)</label>
            <div className="cp-chips">
              {standardOptions.map(standard => (
                <label key={standard} className="cp-chip">
                  <input
                    type="checkbox"
                    checked={profile.standards.includes(standard)}
                    onChange={e => {
                      if (e.target.checked) {
                        setProfile({ ...profile, standards: [...profile.standards, standard] })
                      } else {
                        setProfile({ ...profile, standards: profile.standards.filter(s => s !== standard) })
                      }
                    }}
                  />
                  {standard}
                </label>
              ))}
            </div>
          </div>

          {/* Submit */}
          <div className="cp-actions">
            <button type="button" className="btn btn-outline" onClick={() => navigate('/caregiver/dashboard')}>
              Cancel
            </button>
            <button type="submit" className="btn btn-green" disabled={saving}>
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
