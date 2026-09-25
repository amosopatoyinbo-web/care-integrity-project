import { Link } from 'react-router-dom'
import './HowItWorks.css'

const steps = [
  {
    num: '01',
    name: 'EQUIP',
    headline: 'Prepare caregivers before expecting them to perform.',
    desc: 'The first step in the Care Integrity framework is equipping. Before a caregiver is expected to demonstrate professional standards, they should have access to them. Our 10 Care Integrity Standards give caregivers and organizations a shared professional language-a foundation of expectations that everyone understands before care begins.',
    detail: 'Equipping means investing in the professional identity of caregivers before the first shift. It means giving them the tools to understand what professional caregiving looks like-not just what tasks to complete, but how to care.',
  },
  {
    num: '02',
    name: 'DEMONSTRATE',
    headline: 'Professionalism is demonstrated through behavior.',
    desc: 'Professional caregiving isn\'t just what you know. It\'s what you do-every day, in every interaction, in every setting. Demonstration happens through consistent behavior: showing up reliably, communicating clearly, protecting dignity, advocating appropriately, and treating each person in your care as an individual.',
    detail: 'The platform is designed to capture demonstrated professionalism over time-not through surveillance, but through the documented record of a professional career. Caregiver-reported information, employer verification, and recognition all contribute to a picture of who someone is as a professional.',
  },
  {
    num: '03',
    name: 'RECOGNIZE',
    headline: 'Good caregiving deserves to be seen.',
    desc: 'Recognition is one of the most underutilized tools in caregiving. When a caregiver shows exceptional compassion, dependability, or integrity, that deserves acknowledgment-not just a thank-you in a staff meeting, but a documented, verified recognition that becomes part of their professional profile.',
    detail: 'Recognition through the Care Integrity Project is tied to specific standards. An organization can recognize a caregiver for demonstrating compassion, dependability, communication, or any of our 10 standards. That recognition lives on the caregiver\'s profile-visible to future employers and reflecting a career of professional contribution.',
  },
  {
    num: '04',
    name: 'ACCOUNT',
    headline: 'When something goes wrong, handle it fairly.',
    desc: 'Accountability is part of any professional framework. But accountability done poorly can be more harmful than helpful-leading to damaged careers, lost context, and a system that works against caregivers rather than with them. The Care Integrity framework approaches accountability differently.',
    detail: 'Every accountability matter requires documentation, evidence, and-critically-a caregiver response. No concern is final without the opportunity for the caregiver to provide context, share their perspective, and have that response become part of the record.',
    flow: ['FACT', 'EVIDENCE', 'RESPONSE', 'RESOLUTION'],
  },
  {
    num: '05',
    name: 'GROW',
    headline: 'A professional reputation is built over time.',
    desc: 'A career in caregiving is a long journey. The Care Integrity Project is designed to support that journey-building a professional record that grows more meaningful over time. Every verified position, every recognition, every demonstrated standard adds to a profile that reflects who a caregiver truly is.',
    detail: 'Growth isn\'t just professional advancement. It\'s the accumulation of experience, the refinement of skills, and the deepening of a professional identity. We want every caregiver to be able to look back on their career and see-clearly-what they built.',
  },
]

export default function HowItWorks() {
  return (
    <div className="hiw">
      {/* Hero */}
      <section className="hiw__hero">
        <div className="hiw__hero-inner">
          <h1 className="hiw__hero-title">
            A Better Way to Build Professional Caregivers
          </h1>
          <p className="hiw__hero-sub">
            Five steps. One framework. A professional standard for every care setting.
          </p>
        </div>
      </section>

      {/* Steps */}
      {steps.map((step, i) => (
        <section
          key={step.num}
          className={`hiw__step-section section-pad${i % 2 === 0 ? ' hiw__step-section--white' : ' hiw__step-section--cream'}`}
        >
          <div className="section-pad-inner hiw__step-inner">
            <div className="hiw__step-num">{step.num}</div>
            <div className="hiw__step-content">
              <div className="hiw__step-header">
                <div>
                  <h2 className="hiw__step-name">{step.name}</h2>
                  <p className="hiw__step-headline">{step.headline}</p>
                </div>
              </div>
              <p className="hiw__step-desc">{step.desc}</p>
              <p className="hiw__step-detail">{step.detail}</p>

              {step.flow && (
                <div className="hiw__flow">
                  {step.flow.map((item, fi) => (
                    <div key={item} className="hiw__flow-group">
                      <div className="hiw__flow-item">{item}</div>
                      {fi < step.flow.length - 1 && (
                        <span className="hiw__flow-arrow">→</span>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>
      ))}

      {/* Not a Score */}
      <section className="hiw__notscore section-pad">
        <div className="section-pad-inner">
          <div className="hiw__notscore-box">
            <div className="hiw__notscore-accent"></div>
            <div className="hiw__notscore-content">
              <h3 className="hiw__notscore-heading">
                We're Not Creating a Perfect-Caregiver Score
              </h3>
              <p className="hiw__notscore-body">
                The Care Integrity Project is not designed to score, rank, or rate
                caregivers. We are not building a leaderboard or a trust metric. We are
                building a professional record-one that captures the full picture of a
                caregiver's career: the recognition, the experience, the accountability
                matters, and the response.
              </p>
              <p className="hiw__notscore-body">
                A professional record is not a score. It is a story. And every caregiver
                deserves the opportunity to tell theirs.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Dual CTA */}
      <section className="hiw__cta">
        <div className="hiw__cta-inner">
          <h2 className="hiw__cta-heading">Ready to get started?</h2>
          <div className="hiw__cta-btns">
            <Link to="/caregiver/register" className="btn btn-green">
              Build My Professional Profile
            </Link>
            <Link to="/agency/register" className="btn btn-white-outline">
              Join as an Agency / Employer
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
