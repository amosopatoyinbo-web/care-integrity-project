import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { authApi } from '../../lib/api'
import './Login.css'

export default function ResetPassword() {
  const [params]    = useSearchParams()
  const navigate    = useNavigate()
  const token       = params.get('token') || ''
  const email       = params.get('email') || ''

  const [password,  setPassword]  = useState('')
  const [confirm,   setConfirm]   = useState('')
  const [done,      setDone]      = useState(false)
  const [error,     setError]     = useState('')
  const [loading,   setLoading]   = useState(false)

  const invalidLink = !token || !email

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    if (password.length < 8) {
      setError('Password must be at least 8 characters.')
      return
    }
    if (password !== confirm) {
      setError('Passwords do not match.')
      return
    }
    setLoading(true)
    try {
      await authApi.resetPassword(token, email, password)
      setDone(true)
    } catch (err) {
      setError(err.message || 'This link is invalid or has expired. Please request a new one.')
      setLoading(false)
    }
  }

  return (
    <div className="login-page">
      <div className="login-card">

        <Link to="/" className="login-logo-link">
          <img src="/Main Logo.png" alt="The Care Integrity Project" className="login-logo" />
        </Link>

        {/* ── Success ── */}
        {done && (
          <>
            <div className="fp-success">
              <div className="fp-success__icon" aria-hidden="true">✓</div>
            </div>
            <h1 className="login-heading" style={{ textAlign: 'center' }}>Password Reset!</h1>
            <p className="login-sub">
              Your password has been updated successfully. You can now sign in with your new password.
            </p>
            <button
              className="btn btn-green login-submit"
              onClick={() => navigate('/caregiver/login', { replace: true })}
            >
              Sign In Now
            </button>
          </>
        )}

        {/* ── Invalid link ── */}
        {!done && invalidLink && (
          <>
            <h1 className="login-heading">Invalid Reset Link</h1>
            <p className="login-sub">
              This password reset link is missing required information. Please request a new one.
            </p>
            <Link to="/forgot-password" className="btn btn-blue login-submit">
              Request New Reset Link
            </Link>
            <Link to="/caregiver/login" className="login-back">← Back to Sign In</Link>
          </>
        )}

        {/* ── Form ── */}
        {!done && !invalidLink && (
          <>
            <h1 className="login-heading">Set New Password</h1>
            <p className="login-sub">
              Create a new password for <strong>{email}</strong>.
            </p>

            {error && <div className="login-error" role="alert">{error}</div>}

            <form className="login-form" onSubmit={handleSubmit} noValidate>
              <div className="login-field">
                <label className="login-label" htmlFor="rp-password">New Password</label>
                <input
                  id="rp-password"
                  type="password"
                  className="login-input"
                  placeholder="At least 8 characters"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  autoComplete="new-password"
                  autoFocus
                  required
                />
                {password.length > 0 && (
                  <p style={{
                    fontSize: '0.75rem',
                    marginTop: 4,
                    color: password.length >= 8 ? 'var(--integrity-green)' : '#c0392b',
                  }}>
                    {password.length >= 8 ? '✓ Good length' : `${8 - password.length} more character${8 - password.length !== 1 ? 's' : ''} needed`}
                  </p>
                )}
              </div>

              <div className="login-field">
                <label className="login-label" htmlFor="rp-confirm">Confirm New Password</label>
                <input
                  id="rp-confirm"
                  type="password"
                  className="login-input"
                  placeholder="Repeat your new password"
                  value={confirm}
                  onChange={e => setConfirm(e.target.value)}
                  autoComplete="new-password"
                  required
                />
                {confirm.length > 0 && password.length > 0 && (
                  <p style={{
                    fontSize: '0.75rem',
                    marginTop: 4,
                    color: confirm === password ? 'var(--integrity-green)' : '#c0392b',
                  }}>
                    {confirm === password ? '✓ Passwords match' : '✗ Passwords do not match'}
                  </p>
                )}
              </div>

              <button
                type="submit"
                className="btn btn-green login-submit"
                disabled={loading || !password || !confirm}
              >
                {loading ? 'Saving…' : 'Set New Password'}
              </button>
            </form>

            <Link to="/caregiver/login" className="login-back">← Back to Sign In</Link>
          </>
        )}

      </div>
    </div>
  )
}
