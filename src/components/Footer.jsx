import { Link } from 'react-router-dom'
import './Footer.css'

const quickLinks = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About' },
  { to: '/for-caregivers', label: 'For Caregivers' },
  { to: '/for-agencies', label: 'For Agencies & Employers' },
  { to: '/standards', label: 'Our Standards' },
  { to: '/how-it-works', label: 'How It Works' },
  { to: '/founding-agency', label: 'Founding Agency Program' },
]

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer__main">
        <div className="footer__grid">
          {/* Column 1: About */}
          <div className="footer__col">
            <div className="footer__logo">
              <img src="/Main Logo.png" alt="The Care Integrity Project" className="footer__logo-img" />
            </div>
            <p className="footer__blurb">
              We believe caregivers should be equipped before they are expected to perform-
              and recognized for the professionalism they demonstrate. Building a professional
              standard for caregiving across every setting.
            </p>
            <p className="footer__tagline">
              "Because care is more than a job. It is a responsibility."
            </p>
          </div>

          {/* Column 2: Quick Links */}
          <div className="footer__col">
            <h3 className="footer__col-heading">Quick Links</h3>
            <ul className="footer__links">
              {quickLinks.map(({ to, label }) => (
                <li key={to}>
                  <Link to={to} className="footer__link">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Contact */}
          <div className="footer__col">
            <h3 className="footer__col-heading">Get In Touch</h3>
            <p className="footer__contact-note">
              Interested in joining as a Founding Agency or learning more about our mission?
            </p>
            <div className="footer__contact-items">
              <div className="footer__contact-item">
                <span className="footer__contact-icon">✉</span>
                <span>Contact@thecareintegrityproject.com</span>
              </div>
              <div className="footer__contact-item">
                <span className="footer__contact-icon">📍</span>
                <span>Serving caregivers nationwide</span>
              </div>
            </div>
            <Link to="/founding-agency" className="btn btn-gold footer__cta">
              Become a Founding Agency
            </Link>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="footer__bottom">
        <div className="footer__bottom-inner">
          <p className="footer__mission">
            Trusted Care · Stronger Communities · A Brighter Future
          </p>
          <p className="footer__copyright">
            © 2026 The Care Integrity Project. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
