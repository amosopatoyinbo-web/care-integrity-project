import { Link } from 'react-router-dom'
import './ForAgencies.css'

const features = [
  {
    title: 'Equip Before You Expect',
    desc: 'Give caregivers access to our 10 Care Integrity Standards before they\'re expected to perform. Build a foundation of shared professional expectations from day one.',
  },
  {
    title: 'Recognize What Goes Right',
    desc: 'Most HR systems are built to capture problems. This one also captures professionalism. Acknowledge dependability, compassion, and care when you see it.',
  },
  {
    title: 'Account Fairly',
    desc: 'When concerns arise, document them fairly, with evidence, and give caregivers the opportunity to respond. A complete picture-not just one side of the story.',
  },
  {
    title: 'See More Than a Résumé',
    desc: 'Access caregiver profiles that show verified employment history, demonstrated standards, recognition received, and professional context-not just dates and titles.',
  },
  {
    title: 'Build Your Workforce',
    desc: 'Attract and retain caregivers who value professionalism. When your organization is known for equipping and recognizing its workforce, the right caregivers take notice.',
  },
]

export default function ForAgencies() {
  return (
    <div className="agencies">
      {/* Hero */}
      <section className="agencies__hero">
        <div className="agencies__hero-inner">
          <h1 className="agencies__hero-title">
            Hire With More Confidence.
            <br />
            <span className="agencies__hero-emphasis">Recognize Great Caregivers.</span>
          </h1>
          <p className="agencies__hero-sub">
            The Care Integrity Project gives agencies and employers a better way to equip,
            recognize, and account for the caregivers on their team.
          </p>
          <Link to="/agency/register" className="btn btn-white agencies__hero-btn">
            Join the Care Integrity Project
          </Link>
        </div>
      </section>

      {/* What Makes It Different */}
      <section className="agencies__features section-pad">
        <div className="section-pad-inner">
          <h2 className="section-heading">What Makes It Different</h2>
          <p className="section-subheading agencies__features-sub">
            Most platforms are built to track problems. This one is built to build professionals.
          </p>
          <div className="agencies__features-grid">
            {features.map((f) => (
              <div key={f.title} className="card agencies__feature-card">
                <h3 className="agencies__feature-title">{f.title}</h3>
                <p className="agencies__feature-desc">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* A Better Question */}
      <section className="agencies__question section-pad">
        <div className="section-pad-inner">
          <div className="agencies__question-box">
            <div className="agencies__question-accent"></div>
            <div className="agencies__question-content">
              <h3 className="agencies__question-heading">A Better Question</h3>
              <blockquote className="agencies__question-quote">
                "Instead of only asking, 'Did they work here?' the platform helps
                organizations capture: 'What have they demonstrated as a professional
                caregiver?'"
              </blockquote>
              <p className="agencies__question-sub">
                Employment verification is important. But professional character is what
                really determines the quality of care being delivered-every single day.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Platform Note */}
      <section className="agencies__platform section-pad">
        <div className="section-pad-inner">
          <div className="agencies__platform-grid">
            <div className="agencies__platform-left">
              <h2 className="section-heading">Designed to Complement</h2>
              <p className="agencies__platform-note">
                The platform supplements-not replaces-existing hiring, employment, HR,
                scheduling, payroll, and compliance processes.
              </p>
              <p className="agencies__platform-note">
                You keep your existing systems. We add a layer of professional
                infrastructure that captures what those systems were never designed to see.
              </p>
            </div>
            <div className="agencies__platform-right">
              <div className="agencies__supplement-list">
                {[
                  { label: 'HR Systems',           note: 'Complement' },
                  { label: 'Compliance Tools',     note: 'Complement' },
                  { label: 'Scheduling Platforms', note: 'Complement' },
                  { label: 'Payroll Software',     note: 'Complement' },
                  { label: 'Hiring Processes',     note: 'Complement' },
                ].map((item) => (
                  <div key={item.label} className="agencies__supplement-item">
                    <span className="agencies__supplement-label">{item.label}</span>
                    <span className="agencies__supplement-note">{item.note}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Helps You */}
      <section className="agencies__outcomes section-pad">
        <div className="section-pad-inner">
          <h2 className="section-heading">The Outcomes You're Looking For</h2>
          <div className="agencies__outcomes-grid">
            {[
              { num: '01', heading: 'More Informed Hiring', desc: 'Access caregiver profiles that show professional context beyond a résumé-verified positions, demonstrated standards, and recognition history.' },
              { num: '02', heading: 'Stronger Retention', desc: 'Caregivers who feel recognized and professionally supported stay longer. Recognition isn\'t just nice-it\'s a retention strategy.' },
              { num: '03', heading: 'Consistent Standards', desc: 'Shared professional standards across your organization mean every caregiver starts from the same professional foundation.' },
              { num: '04', heading: 'Fair Accountability', desc: 'When something goes wrong, handle it with documentation, evidence, and caregiver response-protecting everyone involved.' },
            ].map((o) => (
              <div key={o.num} className="card agencies__outcome-card">
                <span className="agencies__outcome-num">{o.num}</span>
                <h3 className="agencies__outcome-heading">{o.heading}</h3>
                <p className="agencies__outcome-desc">{o.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Bar */}
      <section className="agencies__cta">
        <div className="agencies__cta-inner">
          <h2 className="agencies__cta-heading">
            Ready to build something different?
          </h2>
          <p className="agencies__cta-sub">
            Join the first organizations building a professional standard for caregiving.
          </p>
          <Link to="/agency/register" className="btn btn-white agencies__cta-btn">
            Join the Care Integrity Project
          </Link>
        </div>
      </section>
    </div>
  )
}
