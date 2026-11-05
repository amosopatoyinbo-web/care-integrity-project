import { useState, useEffect, useRef } from 'react'
import './OTPVerification.css'

export default function OTPVerification({ 
  email, 
  onVerify, 
  onResend, 
  onCancel,
  title = 'Verify Your Email',
  subtitle = 'Enter the 6-digit code we sent to',
  expirySeconds = 600 // 10 minutes
}) {
  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [timeLeft, setTimeLeft] = useState(expirySeconds)
  const inputRefs = useRef([])

  // Countdown timer
  useEffect(() => {
    if (timeLeft <= 0) return

    const timer = setInterval(() => {
      setTimeLeft(t => Math.max(0, t - 1))
    }, 1000)

    return () => clearInterval(timer)
  }, [timeLeft])

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const handleChange = (index, value) => {
    if (!/^\d*$/.test(value)) return // Only digits

    const newOtp = [...otp]
    newOtp[index] = value.slice(-1) // Only take last character
    setOtp(newOtp)
    setError('')

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus()
    }

    // Auto-submit when all filled
    if (newOtp.every(digit => digit) && index === 5) {
      handleVerify(newOtp.join(''))
    }
  }

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  const handlePaste = (e) => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData('text').trim()
    
    if (!/^\d{6}$/.test(pastedData)) {
      setError('Please paste a 6-digit code')
      return
    }

    const newOtp = pastedData.split('')
    setOtp(newOtp)
    setError('')
    
    // Auto-submit
    handleVerify(pastedData)
  }

  const handleVerify = async (code) => {
    const otpCode = code || otp.join('')
    
    if (otpCode.length !== 6) {
      setError('Please enter all 6 digits')
      return
    }

    setLoading(true)
    setError('')

    try {
      await onVerify(otpCode)
    } catch (err) {
      setError(err.message || 'Invalid code. Please try again.')
      setOtp(['', '', '', '', '', ''])
      inputRefs.current[0]?.focus()
    } finally {
      setLoading(false)
    }
  }

  const handleResend = async () => {
    setLoading(true)
    setError('')
    setOtp(['', '', '', '', '', ''])
    
    try {
      await onResend()
      setTimeLeft(expirySeconds)
      inputRefs.current[0]?.focus()
    } catch (err) {
      setError(err.message || 'Failed to resend code. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="otp-verification">
      <div className="otp-card">
        
        {/* Header */}
        <div className="otp-header">
          <div className="otp-icon">🔐</div>
          <h1 className="otp-title">{title}</h1>
          <p className="otp-subtitle">{subtitle}</p>
          <p className="otp-email">{email}</p>
        </div>

        {/* OTP Input */}
        <div className="otp-inputs" onPaste={handlePaste}>
          {otp.map((digit, index) => (
            <input
              key={index}
              ref={el => inputRefs.current[index] = el}
              type="text"
              inputMode="numeric"
              maxLength="1"
              className={`otp-input ${error ? 'otp-input--error' : ''}`}
              value={digit}
              onChange={e => handleChange(index, e.target.value)}
              onKeyDown={e => handleKeyDown(index, e)}
              autoFocus={index === 0}
              disabled={loading || timeLeft === 0}
            />
          ))}
        </div>

        {/* Error Message */}
        {error && (
          <div className="otp-error" role="alert">
            <span className="otp-error-icon">⚠️</span>
            {error}
          </div>
        )}

        {/* Timer */}
        <div className="otp-timer">
          {timeLeft > 0 ? (
            <p>Code expires in <strong>{formatTime(timeLeft)}</strong></p>
          ) : (
            <p className="otp-expired">Code expired. Please request a new one.</p>
          )}
        </div>

        {/* Actions */}
        <div className="otp-actions">
          <button
            type="button"
            className="btn btn-green otp-verify-btn"
            onClick={() => handleVerify()}
            disabled={loading || otp.some(d => !d) || timeLeft === 0}
          >
            {loading ? 'Verifying...' : 'Verify Code'}
          </button>

          <div className="otp-links">
            <button
              type="button"
              className="otp-link"
              onClick={handleResend}
              disabled={loading || timeLeft > expirySeconds - 60} // Can resend after 1 minute
            >
              Resend Code
            </button>
            <span className="otp-divider">•</span>
            <button
              type="button"
              className="otp-link"
              onClick={onCancel}
              disabled={loading}
            >
              Use Different Email
            </button>
          </div>
        </div>

        {/* Help Text */}
        <div className="otp-help">
          <p>📧 Didn't receive the code?</p>
          <ul>
            <li>Check your spam/junk folder</li>
            <li>Make sure you entered the correct email</li>
            <li>Wait a minute and try resending</li>
          </ul>
        </div>

      </div>
    </div>
  )
}
