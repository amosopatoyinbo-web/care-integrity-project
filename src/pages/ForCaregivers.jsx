import { Link } from 'react-router-dom'
import './ForCaregivers.css'

const features = [
  {
    title: 'Build a Professional Profile',
    desc: 'Create a portable, professional profile that belongs to you-not your employer. Take it with you throughout your career.',
  },
  {
    title: 'Document Experience & Training',
    desc: 'Record your employment history, certifications, and training in one place. Build a verified professional record over time.',
  },
  {
    title: 'Learn the 10 Standards',
    desc: 'Access our 10 Care Integrity Standards and understand what professional caregiving looks like in every setting.',
  },
  {
    title: 'Demonstrate Professionalism',
    desc: 'Show-not just tell-what kind of caregiver you are. Your consistent behavior builds your reputation.',
  },
  {
    title: 'Receive Recognition',
    desc: 'Get acknowledged for the professionalism you demonstrate. Recognition from verified employers becomes part of your profile.',
  },
  {
    title: 'Verified Employment History',
    desc: 'Agency-confirmed positions provide a credible, verified record of where you have worked and what you have contributed.',
  },
  {
    title: 'Review & Respond to Accountability Matters',
    desc: 'If a concern is ever raised, you have the right to review it, provide context, and share your perspective. Always.',
  },
  {
    title: 'Build Your Reputation Over Time',
    desc: 'A career in caregiving is a long journey. Your profile grows with you-reflecting your experience, growth, and dedication.',
  },
]

const badges = [
  { label: 'Compassion', color: '#2EAF8F' },
  { label: 'Dependability', color: '#0F4C81' },
  { label: 'Safety', color: '#D4AF37' },
  { label: 'Integrity', color: '#7ED0C9' },
]

export default function ForCaregivers() {
  return (
    <div className="caregivers">
      {/* Hero */}
      <section className="caregivers__hero">
        <div className="caregivers__hero-inner">
          <h1 className="caregivers__hero-title">
            Your Work Matters.
            <br />
            <span className="caregivers__hero-emphasis">Your Reputation Should, Too.</span>
          </h1>
          <p className="caregivers__hero-sub">
            The Care Integrity Project gives you the professional tools to build, document,
            and demonstrate the caregiver you are-and the one you're becoming.
          </p>
          <Link to="/caregiver/register" className="btn btn-white caregivers__hero-btn">
            Build My Professional Profile
          </Link>
        </div>
      </section>

      {/* What Caregivers Can Do */}
      <section className="caregivers__features section-pad">
        <div className="section-pad-inner">
          <h2 className="section-heading">What Caregivers Can Do</h2>
          <p className="section-subheading caregivers__features-sub">
            Your profile is your professional home. Here's what you can build inside it.
          </p>
          <div className="caregivers__features-grid">
            {features.map((f) => (
              <div key={f.title} className="card caregivers__feature-card">
                <h3 className="caregivers__feature-title">{f.title}</h3>
                <p className="caregivers__feature-desc">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Your Profile */}
      <section className="caregivers__profile section-pad">
        <div className="section-pad-inner caregivers__profile-grid">
          <div className="caregivers__profile-text">
            <h2 className="section-heading">Your Professional Profile</h2>
            <p>
              Your Care Integrity profile is yours-not your employer's. It travels with
              you through your career, building a verified, portable record of who you are
              as a professional.
            </p>
            <p>
              It includes your employment history (verified by agencies), the standards
              you've demonstrated, any recognition you've received, and your own voice
              through caregiver-reported information.
            </p>
            <p>
              Whether you're looking for a new position, growing in your current role, or
              simply building a professional foundation for your career-your profile is
              your professional identity.
            </p>
            <div className="caregivers__profile-note">
              <span>
                Your profile is <strong>caregiver-controlled</strong>. You decide what
                is visible, and you always have the right to respond to any accountability
                matters.
              </span>
            </div>
          </div>

          {/* Mock Profile Card */}
          <div className="caregivers__mock-profile">
            <div className="mock-card">
              <div className="mock-card__header">
                <div className="mock-card__avatar">JD</div>
                <div className="mock-card__identity">
                  <h3 className="mock-card__name">Jane Doe</h3>
                  <p className="mock-card__role">Caregiver</p>
                  <p className="mock-card__location">Seattle, WA</p>
                </div>
                <div className="mock-card__badge">Caregiver-Reported</div>
              </div>

              <div className="mock-card__section">
                <p className="mock-card__label">Standards Demonstrated</p>
                <div className="mock-card__badges">
                  {badges.map((b) => (
                    <span
                      key={b.label}
                      className="mock-card__standard-badge"
                      style={{ background: b.color }}
                    >
                      {b.label}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mock-card__section">
                <p className="mock-card__label">Employment</p>
                <div className="mock-card__employment">
                  <span>3 verified positions</span>
                </div>
              </div>

              <div className="mock-card__section">
                <p className="mock-card__label">Recognition Received</p>
                <div className="mock-card__recognition">
                  <span className="mock-card__recognition-count">2 recognitions</span>
                </div>
              </div>

              <div className="mock-card__footer">
                <span className="mock-card__member">Member since 2024</span>
                <span className="mock-card__verified">Verified Profile ✓</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Bar */}
      <section className="caregivers__cta">
        <div className="caregivers__cta-inner">
          <h2 className="caregivers__cta-heading">
            Ready to build your professional profile?
          </h2>
          <p className="caregivers__cta-sub">
            Join caregivers who are building something lasting.
          </p>
          <Link to="/caregiver/register" className="btn btn-white caregivers__cta-btn">
            Build My Professional Profile
          </Link>
        </div>
      </section>
    </div>
  )
}
