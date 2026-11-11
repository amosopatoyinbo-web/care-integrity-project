import { useState, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import ProgressBar from '../../components/onboarding/ProgressBar'
import ChipSelect from '../../components/onboarding/ChipSelect'
import OTPVerification from '../../components/OTPVerification'
import { authApi, caregiverApi, uploadApi, auth } from '../../lib/api'
import { PROFESSIONAL_ROLES, EMPLOYMENT_STATUS_OPTIONS, US_STATES, requiresLicense } from '../../constants/professionalCategories'
import './CaregiverOnboarding.css'

const STEPS = ['Account', 'About You', 'Experience', 'Training', 'Commitment']

const CARE_EXPERIENCE = ['Personal Care', 'Companion Care', 'Home Health', 'Dementia / Memory Care', 'Hospice / Palliative', 'Post-Surgery Recovery', 'Pediatric Care', 'Disability Support']
const CARE_SETTINGS   = ['Private Home', 'Assisted Living', 'Memory Care Facility', 'Adult Day Program', 'Skilled Nursing', 'Hospital', 'Community-Based', 'Group Home']
const CARE_TYPES      = ['Activities of Daily Living', 'Medication Reminders', 'Meal Preparation', 'Transportation', 'Light Housekeeping', 'Emotional Support', 'Physical Therapy Assist', 'Wound Care Assist']
const SKILLS          = ['CPR Certified', 'First Aid', 'Dementia Training', 'Fall Prevention', 'Communication', 'Documentation', 'Empathy & Patience', 'Crisis Response', 'Cultural Competency']

const STANDARDS = [
  { num: '01', name: 'Compassion',          tagline: 'See the person—not just the task.' },
  { num: '02', name: 'Dependability',        tagline: 'Be someone people can count on.' },
  { num: '03', name: 'Accountability',       tagline: 'Take responsibility for your actions.' },
  { num: '04', name: 'Safety',               tagline: 'Pay attention. Speak up. Act responsibly.' },
  { num: '05', name: 'Communication',        tagline: 'Clear. Respectful. Timely.' },
  { num: '06', name: 'Dignity & Respect',    tagline: 'Every person deserves both.' },
  { num: '07', name: 'Professionalism',      tagline: 'Treat caregiving like the profession it is.' },
  { num: '08', name: 'Integrity',            tagline: 'Do the right thing—even when no one is watching.' },
  { num: '09', name: 'Advocacy',             tagline: 'When something matters, speak up appropriately.' },
  { num: '10', name: 'Person-Centered Care', tagline: 'Put the person before the task list.' },
]

/* ── Shared form components ───────────────────────────── */

function Field({ label, id, required, hint, error, children }) {
  return (
    <div className="ob-field">
      <label className="ob-label" htmlFor={id}>
        {label}{required && <span className="ob-required" aria-hidden="true"> *</span>}
      </label>
      {hint  && <p className="ob-hint"  >{hint}</p>}
      {children}
      {error && <p className="ob-error" role="alert">{error}</p>}
    </div>
  )
}
function Input({ id, type = 'text', placeholder, value, onChange, ...rest }) {
  return <input id={id} type={type} className="ob-input" placeholder={placeholder} value={value} onChange={e => onChange(e.target.value)} {...rest} />
}
function Select({ id, options, value, onChange }) {
  return (
    <select id={id} className="ob-select" value={value} onChange={e => onChange(e.target.value)}>
      <option value="">Select…</option>
      {options.map(o => <option key={o} value={o}>{o}</option>)}
    </select>
  )
}
function Textarea({ id, placeholder, value, onChange, rows = 4 }) {
  return <textarea id={id} className="ob-textarea" placeholder={placeholder} value={value} onChange={e => onChange(e.target.value)} rows={rows} />
}

/* ── Steps ────────────────────────────────────────────── */

function Step1({ data, set, error, validationErrors }) {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const passwordTooShort = data.password && data.password.length < 8
  const passwordMismatch = data.password && data.confirm && data.password !== data.confirm
  
  return (
    <div className="ob-step">
      <div className="ob-step__header">
        <h2 className="ob-step__title">Create Your Account</h2>
        <p className="ob-step__sub">Start building your professional caregiving profile.</p>
      </div>
      <div className="ob-privacy-notice" role="note">
        <span aria-hidden="true">🔒</span>
        <p>Your phone number and email are <strong>private</strong> and will not appear on your public profile.</p>
      </div>
      {error && <p className="ob-error ob-error--banner" role="alert">{error}</p>}
      <Field label="Email Address" id="email" required error={validationErrors.email}>
        <Input id="email" type="email" placeholder="you@example.com" value={data.email} onChange={v => set('email', v)} />
      </Field>
      <Field label="Password" id="password" required hint="At least 8 characters." error={validationErrors.password || (passwordTooShort ? 'Password must be at least 8 characters' : '')}>
        <div style={{ position: 'relative' }}>
          <Input id="password" type={showPassword ? "text" : "password"} placeholder="Create a password" value={data.password} onChange={v => set('password', v)} style={{ paddingRight: '45px' }} />
          <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', padding: '4px', color: '#666', fontSize: '18px' }} aria-label={showPassword ? "Hide password" : "Show password"}>
            {showPassword ? '👁️' : '👁️‍🗨️'}
          </button>
        </div>
      </Field>
      <Field label="Confirm Password" id="confirm" required error={validationErrors.confirm || (passwordMismatch ? 'Passwords do not match' : '')}>
        <div style={{ position: 'relative' }}>
          <Input id="confirm" type={showConfirm ? "text" : "password"} placeholder="Repeat your password" value={data.confirm} onChange={v => set('confirm', v)} style={{ paddingRight: '45px' }} />
          <button type="button" onClick={() => setShowConfirm(!showConfirm)} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', padding: '4px', color: '#666', fontSize: '18px' }} aria-label={showConfirm ? "Hide password" : "Show password"}>
            {showConfirm ? '👁️' : '👁️‍🗨️'}
          </button>
        </div>
      </Field>
      <Field label="Phone Number" id="phone" required error={validationErrors.phone}>
        <Input id="phone" type="tel" placeholder="+1 (555) 000-0000" value={data.phone} onChange={v => set('phone', v)} />
      </Field>
      <Field label="Country / Region" id="country" required error={validationErrors.country}>
        <Select id="country" options={['United States', 'Canada', 'United Kingdom', 'Australia', 'Other']} value={data.country} onChange={v => set('country', v)} />
      </Field>
      
      <div className="ob-legal-checkboxes">
        <label className="ob-checkbox">
          <input type="checkbox" checked={data.terms} onChange={e => set('terms', e.target.checked)} />
          <span>I confirm that I am at least 18 years old, agree to The Care Integrity Project's <Link to="/terms" className="ob-link">Terms & Conditions</Link>, and acknowledge that I have read its <Link to="/privacy" className="ob-link">Privacy Policy</Link>.</span>
        </label>
        {validationErrors.terms && <p className="ob-error" role="alert">{validationErrors.terms}</p>}
        
        <label className="ob-checkbox">
          <input type="checkbox" checked={data.profileConsent} onChange={e => set('profileConsent', e.target.checked)} />
          <span>I understand and agree that information in my professional profile designated for employer viewing may be accessed by approved healthcare employers for recruiting purposes. I understand that creating a profile does not guarantee employment or an interview.</span>
        </label>
        {validationErrors.profileConsent && <p className="ob-error" role="alert">{validationErrors.profileConsent}</p>}
      </div>
    </div>
  )
}

function Step2({ data, set, validationErrors }) {
  const photoRef = useRef()
  return (
    <div className="ob-step">
      <div className="ob-step__header">
        <h2 className="ob-step__title">About You</h2>
        <p className="ob-step__sub">Help others understand who you are as a professional.</p>
      </div>
      <div className="ob-photo-upload">
        <div className="ob-photo-upload__preview">
          {data.photoPreview ? <img src={data.photoPreview} alt="Profile preview" /> : <span aria-hidden="true">📷</span>}
        </div>
        <div className="ob-photo-upload__actions">
          <button type="button" className="btn btn-blue-outline btn-sm" onClick={() => photoRef.current.click()}>Upload Photo</button>
          <p className="ob-hint">JPG or PNG. Max 5 MB.</p>
          <input ref={photoRef} type="file" accept="image/*" style={{ display: 'none' }}
            onChange={e => { const f = e.target.files[0]; if (f) { set('photo', f); set('photoPreview', URL.createObjectURL(f)) } }} />
        </div>
      </div>
      <Field label="Full Name" id="fullName" required error={validationErrors.fullName}>
        <Input id="fullName" placeholder="Your full name" value={data.fullName} onChange={v => set('fullName', v)} />
      </Field>
      <Field label="Professional Category" id="role" required error={validationErrors.role}>
        <Select id="role" options={PROFESSIONAL_ROLES} value={data.role} onChange={v => set('role', v)} />
      </Field>
      <Field label="Employment Status" id="employmentStatus" required error={validationErrors.employmentStatus}>
        <select
          id="employmentStatus"
          className="ob-select"
          value={data.employmentStatus}
          onChange={e => set('employmentStatus', e.target.value)}
        >
          {EMPLOYMENT_STATUS_OPTIONS.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </Field>
      
      {/* Conditional License Fields - Show only for licensed professionals */}
      {requiresLicense(data.role) && (
        <>
          <Field label="License/Certification Number" id="licenseNumber" hint="Optional. Self-reported until verified." error={validationErrors.licenseNumber}>
            <Input id="licenseNumber" placeholder="Enter license number" value={data.licenseNumber} onChange={v => set('licenseNumber', v)} />
          </Field>
          <div className="ob-row-2">
            <Field label="Licensing State" id="licensingState">
              <Select id="licensingState" options={['', ...US_STATES]} value={data.licensingState} onChange={v => set('licensingState', v)} />
            </Field>
            <Field label="License Expiry Date" id="licenseExpiry" hint="Optional">
              <Input id="licenseExpiry" type="date" value={data.licenseExpiry} onChange={v => set('licenseExpiry', v)} />
            </Field>
          </div>
        </>
      )}
      
      <Field label="Years of Experience" id="years" required error={validationErrors.years}>
        <Select id="years" options={['Less than 1 year', '1–2 years', '3–5 years', '6–10 years', '10+ years']} value={data.years} onChange={v => set('years', v)} />
      </Field>
      <Field label="Primary Service Area" id="serviceArea" required hint="City, region, or zip code." error={validationErrors.serviceArea}>
        <Input id="serviceArea" placeholder="e.g. Seattle, WA" value={data.serviceArea} onChange={v => set('serviceArea', v)} />
      </Field>
      <Field label="Professional Bio" id="bio" hint="Appears on your public profile.">
        <Textarea id="bio" placeholder="I am a dedicated caregiver with a passion for..." value={data.bio} onChange={v => set('bio', v)} rows={4} />
      </Field>
      <Field label="Care Philosophy" id="philosophy" hint="Optional.">
        <Textarea id="philosophy" placeholder="My approach to care is centered on..." value={data.philosophy} onChange={v => set('philosophy', v)} rows={3} />
      </Field>
    </div>
  )
}

function Step3({ data, set }) {
  return (
    <div className="ob-step">
      <div className="ob-step__header">
        <h2 className="ob-step__title">Experience & Skills</h2>
        <p className="ob-step__sub">Select all that apply. These appear on your public profile.</p>
      </div>
      <Field label="Care Experience" id="careExp" hint="Types of care you have provided.">
        <ChipSelect options={CARE_EXPERIENCE} selected={data.careExp} onChange={v => set('careExp', v)} />
      </Field>
      <Field label="Care Settings" id="settings" hint="Where you have worked.">
        <ChipSelect options={CARE_SETTINGS} selected={data.settings} onChange={v => set('settings', v)} />
      </Field>
      <Field label="Care Types" id="careTypes" hint="Specific tasks and support types.">
        <ChipSelect options={CARE_TYPES} selected={data.careTypes} onChange={v => set('careTypes', v)} />
      </Field>
      <Field label="Professional Skills" id="skills" hint="Skills and certifications.">
        <ChipSelect options={SKILLS} selected={data.skills} onChange={v => set('skills', v)} />
      </Field>
      <div className="ob-note"><p>We do not use star ratings or skill scores.</p></div>
    </div>
  )
}

function Step4({ data, set }) {
  const docRef = useRef()
  function addCredential() { set('credentials', [...data.credentials, { name: '', org: '', date: '', expiry: '', doc: null }]) }
  function updateCred(i, key, val) { const c = [...data.credentials]; c[i] = { ...c[i], [key]: val }; set('credentials', c) }
  function addEmployment() { set('employment', [...data.employment, { org: '', role: '', start: '', end: '', setting: '', responsibilities: '' }]) }
  function updateEmp(i, key, val) { const e = [...data.employment]; e[i] = { ...e[i], [key]: val }; set('employment', e) }

  return (
    <div className="ob-step">
      <div className="ob-step__header">
        <h2 className="ob-step__title">Training & Employment</h2>
        <p className="ob-step__sub">Build a verified professional record over time.</p>
      </div>
      <div className="ob-section-label">Training & Credentials</div>
      {data.credentials.map((c, i) => (
        <div key={i} className="ob-card-entry">
          <div className="ob-card-entry__header">Credential {i + 1}</div>
          <Field label="Credential Name" id={`cname-${i}`}><Input id={`cname-${i}`} placeholder="e.g. CNA Certification" value={c.name} onChange={v => updateCred(i, 'name', v)} /></Field>
          <Field label="Issuing Organization" id={`corg-${i}`}><Input id={`corg-${i}`} placeholder="e.g. State Board of Nursing" value={c.org} onChange={v => updateCred(i, 'org', v)} /></Field>
          <div className="ob-row-2">
            <Field label="Date Issued" id={`cdate-${i}`}><Input id={`cdate-${i}`} type="date" value={c.date} onChange={v => updateCred(i, 'date', v)} /></Field>
            <Field label="Expiration" id={`cexp-${i}`}><Input id={`cexp-${i}`} type="date" value={c.expiry} onChange={v => updateCred(i, 'expiry', v)} /></Field>
          </div>
          <div className="ob-upload-row">
            <button type="button" className="btn btn-blue-outline btn-sm" onClick={() => docRef.current?.click()}>Upload Document</button>
            {c.doc && <span className="ob-upload-name">{c.doc.name}</span>}
            <input ref={docRef} type="file" accept=".pdf,.jpg,.png" style={{ display: 'none' }} onChange={e => { if (e.target.files[0]) updateCred(i, 'doc', e.target.files[0]) }} />
          </div>
        </div>
      ))}
      <button type="button" className="ob-add-btn" onClick={addCredential}>+ Add Credential</button>

      <div className="ob-section-label" style={{ marginTop: 36 }}>Employment History</div>
      <div className="ob-verification-note">
        <span className="ob-badge ob-badge--reported">Caregiver Reported</span>
        <span className="ob-badge ob-badge--pending">Pending Verification</span>
        <span className="ob-badge ob-badge--verified">Verified</span>
        <p>Employment is initially Caregiver Reported. Agencies can verify directly.</p>
      </div>
      {data.employment.map((e, i) => (
        <div key={i} className="ob-card-entry">
          <div className="ob-card-entry__header">Position {i + 1}</div>
          <Field label="Organization / Employer" id={`eorg-${i}`}><Input id={`eorg-${i}`} placeholder="e.g. Sunrise Home Care" value={e.org} onChange={v => updateEmp(i, 'org', v)} /></Field>
          <Field label="Your Role" id={`erole-${i}`}><Input id={`erole-${i}`} placeholder="e.g. Home Health Aide" value={e.role} onChange={v => updateEmp(i, 'role', v)} /></Field>
          <div className="ob-row-2">
            <Field label="Start Date" id={`estart-${i}`}><Input id={`estart-${i}`} type="date" value={e.start} onChange={v => updateEmp(i, 'start', v)} /></Field>
            <Field label="End Date" id={`eend-${i}`}><Input id={`eend-${i}`} type="date" value={e.end} onChange={v => updateEmp(i, 'end', v)} /></Field>
          </div>
          <Field label="Care Setting" id={`eset-${i}`}><Select id={`eset-${i}`} options={CARE_SETTINGS} value={e.setting} onChange={v => updateEmp(i, 'setting', v)} /></Field>
          <Field label="Key Responsibilities" id={`eresp-${i}`} hint="Brief description.">
            <Textarea id={`eresp-${i}`} placeholder="Describe your responsibilities…" value={e.responsibilities} onChange={v => updateEmp(i, 'responsibilities', v)} rows={3} />
          </Field>
        </div>
      ))}
      <button type="button" className="ob-add-btn" onClick={addEmployment}>+ Add Position</button>
    </div>
  )
}

function Step5({ data, set }) {
  return (
    <div className="ob-step">
      <div className="ob-step__header">
        <h2 className="ob-step__title">Care Integrity Commitment</h2>
        <p className="ob-step__sub">Review the 10 standards that will guide your professional practice.</p>
      </div>
      <div className="ob-standards-grid">
        {STANDARDS.map(s => (
          <div key={s.num} className="ob-standard-card">
            <span className="ob-standard-num">{s.num}</span>
            <div><div className="ob-standard-name">{s.name}</div><div className="ob-standard-tagline">{s.tagline}</div></div>
          </div>
        ))}
      </div>
      <div className="ob-commitment-box">
        <label className="ob-checkbox ob-checkbox--large">
          <input type="checkbox" checked={data.committed} onChange={e => set('committed', e.target.checked)} />
          <span>I understand and commit to the Care Integrity Standards as a foundation of my professional practice.</span>
        </label>
      </div>
      <div className="ob-final-note"><p>Your profile grows with you over time through experience, recognition, and continued commitment.</p></div>
    </div>
  )
}

/* ── Main component ───────────────────────────────────── */

export default function CaregiverOnboarding() {
  const [step, setStep]       = useState(1)
  const [loading, setLoading] = useState(false)
  const [apiError, setApiError] = useState('')
  const [validationErrors, setValidationErrors] = useState({})
  
  // OTP verification state
  const [showOTP, setShowOTP] = useState(false)
  const [otpEmail, setOtpEmail] = useState('')
  const [sessionToken, setSessionToken] = useState('')
  const [otpExpirySeconds, setOtpExpirySeconds] = useState(600)

  const [s1, setS1] = useState({ email: '', password: '', confirm: '', phone: '', country: '', terms: false, profileConsent: false })
  const [s2, setS2] = useState({ 
    photo: null, photoPreview: '', fullName: '', role: '', 
    employmentStatus: 'open_to_opportunities', 
    licenseNumber: '', licensingState: '', licenseExpiry: '', 
    years: '', serviceArea: '', bio: '', philosophy: '' 
  })
  const [s3, setS3] = useState({ careExp: [], settings: [], careTypes: [], skills: [] })
  const [s4, setS4] = useState({ credentials: [{ name: '', org: '', date: '', expiry: '', doc: null }], employment: [{ org: '', role: '', start: '', end: '', setting: '', responsibilities: '' }] })
  const [s5, setS5] = useState({ committed: false })

  const navigate = useNavigate()

  function setter(setState) {
    return (key, val) => setState(prev => ({ ...prev, [key]: val }))
  }

  // Comprehensive validation for each step
  const validateStep = (stepNum) => {
    const errors = {}

    if (stepNum === 1) {
      if (!s1.email) {
        errors.email = 'Email is required'
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s1.email)) {
        errors.email = 'Please enter a valid email address'
      }

      if (!s1.password) {
        errors.password = 'Password is required'
      } else if (s1.password.length < 8) {
        errors.password = 'Password must be at least 8 characters'
      }

      if (!s1.confirm) {
        errors.confirm = 'Please confirm your password'
      } else if (s1.password !== s1.confirm) {
        errors.confirm = 'Passwords do not match'
      }

      if (!s1.phone) {
        errors.phone = 'Phone number is required'
      }

      if (!s1.country) {
        errors.country = 'Please select a country/region'
      }

      if (!s1.terms) {
        errors.terms = 'You must agree to the Privacy Policy and Terms of Use'
      }

      if (!s1.profileConsent) {
        errors.profileConsent = 'You must acknowledge the profile visibility consent'
      }
    }

    if (stepNum === 2) {
      if (!s2.fullName || s2.fullName.trim().length < 2) {
        errors.fullName = 'Please enter your full name (at least 2 characters)'
      }

      if (!s2.role) {
        errors.role = 'Please select a professional role'
      }

      if (!s2.years) {
        errors.years = 'Please select your years of experience'
      }

      if (!s2.serviceArea || s2.serviceArea.trim().length === 0) {
        errors.serviceArea = 'Please enter your primary service area'
      }
    }

    if (stepNum === 5) {
      if (!s5.committed) {
        errors.committed = 'You must commit to the Care Integrity Standards'
      }
    }

    return errors
  }

  const canAdvance = () => {
    if (step === 1) {
      return s1.email && s1.password && s1.confirm && s1.phone && s1.country && s1.terms && s1.profileConsent
        && s1.password.length >= 8 && s1.password === s1.confirm
    }
    if (step === 2) {
      return s2.fullName && s2.role && s2.years && s2.serviceArea
    }
    if (step === 5) return s5.committed
    return true
  }

  const handleNextStep = () => {
    const errors = validateStep(step)
    
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors)
      return
    }
    
    setValidationErrors({})
    setApiError('')
    setStep(s => s + 1)
  }

  async function handleSubmit(e) {
    e.preventDefault()
    
    // Final validation of all required fields
    const allErrors = {
      ...validateStep(1),
      ...validateStep(2),
      ...validateStep(5),
    }

    if (Object.keys(allErrors).length > 0) {
      setValidationErrors(allErrors)
      setApiError('Please fix all validation errors before submitting')
      return
    }

    setLoading(true)
    setApiError('')
    setValidationErrors({})

    try {
      const response = await authApi.initiateSignup(s1.email, 'caregiver')

      if (!response || !response.sessionToken) {
        throw new Error('Invalid response from server.')
      }

      setOtpEmail(s1.email)
      setSessionToken(response.sessionToken)
      setOtpExpirySeconds(response.expiresIn || 600)
      setShowOTP(true)
      setLoading(false)
    } catch (err) {
      console.error('Caregiver signup OTP error:', err)

      if (err.status === 409) {
        setApiError('An account with this email already exists. Please log in instead.')
      } else if (err.message?.includes('network') || err.message?.includes('fetch')) {
        setApiError('Network error. Please check your internet connection.')
      } else {
        setApiError(err.message || 'Unable to send verification code. Please try again.')
      }
      setLoading(false)
    }
  }

  async function handleVerifyOTP(otp) {
    console.log('[CaregiverOnboarding] Starting OTP verification and registration')
    try {
      // Step 1: Verify OTP and get verified token
      console.log('[CaregiverOnboarding] Verifying OTP...')
      const otpResponse = await authApi.verifySignupOTP(s1.email, otp, sessionToken)
      console.log('[CaregiverOnboarding] OTP verification response:', otpResponse)

      if (!otpResponse || !otpResponse.verifiedToken) {
        throw new Error('Invalid response from server - no verified token received.')
      }

      // Step 2: Upload profile photo if provided
      let photoUrl = ''
      if (s2.photo) {
        console.log('[CaregiverOnboarding] Uploading profile photo...')
        const { url } = await uploadApi.avatar(s2.photo)
        photoUrl = url
        console.log('[CaregiverOnboarding] Photo uploaded:', photoUrl)
      }

      // Step 3: Register caregiver account
      console.log('[CaregiverOnboarding] Registering caregiver account...')
      const registrationResponse = await caregiverApi.register({
        // Auth data
        email:    s1.email,
        password: s1.password,
        phone:    s1.phone,
        verifiedToken: otpResponse.verifiedToken,
        // Profile data
        fullName:       s2.fullName,
        role:           s2.role,
        employmentStatus: s2.employmentStatus,
        licenseNumber:  s2.licenseNumber || undefined,
        licensingState: s2.licensingState || undefined,
        licenseExpiry:  s2.licenseExpiry || undefined,
        serviceArea:    s2.serviceArea,
        yearsExp:       s2.years,
        bio:            s2.bio,
        carePhilosophy: s2.philosophy,
        photoUrl,
        careTypes:      s3.careTypes,
        careSettings:   s3.settings,
        skills:         s3.skills,
      })
      console.log('[CaregiverOnboarding] Registration response:', registrationResponse)

      const { user, accessToken, refreshToken } = registrationResponse

      if (!accessToken || !refreshToken || !user) {
        throw new Error('Registration succeeded but tokens were not returned. Please contact support.')
      }

      // Step 4: Set authentication tokens and user data
      console.log('[CaregiverOnboarding] Setting auth tokens and user data...')
      auth.setTokens(accessToken, refreshToken)
      auth.setUser(user)
      
      // Small delay to ensure localStorage writes complete
      await new Promise(resolve => setTimeout(resolve, 100))
      
      console.log('[CaregiverOnboarding] Auth tokens set successfully')
      console.log('[CaregiverOnboarding] Stored access token:', localStorage.getItem('cip_access')?.substring(0, 20) + '...')
      console.log('[CaregiverOnboarding] Stored user:', JSON.parse(localStorage.getItem('cip_user')))

      // Step 5: Upload credential documents and add credentials
      console.log('[CaregiverOnboarding] Processing credentials...')
      try {
        const credentialsWithUrls = await Promise.all(
          s4.credentials
            .filter(c => c.name && c.org)
            .map(async c => {
              let documentUrl = ''
              if (c.doc) {
                console.log('[CaregiverOnboarding] Uploading credential document:', c.name)
                const { path } = await uploadApi.document(c.doc)
                documentUrl = path
              }
              return { name: c.name, org: c.org, issuedDate: c.date, expiryDate: c.expiry, documentUrl }
            })
        )

        for (const cred of credentialsWithUrls) {
          console.log('[CaregiverOnboarding] Adding credential:', cred.name)
          await caregiverApi.addCredential(cred)
        }
        console.log('[CaregiverOnboarding] All credentials added')
      } catch (credErr) {
        console.warn('[CaregiverOnboarding] Failed to add credentials:', credErr.message)
        console.warn('[CaregiverOnboarding] Continuing anyway - user can add credentials later')
      }

      // Step 6: Add employment history
      console.log('[CaregiverOnboarding] Processing employment history...')
      try {
        for (const emp of s4.employment.filter(e => e.org && e.role && e.start)) {
          console.log('[CaregiverOnboarding] Adding employment:', emp.org, emp.role)
          await caregiverApi.addEmployment({
            orgName:          emp.org,
            role:             emp.role,
            startDate:        emp.start,
            endDate:          emp.end || undefined,
            setting:          emp.setting,
            responsibilities: emp.responsibilities,
          })
        }
        console.log('[CaregiverOnboarding] All employment records added')
      } catch (empErr) {
        console.warn('[CaregiverOnboarding] Failed to add employment:', empErr.message)
        console.warn('[CaregiverOnboarding] Continuing anyway - user can add employment later')
      }

      // Step 7: Navigate to dashboard
      console.log('[CaregiverOnboarding] Registration complete! Navigating to dashboard...')
      navigate('/caregiver/profile?view=caregiver')
    } catch (err) {
      console.error('[CaregiverOnboarding] Registration error:', err)
      console.error('[CaregiverOnboarding] Error details:', {
        message: err.message,
        status: err.status,
        stack: err.stack
      })
      throw err
    }
  }

  async function handleResendOTP() {
    const response = await authApi.initiateSignup(s1.email, 'caregiver')
    setSessionToken(response.sessionToken)
    setOtpExpirySeconds(response.expiresIn || 600)
  }

  function handleCancelOTP() {
    setShowOTP(false)
    setSessionToken('')
    setOtpEmail('')
    setLoading(false)
  }

  if (showOTP) {
    return (
      <OTPVerification
        email={otpEmail}
        onVerify={handleVerifyOTP}
        onResend={handleResendOTP}
        onCancel={handleCancelOTP}
        title="Verify Your Email"
        subtitle="Enter the 6-digit code we sent to"
        expirySeconds={otpExpirySeconds}
      />
    )
  }

  return (
    <div className="ob-page">
      <div className="ob-page__top">
        <Link to="/" className="ob-logo-link" aria-label="Home">
          <img src="/Main Logo.png" alt="The Care Integrity Project" className="ob-logo" />
        </Link>
        <div className="ob-page__top-right">
          <p className="ob-page__tag">Caregiver Registration</p>
          <p className="ob-page__signin">
            Already have an account?{' '}
            <a href="/caregiver/login" className="ob-page__signin-link">Sign in</a>
          </p>
        </div>
      </div>

      <ProgressBar steps={STEPS} current={step} />

      <form className="ob-form" onSubmit={handleSubmit} noValidate>
        <div className="ob-form__body">
          {step === 1 && <Step1 data={s1} set={setter(setS1)} error={apiError} validationErrors={validationErrors} />}
          {step === 2 && <Step2 data={s2} set={setter(setS2)} validationErrors={validationErrors} />}
          {step === 3 && <Step3 data={s3} set={setter(setS3)} />}
          {step === 4 && <Step4 data={s4} set={setter(setS4)} />}
          {step === 5 && <Step5 data={s5} set={setter(setS5)} />}
        </div>

        {apiError && step === 5 && (
          <p className="ob-error ob-error--banner" role="alert" style={{ padding: '0 0 12px' }}>{apiError}</p>
        )}

        <div className="ob-form__actions">
          {step > 1 && (
            <button type="button" className="btn btn-blue-outline" onClick={() => { setValidationErrors({}); setApiError(''); setStep(s => s - 1) }}>
              ← Back
            </button>
          )}
          {step < 5 ? (
            <button type="button" className="btn btn-blue" disabled={!canAdvance()} onClick={handleNextStep}>
              Save & Continue
            </button>
          ) : (
            <button type="submit" className="btn btn-green" disabled={!canAdvance() || loading}>
              {loading ? 'Creating Profile…' : 'Create Profile'}
            </button>
          )}
        </div>
      </form>
    </div>
  )
}
