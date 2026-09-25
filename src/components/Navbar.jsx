import { useState, useEffect, useRef } from 'react'
import { NavLink, Link, useLocation } from 'react-router-dom'
import './Navbar.css'



/* ── Dropdown chevron ── */
function Chevron({ open }) {
  return (
    <svg
      width="12" height="12" viewBox="0 0 12 12" fill="none"
      aria-hidden="true"
      style={{ transform: open ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s ease', flexShrink: 0 }}
    >
      <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

/* ── Nav structure ── */
const navItems = [
  { to: '/about', label: 'About' },
  {
    label: 'Learn',
    dropdown: [
      { to: '/standards',    label: 'Our 10 Standards',  desc: 'What professional caregiving looks like' },
      { to: '/how-it-works', label: 'How It Works',      desc: 'Equip · Demonstrate · Recognize · Account · Grow' },
    ],
  },
  {
    label: 'Join',
    dropdown: [
      { to: '/for-caregivers',  label: 'For Caregivers',         desc: 'Build your professional profile' },
      { to: '/for-agencies',    label: 'For Agencies & Employers', desc: 'Equip and recognize your workforce' },
      { to: '/founding-agency', label: 'Founding Agency Program', desc: 'Help shape the platform — Limited Early Access' },
    ],
  },
]

/* ── Dropdown component ── */
function Dropdown({ item, closeAll }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)
  const location = useLocation()

  // Close on route change
  useEffect(() => { setOpen(false) }, [location])

  // Close on outside click
  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const isActive = item.dropdown.some(d => location.pathname === d.to)

  return (
    <div className="navbar__dropdown-wrap" ref={ref}>
      <button
        className={`navbar__link navbar__dropdown-btn${isActive ? ' navbar__link--active' : ''}`}
        onClick={() => setOpen(o => !o)}
        aria-haspopup="true"
        aria-expanded={open}
      >
        {item.label}
        <Chevron open={open} />
      </button>

      {open && (
        <div className="navbar__dropdown" role="menu">
          {item.dropdown.map(d => (
            <NavLink
              key={d.to}
              to={d.to}
              className={({ isActive }) =>
                `navbar__dropdown-item${isActive ? ' navbar__dropdown-item--active' : ''}`
              }
              role="menuitem"
              onClick={() => { setOpen(false); closeAll && closeAll() }}
            >
              <span className="navbar__dropdown-label">{d.label}</span>
              <span className="navbar__dropdown-desc">{d.desc}</span>
            </NavLink>
          ))}
        </div>
      )}
    </div>
  )
}

/* ── Main Navbar ── */
export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [mobileExpanded, setMobileExpanded] = useState(null)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const close = () => { setMenuOpen(false); setMobileExpanded(null) }

  return (
    <header className={`navbar${scrolled ? ' navbar--scrolled' : ''}`} role="banner">
      <div className="navbar__inner">

        {/* Logo */}
        <Link to="/" className="navbar__logo" onClick={close} aria-label="The Care Integrity Project — Home">
          <img src="/Main Logo.png" alt="The Care Integrity Project" className="navbar__logo-img" />
        </Link>

        {/* Desktop Nav */}
        <nav className="navbar__nav" aria-label="Main navigation">
          <ul className="navbar__links" role="list">
            {navItems.map((item) => (
              <li key={item.label}>
                {item.dropdown
                  ? <Dropdown item={item} />
                  : (
                    <NavLink
                      to={item.to}
                      end
                      className={({ isActive }) =>
                        `navbar__link${isActive ? ' navbar__link--active' : ''}`
                      }
                    >
                      {item.label}
                    </NavLink>
                  )
                }
              </li>
            ))}
          </ul>

          <div className="navbar__ctas">
            <Link to="/caregiver/login" className="btn btn-green-outline btn-sm">
              Caregiver Login
            </Link>
            <Link to="/agency/login" className="btn btn-blue-outline btn-sm">
              Agency Login
            </Link>
          </div>
        </nav>

        {/* Hamburger */}
        <button
          className={`navbar__hamburger${menuOpen ? ' open' : ''}`}
          onClick={() => setMenuOpen(o => !o)}
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
        >
          <span /><span /><span />
        </button>
      </div>

      {/* Mobile Menu */}
      <div id="mobile-menu" className={`navbar__mobile${menuOpen ? ' open' : ''}`} aria-hidden={!menuOpen}>
        <ul className="navbar__mobile-links" role="list">

          {/* About — simple link */}
          <li>
            <NavLink to="/about" className={({ isActive }) => `navbar__link${isActive ? ' navbar__link--active' : ''}`} onClick={close}>
              About
            </NavLink>
          </li>

          {/* Learn — expandable */}
          <li className="navbar__mobile-group">
            <button
              className="navbar__mobile-group-btn"
              onClick={() => setMobileExpanded(mobileExpanded === 'learn' ? null : 'learn')}
              aria-expanded={mobileExpanded === 'learn'}
            >
              Learn <Chevron open={mobileExpanded === 'learn'} />
            </button>
            {mobileExpanded === 'learn' && (
              <ul className="navbar__mobile-sub">
                <li><NavLink to="/standards"    onClick={close} className={({ isActive }) => `navbar__mobile-sub-link${isActive ? ' active' : ''}`}>Our 10 Standards</NavLink></li>
                <li><NavLink to="/how-it-works" onClick={close} className={({ isActive }) => `navbar__mobile-sub-link${isActive ? ' active' : ''}`}>How It Works</NavLink></li>
              </ul>
            )}
          </li>

          {/* Join — expandable */}
          <li className="navbar__mobile-group">
            <button
              className="navbar__mobile-group-btn"
              onClick={() => setMobileExpanded(mobileExpanded === 'join' ? null : 'join')}
              aria-expanded={mobileExpanded === 'join'}
            >
              Join <Chevron open={mobileExpanded === 'join'} />
            </button>
            {mobileExpanded === 'join' && (
              <ul className="navbar__mobile-sub">
                <li><NavLink to="/for-caregivers"  onClick={close} className={({ isActive }) => `navbar__mobile-sub-link${isActive ? ' active' : ''}`}>For Caregivers</NavLink></li>
                <li><NavLink to="/for-agencies"    onClick={close} className={({ isActive }) => `navbar__mobile-sub-link${isActive ? ' active' : ''}`}>For Agencies &amp; Employers</NavLink></li>
                <li><NavLink to="/founding-agency" onClick={close} className={({ isActive }) => `navbar__mobile-sub-link${isActive ? ' active' : ''}`}>Founding Agency Program</NavLink></li>
              </ul>
            )}
          </li>

        </ul>

        <div className="navbar__mobile-ctas">
          <Link to="/caregiver/login" className="btn btn-green-outline" onClick={close}>
            Caregiver Login
          </Link>
          <Link to="/agency/login" className="btn btn-blue-outline" onClick={close}>
            Agency Login
          </Link>
        </div>
      </div>
    </header>
  )
}
