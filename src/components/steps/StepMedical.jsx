// src/components/steps/StepMedical.jsx
import React from "react";
import "../../styles/StepMedical.css";

function StepMedical({ form, updateField }) {
  return (
    <div className="form-step medical-step">
      <section className="form-section medical-section">
        <div className="medical-header-row">
          <div>
            <h2>Medical Information & Authorization</h2>
            <p className="section-help">
              This section explains Geolabs, Inc.’s pre-employment and
              employment-related physical examination and testing policy.
            </p>
          </div>
          <div className="medical-meta">
            <span className="medical-chip medical-chip-primary">
              Confidential
            </span>
            <span className="medical-chip medical-chip-muted">
              For hiring review only
            </span>
          </div>
        </div>

        <div className="medical-disclosure-card">
          <h3>Pre-Employment & Employment Physicals</h3>
          <p className="legal-text">
            After an offer of employment is made, but before employment duties
            begin, applicants are required to undergo a pre-employment physical
            including drug and alcohol testing at the Company’s expense and by a
            Company chosen physician, with the offer of employment conditioned
            on the result of such examination.
          </p>
          <p className="legal-text">
            Employees, at any time during the course of their employment, may be
            required to undergo an annual physical examination including drug
            and alcohol testing at the Company’s expense and by a Company chosen
            physician.
          </p>
          <p className="legal-text">
            I authorize the physician conducting the examination and any
            laboratory testing and any specimen obtained by the physician to
            disclose the results of the examination and the laboratory test to
            the Company.
          </p>

          <div className="field inline-initials medical-initials-field">
            <label>Applicant’s Initials (acknowledgment)</label>
            <input
              type="text"
              placeholder="e.g., TY"
              value={form.medInitials || ""}
              onChange={(e) => updateField("medInitials", e.target.value)}
            />
          </div>
        </div>

        <div className="medical-ability-card">
          <h3>Ability to Perform Essential Job Functions</h3>
          <p className="section-help">
            Please indicate whether you are able to perform the essential
            functions of the position, with or without reasonable accommodation.
          </p>

          <div className="field">
            <label>
              Are you able to perform the essential functions of this job with
              or without reasonable accommodation?
            </label>
            <input
              type="text"
              placeholder="Yes / No – if no, please briefly explain."
              value={form.ableToPerformJob || ""}
              onChange={(e) => updateField("ableToPerformJob", e.target.value)}
            />
            <p className="medical-small-note">
              Do not provide medical diagnoses or detailed health history here.
              You may discuss specific accommodations with HR if needed.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default StepMedical;
