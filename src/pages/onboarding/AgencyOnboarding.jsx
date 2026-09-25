import { useState, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import ProgressBar from '../../components/onboarding/ProgressBar'
import ChipSelect from '../../components/onboarding/ChipSelect'
import { authApi, agencyApi, uploadApi, auth } from '../../lib/api'
import './AgencyOnboarding.css'

const STEPS = ['Account', 'Organization', 'Services', 'Verification']

const ORG_TYPES     = ['Home Care Agency', 'Assisted Living Facility', 'Memory Care Facility', 'Adult Day Program', 'Skilled Nursing Facility', 'Staffing Agency', 'Nonprofit Organization', 'Other']
const CARE_TYPES    = ['Personal Care', 'Companion Care', 'Home Health', 'Dementia / Memory Care', 'Hospice / Palliative', 'Post-Surgery Recovery', 'Pediatric Care', 'Disability Support']
const SERVICE_AREAS = ['Seattle Metro', 'Portland Metro', 'Los Angeles', 'San Francisco Bay Area', 'New York Metro', 'Chicago Metro', 'Houston Metro', 'Phoenix Metro', 'Other / Nationwide']
const SETTINGS      = ['Private Home', 'Assisted Living', 'Memory Care Facility', 'Adult Day Program', 'Skilled Nursing', 'Community-Based', 'Group Home']
const FOCUS         = ['Professional Development', 'Caregiver Recognition', 'Quality Assurance', 'Employment Verification', 'Fair Accountability', 'Culture Building']
const SIZES         = ['1–10 caregivers', '11–25 caregivers', '26–50 caregivers', '51–100 caregivers', '100+ caregivers']

function Field({ label, id, required, hint, children }) {
  return (
    <div className="ob-field">
      <label className="ob-label" htmlFor={id}>{label}{required && <span className="ob-required" aria-hidden="true"> *</span>}</label>
      {hint && <p className="ob-hint">{hint}</p>}
      {children}
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
        <h2 className="ob-step__title">Create Agency Account</h2>
        <p className="ob-step__sub">Set up your organization's account on the Care Integrity Project.</p>
      </div>
      {error && <p className="ob-error ob-error--banner" role="alert">{error}</p>}
      <Field label="Work Email" id="email" required><Input id="email" type="email" placeholder="admin@yourorganization.com" value={data.email} onChange={v => set('email', v)} /></Field>
      <Field label="Password" id="password" required hint="At least 8 characters."><Input id="password" type="password" placeholder="Create a password" value={data.password} onChange={v => set('password', v)} /></Field>
      <Field label="Contact Person" id="contact" required hint="Primary point of contact."><Input id="contact" placeholder="Full name" value={data.contact} onChange={v => set('contact', v)} /></Field>
      <Field label="Your Role / Title" id="title" required><Input id="title" placeholder="e.g. Director of Operations" value={data.title} onChange={v => set('title', v)} /></Field>
      <Field label="Phone Number" id="phone" required><Input id="phone" type="tel" placeholder="+1 (555) 000-0000" value={data.phone} onChange={v => set('phone', v)} /></Field>
      <label className="ob-checkbox">
        <input type="checkbox" checked={data.terms} onChange={e => set('terms', e.target.checked)} />
        <span>I agree to the <Link to="/privacy" className="ob-link">Privacy Policy</Link> and <Link to="/terms" className="ob-link">Terms of Use</Link>.</span>
      </label>
    </div>
  )
}

function Step2({ data, set }) {
  const logoRef = useRef()
  return (
    <div className="ob-step">
      <div className="ob-step__header">
        <h2 className="ob-step__title">Organization Profile</h2>
        <p className="ob-step__sub">Tell caregivers about your organization.</p>
      </div>
      <div className="ob-photo-upload">
        <div className="ob-photo-upload__preview ob-photo-upload__preview--square">
          {data.logoPreview ? <img src={data.logoPreview} alt="Logo preview" /> : <span aria-hidden="true">🏢</span>}
        </div>
        <div className="ob-photo-upload__actions">
          <button type="button" className="btn btn-blue-outline btn-sm" onClick={() => logoRef.current.click()}>Upload Logo</button>
          <p className="ob-hint">PNG or SVG recommended. Max 5 MB.</p>
          <input ref={logoRef} type="file" accept="image/*" style={{ display: 'none' }}
            onChange={e => { const f = e.target.files[0]; if (f) { set('logo', f); set('logoPreview', URL.createObjectURL(f)) } }} />
        </div>
      </div>
      <Field label="Organization Name" id="orgName" required><Input id="orgName" placeholder="Full organization name" value={data.orgName} onChange={v => set('orgName', v)} /></Field>
      <Field label="Organization Type" id="orgType" required><Select id="orgType" options={ORG_TYPES} value={data.orgType} onChange={v => set('orgType', v)} /></Field>
      <Field label="Primary Location" id="location" required><Input id="location" placeholder="City, State" value={data.location} onChange={v => set('location', v)} /></Field>
      <Field label="Service Area" id="serviceArea" hint="Geographic area where you operate."><Input id="serviceArea" placeholder="e.g. Greater Seattle area" value={data.serviceArea} onChange={v => set('serviceArea', v)} /></Field>
      <Field label="Website" id="website"><Input id="website" type="url" placeholder="https://yourorganization.com" value={data.website} onChange={v => set('website', v)} /></Field>
      <div className="ob-row-2">
        <Field label="Year Established" id="year"><Input id="year" type="number" placeholder="e.g. 2008" value={data.year} onChange={v => set('year', v)} /></Field>
        <Field label="Number of Caregivers" id="size"><Select id="size" options={SIZES} value={data.size} onChange={v => set('size', v)} /></Field>
      </div>
      <Field label="Organization Description" id="desc" hint="Describe your mission and approach.">
        <Textarea id="desc" placeholder="We are a mission-driven caregiving organization…" value={data.desc} onChange={v => set('desc', v)} rows={4} />
      </Field>
    </div>
  )
}

function Step3({ data, set }) {
  return (
    <div className="ob-step">
      <div className="ob-step__header">
        <h2 className="ob-step__title">Services & Focus</h2>
        <p className="ob-step__sub">Help caregivers understand what you do.</p>
      </div>
      <Field label="Care Types Offered" id="careTypes" hint="Select all that apply.">
        <ChipSelect options={CARE_TYPES} selected={data.careTypes} onChange={v => set('careTypes', v)} />
      </Field>
      <Field label="Service Areas" id="areas" hint="Where your organization operates.">
        <ChipSelect options={SERVICE_AREAS} selected={data.areas} onChange={v => set('areas', v)} />
      </Field>
      <Field label="Care Settings" id="settings" hint="Where care is delivered.">
        <ChipSelect options={SETTINGS} selected={data.settings} onChange={v => set('settings', v)} />
      </Field>
      <Field label="Professional Focus" id="focus" hint="What matters most to your organization.">
        <ChipSelect options={FOCUS} selected={data.focus} onChange={v => set('focus', v)} />
      </Field>
    </div>
  )
}

function Step4({ data, set }) {
  const docRef = useRef()
  return (
    <div className="ob-step">
      <div className="ob-step__header">
        <h2 className="ob-step__title">Verification</h2>
        <p className="ob-step__sub">Your legal details are used for verification only and are never displayed publicly.</p>
      </div>
      <div className="ob-note" style={{ marginBottom: 24 }}>
        Verification helps caregivers and families trust that your organization is legitimate.
      </div>
      <Field label="Legal Organization Name" id="legalName" required><Input id="legalName" placeholder="As registered with state/federal authority" value={data.legalName} onChange={v => set('legalName', v)} /></Field>
      <Field label="Organization Identifier" id="orgId" hint="EIN, Business License Number, or equivalent."><Input id="orgId" placeholder="e.g. EIN: 12-3456789" value={data.orgId} onChange={v => set('orgId', v)} /></Field>
      <Field label="Business Address" id="address" required><Input id="address" placeholder="Full street address" value={data.address} onChange={v => set('address', v)} /></Field>
      <Field label="Authorized Representative" id="rep" required hint="Person legally authorized to act on behalf of the organization."><Input id="rep" placeholder="Full name" value={data.rep} onChange={v => set('rep', v)} /></Field>
      <Field label="Business Email" id="bizEmail" required><Input id="bizEmail" type="email" placeholder="official@organization.com" value={data.bizEmail} onChange={v => set('bizEmail', v)} /></Field>
      <div className="ob-section-label" style={{ marginTop: 24 }}>Supporting Documents (Optional)</div>
      <div className="ob-upload-row" style={{ marginBottom: 8 }}>
        <button type="button" className="btn btn-blue-outline btn-sm" onClick={() => docRef.current.click()}>Upload Document</button>
        {data.doc && <span className="ob-upload-name">{data.doc.name}</span>}
        <input ref={docRef} type="file" accept=".pdf,.jpg,.png" style={{ display: 'none' }} onChange={e => { if (e.target.files[0]) set('doc', e.target.files[0]) }} />
      </div>
      <p className="ob-hint">Business license, certificate of incorporation, or other verification document.</p>
      <div className="ag-pending-notice">
        <div className="ag-pending-badge">Verification Pending</div>
        <p>Your profile will be reviewed after submission. You can begin using the platform while verification is in progress.</p>
      </div>
    </div>
  )
}

/* ── Main ─────────────────────────────────────────────── */

export default function AgencyOnboarding() {
  const [step, setStep]         = useState(1)
  const [loading, setLoading]   = useState(false)
  const [apiError, setApiError] = useState('')

  const [s1, setS1] = useState({ email: '', password: '', contact: '', title: '', phone: '', terms: false })
  const [s2, setS2] = useState({ logo: null, logoPreview: '', orgName: '', orgType: '', location: '', serviceArea: '', website: '', year: '', size: '', desc: '' })
  const [s3, setS3] = useState({ careTypes: [], areas: [], settings: [], focus: [] })
  const [s4, setS4] = useState({ legalName: '', orgId: '', address: '', rep: '', bizEmail: '', doc: null })

  const navigate = useNavigate()

  function setter(setState) { return (key, val) => setState(prev => ({ ...prev, [key]: val })) }

  const canAdvance = () => {
    if (step === 1) return s1.email && s1.password && s1.contact && s1.title && s1.phone && s1.terms
    if (step === 4) return s4.legalName && s4.address && s4.rep && s4.bizEmail
    return true
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setApiError('')

    try {
      // Register account
      const { user, accessToken, refreshToken } = await authApi.register({
        email:    s1.email,
        password: s1.password,
        role:     'agency',
        phone:    s1.phone,
      })
      auth.setTokens(accessToken, refreshToken)
      auth.setUser(user)

      // Upload logo if provided
      let logoUrl = ''
      if (s2.logo) {
        const { url } = await uploadApi.logo(s2.logo)
        logoUrl = url
      }

      // Upload verification document if provided
      let verificationDocUrl = ''
      if (s4.doc) {
        const { path } = await uploadApi.document(s4.doc)
        verificationDocUrl = path
      }

      // Create agency profile
      await agencyApi.create({
        name:             s2.orgName,
        orgType:          s2.orgType,
        location:         s2.location,
        serviceArea:      s2.serviceArea,
        website:          s2.website,
        yearEstablished:  s2.year,
        size:             s2.size,
        description:      s2.desc,
        logoUrl,
        careTypes:        s3.careTypes,
        serviceAreas:     s3.areas,       // ← was being dropped
        settings:         s3.settings,
        focus:            s3.focus,
        legalName:        s4.legalName,
        orgIdentifier:    s4.orgId,
        businessAddress:  s4.address,
        authorizedRep:    s4.rep,
        businessEmail:    s4.bizEmail,
        verificationDocUrl,
      })

      navigate('/agency/dashboard')
    } catch (err) {
      setApiError(err.message || 'Something went wrong. Please try again.')
      setLoading(false)
    }
  }

  return (
    <div className="ob-page">
      <div className="ob-page__top">
        <Link to="/" className="ob-logo-link"><img src="/Main Logo.png" alt="The Care Integrity Project" className="ob-logo" /></Link>
        <div className="ob-page__top-right">
          <p className="ob-page__tag">Agency Registration</p>
          <p className="ob-page__signin">
            Already have an account?{' '}
            <a href="/agency/login" className="ob-page__signin-link">Sign in</a>
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
        </div>
        {apiError && step === 4 && (
          <p className="ob-error ob-error--banner" role="alert" style={{ padding: '0 0 12px' }}>{apiError}</p>
        )}
        <div className="ob-form__actions">
          {step > 1 && <button type="button" className="btn btn-blue-outline" onClick={() => { setApiError(''); setStep(s => s - 1) }}>← Back</button>}
          {step < 4
            ? <button type="button" className="btn btn-blue" disabled={!canAdvance()} onClick={() => { setApiError(''); setStep(s => s + 1) }}>Save & Continue</button>
            : <button type="submit" className="btn btn-green" disabled={!canAdvance() || loading}>
                {loading ? 'Creating Profile…' : 'Create Organization Profile'}
              </button>
          }
        </div>
      </form>
    </div>
  )
}
