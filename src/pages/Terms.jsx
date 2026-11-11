import './Legal.css'

export default function Terms() {
  return (
    <div className="legal">
      {/* Hero */}
      <section className="legal__hero">
        <div className="legal__hero-inner">
          <h1 className="legal__hero-title">Terms & Conditions</h1>
          <p className="legal__hero-date">Effective Date: November 13, 2026</p>
        </div>
      </section>

      {/* Content */}
      <section className="legal__content section-pad">
        <div className="legal__content-inner">
          
          <div className="legal__section">
            <h2 className="legal__heading">1. Acceptance of Terms</h2>
            <p>Welcome to The Care Integrity Project ("CIP," "we," "us," or "our").</p>
            <p>By registering for an account or using www.thecareintegrityproject.com, you agree to these Terms & Conditions and acknowledge our Privacy Policy.</p>
            <p><strong>If you do not agree, you should not register for or use the platform.</strong></p>
          </div>

          <div className="legal__section">
            <h2 className="legal__heading">2. Purpose of the Platform</h2>
            <p>The Care Integrity Project is a professional networking and employment connection platform designed to connect healthcare professionals with healthcare employers.</p>
            <p>Our mission is to encourage professionalism, dependability, accountability, and integrity throughout the healthcare workforce.</p>
            <p>The platform provides tools for professional profiles, employer searches, and interview requests.</p>
            <p className="legal__notice">CIP is not itself an employer of professionals who create profiles, and registration does not establish an employment relationship with CIP.</p>
            <p className="legal__notice">CIP does not guarantee employment, interviews, candidate availability, successful hiring, or particular employment outcomes.</p>
          </div>

          <div className="legal__section">
            <h2 className="legal__heading">3. Eligibility</h2>
            <ul className="legal__list">
              <li>Users must be at least 18 years old and provide accurate registration information.</li>
              <li>Employer accounts must be created by individuals authorized to represent their organizations.</li>
              <li>CIP may review, approve, reject, suspend, or terminate accounts in accordance with these Terms and applicable law.</li>
            </ul>
          </div>

          <div className="legal__section">
            <h2 className="legal__heading">4. Healthcare Professional Accounts</h2>
            <p>Healthcare professionals may create profiles to showcase their experience, skills, qualifications, credentials, and employment preferences.</p>
            <p>Professional registration is free unless future paid services are separately offered and clearly disclosed.</p>
            <p><strong>Professionals agree to:</strong></p>
            <ul className="legal__list">
              <li>Provide accurate and current information.</li>
              <li>Represent their experience and credentials truthfully.</li>
              <li>Update information when circumstances change.</li>
              <li>Avoid misrepresenting licenses, certifications, or professional qualifications.</li>
              <li>Use the platform respectfully and professionally.</li>
              <li>Protect their account login information.</li>
            </ul>
            <p>Professionals are responsible for deciding whether to respond to interview requests and whether to pursue employment opportunities.</p>
          </div>

          <div className="legal__section">
            <h2 className="legal__heading">5. Employer Accounts</h2>
            <p>Approved healthcare employers may use the platform to search professional profiles and request interviews, subject to applicable account permissions and subscription requirements.</p>
            <p><strong>Employers agree to:</strong></p>
            <ul className="legal__list">
              <li>Provide accurate organization and representative information.</li>
              <li>Use professional information only for legitimate recruiting and employment-related purposes.</li>
              <li>Respect the privacy and confidentiality of professionals.</li>
              <li>Follow applicable employment, licensing, privacy, and anti-discrimination laws.</li>
              <li>Conduct their own interviews, reference checks, background checks, and credential verification.</li>
              <li>Refrain from sharing, selling, scraping, or redistributing profile information without authorization.</li>
            </ul>
            <p>Employer access may be suspended or terminated for misuse of the platform.</p>
          </div>

          <div className="legal__section">
            <h2 className="legal__heading">6. Credentials and Verification</h2>
            <p>Unless expressly identified as independently verified by CIP, professional credentials, qualifications, experience, and other profile statements are self-reported.</p>
            <p className="legal__warning">CIP does not guarantee the accuracy, completeness, validity, or current status of professional credentials or other user-submitted information.</p>
            <p>Employers are responsible for independently verifying qualifications and determining whether a candidate meets applicable employment and licensing requirements.</p>
          </div>

          <div className="legal__section">
            <h2 className="legal__heading">7. Interview Requests and Employment Decisions</h2>
            <p>The platform may allow employers to request interviews with healthcare professionals.</p>
            <p>An interview request does not constitute an employment offer.</p>
            <p>CIP is not a party to employment agreements between professionals and employers.</p>
            <ul className="legal__list">
              <li>Employers are responsible for hiring decisions, employment terms, compensation, supervision, and compliance with applicable employment laws.</li>
              <li>Professionals are responsible for evaluating employment opportunities and deciding whether to accept an offer.</li>
            </ul>
          </div>

          <div className="legal__section">
            <h2 className="legal__heading">8. Employer Memberships and Payments</h2>
            <p>Certain employer features may require a paid subscription.</p>
            <p>Applicable subscription pricing, billing frequency, included features, renewal terms, cancellation procedures, and any promotional or trial conditions will be disclosed before purchase.</p>
            <p>Paid subscriptions will not begin without the employer's affirmative agreement to the applicable payment terms.</p>
            <p>Any free trial, introductory offer, or promotional membership will be subject to the specific conditions disclosed when the employer enrolls.</p>
          </div>

          <div className="legal__section">
            <h2 className="legal__heading">9. Acceptable Use</h2>
            <p><strong>Users may not:</strong></p>
            <ul className="legal__list">
              <li>Submit false or misleading information.</li>
              <li>Impersonate another individual or organization.</li>
              <li>Harass, threaten, discriminate against, or exploit other users.</li>
              <li>Access accounts or information without authorization.</li>
              <li>Collect or distribute user information for unauthorized purposes.</li>
              <li>Attempt to compromise website security.</li>
              <li>Use automated tools to scrape or extract professional profiles without written permission.</li>
              <li>Use the platform for unlawful or fraudulent activities.</li>
            </ul>
          </div>

          <div className="legal__section">
            <h2 className="legal__heading">10. User Content</h2>
            <p>Users retain ownership of the information and materials they submit, subject to any rights held by third parties.</p>
            <p>By submitting profile information, users grant CIP a nonexclusive, limited license to store, process, display, and share that information as reasonably necessary to operate the platform and provide its services, consistent with the Privacy Policy and account settings.</p>
            <p>Users represent that they have the right to submit their content and that it does not violate applicable law or third-party rights.</p>
          </div>

          <div className="legal__section">
            <h2 className="legal__heading">11. Privacy and Confidentiality</h2>
            <p>Use of personal information is governed by our Privacy Policy.</p>
            <p>Employers must treat nonpublic professional information obtained through CIP as confidential and use it only for legitimate recruitment-related purposes.</p>
            <p className="legal__warning">Users must not upload confidential patient information or protected health information to the platform.</p>
          </div>

          <div className="legal__section">
            <h2 className="legal__heading">12. Account Suspension and Termination</h2>
            <p>CIP may suspend or terminate accounts that violate these Terms, threaten platform security, misuse personal information, or engage in fraudulent or unlawful activity, subject to applicable law.</p>
            <p>Users may request account closure by contacting: <a href="mailto:contact@thecareintegrityproject.com" className="legal__link">contact@thecareintegrityproject.com</a></p>
          </div>

          <div className="legal__section">
            <h2 className="legal__heading">13. Platform Availability</h2>
            <p>We strive to provide a reliable and functional platform but cannot guarantee uninterrupted access or error-free operation.</p>
            <p>Website features may be updated, modified, or temporarily unavailable for maintenance, security, or operational reasons.</p>
          </div>

          <div className="legal__section">
            <h2 className="legal__heading">14. Disclaimers</h2>
            <p>The platform is provided on an "as available" basis.</p>
            <p>To the extent permitted by applicable law, CIP makes no guarantee regarding the accuracy of user-submitted information, candidate suitability, employer conduct, employment outcomes, or uninterrupted availability of the service.</p>
            <p>Nothing in these Terms excludes rights or protections that cannot lawfully be excluded.</p>
          </div>

          <div className="legal__section">
            <h2 className="legal__heading">15. Limitation of Liability</h2>
            <p>To the extent permitted by applicable law, CIP is not responsible for employment decisions, workplace conduct, compensation disputes, or agreements made directly between employers and healthcare professionals.</p>
          </div>

          <div className="legal__section">
            <h2 className="legal__heading">16. Changes to These Terms</h2>
            <p>CIP may revise these Terms as the platform develops.</p>
            <p>Updated Terms will be posted on the website with a revised effective date. Material changes will be communicated when required by law.</p>
          </div>

          <div className="legal__section">
            <h2 className="legal__heading">17. Governing Law</h2>
            <p>These Terms are intended to be governed by the laws of the Commonwealth of Kentucky, subject to applicable law.</p>
          </div>

          <div className="legal__section">
            <h2 className="legal__heading">18. Contact Information</h2>
            <p><strong>The Care Integrity Project</strong></p>
            <p>Website: <a href="https://www.thecareintegrityproject.com" className="legal__link">www.thecareintegrityproject.com</a></p>
            <p>Email: <a href="mailto:contact@thecareintegrityproject.com" className="legal__link">contact@thecareintegrityproject.com</a></p>
          </div>

        </div>
      </section>
    </div>
  )
}
