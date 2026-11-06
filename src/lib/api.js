/* ============================================================
   THE CARE INTEGRITY PROJECT — API Client
   Centralises all fetch calls to the backend.
   Handles token storage, refresh, and error normalisation.
   ============================================================ */

import { executeRecaptcha } from './recaptcha.js'

const BASE = import.meta.env.VITE_API_URL || 'http://localhost:4000/api'

/* ── Token helpers ───────────────────────────────────────── */

export const auth = {
  getAccess:      () => localStorage.getItem('cip_access'),
  getRefresh:     () => localStorage.getItem('cip_refresh'),
  setTokens:      (a, r) => { localStorage.setItem('cip_access', a); if (r) localStorage.setItem('cip_refresh', r) },
  clearTokens:    () => { localStorage.removeItem('cip_access'); localStorage.removeItem('cip_refresh'); localStorage.removeItem('cip_user') },
  getUser:        () => { try { return JSON.parse(localStorage.getItem('cip_user')) } catch { return null } },
  setUser:        (u) => localStorage.setItem('cip_user', JSON.stringify(u)),
  isLoggedIn:     () => !!localStorage.getItem('cip_access'),
}

/* ── Core fetch wrapper ──────────────────────────────────── */

async function request(path, options = {}, retry = true) {
  console.log(`[API] Request: ${options.method || 'GET'} ${path}`)
  
  const token = auth.getAccess()

  const headers = {
    ...(options.body && !(options.body instanceof FormData)
      ? { 'Content-Type': 'application/json' }
      : {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  }

  // Add timeout controller for cold start handling
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), 30000) // 30 second timeout

  try {
    console.log(`[API] Fetching: ${BASE}${path}`)
    const res = await fetch(`${BASE}${path}`, {
      ...options,
      headers,
      signal: controller.signal,
      body: options.body instanceof FormData
        ? options.body
        : options.body ? JSON.stringify(options.body) : undefined,
    })

    clearTimeout(timeoutId)
    console.log(`[API] Response status: ${res.status}`)

    let data
    try { 
      data = await res.json()
      console.log(`[API] Response data:`, data)
    } catch { 
      data = {}
      console.warn(`[API] No JSON data in response`)
    }

    // Auto-refresh on 401 (but only for protected routes, not auth endpoints)
    if (res.status === 401 && retry && !path.includes('/auth/')) {
      console.log(`[API] 401 detected, attempting token refresh...`)
      const refreshed = await tryRefresh()
      if (refreshed) {
        console.log(`[API] Token refreshed, retrying request`)
        return request(path, options, false)
      }
      console.warn(`[API] Token refresh failed, clearing auth`)
      auth.clearTokens()
      // Redirect to the appropriate login page based on stored role
      const user = auth.getUser()
      if (user?.role === 'admin') {
        window.location.href = '/admin/login'
      } else if (user?.role === 'agency') {
        window.location.href = '/agency/login'
      } else {
        window.location.href = '/caregiver/login'
      }
      throw new Error('Session expired. Please log in again.')
    }

    if (!res.ok) {
      const err = new Error(data.error || `Request failed (${res.status})`)
      err.status = res.status
      err.errors = data.errors
      console.error(`[API] Request failed:`, err)
      throw err
    }

    return data
  } catch (err) {
    clearTimeout(timeoutId)
    
    // Handle timeout/abort errors
    if (err.name === 'AbortError') {
      console.error(`[API] Request timeout`)
      const timeoutErr = new Error('Request timed out. The server may be waking up. Please try again.')
      timeoutErr.status = 408
      throw timeoutErr
    }
    
    // Handle network errors
    if (err.message === 'Failed to fetch' || err.message?.includes('network')) {
      console.error(`[API] Network error`)
      const networkErr = new Error('Network error. Please check your internet connection.')
      networkErr.status = 0
      throw networkErr
    }
    
    console.error(`[API] Request error:`, err)
    throw err
  }
}

