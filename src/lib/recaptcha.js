/* ============================================================
   reCAPTCHA v3 Integration Utility
   Provides helper functions to execute and verify reCAPTCHA
   ============================================================ */

const RECAPTCHA_SITE_KEY = import.meta.env.VITE_RECAPTCHA_SITE_KEY || '6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI' // Test key as fallback

/**
 * Load reCAPTCHA script and execute verification
 * @param {string} action - The action name (e.g., 'login', 'signup')
 * @returns {Promise<string>} - The reCAPTCHA token
 */
export async function executeRecaptcha(action) {
  return new Promise((resolve, reject) => {
    console.log(`[reCAPTCHA] executeRecaptcha called with action: ${action}`)
    
    // Wait for grecaptcha to be ready
    if (!window.grecaptcha) {
      console.log('[reCAPTCHA] grecaptcha not loaded yet, waiting...')
      
      const checkInterval = setInterval(() => {
        if (window.grecaptcha && window.grecaptcha.ready) {
          clearInterval(checkInterval)
          console.log('[reCAPTCHA] grecaptcha loaded successfully')
          executeToken()
        }
      }, 100)

      // Timeout after 10 seconds
      setTimeout(() => {
        clearInterval(checkInterval)
        console.error('[reCAPTCHA] Failed to load after 10 seconds')
        reject(new Error('reCAPTCHA failed to load. Please refresh the page.'))
      }, 10000)
    } else {
      console.log('[reCAPTCHA] grecaptcha already loaded')
      executeToken()
    }

    function executeToken() {
      try {
        window.grecaptcha.ready(() => {
          console.log(`[reCAPTCHA] Executing with action: ${action}, site key: ${RECAPTCHA_SITE_KEY.substring(0, 20)}...`)
          
          // For v3, execute directly with site key (no rendering needed)
          // This is the correct way - no widget rendering
          window.grecaptcha
            .execute(RECAPTCHA_SITE_KEY, { action })
            .then((token) => {
              console.log('[reCAPTCHA] Token generated successfully, length:', token?.length)
              resolve(token)
            })
            .catch((err) => {
              console.error('[reCAPTCHA] Execution error:', err)
              console.error('[reCAPTCHA] Error details:', err.message, err.stack)
              reject(new Error('reCAPTCHA verification failed. Please try again.'))
            })
        })
      } catch (err) {
        console.error('[reCAPTCHA] Unexpected error in executeToken:', err)
        console.error('[reCAPTCHA] Error stack:', err.stack)
        reject(new Error('reCAPTCHA error. Please refresh the page.'))
      }
    }
  })
}

/**
 * Reset reCAPTCHA (for v3, this is mostly a no-op, but kept for compatibility)
 */
export function resetRecaptcha() {
  // reCAPTCHA v3 doesn't need manual reset
  // Tokens are generated fresh on each execute() call
  console.log('[reCAPTCHA] Reset called (no-op for v3)')
}
