// src/components/steps/StepIntro.jsx
import React from "react";
import "../../styles/StepIntro.css";

function StepIntro({ onNext }) {
  return (
    <div className="form-step intro-step">
      <section className="form-section intro-section">
        {/* Top header row */}
        <header className="intro-header-row">
          <div>
            <h2 className="intro-title">Geolabs, Inc. – Employment Opportunities</h2>
            <p className="intro-subtitle">
              Join a 100% employee-owned geotechnical engineering and drilling firm
              serving Hawaiʻi and California.
            </p>
          </div>
          <div className="intro-pill-row">
            <span className="intro-pill">Employee-Owned</span>
            <span className="intro-pill">Field &amp; Office Roles</span>
          </div>
        </header>

        {/* Main two-column layout */}
        <div className="intro-grid">
          {/* LEFT: Hero + job openings */}
          <div className="intro-main">
            {/* Hero callout */}
            <div className="intro-hero">
              <div className="intro-hero-text">
                <h3>Build your career with Geolabs.</h3>
                <p>
                  Our staff engineers, engineering technicians, and drilling team support
                  infrastructure and development projects throughout Hawaiʻi and beyond.
                  If you are motivated, detail-oriented, and willing to learn, we
                  encourage you to apply.
                </p>
                <ul className="intro-hero-list">
                  <li>Hands-on field and lab experience</li>
                  <li>Opportunities to work with professional engineers</li>
                  <li>Competitive benefits and ESOP participation</li>
                </ul>
              </div>

              <div className="intro-hero-cta">
                <button
                  type="button"
                  className="btn primary intro-hero-button"
                  onClick={onNext}
                >
                  Apply Now
                </button>
                <p className="intro-hero-note">
                  You will be guided through a multi-step application form. You can
                  review each step before submitting.
                </p>
              </div>
            </div>

            {/* Current Openings */}
            <section className="intro-jobs">
              <h3 className="intro-section-heading">Current Openings</h3>
              <p className="intro-section-caption">
                Expand each position to review responsibilities, requirements, and
                physical demands.
              </p>

              <div className="job-accordion">
                {/* Job 1 */}
                <details className="job-panel" open>
                  <summary className="job-panel-header">
                    <div className="job-panel-title">Staff Engineer – Waipahu, HI</div>
                    <div className="job-panel-meta">
                      <span className="job-tag">Job ID: 2025-04</span>
                      <span className="job-tag job-tag-outline">
                        Full-time • Office / Field
                      </span>
                    </div>
                  </summary>
                  <div className="job-panel-body">
                    <p className="text-muted job-org">
                      GEOLABS, INC. – Geotechnical Engineering and Drilling Services
                      <br />
                      94-429 Koaki Street, Suite 200 • Waipahu, Hawaii 96797
                      <br />
                      Telephone: (808) 841-5064 • Hawaii • California
                    </p>

                    <p>
                      The employee-owners of Geolabs, Inc. provide geotechnical
                      engineering and construction management services to architects
                      &amp; engineers, general contractors, real estate owners and
                      developers, and government agencies.
                    </p>

                    <h4>Job Responsibilities</h4>
                    <ul>
                      <li>
                        Perform assignments requiring application of standard techniques,
                        procedures and criteria to carry out engineering tasks.
                      </li>
                      <li>
                        Work on assignments designed to further develop judgment and
                        understanding of professional and ethical responsibilities.
                      </li>
                    </ul>

                    <h4>Job Requirements</h4>
                    <ul>
                      <li>Bachelor of Science in Civil Engineering.</li>
                      <li>
                        In current pursuit of a Master of Science in Civil Engineering
                        with geotechnical focus desired and related engineering experience
                        helpful.
                      </li>
                      <li>Excellent communication and grammar skills.</li>
                      <li>Proficient with Microsoft Windows operating system.</li>
                      <li>
                        Proficient with Microsoft Office (Outlook, Word and Excel) and
                        Adobe Acrobat.
                      </li>
                      <li>Able to lift/move at least 50 pounds.</li>
                      <li>
                        Able to work overtime hours (including evenings and weekends).
                      </li>
                      <li>Willing to travel.</li>
                    </ul>
                  </div>
                </details>

                {/* Job 2 */}
                <details className="job-panel">
                  <summary className="job-panel-header">
                    <div className="job-panel-title">
                      Engineering Technician or Trainee (Field) – Waipahu, HI
                    </div>
                    <div className="job-panel-meta">
                      <span className="job-tag">Job ID: 2025-01</span>
                      <span className="job-tag job-tag-outline">
                        Full-time • Field / Lab
                      </span>
                    </div>
                  </summary>
                  <div className="job-panel-body">
                    <p className="text-muted job-org">
                      GEOLABS, INC. – Geotechnical Engineering and Drilling Services
                      <br />
                      94-429 Koaki Street, Suite 200 • Waipahu, Hawaii 96797
                      <br />
                      Telephone: (808) 841-5064 • Hawaii • California
                    </p>

                    <p>
                      Geolabs is currently offering a great opportunity for a responsible,
                      dedicated individual to join our operations as an Engineering
                      Technician. We are willing to train a qualified applicant.
                    </p>

                    <h4>Job Responsibilities (include, but are not limited to)</h4>
                    <ul>
                      <li>Perform daily field tests of different soil types.</li>
                      <li>
                        Prepare and submit data and observations in the form of digital
                        reports to reflect results of daily field work.
                      </li>
                      <li>
                        Communicate with Project Engineers and others, as applicable,
                        regarding construction site, project requirements, and testing;
                        observations and inspection requirements and results.
                      </li>
                      <li>
                        Perform laboratory tests on soils, aggregates, concrete and other
                        materials according to standard specifications.
                      </li>
                    </ul>

                    <h4>Job Requirements</h4>
                    <ul>
                      <li>
                        Working knowledge of Microsoft Office programs (Word, Excel,
                        Outlook, etc.).
                      </li>
                      <li>
                        Able to work overtime hours (including evenings and weekends).
                      </li>
                      <li>Valid driver’s license and clean abstract.</li>
                      <li>
                        Strong organizational skills, problem solving abilities and keen
                        mathematical and analytical aptitude.
                      </li>
                      <li>
                        Ability to work in a fast-paced, team environment while
                        maintaining strict quality standards.
                      </li>
                    </ul>

                    <h4>Physical Demand</h4>
                    <ul>
                      <li>
                        Regularly required to stand, observe, walk and talk or hear, use
                        hands and arms to push and pull.
                      </li>
                      <li>
                        Lift and/or move at least 50 pounds and have peripheral vision.
                      </li>
                    </ul>
                  </div>
                </details>

                {/* Job 3 */}
                <details className="job-panel">
                  <summary className="job-panel-header">
                    <div className="job-panel-title">
                      Engineering Technician or Trainee (Field) – Maui, HI
                    </div>
                    <div className="job-panel-meta">
                      <span className="job-tag">Job ID: 2025-03</span>
                      <span className="job-tag job-tag-outline">
                        Full-time • Maui Field
                      </span>
                    </div>
                  </summary>
                  <div className="job-panel-body">
                    <p className="text-muted job-org">
                      GEOLABS, INC. – Geotechnical Engineering and Drilling Services
                      <br />
                      94-429 Koaki Street, Suite 200 • Waipahu, Hawaii 96797
                      <br />
                      Telephone: (808) 841-5064 • Hawaii • California
                    </p>

                    <p>
                      Geolabs is currently offering a great opportunity for a responsible,
                      dedicated individual to join our operations as an Engineering
                      Technician in Maui. We are willing to train a qualified applicant.
                    </p>

                    <h4>Job Responsibilities (include, but are not limited to)</h4>
                    <ul>
                      <li>Perform daily field tests of different soil types.</li>
                      <li>
                        Prepare and submit data and observations in the form of digital
                        reports to reflect results of daily field work.
                      </li>
                      <li>
                        Communicate with Project Engineers and others, as applicable,
                        regarding construction site, project requirements, and testing;
                        observations and inspection requirements and results.
                      </li>
                      <li>
                        Perform laboratory tests on soils, aggregates, concrete and other
                        materials according to standard specifications.
                      </li>
                    </ul>

                    <h4>Job Requirements</h4>
                    <ul>
                      <li>
                        Working knowledge of Microsoft Office programs (Word, Excel,
                        Outlook, etc.).
                      </li>
                      <li>
                        Able to work overtime hours (including evenings and weekends).
                      </li>
                      <li>Valid driver’s license and acceptable violation history.</li>
                      <li>
                        Strong organizational skills, problem solving abilities and keen
                        mathematical and analytical aptitude.
                      </li>
                      <li>
                        Ability to work in a fast-paced, team environment while
                        maintaining strict quality standards.
                      </li>
                    </ul>

                    <h4>Physical Demand</h4>
                    <ul>
                      <li>
                        Regularly required to stand, observe, walk and talk or hear, use
                        hands and arms to push and pull.
                      </li>
                      <li>
                        Lift and/or move at least 50 pounds and have peripheral vision.
                      </li>
                    </ul>
                  </div>
                </details>

                {/* Job 4 (NEW) */}
                <details className="job-panel">
                  <summary className="job-panel-header">
                    <div className="job-panel-title">
                      Engineering Technician or Trainee (Field) – Waipahu, HI
                    </div>
                    <div className="job-panel-meta">
                      <span className="job-tag">Job ID: 2026-01</span>
                      <span className="job-tag job-tag-outline">
                        Full-time • Engineering / Lab / Materials
                      </span>
                    </div>
                  </summary>
                  <div className="job-panel-body">
                    <p className="text-muted job-org">
                      GEOLABS, INC.
                      <br />
                      Geotechnical Engineering and Drilling Services
                      <br />
                      94-429 Koaki Street, Suite 200 • Waipahu, Hawaii 96797
                      <br />
                      Telephone: (808) 841-5064 • E-mail: hawaii@geolabs.net
                      <br />
                      Hawaii • California
                    </p>

                    <h4>Role</h4>
                    <ul>
                      <li>
                        <strong>Area of Interest:</strong> Engineering, Laboratory Testing,
                        and/or Construction Materials
                      </li>
                      <li>
                        <strong>Job Type:</strong> Full Time
                      </li>
                      <li>
                        <strong>Education (Minimum):</strong> High School Diploma or GED
                      </li>
                      <li>
                        <strong>Posted Date:</strong> January 7, 2026
                      </li>
                    </ul>

                    <p>
                      Geolabs is currently offering a great opportunity for a responsible,
                      dedicated individual to join our operations as an Engineering
                      Technician. We are willing to train a qualified applicant.
                    </p>

                    <h4>Job Responsibilities (include, but are not limited to)</h4>
                    <ul>
                      <li>Perform daily field tests of different soil types.</li>
                      <li>
                        Prepare and submit data and observations in the forms of digital
                        reports to reflect results of daily field work.
                      </li>
                      <li>
                        Communicate with Project Engineers and others as applicable
                        regarding construction site, project requirements, and testing;
                        observations and inspection requirements and results.
                      </li>
                      <li>
                        Perform laboratory tests on soils, aggregates, concrete and other
                        materials according to standard specifications.
                      </li>
                    </ul>

                    <h4>Job Requirements</h4>
                    <ul>
                      <li>
                        A working knowledge of Microsoft Office programs (Word, Excel,
                        Outlook, etc.)
                      </li>
                      <li>
                        Able to work overtime hours (including evenings and weekends).
                      </li>
                      <li>Valid driver’s license and clean abstract</li>
                    </ul>

                    <p>
                      The successful candidate will have strong organizational skills;
                      possess problem solving abilities and keen mathematical and
                      analytical aptitude. The ability to work in a fast-paced, team
                      environment while maintaining strict quality standards.
                    </p>

                    <h4>Physical Demand</h4>
                    <ul>
                      <li>
                        Regularly required to stand, observe, walk and talk or hear, use
                        hands and arms to push and pull.
                      </li>
                      <li>
                        Lift and/or move at least 50 pounds and have peripheral vision.
                      </li>
                    </ul>

                    <p className="job-submit">
                      <strong>Submit resume to:</strong>{" "}
                      <a href="mailto:employment@geolabs.net">employment@geolabs.net</a>
                    </p>

                    <p className="legal-text">
                      <strong>EQUAL OPPORTUNITY EMPLOYER:</strong> All qualified applicants
                      and employees are treated fairly and without regard to race, color,
                      religion, sex, or national origin, or other protected
                      characteristics, in accordance with Title VII of the Civil Rights
                      Act of 1964 and other applicable state and federal employment laws.
                    </p>
                  </div>
                </details>

                {/* Job 5 (NEW) */}
                <details className="job-panel">
                  <summary className="job-panel-header">
                    <div className="job-panel-title">Driller Helper – Waipahu, HI</div>
                    <div className="job-panel-meta">
                      <span className="job-tag">Job ID: 2026-01</span>
                      <span className="job-tag job-tag-outline">
                        Full-time • Drilling
                      </span>
                    </div>
                  </summary>
                  <div className="job-panel-body">
                    <p className="text-muted job-org">
                      GEOLABS, INC.
                      <br />
                      Geotechnical Engineering and Drilling Services
                      <br />
                      94-429 Koaki Street, Suite 200 • Waipahu, Hawaii 96797
                      <br />
                      Telephone: (808) 841-5064 • E-mail: hawaii@geolabs.net
                      <br />
                      Hawaii • California
                    </p>

                    <h4>Role</h4>
                    <ul>
                      <li>
                        <strong>Area of Interest:</strong> Engineering, Drilling
                      </li>
                      <li>
                        <strong>Job Type:</strong> Full-Time
                      </li>
                      <li>
                        <strong>Education (Minimum):</strong> High School Diploma or GED
                      </li>
                      <li>
                        <strong>Posted Date:</strong> January 6, 2026
                      </li>
                    </ul>

                    <p>
                      Geolabs is currently offering a great opportunity for a responsible,
                      dedicated individual to join our drilling operations. We are willing
                      to train a qualified applicant.
                    </p>

                    <h4>Job Responsibilities</h4>
                    <ul>
                      <li>Assist with the day-to-day drill rig operations and field tasks</li>
                    </ul>

                    <h4>Job Requirements</h4>
                    <ul>
                      <li>Valid driver’s license and clean abstract</li>
                      <li>Forklift operations and/or CDL not required but helpful</li>
                      <li>Experience in drilling, construction or labor helpful</li>
                      <li>Able to lift/move 50+ pounds</li>
                      <li>
                        Able to work overtime hours (including evenings and weekends)
                      </li>
                      <li>Be willing to travel</li>
                    </ul>

                    <p>
                      The successful candidate must be willing to work in various weather
                      conditions, be a hard worker, dependable and work well with others.
                      The ability to work in a fast-paced, team environment while
                      maintaining strict quality standards. This is a physically demanding
                      job.
                    </p>

                    <p className="job-submit">
                      <strong>Submit resume to:</strong>{" "}
                      <a href="mailto:employment@geolabs.net">employment@geolabs.net</a>
                    </p>

                    <p className="legal-text">
                      <strong>EQUAL OPPORTUNITY EMPLOYER:</strong> All qualified applicants
                      and employees are treated fairly and without regard to race, color,
                      religion, sex, or national origin, or other protected
                      characteristics, in accordance with Title VII of the Civil Rights
                      Act of 1964 and other applicable state and federal employment laws.
                    </p>
                  </div>
                </details>
              </div>
            </section>
          </div>

          {/* RIGHT: EEO / AAP / Benefits */}
          <aside className="intro-side">
            <section className="side-card">
              <h3 className="side-card-title">Equal Employment Opportunity</h3>
              <p className="legal-text">
                Geolabs, Inc. provides equal employment opportunities to all employees
                and applicants for employment without regard to race, color, religion,
                gender or gender identity, sexual orientation, national origin, age,
                disability, genetic information, marital status, amnesty or status as a
                covered veteran and lactation in accordance with applicable federal,
                state, and local laws.
              </p>
            </section>

            <section className="side-card">
              <h3 className="side-card-title">Accessibility &amp; Accommodations</h3>
              <p className="legal-text">
                As an equal opportunity employer, Geolabs, Inc. is also an ADA-compliant
                employer and is committed to providing reasonable accommodations for
                qualified applicants and employees who are able to perform the essential
                functions of the position satisfactorily where such reasonable
                accommodations do not create an undue hardship and enable employees with
                disabilities to perform the essential functions of their jobs.
              </p>
            </section>

            <section className="side-card benefits-card">
              <h3 className="side-card-title">Benefits Snapshot</h3>
              <p className="text-muted">
                Geolabs is a 100% Employee-Owned Company and offers a comprehensive
                benefits package which may include:
              </p>
              <ul className="benefits-list">
                <li>
                  <strong>Medical, Dental, Drug and Vision</strong> – Geolabs pays family
                  coverage after twelve consecutive months of full-time employment.
                </li>
                <li>
                  <strong>Paid Time Off (PTO)</strong> – 14 days the first year, up to 28
                  days at 20 or more years of service.
                </li>
                <li>
                  <strong>Holidays</strong> – Ten days per year plus 1/2 day on Christmas
                  Eve.
                </li>
                <li>
                  <strong>401(k) Plan</strong> – Provides employees the potential for
                  future financial security for retirement.
                </li>
                <li>
                  <strong>Employee Stock Ownership Plan (ESOP)</strong> – Provides
                  retirement benefits to eligible employees based on ownership interest
                  in our Company.
                </li>
                <li>
                  <strong>Group Term Life Insurance</strong>.
                </li>
                <li>
                  <strong>Flexible Spending Account (FSA)</strong> – Allows employees to
                  save tax dollars on eligible, non-reimbursed health care expenses,
                  insurance premiums and/or dependent care out-of-pocket expenses.
                </li>
              </ul>
            </section>
          </aside>
        </div>
      </section>
    </div>
  );
}

export default StepIntro;
