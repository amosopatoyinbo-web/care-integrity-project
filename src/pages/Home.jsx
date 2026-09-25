import { Link } from 'react-router-dom'
import './Home.css'

/* ─── DATA ──────────────────────────────────────── */

const trustIndicators = [
  { icon: '✦', label: 'Professional Standards' },
  { icon: '✦', label: 'Verified Experience' },
  { icon: '✦', label: 'Meaningful Recognition' },
  { icon: '✦', label: 'Fair Accountability' },
]

const steps = [
  {
    num: '01',
    label: 'Equip',
    color: 'var(--trust-blue)',
    desc: 'Prepare caregivers before expecting them to perform.',
  },
  {
    num: '02',
    label: 'Demonstrate',
    color: 'var(--integrity-green)',
    desc: 'Professionalism is demonstrated through behavior.',
  },
  {
    num: '03',
    label: 'Recognize',
    color: 'var(--accent-gold)',
    desc: 'Good caregiving deserves to be seen.',
  },
  {
    num: '04',
    label: 'Account',
    color: 'var(--calm-aqua)',
    desc: 'When something goes wrong, handle it fairly.',
  },
  {
    num: '05',
    label: 'Grow',
    color: '#1d8a70',
    desc: 'A professional reputation is built over time.',
  },
]

const caregiverBenefits = [
  'Build a professional caregiving profile',
  'Document experience, skills, and training',
  'Learn the 10 Care Integrity Standards',
  'Demonstrate professional behaviors',
  'Receive recognition tied to specific standards',
  'Build verified employment history',
  'Review and respond to accountability matters',
  'Develop a professional reputation over time',
]

const agencyCards = [
  {
    num: '01',
    title: 'Equip Before You Expect',
    desc: 'Introduce professional expectations before relying on them. Build a foundation of shared standards from day one.',
    color: 'var(--trust-blue)',
  },
  {
    num: '02',
    title: 'Recognize What Goes Right',
    desc: 'Acknowledge specific demonstrated standards - not just problems. Good caregiving deserves to be seen.',
    color: 'var(--integrity-green)',
  },
  {
    num: '03',
    title: 'Account Fairly',
    desc: 'Use a structured process: FACT\u00a0\u2192\u00a0EVIDENCE\u00a0\u2192\u00a0RESPONSE\u00a0\u2192\u00a0RESOLUTION.',
    color: 'var(--calm-aqua)',
  },
  {
    num: '04',
    title: 'See More Than a R\u00e9sum\u00e9',
    desc: 'Make demonstrated professionalism more visible - verified history, standards, recognition, and professional context.',
    color: 'var(--accent-gold)',
  },
]

const standards = [
  { num: '01', name: 'Compassion',          tagline: 'See the person\u2014not just the task.' },
  { num: '02', name: 'Dependability',        tagline: 'Be someone people can count on.' },
  { num: '03', name: 'Accountability',       tagline: 'Take responsibility for your actions.' },
  { num: '04', name: 'Safety',               tagline: 'Pay attention. Speak up. Act responsibly.' },
  { num: '05', name: 'Communication',        tagline: 'Clear. Respectful. Timely.' },
  { num: '06', name: 'Dignity & Respect',    tagline: 'Every person deserves both.' },
  { num: '07', name: 'Professionalism',      tagline: 'Treat caregiving like the profession it is.' },
  { num: '08', name: 'Integrity',            tagline: 'Do the right thing\u2014even when no one is watching.' },
  { num: '09', name: 'Advocacy',             tagline: 'When something matters, speak up appropriately.' },
  { num: '10', name: 'Person-Centered Care', tagline: 'Put the person before the task list.' },
]

const standardAccents = [
  '#0F4C81','#2EAF8F','#D4AF37','#1d8a70','#7ED0C9',
  '#0a3460','#2EAF8F','#0F4C81','#D4AF37','#1a5e9e',
]

