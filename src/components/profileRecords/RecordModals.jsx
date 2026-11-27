import { useEffect, useRef, useState } from 'react'
import { FiX, FiUploadCloud, FiFileText, FiTrash2 } from 'react-icons/fi'
import { caregiverApi, uploadApi } from '../../lib/api'
import './RecordModals.css'

/* Shared modal shell: Escape and backdrop close it, focus moves inside on open, bottom sheet on mobile. */
function Modal({ title, subtitle, onClose, children, busy }) {
  const boxRef = useRef(null)
  // On open only: lock page scroll and focus the first field.
  useEffect(() => {
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    boxRef.current?.querySelector('input, select, textarea, button.btn')?.focus()
    return () => { document.body.style.overflow = prevOverflow }
  }, [])
  useEffect(() => {
    const onKey = e => { if (e.key === 'Escape' && !busy) onClose() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose, busy])
  return (
    <div className="rec-modal" role="dialog" aria-modal="true" aria-labelledby="rec-modal-title">
      <div className="rec-modal__backdrop" onClick={() => !busy && onClose()} />
      <div className="rec-modal__box" ref={boxRef}>
        <button type="button" className="rec-modal__x" aria-label="Close" onClick={onClose} disabled={busy}><FiX /></button>
        <h2 id="rec-modal-title" className="rec-modal__title">{title}</h2>
        {subtitle && <p className="rec-modal__sub">{subtitle}</p>}
        {children}
      </div>
    </div>
  )
}

function Field({ label, required, hint, children }) {
  return (
    <label className="rec-field">
      <span className="rec-field__label">{label}{required && <span className="rec-req" aria-hidden="true"> *</span>}</span>
      {children}
      {hint && <span className="rec-field__hint">{hint}</span>}
    </label>
  )
}

const DOC_ACCEPT = 'application/pdf,image/jpeg,image/png,image/webp,image/heic,image/heif'
const MAX_MB = 10

/* ── Credential: name, issuer, dates, optional document ── */
export function CredentialModal({ credential, onClose, onSaved }) {
  const editing = !!credential?._id
  const [form, setForm] = useState({
    name: credential?.name || '',
    org: credential?.org || '',
    issuedDate: credential?.issuedDate || '',
    expiryDate: credential?.expiryDate || '',
  })
  const [docUrl, setDocUrl] = useState(credential?.documentUrl || '')
  const [docName, setDocName] = useState(credential?.documentUrl ? 'Current document' : '')
  const [uploading, setUploading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }))
  const busy = uploading || saving

  async function handleFile(e) {
    const input = e.target
    const file = input.files?.[0]
    input.value = ''
    if (!file) return
    if (file.size > MAX_MB * 1024 * 1024) { setError(`File is too large. Maximum size is ${MAX_MB}MB.`); return }
    setError('')
    setUploading(true)
    try {
      const res = await uploadApi.document(file)
      if (!res?.url) throw new Error('Upload did not return a link.')
      setDocUrl(res.url)
      setDocName(res.filename || file.name)
    } catch (err) {
      setError(err.status === 413 ? `File is too large. Maximum size is ${MAX_MB}MB.`
        : err.status === 400 ? 'Unsupported file. Upload a PDF, JPG, PNG or WEBP.'
        : err.message || 'Could not upload the document. Please try again.')
    } finally {
      setUploading(false)
    }
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (form.name.trim().length < 2) { setError('Enter the credential name.'); return }
    if (form.org.trim().length < 2) { setError('Enter the issuing organization.'); return }
    if (form.issuedDate && form.expiryDate && form.expiryDate < form.issuedDate) { setError('The expiry date is before the issue date.'); return }
    setError('')
    setSaving(true)
    const payload = {
      name: form.name.trim(),
      org: form.org.trim(),
      issuedDate: form.issuedDate || undefined,
      expiryDate: form.expiryDate || undefined,
      // Only send the document link when it changed (added, replaced or removed).
      documentUrl: docUrl === (credential?.documentUrl || '') ? undefined : docUrl,
    }
    try {
      const saved = editing
        ? await caregiverApi.updateCredential(credential._id, payload)
        : await caregiverApi.addCredential(payload)
      onSaved(saved, editing)
    } catch (err) {
      setError(err.message || 'Could not save the credential. Please try again.')
      setSaving(false)
    }
  }

  return (
    <Modal
      title={editing ? 'Edit credential' : 'Add a credential'}
      subtitle="Certifications, licenses and training. Attaching a document lets agencies review it."
      onClose={onClose}
      busy={busy}
    >
      <form className="rec-form" onSubmit={handleSubmit} noValidate>
        <Field label="Credential name" required>
          <input className="rec-input" value={form.name} onChange={set('name')} placeholder="e.g. CNA Certification, CPR / First Aid" maxLength={150} required />
        </Field>
        <Field label="Issuing organization" required>
          <input className="rec-input" value={form.org} onChange={set('org')} placeholder="e.g. State Board of Nursing, American Red Cross" maxLength={150} required />
        </Field>
        <div className="rec-row">
          <Field label="Issue date">
            <input type="date" className="rec-input" value={form.issuedDate} onChange={set('issuedDate')} />
          </Field>
          <Field label="Expiry date" hint="Leave empty if it does not expire.">
            <input type="date" className="rec-input" value={form.expiryDate} min={form.issuedDate || undefined} onChange={set('expiryDate')} />
          </Field>
        </div>

        <div className="rec-field">
          <span className="rec-field__label">Supporting document</span>
          {docUrl ? (
            <div className="rec-doc">
              <FiFileText className="rec-doc__icon" aria-hidden="true" />
              <a href={docUrl} target="_blank" rel="noopener noreferrer" className="rec-doc__name">{docName || 'View document'}</a>
              <button type="button" className="rec-doc__remove" onClick={() => { setDocUrl(''); setDocName('') }} disabled={busy} aria-label="Remove document"><FiTrash2 /></button>
            </div>
          ) : (
            <label className={`rec-drop${uploading ? ' is-busy' : ''}`}>
              <FiUploadCloud className="rec-drop__icon" aria-hidden="true" />
              <span className="rec-drop__text">{uploading ? 'Uploading…' : 'Choose a file to upload'}</span>
              <span className="rec-drop__hint">PDF, JPG, PNG or WEBP, up to {MAX_MB}MB. Optional.</span>
              <input type="file" accept={DOC_ACCEPT} onChange={handleFile} disabled={busy} hidden />
            </label>
          )}
        </div>

        {error && <p className="rec-error" role="alert">{error}</p>}

        <div className="rec-actions">
          <button type="button" className="btn btn-outline" onClick={onClose} disabled={busy}>Cancel</button>
          <button type="submit" className="btn btn-green" disabled={busy}>{saving ? 'Saving…' : editing ? 'Save changes' : 'Add credential'}</button>
        </div>
      </form>
    </Modal>
  )
}

