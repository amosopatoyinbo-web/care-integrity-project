import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { agencyApi, uploadApi } from '../../lib/api'
import './AgencyOnboarding.css'

export default function AgencyProfileEdit() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const [profile, setProfile] = useState({
    name: '',
    orgType: '',
    location: '',
    serviceArea: '',
    website: '',
    yearEstablished: '',
    size: '',
    description: '',
    logoUrl: '',
    careTypes: [],
    serviceAreas: [],
    settings: [],
    focus: [],
  })

  const [logoFile, setLogoFile] = useState(null)
  const [logoPreview, setLogoPreview] = useState('')

  // Load existing profile
  useEffect(() => {
    const loadProfile = async () => {
      try {
        const data = await agencyApi.getMe()
        setProfile(data)
        setLogoPreview(data.logoUrl || '')
        setLoading(false)
      } catch (err) {
        if (err.status === 404) {
          navigate('/agency/register', { replace: true })
        } else {
          setError('Failed to load profile. Please try again.')
          setLoading(false)
        }
      }
    }
    loadProfile()
  }, [navigate])

  function handleLogoSelect(e) {
    const file = e.target.files?.[0]
    if (!file) return
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file.')
      return
    }
    setLogoFile(file)
    setLogoPreview(URL.createObjectURL(file))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setSaving(true)
    setError('')
    setSuccess(false)

    try {
      // Upload new logo if provided
      let logoUrl = profile.logoUrl
      if (logoFile) {
        const { url } = await uploadApi.logo(logoFile)
        logoUrl = url
      }

      // Update profile
      await agencyApi.updateMe({
        name: profile.name,
        orgType: profile.orgType,
        location: profile.location,
        serviceArea: profile.serviceArea,
        website: profile.website,
        yearEstablished: profile.yearEstablished,
        size: profile.size,
        description: profile.description,
        logoUrl,
        careTypes: profile.careTypes,
        serviceAreas: profile.serviceAreas,
        settings: profile.settings,
        focus: profile.focus,
      })

      setSuccess(true)
      setTimeout(() => navigate('/agency/dashboard'), 1500)
    } catch (err) {
      setError(err.message || 'Failed to update profile. Please try again.')
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="ob-page">
        <div className="ob-page__content">
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

  const focusOptions = [
    'Quality Over Quantity', 'Caregiver Support', 'Training & Development',
    'Fair Compensation', 'Work-Life Balance', 'Recognition Programs'
  ]

  return (
    <div className="ob-page">
      <div className="ob-page__content">
        <header className="ob-page__header">
          <button className="btn btn-outline btn-sm" onClick={() => navigate('/agency/dashboard')}>
            ← Back to Dashboard
          </button>
          <img src="/Main Logo.png" alt="The Care Integrity Project" className="ob-page__logo" />
          <h1 className="ob-page__heading">Edit Agency Profile</h1>
          <p className="ob-page__sub">Update your organization's information.</p>
        </header>

        {error && <div className="ob-page__error" role="alert">{error}</div>}
        {success && <div className="ob-page__success" role="alert">✓ Profile updated successfully! Redirecting...</div>}

        <form className="ob-page__form" onSubmit={handleSubmit}>
          
          {/* Logo */}
          <div className="ob-field">
            <label className="ob-label">Organization Logo</label>
            <div className="ob-logo-upload">
              {logoPreview ? (
                <img src={logoPreview} alt="Logo preview" className="ob-logo-preview" />
              ) : (
                <div className="ob-logo-placeholder">No logo</div>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={handleLogoSelect}
                className="ob-logo-input"
              />
            </div>
          </div>

          {/* Organization Name */}
          <div className="ob-field">
            <label className="ob-label">Organization Name *</label>
            <input
              type="text"
              className="ob-input"
              value={profile.name}
              onChange={e => setProfile({ ...profile, name: e.target.value })}
              required
            />
          </div>

          {/* Organization Type */}
          <div className="ob-field">
            <label className="ob-label">Organization Type *</label>
            <select
              className="ob-input"
              value={profile.orgType}
              onChange={e => setProfile({ ...profile, orgType: e.target.value })}
              required
            >
              <option value="">Select type...</option>
              <option value="Home Care Agency">Home Care Agency</option>
              <option value="Staffing Agency">Staffing Agency</option>
              <option value="Assisted Living Facility">Assisted Living Facility</option>
              <option value="Memory Care Facility">Memory Care Facility</option>
              <option value="Nursing Home">Nursing Home</option>
              <option value="Hospice">Hospice</option>
              <option value="Adult Day Center">Adult Day Center</option>
              <option value="Other">Other</option>
            </select>
          </div>

          {/* Location */}
          <div className="ob-field">
            <label className="ob-label">Primary Location *</label>
            <input
              type="text"
              className="ob-input"
              value={profile.location}
              onChange={e => setProfile({ ...profile, location: e.target.value })}
              placeholder="e.g., Seattle, WA"
              required
            />
          </div>

          {/* Service Area */}
          <div className="ob-field">
            <label className="ob-label">Service Area *</label>
            <input
              type="text"
              className="ob-input"
              value={profile.serviceArea}
              onChange={e => setProfile({ ...profile, serviceArea: e.target.value })}
              placeholder="e.g., King County and surrounding areas"
              required
            />
          </div>

          {/* Website */}
          <div className="ob-field">
            <label className="ob-label">Website</label>
            <input
              type="url"
              className="ob-input"
              value={profile.website}
              onChange={e => setProfile({ ...profile, website: e.target.value })}
              placeholder="https://yourwebsite.com"
            />
          </div>

          {/* Year Established */}
          <div className="ob-field">
            <label className="ob-label">Year Established</label>
            <input
              type="text"
              className="ob-input"
              value={profile.yearEstablished}
              onChange={e => setProfile({ ...profile, yearEstablished: e.target.value })}
              placeholder="e.g., 2015"
            />
          </div>

          {/* Size */}
          <div className="ob-field">
            <label className="ob-label">Organization Size</label>
            <select
              className="ob-input"
              value={profile.size}
              onChange={e => setProfile({ ...profile, size: e.target.value })}
            >
              <option value="">Select size...</option>
              <option value="1-10">1-10 caregivers</option>
              <option value="11-50">11-50 caregivers</option>
              <option value="51-200">51-200 caregivers</option>
              <option value="201-500">201-500 caregivers</option>
              <option value="501+">501+ caregivers</option>
            </select>
          </div>

          {/* Description */}
          <div className="ob-field">
            <label className="ob-label">Organization Description</label>
            <textarea
              className="ob-textarea"
              rows={4}
              value={profile.description}
              onChange={e => setProfile({ ...profile, description: e.target.value })}
              placeholder="Tell caregivers about your organization, values, and what makes you unique..."
            />
          </div>

          {/* Care Types */}
          <div className="ob-field">
            <label className="ob-label">Care Types You Specialize In</label>
            <div className="ob-chips">
              {careTypeOptions.map(type => (
                <label key={type} className="ob-chip">
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
          <div className="ob-field">
            <label className="ob-label">Care Settings</label>
            <div className="ob-chips">
              {settingOptions.map(setting => (
                <label key={setting} className="ob-chip">
                  <input
                    type="checkbox"
                    checked={profile.settings.includes(setting)}
                    onChange={e => {
                      if (e.target.checked) {
                        setProfile({ ...profile, settings: [...profile.settings, setting] })
                      } else {
                        setProfile({ ...profile, settings: profile.settings.filter(s => s !== setting) })
                      }
                    }}
                  />
                  {setting}
                </label>
              ))}
            </div>
          </div>

          {/* Professional Focus */}
          <div className="ob-field">
            <label className="ob-label">Professional Focus</label>
            <div className="ob-chips">
              {focusOptions.map(focus => (
                <label key={focus} className="ob-chip">
                  <input
                    type="checkbox"
                    checked={profile.focus.includes(focus)}
                    onChange={e => {
                      if (e.target.checked) {
                        setProfile({ ...profile, focus: [...profile.focus, focus] })
                      } else {
                        setProfile({ ...profile, focus: profile.focus.filter(f => f !== focus) })
                      }
                    }}
                  />
                  {focus}
                </label>
              ))}
            </div>
          </div>

          {/* Submit */}
          <div className="ob-actions">
            <button type="button" className="btn btn-outline" onClick={() => navigate('/agency/dashboard')}>
              Cancel
            </button>
            <button type="submit" className="btn btn-blue" disabled={saving}>
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
