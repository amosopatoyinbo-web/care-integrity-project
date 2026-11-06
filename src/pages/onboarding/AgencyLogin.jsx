import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { authApi, auth } from '../../lib/api'
import OTPVerification from '../../components/OTPVerification'
import './Login.css'

export default function AgencyLogin() {
  const navigate = useNavigate()

  const [email,    setEmail]    = useState('')
  const [password, setPassword] = useState('')
  const [error,    setError]    = useState('')
  const [loading,  setLoading]  = useState(false)
  
  // OTP flow state
  const [showOTP, setShowOTP] = useState(false)
  const [sessionToken, setSessionToken] = useState('')
  const [otpExpirySeconds, setOtpExpirySeconds] = useState(600)

  // If already logged in as agency, go to dashboard
  useEffect(() => {
    const checkAuth = async () => {
      try {
        if (auth.isLoggedIn()) {
          const user = auth.getUser()
          if (user?.role === 'agency') {
            // Verify the profile exists before redirecting
            try {
              await authApi.me()
              navigate('/agency/dashboard', { replace: true })
            } catch {
              // Profile doesn't exist — clear tokens and show login form
              auth.clearTokens()
            }
          } else if (user?.role === 'caregiver') {
            // Wrong login page — send to caregiver login
            navigate('/caregiver/login', { replace: true })
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
    console.log('[AgencyLogin] handleSubmit called')
    
    if (!email || !password) {
      console.warn('[AgencyLogin] Missing email or password')
      setError('Please enter your email and password.')
      return
    }
    
    setLoading(true)
    setError('')
    console.log('[AgencyLogin] Starting login initiation for:', email)

    try {
      console.log('[AgencyLogin] Calling authApi.initiateLogin...')
      // Step 1: Initiate login with OTP
      const response = await authApi.initiateLogin(email, password)
      console.log('[AgencyLogin] initiateLogin response:', response)
      
      if (!response || !response.sessionToken) {
        console.error('[AgencyLogin] Invalid response - missing sessionToken:', response)
        throw new Error('Invalid response from server.')
      }

      // OTP sent successfully - show OTP screen
      console.log('[AgencyLogin] OTP sent successfully, showing OTP screen')
      setSessionToken(response.sessionToken)
      setOtpExpirySeconds(response.expiresIn || 600)
      setShowOTP(true)
      
    } catch (err) {
      console.error('[AgencyLogin] Login initiation error:', err)
      console.error('[AgencyLogin] Error stack:', err.stack)
      
      if (err.status === 401) {
        setError('Incorrect email or password. Please try again.')
      } else if (err.status === 423) {
        setError(err.message || 'Account temporarily locked.')
      } else if (err.status === 429) {
        setError('Too many attempts. Please wait a few minutes.')
      } else if (err.message?.includes('fetch') || err.message?.includes('network')) {
        setError('Network error. Please check your internet connection.')
      } else {
        setError(err.message || 'Unable to connect. Please try again.')
      }
      setLoading(false)
    }
  }

  async function handleVerifyOTP(otp) {
    console.log('[AgencyLogin] handleVerifyOTP called with OTP:', otp.substring(0, 2) + '****')
    
    try {
      console.log('[AgencyLogin] Calling authApi.verifyLoginOTP...')
      const response = await authApi.verifyLoginOTP(email, otp, sessionToken)
      console.log('[AgencyLogin] verifyLoginOTP response:', response)
      
      if (!response || !response.user) {
        console.error('[AgencyLogin] Invalid response - missing user:', response)
        throw new Error('Invalid response from server.')
      }

      const { user, accessToken, refreshToken } = response

      // Check if user is actually an agency
      if (user.role !== 'agency') {
        console.error('[AgencyLogin] Wrong role - expected agency, got:', user.role)
        throw new Error('This account is registered as a caregiver. Please use the Caregiver Login page.')
      }

      console.log('[AgencyLogin] Login successful, setting tokens and redirecting')
      auth.setTokens(accessToken, refreshToken)
      auth.setUser(user)
      navigate('/agency/dashboard', { replace: true })
      
    } catch (err) {
      console.error('[AgencyLogin] OTP verification error:', err)
      console.error('[AgencyLogin] Error stack:', err.stack)
      throw err // Re-throw to let OTPVerification component handle the error display
    }
  }

  async function handleResendOTP() {
    console.log('[AgencyLogin] handleResendOTP called')
    
    try {
      // Re-initiate login to get new OTP
      console.log('[AgencyLogin] Re-initiating login for new OTP')
      const response = await authApi.initiateLogin(email, password)
      console.log('[AgencyLogin] New OTP sent')
      setSessionToken(response.sessionToken)
      setOtpExpirySeconds(response.expiresIn || 600)
    } catch (err) {
      console.error('[AgencyLogin] Resend OTP error:', err)
      throw err
    }
  }

  function handleCancelOTP() {
    console.log('[AgencyLogin] handleCancelOTP called')
    setShowOTP(false)
    setSessionToken('')
    setPassword('')
    setLoading(false)
  }

  // Show OTP verification screen
  if (showOTP) {
    return (
      <OTPVerification
        email={email}
        onVerify={handleVerifyOTP}
        onResend={handleResendOTP}
        onCancel={handleCancelOTP}
        title="Verify Your Login"
        subtitle="Enter the 6-digit code we sent to"
        expirySeconds={otpExpirySeconds}
      />
    )
  }

  // Show login form
  return (
    <div className="login-page">
      <div className="login-card">

        {/* Logo */}
        <Link to="/" className="login-logo-link">
          <img src="/Main Logo.png" alt="The Care Integrity Project" className="login-logo" />
        </Link>

        {/* Heading */}
        <h1 className="login-heading">Agency Sign In</h1>
        <p className="login-sub">Sign in to access your organization dashboard.</p>

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
              placeholder="you@example.com"
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
              <Link to="/forgot-password?role=agency" className="login-forgot">Forgot password?</Link>
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
            className="btn login-submit btn-blue"
            disabled={loading || !email || !password}
          >
            {loading ? 'Sending Code…' : 'Continue with Email Verification'}
          </button>

        </form>

        {/* Divider */}
        <div className="login-divider"><span>New here?</span></div>

        {/* Register link */}
        <Link to="/agency/register" className="btn btn-blue-outline login-register-btn">
          Register Your Agency
        </Link>

        {/* Wrong page? */}
        <div className="login-switch">
          Are you a caregiver? <Link to="/caregiver/login">Caregiver Sign In →</Link>
        </div>

        {/* Back to site */}
        <Link to="/" className="login-back">← Back to site</Link>

      </div>
    </div>
  )
}
