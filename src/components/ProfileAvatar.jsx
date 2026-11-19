import { useState } from 'react'
import './ProfileAvatar.css'

/**
 * ProfileAvatar - Reusable avatar component with error handling
 * 
 * Features:
 * - Displays profile image with fallback to initials
 * - Loading state with skeleton animation
 * - Error handling with automatic fallback
 * - Size variants: small (50px), medium (100px), large (150px)
 * - Responsive and accessible
 */
export default function ProfileAvatar({ 
  photoUrl, 
  name = 'User', 
  size = 'medium',
  alt = 'Profile avatar'
}) {
  const [loading, setLoading] = useState(!!photoUrl)
  const [error, setError] = useState(false)

  // Generate initials from name
  const getInitials = (name) => {
    if (!name || typeof name !== 'string') return 'U'
    const parts = name.trim().split(' ')
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
    }
    return name.slice(0, 2).toUpperCase()
  }

  const initials = getInitials(name)

  // Handle image load success
  const handleLoad = () => {
    setLoading(false)
    setError(false)
  }

  // Handle image load error
  const handleError = () => {
    console.warn('[ProfileAvatar] Failed to load image:', photoUrl)
    setLoading(false)
    setError(true)
  }

  // Show initials if no photo URL or error occurred
  const showInitials = !photoUrl || error

  return (
    <div 
      className={`profile-avatar profile-avatar--${size}`}
      role="img"
      aria-label={alt}
    >
      {showInitials ? (
        <div className="profile-avatar__initials">
          {initials}
        </div>
      ) : (
        <>
          {loading && (
            <div className="profile-avatar__skeleton" aria-hidden="true" />
          )}
          <img
            src={photoUrl}
            alt={alt}
            className={`profile-avatar__image ${loading ? 'profile-avatar__image--loading' : ''}`}
            onLoad={handleLoad}
            onError={handleError}
            loading="lazy"
          />
        </>
      )}
    </div>
  )
}
