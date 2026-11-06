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
    // Wait for grecaptcha to be ready
    if (!window.grecaptcha) {
      const checkInterval = setInterval(() => {
        if (window.grecaptcha && window.grecaptcha.ready) {
          clearInterval(checkInterval)
          executeToken()
        }
      }, 100)

      // Timeout after 10 seconds
      setTimeout(() => {
        clearInterval(checkInterval)
        reject(new Error('reCAPTCHA failed to load. Please refresh the page.'))
      }, 10000)
    } else {
      executeToken()
    }

    function executeToken() {
      window.grecaptcha.ready(() => {
        // For v3, we don't need to render - just execute directly
        window.grecaptcha
          .execute(RECAPTCHA_SITE_KEY, { action })
          .then((token) => {
            resolve(token)
          })
          .catch((err) => {
            console.error('[reCAPTCHA] Execution failed:', err)
            reject(new Error('reCAPTCHA verification failed. Please try again.'))
          })
      })
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
