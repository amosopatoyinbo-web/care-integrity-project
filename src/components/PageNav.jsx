import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { auth } from '../lib/api'
import BackButton, { fallbackPath } from './BackButton'
import './PageNav.css'

const LINKS = [
  { to: '/', label: 'Home' },
  { to: '/how-it-works', label: 'How It Works' },
  { to: '/for-caregivers', label: 'For Caregivers' },
  { to: '/for-agencies', label: 'For Agencies' },
]

/* Slim top menu for standalone pages that have no sidebar. */
export default function PageNav() {
  const [open, setOpen] = useState(false)
  const { pathname } = useLocation()
  useEffect(() => { setOpen(false) }, [pathname])

  const dash = fallbackPath()
  const links = dash === '/' ? LINKS : [...LINKS, { to: dash, label: 'My Dashboard' }]

  return (
    <nav className="cip-pagenav" aria-label="Page navigation">
      <div className="cip-pagenav__bar">
        <BackButton />
        <button
          type="button"
          className="cip-pagenav__toggle"
          aria-expanded={open}
          aria-controls="cip-pagenav-links"
          onClick={() => setOpen(o => !o)}
        >
          {open ? '✕ Close' : '☰ Menu'}
        </button>
        <ul id="cip-pagenav-links" className={`cip-pagenav__links${open ? ' is-open' : ''}`}>
          {links.map(l => (
            <li key={l.to}>
              <Link to={l.to} className={pathname === l.to ? 'is-active' : ''}>{l.label}</Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  )
}