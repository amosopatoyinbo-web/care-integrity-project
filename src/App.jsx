import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import About from './pages/About'
import ForCaregivers from './pages/ForCaregivers'
import ForAgencies from './pages/ForAgencies'
import Standards from './pages/Standards'
import HowItWorks from './pages/HowItWorks'
import FoundingAgency from './pages/FoundingAgency'
import CaregiverOnboarding from './pages/onboarding/CaregiverOnboarding'
import CaregiverProfile    from './pages/onboarding/CaregiverProfile'
import CaregiverProfileEdit from './pages/onboarding/CaregiverProfileEdit'
import CaregiverDashboard  from './pages/onboarding/CaregiverDashboard'
import CaregiverBrowse     from './pages/onboarding/CaregiverBrowse'
import CaregiverLogin      from './pages/onboarding/CaregiverLogin'
import AgencyOnboarding    from './pages/onboarding/AgencyOnboarding'
import AgencyProfileEdit   from './pages/onboarding/AgencyProfileEdit'
import AgencyDashboard     from './pages/onboarding/AgencyDashboard'
import AgencyLogin         from './pages/onboarding/AgencyLogin'
import AdminLogin          from './pages/onboarding/AdminLogin'
import AdminDashboard      from './pages/onboarding/AdminDashboard'
import ForgotPassword      from './pages/onboarding/ForgotPassword'
import ResetPassword       from './pages/onboarding/ResetPassword'

/* Routes that render their own full-page layout — no shared Navbar/Footer */
const STANDALONE = new Set([
  '/caregiver/register',
  '/caregiver/profile',
  '/caregiver/profile/edit',
  '/caregiver/dashboard',
  '/caregiver/login',
  '/caregivers/browse',
  '/agency/register',
  '/agency/profile/edit',
  '/agency/dashboard',
  '/agency/login',
  '/admin/login',
  '/admin/dashboard',
  '/forgot-password',
  '/reset-password',
])

function Layout({ children }) {
  const { pathname } = useLocation()

  /* Check both exact match and prefix match */
  const isStandalone = [...STANDALONE].some(p => pathname === p || pathname.startsWith(p + '?') || pathname.startsWith(p + '/'))

  if (isStandalone) return <>{children}</>

  return (
    <>
      <Navbar />
      <main>{children}</main>
      <Footer />
    </>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          {/* ── Marketing site ── */}
          <Route path="/"                element={<Home />} />
          <Route path="/about"           element={<About />} />
          <Route path="/for-caregivers"  element={<ForCaregivers />} />
          <Route path="/for-agencies"    element={<ForAgencies />} />
          <Route path="/standards"       element={<Standards />} />
          <Route path="/how-it-works"    element={<HowItWorks />} />
          <Route path="/founding-agency" element={<FoundingAgency />} />

          {/* ── Phase 1 — Caregiver ── */}
          <Route path="/caregiver/register"  element={<CaregiverOnboarding />} />
          <Route path="/caregiver/profile"   element={<CaregiverProfile />} />
          <Route path="/caregiver/profile/edit" element={<CaregiverProfileEdit />} />
          <Route path="/caregiver/dashboard" element={<CaregiverDashboard />} />
          <Route path="/caregiver/login"     element={<CaregiverLogin />} />
          <Route path="/caregivers/browse"   element={<CaregiverBrowse />} />

          {/* ── Phase 1 — Agency ── */}
          <Route path="/agency/register"  element={<AgencyOnboarding />} />
          <Route path="/agency/profile/edit" element={<AgencyProfileEdit />} />
          <Route path="/agency/dashboard" element={<AgencyDashboard />} />
          <Route path="/agency/login"     element={<AgencyLogin />} />

          {/* ── Admin ── */}
          <Route path="/admin/login"      element={<AdminLogin />} />
          <Route path="/admin/dashboard"  element={<AdminDashboard />} />

          {/* ── Auth pages (standalone — no Navbar/Footer) ── */}
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password"  element={<ResetPassword />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  )
}
