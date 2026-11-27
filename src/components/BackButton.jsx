import { useNavigate, useLocation } from 'react-router-dom'
import { auth } from '../lib/api'
import './BackButton.css'

/* Where to land when there is no in-app history to go back to. */
export function fallbackPath() {
  const role = auth.getUser()?.role
  if (role === 'agency') return '/agency/dashboard'
  if (role === 'caregiver') return '/caregiver/dashboard'
  if (role === 'admin') return '/admin/dashboard'
  return '/'
}

export default function BackButton({ className = '' }) {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  if (pathname === '/') return null

  function goBack() {
    if ((window.history.state?.idx ?? 0) > 0) navigate(-1)
    else navigate(fallbackPath())
  }

  return (
    <button type="button" className={`cip-back ${className}`.trim()} onClick={goBack} aria-label="Go back">
      <span aria-hidden="true">←</span> Back
    </button>
  )
}