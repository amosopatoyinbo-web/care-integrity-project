import { Link } from 'react-router-dom'
import './About.css'

export default function About() {
  return (
    <div className="about">
      {/* Hero */}
      <section className="about__hero">
        <div className="about__hero-inner">
          <h1 className="about__hero-title">
            Caregiving Is More Than a Job.
            <br />
            <span className="about__hero-emphasis">It is a responsibility.</span>
          </h1>
          <p className="about__hero-sub">
            The Care Integrity Project was created to bring a professional standard to
            caregiving-one that recognizes what great caregivers already do, and helps
            build the infrastructure to make that visible.
          </p>
        </div>
      </section>

      {/* Why We Created This */}
      <section className="about__why section-pad">
        <div className="section-pad-inner about__why-grid">
          <div className="about__why-left">
            <h2 className="section-heading">Why We Created This</h2>
            <div className="about__why-accent"></div>
          </div>
          <div className="about__why-right">
            <p>
              Caregiving is one of the most important professions in society. The people who
              provide care-in homes, in facilities, in communities-carry an enormous
              responsibility. They care for people at their most vulnerable. They protect
              dignity, support independence, and often serve as a critical line of safety.
            </p>
            <p>
              And yet, the profession has historically lacked the kind of professional
              infrastructure that other fields take for granted. A clear set of standards.
              A way to demonstrate professionalism over time. A framework that equips
              caregivers before expecting them to perform.
            </p>
            <p>
              That gap matters-for caregivers, for the people they care for, and for the
              organizations that employ them. The Care Integrity Project was created to
              address it.
            </p>
            <p>
              We built this because we believe caregivers deserve better tools, better
              recognition, and a better professional identity. And because the people who
              receive care deserve to know that the people caring for them have been equipped
              with a professional standard-not just a job description.
            </p>
          </div>
        </div>
      </section>

      {/* Philosophy Callout */}
      <section className="about__philosophy">
        <div className="about__philosophy-inner">
          <blockquote className="about__philosophy-quote">
            "We Equip Before We Account."
          </blockquote>

          <p className="about__philosophy-sub">
            Our foundation is preparation, not surveillance. Professionalism is built
            through equipping, supporting, and recognizing-not just monitoring.
          </p>

          {/* Image cards */}
          <div className="about__philosophy-cards">
            <div className="about__philosophy-card">
              <img src="/image 6.jpg" alt="Professional caregiver supporting a client with warmth and dignity" loading="lazy" />
            </div>
            <div className="about__philosophy-card">
              <img src="/image 7.jpg" alt="Caregiver and client sharing a moment of trust and connection" loading="lazy" />
            </div>
            <div className="about__philosophy-card">
              <img src="/image 8.jpg" alt="Caregiver demonstrating professional care in a home setting" loading="lazy" />
            </div>
          </div>

          <Link to="/how-it-works" className="btn btn-white about__philosophy-btn">
            Learn How It Works
          </Link>
        </div>
      </section>

      {/* What We Are NOT / What We Are Building */}
      <section className="about__what section-pad">
        <div className="section-pad-inner">
          <h2 className="section-heading about__what-heading">Our Approach</h2>
          <div className="about__what-grid">
            {/* What We Are Not */}
            <div className="about__what-col about__what-col--not">
              <h3 className="about__what-col-title about__what-col-title--not">
                What We Are Not
              </h3>
              <ul className="about__what-list">
                {[
                  'A blacklist or punitive database',
                  'A surveillance platform',
                  'A trust score or rating system',
                  'A replacement for HR, hiring, or compliance processes',
                  'A one-strike accountability system',
                  'A system designed to damage careers',
                  'A shortcut that replaces professional judgment',
                ].map((item) => (
                  <li key={item} className="about__what-item about__what-item--not">
                    <span className="about__what-marker about__what-marker--not">✗</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* What We Are Building */}
            <div className="about__what-col about__what-col--building">
              <h3 className="about__what-col-title about__what-col-title--building">
                What We Are Building
              </h3>
              <ul className="about__what-list">
                {[
                  'A professional standard for caregiving',
                  'Tools to equip caregivers before expecting performance',
                  'A framework for recognizing demonstrated professionalism',
                  'Fair, documented accountability when concerns arise',
                  'A portable professional profile for every caregiver',
                  'A platform that supports growth over time',
                  'Infrastructure that serves caregivers, employers, and those in care',
                ].map((item) => (
                  <li key={item} className="about__what-item about__what-item--building">
                    <span className="about__what-marker about__what-marker--building">✓</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="about__values section-pad">
        <div className="section-pad-inner">
          <h2 className="section-heading">Our Core Values</h2>
          <div className="about__values-grid">
            {[
              { title: 'Warm',         desc: 'We approach caregivers and organizations with empathy and respect.' },
              { title: 'Trustworthy',  desc: 'Every feature we build is grounded in integrity and transparency.' },
              { title: 'Professional', desc: 'We treat caregiving as the profession it deserves to be.' },
              { title: 'Modern',       desc: 'Contemporary tools that meet caregivers and agencies where they are.' },
              { title: 'Human',        desc: 'People are at the center of everything we build.' },
            ].map((v) => (
              <div key={v.title} className="card about__value-card">
                <h3 className="about__value-title">{v.title}</h3>
                <p className="about__value-desc">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="about__cta">
        <div className="about__cta-inner">
          <h2 className="about__cta-heading">Ready to Get Started?</h2>
          <div className="about__cta-btns">
            <Link to="/caregiver/register" className="btn btn-white">
              I'm a Caregiver
            </Link>
            <Link to="/agency/register" className="btn btn-white-outline">
              I'm an Agency
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
