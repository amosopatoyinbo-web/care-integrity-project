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
              onClick={() => {
                // Determine which login page to show based on stored user role or default to caregiver
                const user = JSON.parse(localStorage.getItem('cip_user') || '{}')
                const loginPage = user?.role === 'agency' ? '/agency/login' : '/caregiver/login'
                navigate(loginPage, { replace: true })
              }}
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

      </div>
    </div>
  )
}
