import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { authApi, auth } from '../../lib/api'
import './Login.css'

export default function AdminLogin() {
  const navigate = useNavigate()

  const [email,    setEmail]    = useState('')
  const [password, setPassword] = useState('')
  const [error,    setError]    = useState('')
  const [loading,  setLoading]  = useState(false)

  // If already logged in as admin, go to dashboard
  useEffect(() => {
    const checkAuth = async () => {
      try {
        if (auth.isLoggedIn()) {
          const user = auth.getUser()
          if (user?.role === 'admin') {
            // Verify the user actually exists before redirecting
            try {
              await authApi.me()
              navigate('/admin/dashboard', { replace: true })
            } catch {
              // User doesn't exist — clear tokens and show login form
              auth.clearTokens()
            }
          } else if (user?.role === 'caregiver') {
            // Wrong login page — send to caregiver login
            navigate('/caregiver/login', { replace: true })
          } else if (user?.role === 'agency') {
            // Wrong login page — send to agency login
            navigate('/agency/login', { replace: true })
          }
        }
      } catch {
        // localStorage unavailable — show login form
      }
    }
    checkAuth()
  }, [navigate])

  async function handleSubmit(e) {
    e.preventDefault()
    if (!email || !password) {
      setError('Please enter your email and password.')
      return
    }
    setLoading(true)
    setError('')

    try {
      const response = await authApi.login(email, password)
      
      if (!response || !response.user) {
        console.error('Invalid login response:', response)
        setError('Invalid response from server. Please try again.')
        setLoading(false)
        return
      }

      const { user, accessToken, refreshToken } = response

      // Check if user is actually an admin
      if (user.role !== 'admin') {
        setError('This account does not have admin privileges.')
        setLoading(false)
        return
      }

      auth.setTokens(accessToken, refreshToken)
      auth.setUser(user)
      navigate('/admin/dashboard', { replace: true })
    } catch (err) {
      console.error('Admin login error:', err)
      
      // Show specific error messages
      if (err.status === 401) {
        setError('Incorrect email or password. Please try again.')
      } else if (err.status === 429) {
        setError('Too many attempts. Please wait a few minutes.')
      } else if (err.message?.includes('fetch') || err.message?.includes('network')) {
        setError('Network error. Please check your internet connection.')
      } else if (err.message?.includes('timeout')) {
        setError('Request timed out. Please try again.')
      } else {
        setError(err.message || 'Unable to connect. Please try again.')
      }
      setLoading(false)
    }
  }

  return (
    <div className="login-page">
      <div className="login-card">

        {/* Logo */}
        <Link to="/" className="login-logo-link">
          <img src="/Main Logo.png" alt="The Care Integrity Project" className="login-logo" />
        </Link>

        {/* Heading */}
        <h1 className="login-heading">Admin Sign In</h1>
        <p className="login-sub">Sign in to access the admin dashboard.</p>

        {/* Error banner */}
        {error && <div className="login-error" role="alert">{error}</div>}

        {/* Sign-in form */}
        <form className="login-form" onSubmit={handleSubmit} noValidate>

          <div className="login-field">
            <label className="login-label" htmlFor="login-email">Email Address</label>
            <input
              id="login-email"
              type="email"
              className="login-input"
              placeholder="admin@example.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              autoComplete="email"
              autoFocus
              required
            />
          </div>

          <div className="login-field">
            <div className="login-label-row">
              <label className="login-label" htmlFor="login-password">Password</label>
            </div>
            <input
              id="login-password"
              type="password"
              className="login-input"
              placeholder="Your password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              autoComplete="current-password"
              required
            />
          </div>

          <button
            type="submit"
            className="btn login-submit"
            style={{ backgroundColor: '#6c757d' }}
            disabled={loading || !email || !password}
          >
            {loading ? 'Signing in…' : 'Sign In as Admin'}
          </button>

        </form>

        {/* Back to site */}
        <Link to="/" className="login-back">← Back to site</Link>

      </div>
    </div>
  )
}
