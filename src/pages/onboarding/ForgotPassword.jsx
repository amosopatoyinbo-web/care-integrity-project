import { useState, useEffect, useRef } from 'react'
import { Link, useSearchParams, useNavigate } from 'react-router-dom'
import { authApi } from '../../lib/api'
import './Login.css'

export default function ForgotPassword() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const role = searchParams.get('role') // 'caregiver' or 'agency'
  const loginPath = role === 'agency' ? '/agency/login' : '/caregiver/login'

  // Step 1: Enter email
  const [email, setEmail] = useState('')
  const [emailSent, setEmailSent] = useState(false)
  const [emailLoading, setEmailLoading] = useState(false)
  const [emailError, setEmailError] = useState('')

  // Step 2: Enter OTP
  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const [otpLoading, setOtpLoading] = useState(false)
  const [otpError, setOtpError] = useState('')
  const [remainingAttempts, setRemainingAttempts] = useState(7)
  const [verificationToken, setVerificationToken] = useState('')

  // Step 3: Enter new password
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [resetLoading, setResetLoading] = useState(false)
  const [resetError, setResetError] = useState('')
  const [resetSuccess, setResetSuccess] = useState(false)

  // Timer for OTP expiry (15 minutes)
  const [timeRemaining, setTimeRemaining] = useState(15 * 60) // 15 minutes in seconds
  const [canResend, setCanResend] = useState(false)
  const [resendCount, setResendCount] = useState(0)
  const MAX_RESEND = 3

  // Refs for OTP input fields
  const otpRefs = useRef([])

  // Timer countdown
  useEffect(() => {
    if (!emailSent) return

    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          clearInterval(timer)
          setCanResend(true)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [emailSent])

  // Format time as MM:SS
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  // Step 1: Request OTP
  async function handleRequestOTP(e) {
    e.preventDefault()
    if (!email) {
      setEmailError('Please enter your email address.')
      return
    }

    setEmailLoading(true)
    setEmailError('')

    try {
      await authApi.forgotPassword(email)
      setEmailSent(true)
      setTimeRemaining(15 * 60) // Reset timer
      setCanResend(false)
      // Focus first OTP input
      setTimeout(() => otpRefs.current[0]?.focus(), 100)
    } catch (err) {
      setEmailError(err.message || 'Failed to send OTP. Please try again.')
    } finally {
      setEmailLoading(false)
    }
  }

  // Handle OTP input change
  function handleOtpChange(index, value) {
    // Only allow digits
    if (value && !/^\d$/.test(value)) return

    const newOtp = [...otp]
    newOtp[index] = value
    setOtp(newOtp)
    setOtpError('')

    // Auto-focus next input
    if (value && index < 5) {
      otpRefs.current[index + 1]?.focus()
    }

    // Auto-submit when all 6 digits entered
    if (newOtp.every(digit => digit !== '') && index === 5) {
      handleVerifyOTP(newOtp.join(''))
    }
  }

  // Handle OTP input keydown (backspace)
  function handleOtpKeyDown(index, e) {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus()
    }
  }

  // Handle paste in OTP field
  function handleOtpPaste(e) {
    e.preventDefault()
    const pastedData = e.clipboardData.getData('text').slice(0, 6)
    if (!/^\d+$/.test(pastedData)) return

    const newOtp = pastedData.split('').concat(Array(6).fill('')).slice(0, 6)
    setOtp(newOtp)
    setOtpError('')

    // Focus last filled input
    const lastIndex = Math.min(pastedData.length, 5)
    otpRefs.current[lastIndex]?.focus()

    // Auto-submit if complete
    if (pastedData.length === 6) {
      handleVerifyOTP(pastedData)
    }
  }

  // Step 2: Verify OTP
  async function handleVerifyOTP(otpCode = otp.join('')) {
    if (otpCode.length !== 6) {
      setOtpError('Please enter the complete 6-digit code.')
      return
    }

    setOtpLoading(true)
    setOtpError('')

    try {
      const response = await authApi.verifyOTP(email, otpCode)
      setVerificationToken(response.verificationToken)
      // Move to password reset step (we'll handle this in the UI)
    } catch (err) {
      const errorMsg = err.message || 'Invalid OTP code. Please try again.'
      setOtpError(errorMsg)
      
      // Extract remaining attempts from error if available
      if (err.status === 400 && errorMsg.includes('Invalid OTP')) {
        setRemainingAttempts(prev => Math.max(0, prev - 1))
      }
      
      // Clear OTP fields on error
      setOtp(['', '', '', '', '', ''])
      otpRefs.current[0]?.focus()
    } finally {
      setOtpLoading(false)
    }
  }

  // Resend OTP
  async function handleResendOTP() {
    if (resendCount >= MAX_RESEND) {
      setOtpError(`Maximum resend attempts (${MAX_RESEND}) reached. Please try again later.`)
      return
    }

    setOtpLoading(true)
    setOtpError('')

    try {
      await authApi.forgotPassword(email)
      setResendCount(prev => prev + 1)
      setTimeRemaining(15 * 60) // Reset timer
      setCanResend(false)
      setRemainingAttempts(7) // Reset attempts
      setOtp(['', '', '', '', '', '']) // Clear OTP
      otpRefs.current[0]?.focus()
    } catch (err) {
      setOtpError(err.message || 'Failed to resend OTP. Please try again.')
    } finally {
      setOtpLoading(false)
    }
  }

  // Step 3: Reset password
  async function handleResetPassword(e) {
    e.preventDefault()
    
    if (!newPassword || !confirmPassword) {
      setResetError('Please fill in both password fields.')
      return
    }
    
    if (newPassword.length < 8) {
      setResetError('Password must be at least 8 characters.')
      return
    }
    
    if (newPassword !== confirmPassword) {
      setResetError('Passwords do not match.')
      return
    }

    setResetLoading(true)
    setResetError('')

    try {
      await authApi.resetPassword(email, verificationToken, newPassword)
      setResetSuccess(true)
      // Redirect to login after 3 seconds
      setTimeout(() => navigate(loginPath), 3000)
    } catch (err) {
      setResetError(err.message || 'Failed to reset password. Please try again.')
    } finally {
      setResetLoading(false)
    }
  }

  // Go back to email entry
  function handleBackToEmail() {
    setEmailSent(false)
    setOtp(['', '', '', '', '', ''])
    setVerificationToken('')
    setOtpError('')
    setTimeRemaining(15 * 60)
    setCanResend(false)
    setResendCount(0)
    setRemainingAttempts(7)
  }

  return (
    <div className="login-page">
      <div className="login-card">
        <Link to="/" className="login-logo-link">
          <img src="/Main Logo.png" alt="The Care Integrity Project" className="login-logo" />
        </Link>

        {/* Success State - Password Reset Complete */}
        {resetSuccess ? (
          <>
            <div className="fp-success">
              <div className="fp-success__icon" aria-hidden="true">✓</div>
            </div>
            <h1 className="login-heading" style={{ textAlign: 'center' }}>Password Reset Successfully!</h1>
            <p className="login-sub" style={{ textAlign: 'center' }}>
              Your password has been updated. Redirecting you to sign in...
            </p>
            <Link to={loginPath} className="btn btn-blue" style={{ width: '100%', justifyContent: 'center', marginTop: 20 }}>
              Sign In Now
            </Link>
          </>
        ) : verificationToken ? (
          /* Step 3: Enter New Password */
          <>
            <h1 className="login-heading">Create New Password</h1>
            <p className="login-sub">
              Enter your new password for <strong>{email}</strong>
            </p>

            {resetError && <div className="login-error" role="alert">{resetError}</div>}

            <form className="login-form" onSubmit={handleResetPassword} noValidate>
              <div className="login-field">
                <label className="login-label" htmlFor="new-password">New Password</label>
                <input
                  id="new-password"
                  type="password"
                  className="login-input"
                  placeholder="At least 8 characters"
                  value={newPassword}
                  onChange={e => setNewPassword(e.target.value)}
                  autoComplete="new-password"
                  autoFocus
                  required
                />
              </div>

              <div className="login-field">
                <label className="login-label" htmlFor="confirm-password">Confirm Password</label>
                <input
                  id="confirm-password"
                  type="password"
                  className="login-input"
                  placeholder="Re-enter your password"
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  autoComplete="new-password"
                  required
                />
              </div>

              <button
                type="submit"
                className="btn btn-blue login-submit"
                disabled={resetLoading || !newPassword || !confirmPassword}
              >
                {resetLoading ? 'Resetting Password…' : 'Reset Password'}
              </button>
            </form>
          </>
        ) : emailSent ? (
          /* Step 2: Enter OTP */
          <>
            <h1 className="login-heading">Enter Verification Code</h1>
            <p className="login-sub">
              We sent a 6-digit code to <strong>{email}</strong>. Enter it below to verify your identity.
            </p>

            {/* Timer */}
            <div style={{ 
              background: timeRemaining < 300 ? '#fff3cd' : '#f0f9f7', 
              border: `1px solid ${timeRemaining < 300 ? '#ffc107' : '#2EAF8F'}`, 
              borderRadius: '8px', 
              padding: '12px 16px', 
              margin: '20px 0', 
              fontSize: '0.9rem', 
              color: timeRemaining < 300 ? '#856404' : '#1a5f4a',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <span>
                <strong>{timeRemaining > 0 ? '⏰ Code expires in:' : '⏰ Code expired'}</strong>
              </span>
              <span style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>
                {formatTime(timeRemaining)}
              </span>
            </div>

            {otpError && <div className="login-error" role="alert">{otpError}</div>}

            {/* OTP Input */}
            <div className="otp-container" style={{ margin: '30px 0' }}>
              <div className="otp-inputs" style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    ref={el => otpRefs.current[index] = el}
                    type="text"
                    inputMode="numeric"
                    maxLength="1"
                    className="otp-input"
                    style={{
                      width: '50px',
                      height: '60px',
                      fontSize: '24px',
                      textAlign: 'center',
                      border: '2px solid #ddd',
                      borderRadius: '8px',
                      outline: 'none',
                      transition: 'border-color 0.2s',
                    }}
                    value={digit}
                    onChange={e => handleOtpChange(index, e.target.value)}
                    onKeyDown={e => handleOtpKeyDown(index, e)}
                    onPaste={index === 0 ? handleOtpPaste : undefined}
                    onFocus={e => e.target.style.borderColor = '#2EAF8F'}
                    onBlur={e => e.target.style.borderColor = '#ddd'}
                    disabled={otpLoading}
                  />
                ))}
              </div>
            </div>

            {/* Attempts remaining */}
            {remainingAttempts < 7 && remainingAttempts > 0 && (
              <p style={{ fontSize: '0.85rem', color: '#856404', textAlign: 'center', marginBottom: 15 }}>
                {remainingAttempts} {remainingAttempts === 1 ? 'attempt' : 'attempts'} remaining
              </p>
            )}

            {/* Resend button */}
            <div style={{ textAlign: 'center', marginBottom: 20 }}>
              {canResend && resendCount < MAX_RESEND ? (
                <button
                  className="btn btn-blue-outline"
                  onClick={handleResendOTP}
                  disabled={otpLoading}
                  style={{ padding: '10px 20px', fontSize: '0.9rem' }}
                >
                  {otpLoading ? 'Resending…' : 'Resend Code'}
                </button>
              ) : !canResend ? (
                <p style={{ fontSize: '0.85rem', color: '#666' }}>
                  Didn't receive it? You can resend in {formatTime(timeRemaining)}
                </p>
              ) : (
                <p style={{ fontSize: '0.85rem', color: '#666' }}>
                  Maximum resend attempts reached ({MAX_RESEND}/{MAX_RESEND})
                </p>
              )}
            </div>

            <button
              className="btn btn-blue-outline"
              style={{ width: '100%', justifyContent: 'center' }}
              onClick={handleBackToEmail}
            >
              ← Use a different email
            </button>
            
            <Link to={loginPath} className="login-back">← Back to Sign In</Link>
          </>
        ) : (
          /* Step 1: Enter Email */
          <>
            <h1 className="login-heading">Forgot Password?</h1>
            <p className="login-sub">
              Enter your email address and we'll send you a 6-digit verification code to reset your password.
            </p>

            {emailError && <div className="login-error" role="alert">{emailError}</div>}

            <form className="login-form" onSubmit={handleRequestOTP} noValidate>
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
                disabled={emailLoading || !email}
              >
                {emailLoading ? 'Sending Code…' : 'Send Verification Code'}
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
