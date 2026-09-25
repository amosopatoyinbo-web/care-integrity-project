import { useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { authApi } from '../../lib/api'
import './Login.css'

export default function ForgotPassword() {
  const [searchParams] = useSearchParams()
  const role = searchParams.get('role') // 'caregiver' or 'agency'
  const loginPath = role === 'agency' ? '/agency/login' : '/caregiver/login'

  const [email,   setEmail]   = useState('')
  const [sent,    setSent]    = useState(false)
  const [error,   setError]   = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    if (!email) { setError('Please enter your email address.'); return }
    setLoading(true)
    setError('')
    try {
      await authApi.forgotPassword(email)
    } catch {
      // Always show success — never reveal whether email exists
    } finally {
      setSent(true)
      setLoading(false)
    }
  }

  return (
    <div className="login-page">
      <div className="login-card">

        <Link to="/" className="login-logo-link">
          <img src="/Main Logo.png" alt="The Care Integrity Project" className="login-logo" />
        </Link>

        {sent ? (
          <>
            <div className="fp-success">
              <div className="fp-success__icon" aria-hidden="true">✓</div>
            </div>
            <h1 className="login-heading" style={{ textAlign: 'center' }}>Check Your Email</h1>
            <p className="login-sub">
              If an account exists for <strong>{email}</strong>, a reset link has been sent.
              The link expires in <strong>1 hour</strong>.
            </p>
            <p style={{ fontSize: '0.78rem', color: 'var(--charcoal-pale)', textAlign: 'center', marginBottom: 20 }}>
              Didn't receive it? Check your spam folder or try again.
            </p>
            <button
              className="btn btn-blue-outline"
              style={{ width: '100%', justifyContent: 'center' }}
              onClick={() => { setSent(false); setEmail('') }}
            >
              Try a different email
            </button>
            <Link to={loginPath} className="login-back">← Back to Sign In</Link>
          </>
        ) : (
          <>
            <h1 className="login-heading">Forgot Password?</h1>
            <p className="login-sub">
              Enter the email address for your account and we'll send you a password reset link.
            </p>

            {error && <div className="login-error" role="alert">{error}</div>}

            <form className="login-form" onSubmit={handleSubmit} noValidate>
              <div className="login-field">
                <label className="login-label" htmlFor="fp-email">Email Address</label>
                <input
                  id="fp-email"
                  type="email"
                  className="login-input"
                  placeholder="you@example.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  autoComplete="email"
                  autoFocus
                  required
                />
              </div>
              <button
                type="submit"
                className="btn btn-blue login-submit"
                disabled={loading || !email}
              >
                {loading ? 'Sending…' : 'Send Reset Link'}
              </button>
            </form>

            <div className="login-divider"><span>Remember your password?</span></div>
            <Link to={loginPath} className="btn btn-blue-outline login-register-btn">← Back to Sign In</Link>
            <Link to="/" className="login-back">← Back to site</Link>
          </>
        )}
      </div>
    </div>
  )
}
