import React from "react";

function StepIntro({ onNext }) {
  return (
    <div className="form-step">
      <section className="form-section">
        <h2>Welcome to Geolabs, Inc. Employment Application</h2>
        <p className="section-help">
          Please review our current openings and benefits below. When you are
          ready, click <strong>Apply Now</strong> to begin the application.
        </p>

        {/* Job cards – same content as before, just intro-only */}
        <details className="job-card">
          <summary className="job-summary">
            Staff Engineer – Waipahu, HI (Job ID: 2025-04)
          </summary>
          <div className="job-body">
            <p className="text-muted">
              GEOLABS, INC. – Geotechnical Engineering and Drilling Services
              <br />
              94-429 Koaki Street, Suite 200 • Waipahu, Hawaii 96797
              <br />
              Telephone: (808) 841-5064 • Hawaii • California
            </p>
            <p>
              The employee-owners of Geolabs, Inc. provide geotechnical
              engineering and construction management services to architects &
              engineers, general contractors, real estate owners and developers,
              and government agencies.
            </p>
            <p>
              <strong>Job Responsibilities:</strong>
            </p>
            <ul>
              <li>
                Perform assignments requiring application of standard
                techniques, procedures and criteria to carry out engineering
                tasks.
              </li>
              <li>
                Work on assignments designed to further develop judgment and
                understanding of professional and ethical responsibilities.
              </li>
            </ul>
            <p>
              <strong>Job Requirements:</strong>
            </p>
            <ul>
              <li>Bachelor of Science in Civil Engineering.</li>
              <li>
                In current pursuit of a Master of Science in Civil Engineering
                with geotechnical focus desired and related engineering
                experience helpful.
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

        <details className="job-card">
          <summary className="job-summary">
            Engineering Technician or Trainee (Field) – Waipahu, HI (Job ID:
            2025-01)
          </summary>
          <div className="job-body">
            <p className="text-muted">
              GEOLABS, INC. – Geotechnical Engineering and Drilling Services
              <br />
              94-429 Koaki Street, Suite 200 • Waipahu, Hawaii 96797
              <br />
              Telephone: (808) 841-5064 • Hawaii • California
            </p>
            <p>
              Geolabs is currently offering a great opportunity for a
              responsible, dedicated individual to join our operations as an
              Engineering Technician. We are willing to train a qualified
              applicant.
            </p>
            <p>
              <strong>Job Responsibilities (include, but are not limited to):</strong>
            </p>
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
                Perform laboratory tests on soils, aggregates, concrete and
                other materials according to standard specifications.
              </li>
            </ul>
            <p>
              <strong>Job Requirements:</strong>
            </p>
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
            <p>
              <strong>Physical Demand:</strong>
            </p>
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

        <details className="job-card">
          <summary className="job-summary">
            Engineering Technician or Trainee (Field) – Maui, HI (Job ID:
            2025-03)
          </summary>
          <div className="job-body">
            <p className="text-muted">
              GEOLABS, INC. – Geotechnical Engineering and Drilling Services
              <br />
              94-429 Koaki Street, Suite 200 • Waipahu, Hawaii 96797
              <br />
              Telephone: (808) 841-5064 • Hawaii • California
            </p>
            <p>
              Geolabs is currently offering a great opportunity for a
              responsible, dedicated individual to join our operations as an
              Engineering Technician in Maui. We are willing to train a
              qualified applicant.
            </p>
            <p>
              <strong>Job Responsibilities (include, but are not limited to):</strong>
            </p>
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
                Perform laboratory tests on soils, aggregates, concrete and
                other materials according to standard specifications.
              </li>
            </ul>
            <p>
              <strong>Job Requirements:</strong>
            </p>
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
            <p>
              <strong>Physical Demand:</strong>
            </p>
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

        <div className="eeo-block">
          <p className="legal-text">
            <strong>EEO Statement</strong> – Geolabs, Inc. provides equal
            employment opportunities to all employees and applicants for
            employment without regard to race, color, religion, gender or gender
            identity, sexual orientation, national origin, age, disability,
            genetic information, marital status, amnesty or status as a covered
            veteran and lactation in accordance with applicable federal, state,
            and local laws.
          </p>
        </div>

        <div className="aap-block">
          <p className="legal-text">
            <strong>AAP Statement</strong> – As an equal opportunity employer,
            Geolabs, Inc. is also an ADA-compliant employer and is committed to
            providing reasonable accommodations for qualified applicants and
            employees who are able to perform the essential functions of the
            position satisfactorily where such reasonable accommodations do not
            create an undue hardship and enable employees with disabilities to
            perform the essential functions of their jobs.
          </p>
        </div>

        <div className="benefits-block">
          <h3>Benefits Overview</h3>
          <p className="text-muted">
            Geolabs is a 100% Employee-Owned Company and offers a comprehensive
            benefits package which may include:
          </p>
          <ul className="job-list">
            <li>
              <strong>Medical, Dental, Drug and Vision</strong> – Geolabs pays
              family coverage after twelve consecutive months of full-time
              employment.
            </li>
            <li>
              <strong>Paid Time Off (PTO)</strong> – 14 days the first year, up
              to 28 days at 20 or more years of service.
            </li>
            <li>
              <strong>Holidays</strong> – Ten days per year plus 1/2 day on
              Christmas Eve.
            </li>
            <li>
              <strong>401(k) Plan</strong> – Provides employees the potential
              for future financial security for retirement.
            </li>
            <li>
              <strong>Employee Stock Ownership Plan (ESOP)</strong> – Provides
              retirement benefits to eligible employees based on ownership
              interest in our Company.
            </li>
            <li>
              <strong>Group Term Life Insurance</strong>.
            </li>
            <li>
              <strong>Flexible Spending Account (FSA)</strong> – Allows
              employees to save tax dollars on money they spend for eligible,
              non-reimbursed health care expenses, insurance premiums and/or
              dependent care out-of-pocket expenses.
            </li>
          </ul>
        </div>
      </section>

      <div style={{ display: "flex", justifyContent: "center" }}>
        <button
          type="button"
          className="btn primary"
          onClick={onNext}
          style={{ marginTop: "0.5rem" }}
        >
          Apply Now
        </button>
      </div>
    </div>
  );
}

export default StepIntro;
