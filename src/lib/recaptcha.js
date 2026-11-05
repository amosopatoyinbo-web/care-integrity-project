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
        // Render invisible reCAPTCHA badge
        if (!window.recaptchaWidgetId) {
          window.recaptchaWidgetId = window.grecaptcha.render('recaptcha-container', {
            sitekey: RECAPTCHA_SITE_KEY,
            size: 'invisible',
          })
        }

        // Execute reCAPTCHA
        window.grecaptcha
          .execute(window.recaptchaWidgetId, { action })
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
 * Reset reCAPTCHA widget (useful after failed attempts)
 */
export function resetRecaptcha() {
  if (window.grecaptcha && window.recaptchaWidgetId !== undefined) {
    try {
      window.grecaptcha.reset(window.recaptchaWidgetId)
    } catch (err) {
      console.warn('[reCAPTCHA] Reset failed:', err)
    }
  }
}