const equippedFlow = [
  'Clear Expectations',
  'Opportunity to Learn',
  'Opportunity to Demonstrate',
  'Recognition',
  'Fair Accountability',
  'Growth',
]

const accountFlow = [
  { step: 'FACT',       desc: 'Document what happened and what was observed.' },
  { step: 'EVIDENCE',   desc: 'Associate supporting evidence where appropriate.' },
  { step: 'RESPONSE',   desc: 'Caregiver is notified and given an opportunity to respond.' },
  { step: 'RESOLUTION', desc: 'Outcome is recorded. History remains auditable.' },
]

const growthTimeline = [
  'Experience',
  'Demonstrated Standards',
  'Recognition',
  'Verified Employment',
  'Accountability & Response',
  'Continued Growth',
]

const settings = [
  { label: 'Home Care',           desc: 'Supporting independence in familiar surroundings.' },
  { label: 'Companion Care',      desc: 'Presence, engagement, and meaningful connection.' },
  { label: 'Senior Care',         desc: 'Dignity, comfort, and personalized support.' },
  { label: 'Personal Care',       desc: 'Compassionate assistance with daily activities.' },
  { label: 'Community-Based Care',desc: 'Extending care beyond the walls of the home.' },
]

const foundingIncluded = [
  'Organization profile',
  'Caregiver management',
  'Employment verification',
  'Professional recognition tools',
  'Care Integrity Standards access',
  'Accountability documentation tools',
  'Caregiver response framework',
  'Early feature access',
  'Direct feedback channel',
]

/* ─── COMPONENT ─────────────────────────────────── */