const SETTINGS = ['Private Home', 'Assisted Living', 'Memory Care', 'Nursing Home', 'Hospital', 'Hospice', 'Adult Day Center', 'Other']

/* ── Employment: organization, role, dates, setting, responsibilities ── */
export function EmploymentModal({ position, defaultRole, onClose, onSaved }) {
  const editing = !!position?._id
  const [form, setForm] = useState({
    orgName: position?.orgName || '',
    role: position?.role || defaultRole || '',
    startDate: position?.startDate || '',
    endDate: position?.endDate || '',
    setting: position?.setting || '',
    responsibilities: position?.responsibilities || '',
  })
  const [current, setCurrent] = useState(editing ? !position?.endDate : false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }))
  const thisMonth = new Date().toISOString().slice(0, 7)

  async function handleSubmit(e) {
    e.preventDefault()
    if (form.orgName.trim().length < 2) { setError('Enter the organization name.'); return }
    if (form.role.trim().length < 2) { setError('Enter your role or job title.'); return }
    if (!form.startDate) { setError('Choose a start date.'); return }
    if (!current && form.endDate && form.endDate < form.startDate) { setError('The end date is before the start date.'); return }
    setError('')
    setSaving(true)
    const payload = {
      orgName: form.orgName.trim(),
      role: form.role.trim(),
      startDate: form.startDate,
      endDate: current ? (editing ? '' : undefined) : (form.endDate || undefined),
      setting: form.setting || undefined,
      responsibilities: form.responsibilities.trim() || undefined,
    }
    try {
      const saved = editing
        ? await caregiverApi.updateEmployment(position._id, payload)
        : await caregiverApi.addEmployment(payload)
      onSaved(saved, editing)
    } catch (err) {
      setError(err.message || 'Could not save the position. Please try again.')
      setSaving(false)
    }
  }

  return (
    <Modal
      title={editing ? 'Edit position' : 'Add a position'}
      subtitle="After saving, you can ask the employer to verify this position."
      onClose={onClose}
      busy={saving}
    >
      <form className="rec-form" onSubmit={handleSubmit} noValidate>
        <Field label="Organization" required>
          <input className="rec-input" value={form.orgName} onChange={set('orgName')} placeholder="e.g. Ahava Home Care" maxLength={150} required />
        </Field>
        <Field label="Role / job title" required>
          <input className="rec-input" value={form.role} onChange={set('role')} placeholder="e.g. Certified Nursing Assistant" maxLength={150} required />
        </Field>
        <div className="rec-row">
          <Field label="Start date" required>
            <input type="month" className="rec-input" value={form.startDate} max={thisMonth} onChange={set('startDate')} required />
          </Field>
          <Field label="End date">
            <input type="month" className="rec-input" value={current ? '' : form.endDate} min={form.startDate || undefined} max={thisMonth} onChange={set('endDate')} disabled={current} />
          </Field>
        </div>
        <label className="rec-check">
          <input type="checkbox" checked={current} onChange={e => setCurrent(e.target.checked)} />
          I currently work here
        </label>
        <Field label="Care setting">
          <select className="rec-input" value={form.setting} onChange={set('setting')}>
            <option value="">Select a setting (optional)</option>
            {SETTINGS.map(s => <option key={s} value={s}>{s}</option>)}
            {form.setting && !SETTINGS.includes(form.setting) && <option value={form.setting}>{form.setting}</option>}
          </select>
        </Field>
        <Field label="Responsibilities" hint="Optional. A few lines about the care you provided.">
          <textarea className="rec-input rec-textarea" value={form.responsibilities} onChange={set('responsibilities')} rows={3} maxLength={1000} />
        </Field>

        {error && <p className="rec-error" role="alert">{error}</p>}

        <div className="rec-actions">
          <button type="button" className="btn btn-outline" onClick={onClose} disabled={saving}>Cancel</button>
          <button type="submit" className="btn btn-green" disabled={saving}>{saving ? 'Saving…' : editing ? 'Save changes' : 'Add position'}</button>
        </div>
      </form>
    </Modal>
  )
}

/* ── Small confirm dialog for deletes ── */
export function ConfirmDelete({ what, onCancel, onConfirm }) {
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  async function go() {
    setBusy(true)
    setError('')
    try { await onConfirm() } catch (err) { setError(err.message || 'Could not delete. Please try again.'); setBusy(false) }
  }
  return (
    <Modal title={`Delete ${what}?`} subtitle="This removes it from your profile. You can add it again later." onClose={onCancel} busy={busy}>
      {error && <p className="rec-error" role="alert">{error}</p>}
      <div className="rec-actions">
        <button type="button" className="btn btn-outline" onClick={onCancel} disabled={busy}>Cancel</button>
        <button type="button" className="btn rec-btn-danger" onClick={go} disabled={busy}>{busy ? 'Deleting…' : 'Delete'}</button>
      </div>
    </Modal>
  )
}
