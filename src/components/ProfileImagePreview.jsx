import { useState } from 'react'
import './ProfileImagePreview.css'

/**
 * ProfileImagePreview - Image preview component for edit forms
 * 
 * Features:
 * - Displays preview of selected image
 * - Loading state during image load
 * - Error handling with fallback placeholder
 * - Logs failed image URLs for debugging
 * - Responsive design
 */
export default function ProfileImagePreview({ 
  preview, 
  alt = 'Image preview',
  placeholder = 'No image selected'
}) {
  const [loading, setLoading] = useState(!!preview)
  const [error, setError] = useState(false)

  // Handle image load success
  const handleLoad = () => {
    setLoading(false)
    setError(false)
  }

  // Handle image load error
  const handleError = () => {
    console.error('[ProfileImagePreview] Failed to load preview image:', preview)
    setLoading(false)
    setError(true)
  }

  // Show placeholder if no preview or error occurred
  const showPlaceholder = !preview || error

  return (
    <div className="profile-image-preview">
      {showPlaceholder ? (
        <div className="profile-image-preview__placeholder">
          <svg 
            className="profile-image-preview__icon" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" 
            />
          </svg>
          <span className="profile-image-preview__text">{placeholder}</span>
        </div>
      ) : (
        <>
          {loading && (
            <div className="profile-image-preview__loading">
              <div className="profile-image-preview__spinner" />
            </div>
          )}
          <img
            src={preview}
            alt={alt}
            className={`profile-image-preview__image ${loading ? 'profile-image-preview__image--loading' : ''}`}
            onLoad={handleLoad}
            onError={handleError}
          />
        </>
      )}
    </div>
  )
}