export default function Home() {
  return (
    <div className="home">

      {/* ── 1. HERO ──────────────────────────────── */}
      <section className="h-hero" aria-labelledby="hero-heading">
        <div className="h-hero__bg" aria-hidden="true"></div>
        <div className="h-hero__overlay" aria-hidden="true"></div>
        <div className="h-hero__inner">
          <div className="h-hero__text">
            <p className="h-hero__eyebrow">A Professional Standard for Caregiving</p>
            <h1 className="h-hero__heading" id="hero-heading">
              Caregiving Deserves<br />a Professional Standard.
            </h1>
            <p className="h-hero__tagline">
              Because care is more than a job. It is a responsibility.
            </p>
            <p className="h-hero__body">
              The Care Integrity Project helps define, equip, recognize, and grow
              professional caregiving&mdash;so caregivers can build a reputation that
              reflects how they care, and organizations can build stronger cultures of care.
            </p>
            <div className="h-hero__ctas">
              <Link to="/caregiver/register" className="btn btn-green btn-lg">
                I&rsquo;m a Caregiver
              </Link>
              <Link to="/agency/register" className="btn btn-white-outline btn-lg">
                I&rsquo;m an Agency / Employer
              </Link>
            </div>
            <div className="h-hero__sub-links">
              <span>Build a professional profile.</span>
              <span className="h-hero__dot" aria-hidden="true">&middot;</span>
              <span>Equip and recognize your caregiving workforce.</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── 2. TRUST STRIP ───────────────────────── */}
      <section className="h-trust" aria-label="Platform trust indicators">
        <div className="h-trust__inner">
          <p className="h-trust__headline">
            Care is personal. Professionalism should be visible.
          </p>
          <p className="h-trust__body">
            A r&eacute;sum&eacute; can show where someone worked. A credential can show what
            training they completed. But professional caregiving also means showing up,
            communicating, protecting dignity, noticing concerns, taking responsibility,
            and putting the person first.
          </p>
          <ul className="h-trust__indicators" role="list">
            {trustIndicators.map((t) => (
              <li key={t.label} className="h-trust__item">
                <span className="h-trust__check" aria-hidden="true">&#10003;</span>
                {t.label}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── 3. WHY CARE INTEGRITY MATTERS ────────── */}
      <section className="h-why section-pad" aria-labelledby="why-heading">
        <div className="section-pad-inner h-why__inner">
          <div className="h-why__left">
            <p className="h-why__eyebrow eyebrow" style={{ color: 'var(--integrity-green)' }}>
              Why It Matters
            </p>
            <h2 className="h-why__heading" id="why-heading">
              More Than<br />a R&eacute;sum&eacute;.
            </h2>
            <div className="h-why__rule"></div>
          </div>
          <div className="h-why__right">
            <p className="h-why__lead">
              A r&eacute;sum&eacute; can tell you where someone worked. A credential can tell
              you what training they completed.
            </p>
            <p className="h-why__body">
              But neither necessarily tells you whether someone shows up, communicates,
              protects dignity, notices concerns, takes responsibility, or treats
              caregiving as a profession.
            </p>
            <p className="h-why__body">
              The Care Integrity Project is designed to make those professional qualities
              more visible.
            </p>
            {/* Profile progression visual */}
            <div className="h-why__progression" aria-label="Professional development progression" role="list">
              {['Experience', 'Standards', 'Demonstrated Behaviors', 'Recognition', 'Professional Growth'].map(
                (item, i, arr) => (
                  <div key={item} className="h-why__prog-group" role="listitem">
                    <div className="h-why__prog-node">
                      <span className="h-why__prog-dot" aria-hidden="true"></span>
                      <span className="h-why__prog-label">{item}</span>
                    </div>
                    {i < arr.length - 1 && (
                      <div className="h-why__prog-line" aria-hidden="true"></div>
                    )}
                  </div>
                )
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ── 4. HOW IT WORKS (5 STEPS) ────────────── */}
      <section className="h-how section-pad" aria-labelledby="how-heading">
        <div className="section-pad-inner">

          <div className="h-how__header">
            <p className="h-how__eyebrow eyebrow">The Platform Model</p>
            <h2 className="h-how__heading" id="how-heading">How Care Integrity Works</h2>
            <p className="h-how__subhead">
              Professional caregiving is built over time. Our framework supports
              that journey at every stage.
            </p>
          </div>

          <div className="h-how__track" role="list">
            <div className="h-how__row h-how__row--top">
              {/* Card 01 — Equip */}
              <div className="h-how__journey-step" role="listitem">
                <div className="h-how__card">
                  <div className="h-how__card-img-wrap">
                    <img src="/image 1.jpg" alt="A caregiver in blue scrubs guiding an older adult with a walker in a warm home environment" className="h-how__card-img" loading="lazy" />
                    <div className="h-how__card-num-badge" style={{ background: '#0F4C81' }}>01</div>
                  </div>
                  <div className="h-how__card-body">
                    <div className="h-how__card-top">
                      <h3 className="h-how__card-title" style={{ color: '#0F4C81' }}>Equip</h3>
                    </div>
                    <p className="h-how__card-headline">Prepare Before You Perform</p>
                    <p className="h-how__card-desc">Great care starts with preparation. Caregivers need clear expectations, practical guidance, and the tools to provide professional care with confidence.</p>
                    <div className="h-how__card-tags">
                      <span className="h-how__tag" style={{ background: 'rgba(15,76,129,0.08)', color: '#0F4C81' }}>Preparation</span>
                      <span className="h-how__tag" style={{ background: 'rgba(15,76,129,0.08)', color: '#0F4C81' }}>Knowledge</span>
                      <span className="h-how__tag" style={{ background: 'rgba(15,76,129,0.08)', color: '#0F4C81' }}>Readiness</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Card 02 — Demonstrate */}
              <div className="h-how__journey-step" role="listitem">
                <div className="h-how__card">
                  <div className="h-how__card-img-wrap">
                    <img src="/image 2.jpg" alt="A caregiver with a warm smile attentively engaged with an older adult in a home-care setting" className="h-how__card-img" loading="lazy" />
                    <div className="h-how__card-num-badge" style={{ background: '#2EAF8F' }}>02</div>
                  </div>
                  <div className="h-how__card-body">
                    <div className="h-how__card-top">
                      <h3 className="h-how__card-title" style={{ color: '#2EAF8F' }}>Demonstrate</h3>
                    </div>
                    <p className="h-how__card-headline">Professionalism in Action</p>
                    <p className="h-how__card-desc">Professional care is demonstrated through everyday behavior&mdash;how caregivers communicate, respond, protect dignity, and carry out their responsibilities.</p>
                    <div className="h-how__card-tags">
                      <span className="h-how__tag" style={{ background: 'rgba(46,175,143,0.1)', color: '#1d8a70' }}>Behavior</span>
                      <span className="h-how__tag" style={{ background: 'rgba(46,175,143,0.1)', color: '#1d8a70' }}>Communication</span>
                      <span className="h-how__tag" style={{ background: 'rgba(46,175,143,0.1)', color: '#1d8a70' }}>Professionalism</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Card 03 — Recognize */}
              <div className="h-how__journey-step" role="listitem">
                <div className="h-how__card">
                  <div className="h-how__card-img-wrap">
                    <img src="/image 3.jpg" alt="A caregiver warmly supporting an older adult walking with a mobility aid, both smiling" className="h-how__card-img" loading="lazy" />
                    <div className="h-how__card-num-badge" style={{ background: '#D4AF37' }}>03</div>
                  </div>
                  <div className="h-how__card-body">
                    <div className="h-how__card-top">
                      <h3 className="h-how__card-title" style={{ color: '#b8960d' }}>Recognize</h3>
                    </div>
                    <p className="h-how__card-headline">Good Care Deserves to Be Seen</p>
                    <p className="h-how__card-desc">Professional caregiving happens in the small moments. Recognize caregivers who consistently demonstrate the standards that strengthen trust and quality of care.</p>
                    <div className="h-how__card-tags">
                      <span className="h-how__tag" style={{ background: 'rgba(212,175,55,0.12)', color: '#b8960d' }}>Recognition</span>
                      <span className="h-how__tag" style={{ background: 'rgba(212,175,55,0.12)', color: '#b8960d' }}>Achievement</span>
                      <span className="h-how__tag" style={{ background: 'rgba(212,175,55,0.12)', color: '#b8960d' }}>Appreciation</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>{/* end row top */}

            <div className="h-how__row h-how__row--bottom">
              {/* Card 04 — Account */}
              <div className="h-how__journey-step" role="listitem">
                <div className="h-how__card">
                  <div className="h-how__card-img-wrap">
                    <img src="/image 4.jpg" alt="A caregiver attentively supporting a person in a wheelchair, showing respect and dignity" className="h-how__card-img" loading="lazy" />
                    <div className="h-how__card-num-badge" style={{ background: '#7ED0C9' }}>04</div>
                  </div>
                  <div className="h-how__card-body">
                    <div className="h-how__card-top">
                      <h3 className="h-how__card-title" style={{ color: '#2a7d79' }}>Account</h3>
                    </div>
                    <p className="h-how__card-headline">When Something Goes Wrong, Respond Fairly</p>
                    <p className="h-how__card-desc">Accountability should be grounded in facts, evidence, response, and resolution&mdash;not assumptions or public judgment.</p>
                    <div className="h-how__card-tags">
                      <span className="h-how__tag" style={{ background: 'rgba(126,208,201,0.15)', color: '#2a7d79' }}>Facts</span>
                      <span className="h-how__tag" style={{ background: 'rgba(126,208,201,0.15)', color: '#2a7d79' }}>Evidence</span>
                      <span className="h-how__tag" style={{ background: 'rgba(126,208,201,0.15)', color: '#2a7d79' }}>Response</span>
                      <span className="h-how__tag" style={{ background: 'rgba(126,208,201,0.15)', color: '#2a7d79' }}>Resolution</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Card 05 — Grow */}
              <div className="h-how__journey-step h-how__journey-step--last" role="listitem">
                <div className="h-how__card">
                  <div className="h-how__card-img-wrap">
                    <img src="/image 5.png" alt="A caregiver demonstrating professional growth and development in a caregiving setting" className="h-how__card-img" loading="lazy" />
                    <div className="h-how__card-num-badge" style={{ background: '#2EAF8F' }}>05</div>
                  </div>
                  <div className="h-how__card-body">
                    <div className="h-how__card-top">
                      <h3 className="h-how__card-title" style={{ color: '#2EAF8F' }}>Grow</h3>
                    </div>
                    <p className="h-how__card-headline">Build a Reputation Over Time</p>
                    <p className="h-how__card-desc">Professional reputation isn&rsquo;t created in one moment. It grows through experience, demonstrated standards, recognition, accountability, and continued commitment to excellent care.</p>
                    <div className="h-how__card-tags">
                      <span className="h-how__tag" style={{ background: 'rgba(46,175,143,0.1)', color: '#1d8a70' }}>Experience</span>
                      <span className="h-how__tag" style={{ background: 'rgba(46,175,143,0.1)', color: '#1d8a70' }}>Reputation</span>
                      <span className="h-how__tag" style={{ background: 'rgba(46,175,143,0.1)', color: '#1d8a70' }}>Progress</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>{/* end row bottom */}

          </div>{/* end track */}

          <div className="h-how__cta">
            <Link to="/how-it-works" className="btn btn-blue">
              See How It Works
            </Link>
          </div>
        </div>
      </section>

      {/* ── 5. FOR CAREGIVERS ────────────────────── */}
      <section className="h-cg section-pad" aria-labelledby="cg-heading">
        <div className="section-pad-inner h-cg__inner">

          <div className="h-cg__text">
            <p className="eyebrow" style={{ color: 'var(--integrity-green)' }}>For Caregivers</p>
            <h2 className="section-heading" id="cg-heading">
              Your Work Matters.<br />Your Reputation Should, Too.
            </h2>
            <p className="h-cg__body">
              Caregiving is more than completing a list of tasks. You are trusted with
              someone&rsquo;s well-being, dignity, safety, and daily life.
            </p>
            <p className="h-cg__body">
              The Care Integrity Project helps caregivers build a professional reputation
              that reflects how they care.
            </p>
            <ul className="h-cg__benefits" aria-label="Caregiver benefits" role="list">
              {caregiverBenefits.map((b) => (
                <li key={b} className="h-cg__benefit" role="listitem">
                  <span className="h-cg__check" aria-hidden="true">&#10003;</span>
                  {b}
                </li>
              ))}
            </ul>
            <div className="h-cg__ctas">
              <Link to="/caregiver/register" className="btn btn-green btn-lg">
                Build My Professional Profile
              </Link>
              <Link to="/caregiver/register" className="h-cg__link">
                Explore the Caregiver Experience &rarr;
              </Link>
            </div>
          </div>

          <div className="h-cg__visual" aria-hidden="true">
            <div className="h-cg__img-wrap">
              <img
                src="/image 78.jpg"
                alt="A professional caregiver in blue scrubs smiling warmly"
                className="h-cg__img"
                loading="lazy"
              />
            </div>
            {/* Profile card mock */}
            <div className="h-cg__profile-mock" role="presentation">
              <div className="h-cpm__header">
                <div className="h-cpm__avatar">JD</div>
                <div>
                  <div className="h-cpm__name">Jane Doe</div>
                  <div className="h-cpm__role">Professional Caregiver</div>
                </div>
              </div>
              <div className="h-cpm__section">
                <div className="h-cpm__section-label">Experience &amp; Skills</div>
                <div className="h-cpm__bar-wrap">
                  <div className="h-cpm__bar-label">Home Care</div>
                  <div className="h-cpm__bar"><div className="h-cpm__bar-fill" style={{ width: '88%' }}></div></div>
                </div>
                <div className="h-cpm__bar-wrap">
                  <div className="h-cpm__bar-label">Communication</div>
                  <div className="h-cpm__bar"><div className="h-cpm__bar-fill" style={{ width: '94%', background: 'var(--integrity-green)' }}></div></div>
                </div>
              </div>
              <div className="h-cpm__section">
                <div className="h-cpm__section-label">Standards Demonstrated</div>
                <div className="h-cpm__tags">
                  {['Compassion','Dependability','Safety','Integrity'].map(t => (
                    <span key={t} className="h-cpm__tag">{t}</span>
                  ))}
                </div>
              </div>
              <div className="h-cpm__section">
                <div className="h-cpm__section-label">Employment</div>
                <div className="h-cpm__emp">
                  <span className="h-cpm__emp-check">&#10003;</span>
                  3 verified positions
                </div>
              </div>
              <div className="h-cpm__notice">
                More than a rating. A complete professional record.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 6. FOR AGENCIES ──────────────────────── */}
      <section className="h-ag section-pad" aria-labelledby="ag-heading">
        <div className="section-pad-inner">
          <div className="h-ag__header">
            <p className="eyebrow" style={{ color: 'var(--calm-aqua)' }}>For Agencies &amp; Employers</p>
            <h2 className="section-heading h-ag__heading" id="ag-heading">
              Hire With More Confidence.<br />Recognize Great Caregivers.
            </h2>
            <p className="h-ag__subhead">Don&rsquo;t just hire caregivers. Equip them.</p>
            <p className="h-ag__body">
              The Care Integrity Project is not another system for managing schedules,
              payroll, or employee files. It is designed to help caregiving organizations
              build stronger caregivers and a stronger professional culture.
            </p>
          </div>

          <div className="h-ag__cards" role="list">
            {agencyCards.map((c) => (
              <div key={c.num} className="h-ag__card" role="listitem">
                <div className="h-ag__card-num" style={{ color: c.color }}>
                  {c.num}
                </div>
                <h3 className="h-ag__card-title">{c.title}</h3>
                <p className="h-ag__card-desc">{c.desc}</p>
                <div className="h-ag__card-bar" style={{ background: c.color }}></div>
              </div>
            ))}
          </div>

          <div className="h-ag__ctas">
            <Link to="/agency/register" className="btn btn-blue btn-lg">
              Join the Care Integrity Project
            </Link>
            <Link to="/how-it-works" className="h-ag__link">
              Learn How It Works &rarr;
            </Link>
          </div>
        </div>
      </section>

      {/* ── 7. THE 10 STANDARDS ──────────────────── */}
      <section className="h-std section-pad" aria-labelledby="std-heading">
        <div className="section-pad-inner">
          <div className="h-std__header">
            <p className="eyebrow" style={{ color: 'var(--integrity-green)' }}>
              The Framework
            </p>
            <h2 className="section-heading" id="std-heading">
              What Does Professional Caregiving Look Like?
            </h2>
            <p className="section-subheading">
              A caregiver&rsquo;s job description tells them what to do.
              Our standards help define <em>how to care</em>.
            </p>
          </div>

          <div className="h-std__grid" role="list">
            {standards.map((s, i) => (
              <article
                key={s.num}
                className="h-std__card"
                role="listitem"
                style={{ '--accent': standardAccents[i] }}
              >
                <div className="h-std__card-top">
                  <span className="h-std__card-num" style={{ color: standardAccents[i] }}>
                    {s.num}
                  </span>
                </div>
                <h3 className="h-std__card-name">{s.name}</h3>
                <p className="h-std__card-tagline">{s.tagline}</p>
                <div className="h-std__card-accent" style={{ background: standardAccents[i] }}></div>
              </article>
            ))}
          </div>

          <div className="h-std__cta">
            <Link to="/standards" className="btn btn-blue">
              Explore All 10 Standards
            </Link>
          </div>
        </div>
      </section>

      {/* ── 8. WE EQUIP BEFORE WE ACCOUNT ────────── */}
      <section className="h-equip" aria-labelledby="equip-heading">
        <div className="h-equip__inner">
          <div className="h-equip__text">
            <p className="eyebrow h-equip__eyebrow">Our Philosophy</p>
            <h2 className="h-equip__heading" id="equip-heading">
              We Equip Before We Account.
            </h2>
            <p className="h-equip__body">
              Accountability matters. But professional accountability should be fair,
              structured, and grounded in clear expectations.
            </p>
            <p className="h-equip__body">
              Caregivers should know what professional care looks like before they are
              evaluated against it.
            </p>
          </div>
          <div className="h-equip__flow" aria-label="Professional development flow" role="list">
            {equippedFlow.map((item, i, arr) => (
              <div key={item} className="h-equip__flow-group" role="listitem">
                <div className="h-equip__flow-node">
                  <span className="h-equip__flow-dot" aria-hidden="true"></span>
                  <span className="h-equip__flow-label">{item}</span>
                </div>
                {i < arr.length - 1 && (
                  <div className="h-equip__flow-line" aria-hidden="true"></div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 9. ACCOUNTABILITY ────────────────────── */}
      <section className="h-acct section-pad" aria-labelledby="acct-heading">
        <div className="section-pad-inner">
          <div className="h-acct__header">
            <p className="eyebrow" style={{ color: 'var(--integrity-green)' }}>
              Fair Accountability
            </p>
            <h2 className="section-heading" id="acct-heading">
              When Something Goes Wrong, Handle It Fairly.
            </h2>
            <p className="section-subheading">
              Accountability should not be about punishment or public labels. It should be
              about facts, evidence, response, resolution, and learning.
            </p>
          </div>

          <div className="h-acct__flow" role="list">
            {accountFlow.map((item, i, arr) => (
              <div key={item.step} className="h-acct__flow-group" role="listitem">
                <div className="h-acct__flow-card">
                  <div className="h-acct__flow-num">{String(i + 1).padStart(2, '0')}</div>
                  <div className="h-acct__flow-step">{item.step}</div>
                  <p className="h-acct__flow-desc">{item.desc}</p>
                </div>
                {i < arr.length - 1 && (
                  <div className="h-acct__flow-arrow" aria-hidden="true">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                      <path d="M4 10h12M10 4l6 6-6 6" stroke="var(--calm-aqua)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                )}
              </div>
            ))}
          </div>


        </div>
      </section>

      {/* ── 10. PROFESSIONAL GROWTH ──────────────── */}
      <section className="h-grow section-pad" aria-labelledby="grow-heading">
        <div className="section-pad-inner h-grow__inner">
          <div className="h-grow__text">
            <p className="eyebrow" style={{ color: 'var(--integrity-green)' }}>Professional Growth</p>
            <h2 className="section-heading" id="grow-heading">
              Build a Professional Reputation Over Time.
            </h2>
            <p className="h-grow__body">
              A professional reputation is not created by a single score. It is built
              through experience, demonstrated standards, recognition, accountability,
              and continued growth.
            </p>
            <blockquote className="h-grow__quote">
              Accountability records the past.<br />
              <em>Performance demonstrates the future.</em>
            </blockquote>
          </div>
          <div className="h-grow__timeline" aria-label="Career growth timeline" role="list">
            {growthTimeline.map((item, i, arr) => (
              <div key={item} className="h-grow__tl-group" role="listitem">
                <div className="h-grow__tl-node">
                  <div className="h-grow__tl-circle" aria-hidden="true">
                    <span>{i + 1}</span>
                  </div>
                  <span className="h-grow__tl-label">{item}</span>
                </div>
                {i < arr.length - 1 && (
                  <div className="h-grow__tl-line" aria-hidden="true"></div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 11. CAREGIVING SETTINGS ──────────────── */}
      <section className="h-settings section-pad" aria-labelledby="settings-heading">
        <div className="section-pad-inner">
          <div className="h-settings__header">
            <h2 className="section-heading" id="settings-heading">
              Caregiving Happens in Many Settings.
            </h2>
            <p className="h-settings__sub">The responsibility is the same.</p>
          </div>
          <div className="h-settings__grid" role="list">
            {settings.map((s) => (
              <div key={s.label} className="h-settings__card card" role="listitem">
                <div className="h-settings__card-dot" aria-hidden="true"></div>
                <h3 className="h-settings__card-title">{s.label}</h3>
                <p className="h-settings__card-desc">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 12. FOUNDING AGENCY PROGRAM ──────────── */}
      <section className="h-founding section-pad" aria-labelledby="founding-heading">
        <div className="section-pad-inner h-founding__inner">
          <div className="h-founding__text">
            <span className="h-founding__badge">Founding Agency Program</span>
            <h2 className="h-founding__heading" id="founding-heading">
              Help Shape the Future of Professional Caregiving.
            </h2>
            <p className="h-founding__sub">Become a Founding Agency.</p>
            <p className="h-founding__body">
              The Care Integrity Project is inviting a small group of home-care
              organizations to become Founding Agencies and help shape the first version
              of the platform.
            </p>
            <p className="h-founding__body">
              The first Founding Agencies won&rsquo;t simply be early customers.
              They&rsquo;ll help shape the foundation.
            </p>
            <Link to="/founding-agency" className="btn btn-gold btn-lg h-founding__cta">
              Apply to Become a Founding Agency
            </Link>
          </div>

          <div className="h-founding__card" role="presentation">
            <div className="h-founding__card-top">
              <p className="h-founding__card-label">FOUNDING AGENCY PILOT</p>
              <p className="h-founding__card-duration">6 Months</p>
              <div className="h-founding__card-price">
                <span className="h-founding__card-amount">Limited Early Access</span>
              </div>
              <p className="h-founding__card-cohort">Initial cohort: ~5&ndash;10 organizations</p>
            </div>
            <ul className="h-founding__card-list" role="list">
              {foundingIncluded.map((item) => (
                <li key={item} className="h-founding__card-item" role="listitem">
                  <span className="h-founding__card-check" aria-hidden="true">&#10003;</span>
                  {item}
                </li>
              ))}
            </ul>
            <p className="h-founding__card-note">
              Founding Agency participation is subject to program availability and acceptance.
            </p>
          </div>
        </div>
      </section>

      {/* ── 13. FINAL CTA ────────────────────────── */}
      <section className="h-final" aria-labelledby="final-heading">
        {/* Decorative shapes */}
        <div className="h-final__shape h-final__shape--1" aria-hidden="true"></div>
        <div className="h-final__shape h-final__shape--2" aria-hidden="true"></div>

        <div className="h-final__inner">
          <h2 className="h-final__heading" id="final-heading">
            Let&rsquo;s Build a Higher Standard<br />for Caregiving.
          </h2>
          <p className="h-final__body">
            Caregiving deserves a professional standard&mdash;and caregivers deserve a
            system that helps them build a professional reputation they can be proud of.
          </p>
          <div className="h-final__ctas">
            <Link to="/caregiver/register" className="btn btn-green btn-lg">
              I&rsquo;m a Caregiver
            </Link>
            <Link to="/agency/register" className="btn btn-white-outline btn-lg">
              I&rsquo;m an Agency / Employer
            </Link>
          </div>
          <p className="h-final__mission" aria-label="Mission statement">
            Trusted Care &middot; Stronger Communities &middot; A Brighter Future
          </p>
          <p className="h-final__name">THE CARE INTEGRITY PROJECT</p>
        </div>
      </section>

    </div>
  )
}
