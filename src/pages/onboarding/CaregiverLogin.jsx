import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { authApi, auth } from '../../lib/api'
import OTPVerification from '../../components/OTPVerification'
import './Login.css'

export default function CaregiverLogin() {
  const navigate = useNavigate()

  const [email,    setEmail]    = useState('')
  const [password, setPassword] = useState('')
  const [error,    setError]    = useState('')
  const [loading,  setLoading]  = useState(false)
  
  // OTP flow state
  const [showOTP, setShowOTP] = useState(false)
  const [sessionToken, setSessionToken] = useState('')
  const [otpExpirySeconds, setOtpExpirySeconds] = useState(600)

  // If already logged in as caregiver, go to dashboard
  useEffect(() => {
    const checkAuth = async () => {
      try {
        if (auth.isLoggedIn()) {
          const user = auth.getUser()
          if (user?.role === 'caregiver') {
            try {
              await authApi.me()
              navigate('/caregiver/dashboard', { replace: true })
            } catch {
              auth.clearTokens()
            }
          } else if (user?.role === 'agency') {
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
    console.log('[CaregiverLogin] handleSubmit called')
    
    if (!email || !password) {
      console.warn('[CaregiverLogin] Missing email or password')
      setError('Please enter your email and password.')
      return
    }
    
    setLoading(true)
    setError('')
    console.log('[CaregiverLogin] Starting login initiation for:', email)

    try {
      console.log('[CaregiverLogin] Calling authApi.initiateLogin...')
      // Step 1: Initiate login with OTP
      const response = await authApi.initiateLogin(email, password)
      console.log('[CaregiverLogin] initiateLogin response:', response)
      
      if (!response || !response.sessionToken) {
        console.error('[CaregiverLogin] Invalid response - missing sessionToken:', response)
        throw new Error('Invalid response from server.')
      }

      // OTP sent successfully - show OTP screen
      console.log('[CaregiverLogin] OTP sent successfully, showing OTP screen')
      setSessionToken(response.sessionToken)
      setOtpExpirySeconds(response.expiresIn || 600)
      setShowOTP(true)
      
    } catch (err) {
      console.error('[CaregiverLogin] Login initiation error:', err)
      console.error('[CaregiverLogin] Error stack:', err.stack)
      
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
    console.log('[CaregiverLogin] handleVerifyOTP called with OTP:', otp.substring(0, 2) + '****')
    
    try {
      console.log('[CaregiverLogin] Calling authApi.verifyLoginOTP...')
      const response = await authApi.verifyLoginOTP(email, otp, sessionToken)
      console.log('[CaregiverLogin] verifyLoginOTP response:', response)
      
      if (!response || !response.user) {
        console.error('[CaregiverLogin] Invalid response - missing user:', response)
        throw new Error('Invalid response from server.')
      }

      const { user, accessToken, refreshToken } = response

      // Check if user is actually a caregiver
      if (user.role !== 'caregiver') {
        console.error('[CaregiverLogin] Wrong role - expected caregiver, got:', user.role)
        throw new Error('This account is registered as an agency. Please use the Agency Login page.')
      }

      console.log('[CaregiverLogin] Login successful, setting tokens and redirecting')
      auth.setTokens(accessToken, refreshToken)
      auth.setUser(user)
      navigate('/caregiver/dashboard', { replace: true })
      
    } catch (err) {
      console.error('[CaregiverLogin] OTP verification error:', err)
      console.error('[CaregiverLogin] Error stack:', err.stack)
      throw err // Re-throw to let OTPVerification component handle the error display
    }
  }

  async function handleResendOTP() {
    console.log('[CaregiverLogin] handleResendOTP called')
    
    try {
      // Re-initiate login to get new OTP
      console.log('[CaregiverLogin] Re-initiating login for new OTP')
      const response = await authApi.initiateLogin(email, password)
      console.log('[CaregiverLogin] New OTP sent')
      setSessionToken(response.sessionToken)
      setOtpExpirySeconds(response.expiresIn || 600)
    } catch (err) {
      console.error('[CaregiverLogin] Resend OTP error:', err)
      throw err
    }
  }

  function handleCancelOTP() {
    console.log('[CaregiverLogin] handleCancelOTP called')
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
        <h1 className="login-heading">Caregiver Sign In</h1>
        <p className="login-sub">Sign in to access your professional profile.</p>

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
              <Link to="/forgot-password?role=caregiver" className="login-forgot">Forgot password?</Link>
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
            className="btn login-submit btn-green"
            disabled={loading || !email || !password}
          >
            {loading ? 'Sending Code…' : 'Continue with Email Verification'}
          </button>

        </form>

        {/* Divider */}
        <div className="login-divider"><span>New here?</span></div>

        {/* Register link */}
        <Link to="/caregiver/register" className="btn btn-green-outline login-register-btn">
          Create Caregiver Profile
        </Link>

        {/* Wrong page? */}
        <div className="login-switch">
          Are you an agency? <Link to="/agency/login">Agency Sign In →</Link>
        </div>

        {/* Back to site */}
        <Link to="/" className="login-back">← Back to site</Link>

      </div>
    </div>
  )
}
