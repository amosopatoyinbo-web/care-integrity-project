import { Link } from 'react-router-dom'
import './FoundingAgency.css'

const reasons = [
  {
    title: 'Shape the Platform',
    desc: 'Founding Agencies have direct input into platform features, standards implementation, and the accountability framework. Your experience in caregiving informs what we build.',
  },
  {
    title: 'Lead the Field',
    desc: 'Be known as an organization that doesn\'t just talk about professional caregiving-that actively invests in it. Founding Agencies are building something others will follow.',
  },
  {
    title: 'Founding Pricing',
    desc: 'Limited early access is available exclusively to founding participants. As the platform grows, this rate is locked in for those who helped build it.',
  },
  {
    title: 'Direct Partnership',
    desc: 'Founding Agencies work directly with our team-not through a support ticket. Your feedback matters, and we\'re committed to responding to it personally.',
  },
  {
    title: 'Early Feature Access',
    desc: 'Founding Agencies get access to new features before general release-and the opportunity to influence what those features look like.',
  },
]

const included = [
  'Organization profile',
  'Caregiver management',
  'Employment verification',
  'Professional recognition tools',
  'Care Integrity Standards access',
  'Accountability documentation tools',
  'Caregiver response framework',
  'Early feature access',
  'Direct feedback channel to our team',
]

const asks = [
  'Participate actively during the 6-month pilot period',
  'Provide honest feedback on what\'s working and what isn\'t',
  'Engage with at least a small cohort of your caregivers on the platform',
  'Communicate openly about your organization\'s needs and challenges',
  'Help us build something that works in the real world-not just in theory',
]

export default function FoundingAgency() {
  return (
    <div className="founding">
      {/* Hero */}
      <section className="founding__hero">
        <div className="founding__hero-inner">
          <div className="founding__hero-badge">Founding Agency Program</div>
          <h1 className="founding__hero-title">
            Help Shape the Future of Professional Caregiving
          </h1>
          <p className="founding__hero-sub">
            Be one of the first organizations building something different.
          </p>
          <p className="founding__hero-body">
            We're looking for a small cohort of agencies and employers who believe
            caregiving deserves a professional standard-and who want to help build it
            from the ground up.
          </p>
        </div>
      </section>

      {/* Why Become a Founding Agency */}
      <section className="founding__reasons section-pad">
        <div className="section-pad-inner">
          <h2 className="section-heading founding__reasons-heading">
            Why Become a Founding Agency?
          </h2>
          <p className="section-subheading founding__reasons-sub">
            This isn't just early access. It's a seat at the table.
          </p>
          <div className="founding__reasons-grid">
            {reasons.map((r) => (
              <div key={r.title} className="card founding__reason-card">
                <h3 className="founding__reason-title">{r.title}</h3>
                <p className="founding__reason-desc">{r.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Card */}
      <section className="founding__pricing section-pad">
        <div className="section-pad-inner">
          <h2 className="section-heading founding__pricing-heading">
            Founding Agency Pilot
          </h2>
          <p className="section-subheading founding__pricing-sub">
            Simple, transparent pricing for organizations building something new.
          </p>

          <div className="founding__pricing-card">
            <div className="founding__pricing-top">
              <div className="founding__pricing-label">FOUNDING AGENCY PILOT</div>
              <div className="founding__pricing-duration">6 Months</div>
              <div className="founding__pricing-price">
                <span className="founding__pricing-amount">Limited Early Access</span>
              </div>
              <div className="founding__pricing-cohort">
                Initial cohort: ~5–10 organizations
              </div>
            </div>

            <div className="founding__pricing-divider"></div>

            <ul className="founding__pricing-features">
              {included.map((item) => (
                <li key={item} className="founding__pricing-feature">
                  <span className="founding__pricing-check">✓</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            <Link to="/agency/register" className="btn btn-blue founding__pricing-cta">
              Apply to Become a Founding Agency
            </Link>

            <p className="founding__pricing-note">
              Founding Agency participation is subject to program availability and acceptance.
            </p>
          </div>
        </div>
      </section>

      {/* What We Ask */}
      <section className="founding__asks section-pad">
        <div className="section-pad-inner founding__asks-grid">
          <div className="founding__asks-left">
            <h2 className="section-heading">What We Ask of Founding Agencies</h2>
            <p className="founding__asks-intro">
              We're not looking for passive customers. We're looking for partners who
              want to build something meaningful together.
            </p>
          </div>
          <div className="founding__asks-right">
            <ul className="founding__asks-list">
              {asks.map((ask) => (
                <li key={ask} className="founding__asks-item">
                  <span className="founding__asks-icon">→</span>
                  <span>{ask}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Closing */}
      <section className="founding__closing section-pad">
        <div className="section-pad-inner">
          <div className="founding__closing-card">
            <h2 className="founding__closing-heading">
              More Than Early Customers
            </h2>
            <p className="founding__closing-body">
              The first Founding Agencies won't simply be early customers. They'll help
              shape the foundation of a professional standard for caregiving that can
              serve the entire field.
            </p>
            <p className="founding__closing-note">
              <em>
                The first Founding Agencies won't simply be early customers.
                They'll help shape the foundation.
              </em>
            </p>
            <Link to="/agency/register" className="btn btn-green founding__closing-btn">
              Apply to Become a Founding Agency
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
