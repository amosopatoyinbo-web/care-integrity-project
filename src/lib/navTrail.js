import { auth } from './api'

/* Where "home" is for the current visitor: own dashboard when logged in, else the landing page. */
export function homePath() {
  if (!auth.isLoggedIn()) return '/'
  const role = auth.getUser()?.role
  if (role === 'agency') return '/agency/dashboard'
  if (role === 'caregiver') return '/caregiver/dashboard'
  if (role === 'admin') return '/admin/dashboard'
  return '/'
}

export function homeLabel() {
  return homePath() === '/' ? 'Home' : 'Dashboard'
}

const PUBLIC_TRAILS = {
  '/about': 'About',
  '/standards': 'Our 10 Standards',
  '/how-it-works': 'How It Works',
  '/for-caregivers': 'For Caregivers',
  '/for-agencies': 'For Agencies',
  '/founding-agency': 'Founding Agency Program',
  '/privacy': 'Privacy Policy',
  '/terms': 'Terms',
}

/* Default breadcrumb trail for a route. Pages with dynamic data pass their own `trail` to SubNav. */
export function getTrail(pathname, search = '') {
  const home = { label: homeLabel(), to: homePath() }
  const dash = { label: 'Dashboard', to: homePath() }
  if (PUBLIC_TRAILS[pathname]) return [home, { label: PUBLIC_TRAILS[pathname] }]
  switch (pathname) {
    case '/caregiver/dashboard':
    case '/agency/dashboard':
    case '/admin/dashboard':
      return [{ label: 'Dashboard' }]
    case '/caregiver/profile/edit':
    case '/agency/profile/edit':
      return [dash, { label: 'Edit Profile' }]
    case '/caregivers/browse':
      return [dash, { label: 'Browse Caregivers' }]
    case '/caregiver/profile': {
      const p = new URLSearchParams(search)
      if (p.get('view') === 'agency') {
        return [dash, { label: 'Browse Caregivers', to: '/caregivers/browse' }, { label: 'Profile' }]
      }
      return [dash, { label: 'My Profile' }]
    }
    default:
      return [home]
  }
}