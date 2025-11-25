import React from "react";
import "../../styles/StepEmployment.css";

function StepEmployment({ form, updateEmploymentField }) {
  const jobs = form.employment || [];

  return (
    <div className="form-step employment-step">
      <section className="form-section employment-section">
        {/* Header row */}
        <div className="employment-header-row">
          <div>
            <h2>Employment Record</h2>
            <p className="section-help">
              Starting with your present or most recent employer, list your work
              history. Include self-employment, military service, summer, and
              part-time roles as applicable.
            </p>
          </div>
          <div className="employment-meta">
            <span className="emp-chip emp-chip-step">Step 3</span>
            <span className="emp-chip emp-chip-guidance">
              Most recent first
            </span>
          </div>
        </div>

        {jobs.map((job, i) => {
          const isCurrent = i === 0;
          return (
            <div key={i} className="employment-block">
              <div className="employment-block-header">
                <div>
                  <h3>
                    {isCurrent ? "Current / Most Recent Employer" : `Employer #${i + 1}`}
                  </h3>
                  <p className="employment-subhelp">
                    {isCurrent
                      ? "Start with your current or most recent position."
                      : "Add your previous employer details for this period."}
                  </p>
                </div>
                <div className="employment-pill-row">
                  <span className="emp-chip emp-chip-index">
                    Job {i + 1} of {jobs.length}
                  </span>
                  {isCurrent && (
                    <span className="emp-chip emp-chip-current">Most recent</span>
                  )}
                </div>
              </div>

              <div className="grid grid-2">
                <div className="field">
                  <label htmlFor={`company-${i}`}>Company Name / Address</label>
                  <input
                    id={`company-${i}`}
                    type="text"
                    placeholder="Organization and street address"
                    value={job.company}
                    onChange={(e) =>
                      updateEmploymentField(i, "company", e.target.value)
                    }
                  />
                  <div className="field-hint">
                    Include company name and city/state if possible.
                  </div>
                </div>
                <div className="field">
                  <label htmlFor={`phone-${i}`}>Phone</label>
                  <input
                    id={`phone-${i}`}
                    type="tel"
                    placeholder="Company or supervisor phone"
                    value={job.phone}
                    onChange={(e) =>
                      updateEmploymentField(i, "phone", e.target.value)
                    }
                  />
                </div>
              </div>

              <div className="grid grid-3 employment-dates-grid">
                <div className="field">
                  <label htmlFor={`position-${i}`}>Position</label>
                  <input
                    id={`position-${i}`}
                    type="text"
                    placeholder="Job title"
                    value={job.position}
                    onChange={(e) =>
                      updateEmploymentField(i, "position", e.target.value)
                    }
                  />
                </div>
                <div className="field">
                  <label htmlFor={`dateFrom-${i}`}>Date Employed (From)</label>
                  <input
                    id={`dateFrom-${i}`}
                    type="text"
                    placeholder="MM/YYYY"
                    value={job.dateFrom}
                    onChange={(e) =>
                      updateEmploymentField(i, "dateFrom", e.target.value)
                    }
                  />
                </div>
                <div className="field">
                  <label htmlFor={`dateTo-${i}`}>Date Employed (To)</label>
                  <input
                    id={`dateTo-${i}`}
                    type="text"
                    placeholder="MM/YYYY or Present"
                    value={job.dateTo}
                    onChange={(e) =>
                      updateEmploymentField(i, "dateTo", e.target.value)
                    }
                  />
                </div>
              </div>

              <div className="field">
                <label htmlFor={`duties-${i}`}>Primary Duties / Responsibilities</label>
                <textarea
                  id={`duties-${i}`}
                  rows={3}
                  placeholder="Briefly describe your key responsibilities, projects, and accomplishments."
                  value={job.duties}
                  onChange={(e) =>
                    updateEmploymentField(i, "duties", e.target.value)
                  }
                />
                <div className="field-hint">
                  Focus on responsibilities that relate to the position you're applying for.
                </div>
              </div>

              <div className="grid grid-2 employment-footer-grid">
                <div className="field">
                  <label htmlFor={`reasonForLeaving-${i}`}>
                    Reason for Leaving{" "}
                    <span className="optional-tag">(if applicable)</span>
                  </label>
                  <input
                    id={`reasonForLeaving-${i}`}
                    type="text"
                    placeholder="e.g., Career growth, relocation"
                    value={job.reasonForLeaving}
                    onChange={(e) =>
                      updateEmploymentField(
                        i,
                        "reasonForLeaving",
                        e.target.value
                      )
                    }
                  />
                </div>
                <div className="field">
                  <label htmlFor={`supervisor-${i}`}>Supervisor / Title</label>
                  <input
                    id={`supervisor-${i}`}
                    type="text"
                    placeholder="Name and title of supervisor"
                    value={job.supervisor}
                    onChange={(e) =>
                      updateEmploymentField(i, "supervisor", e.target.value)
                    }
                  />
                  <div className="field-hint">
                    This may be used for reference checks with your permission.
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        <p className="employment-footer-note">
          If you have additional employers beyond the fields above, you may
          attach an extra page or provide details in your resume.
        </p>
      </section>
    </div>
  );
}

export default StepEmployment;
