import { Link } from 'react-router-dom'
import './Standards.css'

const standards = [
  {
    num: '01',
    name: 'Compassion',
    tagline: 'See the person-not just the task.',
    desc: 'A professional caregiver approaches every interaction with genuine care and empathy. Compassion means recognizing the full humanity of the person you are caring for-their feelings, their fears, their dignity, and their worth. It means being patient when patience is hard, kind when kindness matters most, and present even when the work is difficult.',
    tags: ['Patience', 'Empathy', 'Presence', 'Kindness'],
  },
  {
    num: '02',
    name: 'Dependability',
    tagline: 'Be someone people can count on.',
    desc: 'Dependability means showing up-physically and professionally. It means following through on commitments, communicating when plans change, and being the kind of caregiver that clients, families, and colleagues can count on. In caregiving, reliability is not optional. People depend on you.',
    tags: ['Reliability', 'Follow-through', 'Communication', 'Consistency'],
  },
  {
    num: '03',
    name: 'Accountability',
    tagline: 'Take responsibility for your actions.',
    desc: 'Professional caregivers own their actions-including their mistakes. Accountability means reporting problems honestly, following procedures, and learning from setbacks rather than hiding them. It means taking responsibility when something goes wrong and working to make it right. Accountability is not about punishment; it is about integrity.',
    tags: ['Ownership', 'Honesty', 'Responsibility', 'Growth'],
  },
  {
    num: '04',
    name: 'Safety',
    tagline: 'Pay attention. Speak up. Act responsibly.',
    desc: 'Safety in caregiving means more than following protocols. It means staying alert, noticing hazards and changes in condition, speaking up when something seems wrong, and acting responsibly to protect the people in your care. A professional caregiver is a proactive safety partner-not just a task-completer.',
    tags: ['Alertness', 'Hazard Recognition', 'Communication', 'Responsibility'],
  },
  {
    num: '05',
    name: 'Communication',
    tagline: 'Clear. Respectful. Timely.',
    desc: 'Communication is foundational to safe, effective caregiving. It means listening carefully, sharing relevant updates with the care team, documenting appropriately, and communicating with clients and families in a way that is clear, respectful, and timely. Good communication prevents problems. Poor communication creates them.',
    tags: ['Listening', 'Documentation', 'Updates', 'Clarity'],
  },
  {
    num: '06',
    name: 'Dignity & Respect',
    tagline: 'Every person deserves both.',
    desc: 'Every person in care deserves to be treated with full dignity and respect-regardless of their condition, behavior, or circumstances. This means protecting their privacy, honoring their choices, supporting their independence, respecting their personal space, and ensuring they always feel valued as a human being. Dignity is not optional. It is the foundation of care.',
    tags: ['Privacy', 'Autonomy', 'Respect', 'Inclusion'],
  },
  {
    num: '07',
    name: 'Professionalism',
    tagline: 'Treat caregiving like the profession it is.',
    desc: 'Caregiving is a profession. That means maintaining appropriate boundaries, protecting confidentiality, conducting yourself with professionalism in all settings, and representing your organization with integrity. A professional caregiver understands that how they show up reflects not just on themselves, but on the entire field.',
    tags: ['Boundaries', 'Confidentiality', 'Conduct', 'Integrity'],
  },
  {
    num: '08',
    name: 'Integrity',
    tagline: 'Do the right thing-even when no one is watching.',
    desc: 'Integrity means being honest, truthful, and ethical-especially when no one is watching. It means protecting the people in your care from any form of exploitation or harm. It means not cutting corners, not being dishonest, and not taking advantage of the trust that clients and families place in you. Integrity is the character of a professional.',
    tags: ['Honesty', 'Ethics', 'Trust', 'Character'],
  },
  {
    num: '09',
    name: 'Advocacy',
    tagline: 'When something matters, speak up appropriately.',
    desc: 'Advocacy means noticing when something is wrong and doing something about it-through the right channels, in the right way. It means supporting the preferences and rights of the people in your care, communicating concerns to appropriate parties, and not staying silent when someone\'s wellbeing is at risk. Good caregivers are informed advocates.',
    tags: ['Speaking Up', 'Support', 'Escalation', 'Rights'],
  },
  {
    num: '10',
    name: 'Person-Centered Care',
    tagline: 'Put the person before the task list.',
    desc: 'Person-centered care means recognizing that every person you care for is an individual-with their own preferences, routines, abilities, values, and life story. It means delivering care in a way that respects who they are, not just what they need. The task list matters. But the person comes first.',
    tags: ['Individuality', 'Preferences', 'Routines', 'Respect'],
  },
]

const steps = [
  { label: 'Learn' },
  { label: 'Practice' },
  { label: 'Demonstrate' },
  { label: 'Recognize' },
  { label: 'Reflect & Grow' },
]

export default function Standards() {
  return (
    <div className="standards">
      {/* Hero */}
      <section className="standards__hero">
        <div className="standards__hero-inner">
          <h1 className="standards__hero-title">
            What Does Professional Caregiving Look Like?
          </h1>
          <p className="standards__hero-sub">
            A caregiver's job description tells them what to do.
            Our standards help define <em>how to care</em>.
          </p>
        </div>
      </section>

      {/* Standards Grid */}
      <section className="standards__list section-pad">
        <div className="section-pad-inner">
          <h2 className="section-heading standards__list-heading">
            The 10 Care Integrity Standards
          </h2>
          <p className="section-subheading standards__list-sub">
            Ten standards. One professional framework. Applicable in every care setting.
          </p>
          <div className="standards__grid">
            {standards.map((s) => (
              <article key={s.num} className="standards__card">
                <div className="standards__card-num">{s.num}</div>
                <div className="standards__card-body">
                  <h3 className="standards__card-name">{s.name}</h3>
                  <p className="standards__card-tagline">{s.tagline}</p>
                  <p className="standards__card-desc">{s.desc}</p>
                  <div className="standards__card-tags">
                    {s.tags.map((tag) => (
                      <span key={tag} className="tag tag-blue">{tag}</span>
                    ))}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* How the Standards Work */}
      <section className="standards__how section-pad">
        <div className="section-pad-inner">
          <h2 className="section-heading standards__how-heading">
            How the Standards Work
          </h2>
          <p className="section-subheading standards__how-sub">
            The standards aren't a checklist. They're a framework for professional growth.
          </p>
          <div className="standards__steps">
            {steps.map((step, i) => (
              <div key={step.label} className="standards__step">
                <div className="standards__step-label">{step.label}</div>
                {i < steps.length - 1 && (
                  <div className="standards__step-connector" aria-hidden="true">→</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="standards__cta">
        <div className="standards__cta-inner">
          <h2 className="standards__cta-heading">See how these standards come to life</h2>
          <Link to="/how-it-works" className="btn btn-white standards__cta-btn">
            Explore How It Works
          </Link>
        </div>
      </section>
    </div>
  )
}
