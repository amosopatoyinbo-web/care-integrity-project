/* ============================================================
   THE CARE INTEGRITY PROJECT — API Client
   Centralises all fetch calls to the backend.
   Handles token storage, refresh, and error normalisation.
   ============================================================ */

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
  const token = auth.getAccess()

  const headers = {
    ...(options.body && !(options.body instanceof FormData)
      ? { 'Content-Type': 'application/json' }
      : {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  }

  const res = await fetch(`${BASE}${path}`, {
    ...options,
    headers,
    body: options.body instanceof FormData
      ? options.body
      : options.body ? JSON.stringify(options.body) : undefined,
  })

  // Auto-refresh on 401
  if (res.status === 401 && retry) {
    const refreshed = await tryRefresh()
    if (refreshed) return request(path, options, false)
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
    return
  }

  let data
  try { data = await res.json() } catch { data = {} }

  if (!res.ok) {
    const err = new Error(data.error || `Request failed (${res.status})`)
    err.status = res.status
    err.errors = data.errors
    throw err
  }

  return data
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
  register:       (data)             => api.post('/auth/register', data),
  login:          (email, password)  => api.post('/auth/login', { email, password }),
  logout:         ()                 => api.post('/auth/logout', { refreshToken: auth.getRefresh() }),
  me:             ()                 => api.get('/auth/me'),
  changePassword: (cur, next)        => api.post('/auth/change-password', { currentPassword: cur, newPassword: next }),
  forgotPassword: (email)            => api.post('/auth/forgot-password', { email }),
  resetPassword:  (token, email, newPassword) => api.post('/auth/reset-password', { token, email, newPassword }),
}

/* ── Caregiver endpoints ─────────────────────────────────── */

export const caregiverApi = {
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