async function tryRefresh() {
  const refreshToken = auth.getRefresh()
  if (!refreshToken) return false
  try {
    const res = await fetch(`${BASE}/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken }),
    })
    if (!res.ok) return false
    const { accessToken, refreshToken: newRefresh } = await res.json()
    auth.setTokens(accessToken, newRefresh)
    return true
  } catch { return false }
}

/* ── Convenience methods ─────────────────────────────────── */

const api = {
  get:    (path, opts)   => request(path, { method: 'GET',    ...opts }),
  post:   (path, body)   => request(path, { method: 'POST',   body }),
  put:    (path, body)   => request(path, { method: 'PUT',    body }),
  patch:  (path, body)   => request(path, { method: 'PATCH',  body }),
  delete: (path)         => request(path, { method: 'DELETE' }),
  upload: (path, form)   => request(path, { method: 'POST',   body: form }),
}

/* ── Auth endpoints ──────────────────────────────────────── */

export const authApi = {
  register: async (data) => {
    console.log('[authApi] register called')
    const recaptchaToken = await executeRecaptcha('signup')
    console.log('[authApi] reCAPTCHA token obtained for register')
    return api.post('/auth/register', { ...data, recaptchaToken })
  },
  login: async (email, password) => {
    console.log('[authApi] login called for:', email)
    const recaptchaToken = await executeRecaptcha('login')
    console.log('[authApi] reCAPTCHA token obtained for login')
    return api.post('/auth/login', { email, password, recaptchaToken })
  },
  // OTP-based login (2-step process)
  initiateLogin: async (email, password) => {
    console.log('[authApi] initiateLogin called for:', email)
    const recaptchaToken = await executeRecaptcha('login')
    console.log('[authApi] reCAPTCHA token obtained for initiateLogin')
    return api.post('/auth-otp/initiate-login', { email, password, recaptchaToken })
  },
  verifyLoginOTP: async (email, otp, sessionToken) => {
    console.log('[authApi] verifyLoginOTP called for:', email)
    return api.post('/auth-otp/verify-login', { email, otp, sessionToken })
  },
  // OTP-based signup (2-step process)
  initiateSignup: async (email, role) => {
    console.log('[authApi] initiateSignup called for:', email, role)
    const recaptchaToken = await executeRecaptcha('signup')
    console.log('[authApi] reCAPTCHA token obtained for initiateSignup')
    return api.post('/auth-otp/initiate-signup', { email, role, recaptchaToken })
  },
  verifySignupOTP: async (email, otp, sessionToken) => {
    console.log('[authApi] verifySignupOTP called for:', email)
    return api.post('/auth-otp/verify-signup', { email, otp, sessionToken })
  },
  logout:         ()                 => api.post('/auth/logout', { refreshToken: auth.getRefresh() }),
  me:             ()                 => api.get('/auth/me'),
  changePassword: (cur, next)        => api.post('/auth/change-password', { currentPassword: cur, newPassword: next }),
  forgotPassword: (email)            => api.post('/auth/forgot-password', { email }),
  verifyOTP:      (email, otp)       => api.post('/auth/verify-otp', { email, otp }),
  resetPassword:  (email, verificationToken, newPassword) => api.post('/auth/reset-password', { email, verificationToken, newPassword }),
}

/* ── Caregiver endpoints ─────────────────────────────────── */

export const caregiverApi = {
  register: async (data) => {
    console.log('[caregiverApi] register called')
    const recaptchaToken = await executeRecaptcha('caregiver_signup')
    console.log('[caregiverApi] reCAPTCHA token obtained')
    return api.post('/caregivers/register', { ...data, recaptchaToken })
  },
  list:        (page = 1)   => api.get(`/caregivers?page=${page}`),
  getById:     (id)         => api.get(`/caregivers/${id}`),
  getMe:       ()           => api.get('/caregivers/me'),
  create:      (data)       => api.post('/caregivers', data),
  updateMe:    (data)       => api.put('/caregivers/me', data),
  deleteMe:    ()           => api.delete('/caregivers/me'),

  // Credentials
  getCredentials:       ()          => api.get('/caregivers/me/credentials'),
  addCredential:        (data)      => api.post('/caregivers/me/credentials', data),
  updateCredential:     (id, data)  => api.put(`/caregivers/me/credentials/${id}`, data),
  deleteCredential:     (id)        => api.delete(`/caregivers/me/credentials/${id}`),

  // Employment
  getEmployment:        ()          => api.get('/caregivers/me/employment'),
  addEmployment:        (data)      => api.post('/caregivers/me/employment', data),
  updateEmployment:     (id, data)  => api.put(`/caregivers/me/employment/${id}`, data),
  deleteEmployment:     (id)        => api.delete(`/caregivers/me/employment/${id}`),
}

/* ── Agency endpoints ────────────────────────────────────── */

export const agencyApi = {
  register: async (data) => {
    console.log('[agencyApi] register called')
    const recaptchaToken = await executeRecaptcha('agency_signup')
    console.log('[agencyApi] reCAPTCHA token obtained')
    return api.post('/agencies/register', { ...data, recaptchaToken })
  },
  list:     (page = 1)  => api.get(`/agencies?page=${page}`),
  getById:  (id)        => api.get(`/agencies/${id}`),
  getMe:    ()          => api.get('/agencies/me'),
  create:   (data)      => api.post('/agencies', data),
  updateMe: (data)      => api.put('/agencies/me', data),
  deleteMe: ()          => api.delete('/agencies/me'),
}

/* ── Interview request endpoints ─────────────────────────── */

export const requestApi = {
  list:     (status)      => api.get(`/requests${status ? `?status=${status}` : ''}`),
  getById:  (id)          => api.get(`/requests/${id}`),
  send:     (data)        => api.post('/requests', data),
  respond:  (id, data)    => api.patch(`/requests/${id}`, data),
  withdraw: (id)          => api.delete(`/requests/${id}`),
}

/* ── Recognition endpoints ───────────────────────────────── */

export const recognitionApi = {
  getByCaregiverId: (caregiverId) => api.get(`/recognition?caregiverId=${caregiverId}`),
  getByAgencyId:    (agencyId)    => api.get(`/recognition?agencyId=${agencyId}`),
  give:             (data)        => api.post('/recognition', data),
  remove:           (id)          => api.delete(`/recognition/${id}`),
}

/* ── Verification endpoints ──────────────────────────────── */

export const verificationApi = {
  getPending:  ()                           => api.get('/verification/pending'),
  action:      (caregiverId, empId, action) => api.patch(`/verification/${caregiverId}/${empId}`, { action }),
  claim:       (employmentId, agencyName)   => api.post('/verification/claim', { employmentId, agencyName }),
}

/* ── Accountability endpoints ────────────────────────────── */

export const accountabilityApi = {
  list:    ()       => api.get('/accountability'),
  create:  (data)   => api.post('/accountability', data),
  update:  (id, d)  => api.patch(`/accountability/${id}`, d),
  getById: (id)     => api.get(`/accountability/${id}`),
}

/* ── Upload endpoints ────────────────────────────────────── */

export const uploadApi = {
  avatar:   (file) => { const f = new FormData(); f.append('file', file); return api.upload('/uploads/avatar', f) },
  logo:     (file) => { const f = new FormData(); f.append('file', file); return api.upload('/uploads/logo', f) },
  document: (file) => { const f = new FormData(); f.append('file', file); return api.upload('/uploads/document', f) },
}

export default api
