// src/components/steps/StepDisability.jsx
import React, { useMemo } from "react";
import "../../styles/StepDisability.css";

function StepDisability({ form, updateField }) {
  const handleChange = (field) => (e) => updateField(field, e.target.value);

  const todayISO = useMemo(() => {
    const d = new Date();
    return d.toISOString().split("T")[0];
  }, []);

  const fillDate = (field) => {
    if (!form[field]) updateField(field, todayISO);
  };

  const clearStatus = () => updateField("disabilityStatus", "");

  return (
    <section className="form-section disability-section">
      {/* Header */}
      <div className="disability-header-row">
        <div className="disability-title">
          <h2>Voluntary Self-Identification of Disability</h2>
          <p className="section-help">
            This form is used for federal reporting purposes only. It is
            confidential and will not affect your opportunity for employment.
          </p>
        </div>

        <div className="disability-meta">
          <div className="disability-meta-lines">
            <div>Form CC-305</div>
            <div>OMB Control Number 1250-0005</div>
            <div>Page 1 of 1 · Expires 04/30/2026</div>
          </div>
          <span className="disability-chip disability-chip-voluntary">
            Voluntary &amp; confidential
          </span>
        </div>
      </div>

      {/* Name / Date / Employee ID */}
      <div className="disability-top-grid">
        <div className="field">
          <label>Name</label>
          <input
            type="text"
            value={form.disabilityName || ""}
            onChange={handleChange("disabilityName")}
            placeholder="Optional"
            autoComplete="name"
          />
          <p className="field-hint">You may leave this blank if you prefer.</p>
        </div>

        <div className="field">
          <label>Date</label>
          <div className="disability-date-row">
            <input
              type="date"
              className="disability-date-input"
              value={form.disabilityDate || ""}
              onChange={handleChange("disabilityDate")}
            />
            <button
              type="button"
              className="btn subtle disability-today-btn"
              onClick={() => fillDate("disabilityDate")}
            >
              Today
            </button>
          </div>
          <p className="field-hint">Optional.</p>
        </div>

        <div className="field">
          <label>Employee ID (if applicable)</label>
          <input
            type="text"
            value={form.disabilityEmployeeId || ""}
            onChange={handleChange("disabilityEmployeeId")}
            placeholder="Optional"
          />
          <p className="field-hint">Only if you already have one.</p>
        </div>
      </div>

      {/* Why asked */}
      <div className="disability-card">
        <div className="disability-card-header">
          <h3>Why are you being asked to complete this form?</h3>
        </div>
        <p className="legal-text">
          We are a federal contractor or subcontractor. The law requires us to
          provide equal employment opportunity to qualified people with
          disabilities. We have a goal of having at least 7% of our workers as
          people with disabilities. The law says we must measure our progress
          towards this goal. To do this, we must ask applicants and employees if
          they have a disability or have ever had one. People can become
          disabled, so we need to ask this question at least every five years.
        </p>
        <p className="legal-text">
          Completing this form is voluntary, and we hope that you will choose to
          do so. Your answer is confidential. No one who makes hiring decisions
          will see it. Your decision to complete the form and your answer will
          not harm you in any way. If you want to learn more about the law or
          this form, visit the U.S. Department of Labor’s Office of Federal
          Contract Compliance Programs (OFCCP) website at www.dol.gov/ofccp.
        </p>
      </div>

      {/* How you know + conditions */}
      <div className="disability-card">
        <div className="disability-card-header">
          <h3>How do you know if you have a disability?</h3>
        </div>
        <p className="legal-text">
          A disability is a condition that substantially limits one or more of
          your “major life activities.” If you have or have ever had such a
          condition, you are a person with a disability. Disabilities include,
          but are not limited to:
        </p>

        <div className="disability-list-card" aria-label="Disability examples list">
          <ul className="legal-text">
            <li>
              Alcohol or other substance use disorder (not currently using drugs
              illegally)
            </li>
            <li>
              Autoimmune disorder, for example, lupus, fibromyalgia, rheumatoid
              arthritis, HIV/AIDS
            </li>
            <li>Blind or low vision</li>
            <li>Cancer (past or present)</li>
            <li>Cardiovascular or heart disease</li>
            <li>Celiac disease</li>
            <li>Cerebral palsy</li>
            <li>Deaf or serious difficulty hearing</li>
            <li>Diabetes</li>
            <li>
              Disfigurement, for example, disfigurement caused by burns, wounds,
              accidents, or congenital disorders
            </li>
            <li>Epilepsy or other seizure disorder</li>
            <li>
              Gastrointestinal disorders, for example, Crohn&apos;s disease,
              irritable bowel syndrome
            </li>
            <li>Intellectual or developmental disability</li>
            <li>
              Mental health conditions, for example, depression, bipolar
              disorder, anxiety disorder, schizophrenia, PTSD
            </li>
            <li>Missing limbs or partially missing limbs</li>
            <li>
              Mobility impairment, benefiting from the use of a wheelchair,
              scooter, walker, leg brace(s) and/or other supports
            </li>
            <li>
              Nervous system condition, for example, migraine headaches,
              Parkinson’s disease, multiple sclerosis (MS)
            </li>
            <li>
              Neurodivergence, for example, attention-deficit/hyperactivity
              disorder (ADHD), autism spectrum disorder, dyslexia, dyspraxia,
              other learning disabilities
            </li>
            <li>Partial or complete paralysis (any cause)</li>
            <li>
              Pulmonary or respiratory conditions, for example, tuberculosis,
              asthma, emphysema
            </li>
            <li>Short stature (dwarfism)</li>
            <li>Traumatic brain injury</li>
          </ul>
        </div>
      </div>

      {/* Choice */}
      <div className="disability-card disability-choice-card">
        <div className="disability-choice-header">
          <div>
            <h3>Voluntary Response</h3>
            <p className="disability-card-subtitle">
              Please select one option below. Your response is voluntary.
            </p>
          </div>

          <button type="button" className="disability-clear" onClick={clearStatus}>
            Clear
          </button>
        </div>

        <div className="disability-radio-stack">
          <label
            className={`disability-radio-card ${
              form.disabilityStatus ===
              "Yes, I have a disability, or have had one in the past"
                ? "is-selected"
                : ""
            }`}
          >
            <input
              type="radio"
              name="disabilityStatus"
              value="Yes, I have a disability, or have had one in the past"
              checked={
                form.disabilityStatus ===
                "Yes, I have a disability, or have had one in the past"
              }
              onChange={handleChange("disabilityStatus")}
            />
            <span>Yes, I have a disability, or have had one in the past</span>
          </label>

          <label
            className={`disability-radio-card ${
              form.disabilityStatus ===
              "No, I do not have a disability and have not had one in the past"
                ? "is-selected"
                : ""
            }`}
          >
            <input
              type="radio"
              name="disabilityStatus"
              value="No, I do not have a disability and have not had one in the past"
              checked={
                form.disabilityStatus ===
                "No, I do not have a disability and have not had one in the past"
              }
              onChange={handleChange("disabilityStatus")}
            />
            <span>
              No, I do not have a disability and have not had one in the past
            </span>
          </label>

          <label
            className={`disability-radio-card ${
              form.disabilityStatus === "I do not want to answer"
                ? "is-selected"
                : ""
            }`}
          >
            <input
              type="radio"
              name="disabilityStatus"
              value="I do not want to answer"
              checked={form.disabilityStatus === "I do not want to answer"}
              onChange={handleChange("disabilityStatus")}
            />
            <span>I do not want to answer</span>
          </label>
        </div>
      </div>

      {/* Public burden statement */}
      <p className="legal-text disability-burden">
        PUBLIC BURDEN STATEMENT: According to the Paperwork Reduction Act of
        1995, no persons are required to respond to a collection of information
        unless such collection displays a valid OMB control number. This survey
        should take about 5 minutes to complete.
      </p>

      {/* Employer-only */}
      <div className="disability-card disability-employer-card">
        <div className="disability-card-header">
          <h3>For employer use only</h3>
        </div>
        <p className="legal-text">
          Employers may modify this section of the form as needed for
          recordkeeping purposes.
          <br />
          For example:
          <br />
          Job Title: ______________________ Date of Hire: ______________________
        </p>
      </div>

      {/* Signature */}
      <div className="disability-signature-card">
        <div className="disability-signature-grid">
          <div className="field">
            <label>Signature of Applicant</label>
            <input
              type="text"
              className="disability-signature-input"
              placeholder="Type your full name"
              value={form.disabilitySignature || ""}
              onChange={handleChange("disabilitySignature")}
              autoComplete="name"
            />
            <p className="field-hint">
              By typing your name, you acknowledge this as your electronic signature.
            </p>
          </div>

          <div className="field">
            <label>Date</label>
            <div className="disability-date-row">
              <input
                type="date"
                className="disability-date-input"
                value={form.disabilitySignatureDate || ""}
                onChange={handleChange("disabilitySignatureDate")}
              />
              <button
                type="button"
                className="btn subtle disability-today-btn"
                onClick={() => fillDate("disabilitySignatureDate")}
              >
                Today
              </button>
            </div>
            <p className="field-hint">Optional.</p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default StepDisability;
