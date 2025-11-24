import React from "react";

function StepEmployment({ form, updateEmploymentField }) {
  return (
    <section className="form-section">
      <h2>Employment Record</h2>
      <p className="section-help">
        STARTING WITH present or MOST RECENT, list all previous employers.
        Include self-employment, military service, summer, and part-time jobs.
        (Please attach additional sheets if necessary.)
      </p>

      {form.employment.map((job, i) => (
        <div key={i} className="employment-block">
          <h3>Company #{i + 1}</h3>

          <div className="grid grid-2">
            <div className="field">
              <label>Company Name / Address</label>
              <input
                type="text"
                value={job.company}
                onChange={(e) =>
                  updateEmploymentField(i, "company", e.target.value)
                }
              />
            </div>
            <div className="field">
              <label>Phone</label>
              <input
                type="tel"
                value={job.phone}
                onChange={(e) =>
                  updateEmploymentField(i, "phone", e.target.value)
                }
              />
            </div>
          </div>

          <div className="grid grid-3">
            <div className="field">
              <label>Position</label>
              <input
                type="text"
                value={job.position}
                onChange={(e) =>
                  updateEmploymentField(i, "position", e.target.value)
                }
              />
            </div>
            <div className="field">
              <label>Date Employed (From)</label>
              <input
                type="text"
                placeholder="MM/YYYY"
                value={job.dateFrom}
                onChange={(e) =>
                  updateEmploymentField(i, "dateFrom", e.target.value)
                }
              />
            </div>
            <div className="field">
              <label>Date Employed (To)</label>
              <input
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
            <label>Duties</label>
            <textarea
              rows={3}
              value={job.duties}
              onChange={(e) =>
                updateEmploymentField(i, "duties", e.target.value)
              }
            />
          </div>

          <div className="grid grid-2">
            <div className="field">
              <label>Reason for Leaving</label>
              <input
                type="text"
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
              <label>Supervisor / Title</label>
              <input
                type="text"
                value={job.supervisor}
                onChange={(e) =>
                  updateEmploymentField(i, "supervisor", e.target.value)
                }
              />
            </div>
          </div>
        </div>
      ))}
    </section>
  );
}

export default StepEmployment;
