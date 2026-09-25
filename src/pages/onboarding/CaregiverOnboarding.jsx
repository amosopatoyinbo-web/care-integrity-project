import { useState, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import ProgressBar from '../../components/onboarding/ProgressBar'
import ChipSelect from '../../components/onboarding/ChipSelect'
import { authApi, caregiverApi, uploadApi, auth } from '../../lib/api'
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

function Step1({ data, set, error }) {
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
      <Field label="Email Address" id="email" required>
        <Input id="email" type="email" placeholder="you@example.com" value={data.email} onChange={v => set('email', v)} />
      </Field>
      <Field label="Password" id="password" required hint="At least 8 characters.">
        <Input id="password" type="password" placeholder="Create a password" value={data.password} onChange={v => set('password', v)} />
      </Field>
      <Field label="Confirm Password" id="confirm" required>
        <Input id="confirm" type="password" placeholder="Repeat your password" value={data.confirm} onChange={v => set('confirm', v)} />
      </Field>
      <Field label="Phone Number" id="phone" required>
        <Input id="phone" type="tel" placeholder="+1 (555) 000-0000" value={data.phone} onChange={v => set('phone', v)} />
      </Field>
      <Field label="Country / Region" id="country" required>
        <Select id="country" options={['United States', 'Canada', 'United Kingdom', 'Australia', 'Other']} value={data.country} onChange={v => set('country', v)} />
      </Field>
      <label className="ob-checkbox">
        <input type="checkbox" checked={data.terms} onChange={e => set('terms', e.target.checked)} />
        <span>I agree to the <Link to="/privacy" className="ob-link">Privacy Policy</Link> and <Link to="/terms" className="ob-link">Terms of Use</Link>.</span>
      </label>
    </div>
  )
}

function Step2({ data, set }) {
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
      <Field label="Full Name" id="fullName" required>
        <Input id="fullName" placeholder="Your full name" value={data.fullName} onChange={v => set('fullName', v)} />
      </Field>
      <Field label="Professional Role" id="role" required>
        <Select id="role" options={['Home Health Aide', 'Certified Nursing Assistant (CNA)', 'Personal Care Aide', 'Companion Caregiver', 'Live-In Caregiver', 'Memory Care Specialist', 'Other']} value={data.role} onChange={v => set('role', v)} />
      </Field>
      <Field label="Years of Experience" id="years" required>
        <Select id="years" options={['Less than 1 year', '1–2 years', '3–5 years', '6–10 years', '10+ years']} value={data.years} onChange={v => set('years', v)} />
      </Field>
      <Field label="Primary Service Area" id="serviceArea" required hint="City, region, or zip code.">
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

  const [s1, setS1] = useState({ email: '', password: '', confirm: '', phone: '', country: '', terms: false })
  const [s2, setS2] = useState({ photo: null, photoPreview: '', fullName: '', role: '', years: '', serviceArea: '', bio: '', philosophy: '' })
  const [s3, setS3] = useState({ careExp: [], settings: [], careTypes: [], skills: [] })
  const [s4, setS4] = useState({ credentials: [{ name: '', org: '', date: '', expiry: '', doc: null }], employment: [{ org: '', role: '', start: '', end: '', setting: '', responsibilities: '' }] })
  const [s5, setS5] = useState({ committed: false })

  const navigate = useNavigate()

  function setter(setState) {
    return (key, val) => setState(prev => ({ ...prev, [key]: val }))
  }

  const canAdvance = () => {
    if (step === 1) return s1.email && s1.password && s1.confirm && s1.phone && s1.country && s1.terms
    if (step === 5) return s5.committed
    return true
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setApiError('')

    try {
      // Step 1 — Register account
      const { user, accessToken, refreshToken } = await authApi.register({
        email:    s1.email,
        password: s1.password,
        role:     'caregiver',
        phone:    s1.phone,
      })
      auth.setTokens(accessToken, refreshToken)
      auth.setUser(user)

      // Step 2a — Upload photo if provided
      let photoUrl = ''
      if (s2.photo) {
        const { url } = await uploadApi.avatar(s2.photo)
        photoUrl = url
      }

      // Step 2b — Upload credential documents
      const credentialsWithUrls = await Promise.all(
        s4.credentials
          .filter(c => c.name && c.org)
          .map(async c => {
            let documentUrl = ''
            if (c.doc) {
              const { path } = await uploadApi.document(c.doc)
              documentUrl = path
            }
            return { name: c.name, org: c.org, issuedDate: c.date, expiryDate: c.expiry, documentUrl }
          })
      )

      // Step 3 — Create caregiver profile
      const profile = await caregiverApi.create({
        fullName:       s2.fullName,
        role:           s2.role,
        serviceArea:    s2.serviceArea,
        yearsExp:       s2.years,
        bio:            s2.bio,
        carePhilosophy: s2.philosophy,
        photoUrl,
        careTypes:    s3.careTypes,
        careSettings: s3.settings,
        skills:       s3.skills,
      })

      // Step 4 — Add credentials
      for (const cred of credentialsWithUrls) {
        await caregiverApi.addCredential(cred)
      }

      // Step 5 — Add employment
      for (const emp of s4.employment.filter(e => e.org && e.role && e.start)) {
        await caregiverApi.addEmployment({
          orgName:          emp.org,
          role:             emp.role,
          startDate:        emp.start,
          endDate:          emp.end || undefined,
          setting:          emp.setting,
          responsibilities: emp.responsibilities,
        })
      }

      navigate('/caregiver/profile?view=caregiver')
    } catch (err) {
      setApiError(err.message || 'Something went wrong. Please try again.')
      setLoading(false)
    }
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
          {step === 1 && <Step1 data={s1} set={setter(setS1)} error={apiError} />}
          {step === 2 && <Step2 data={s2} set={setter(setS2)} />}
          {step === 3 && <Step3 data={s3} set={setter(setS3)} />}
          {step === 4 && <Step4 data={s4} set={setter(setS4)} />}
          {step === 5 && <Step5 data={s5} set={setter(setS5)} />}
        </div>

        {apiError && step === 5 && (
          <p className="ob-error ob-error--banner" role="alert" style={{ padding: '0 0 12px' }}>{apiError}</p>
        )}

        <div className="ob-form__actions">
          {step > 1 && (
            <button type="button" className="btn btn-blue-outline" onClick={() => { setApiError(''); setStep(s => s - 1) }}>
              ← Back
            </button>
          )}
          {step < 5 ? (
            <button type="button" className="btn btn-blue" disabled={!canAdvance()} onClick={() => { setApiError(''); setStep(s => s + 1) }}>
              Save & Continue
            </button>
          ) : (
            <button type="submit" className="btn btn-green" disabled={!canAdvance() || loading}>
              {loading ? 'Creating Profile…' : 'Create My Professional Profile'}
            </button>
          )}
        </div>
      </form>
    </div>
  )
}
