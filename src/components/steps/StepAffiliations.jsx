import React from "react";
import "../../styles/StepAffiliations.css";

function StepAffiliations({ form, updateField }) {
  const value = form.affiliations || "";
  const maxRecommended = 800;
  const length = value.length;
  const counterClass =
    length > maxRecommended
      ? "affiliations-counter over-limit"
      : "affiliations-counter";

  return (
    <section className="form-section affiliations-section">
      <div className="affiliations-header-row">
        <div>
          <h2>Professional Affiliations</h2>
          <p className="section-help">
            This section is optional. List any memberships, licenses, or
            professional organizations related to your work. If none, you may
            simply enter “N/A”.
          </p>
        </div>
        <span className="affiliations-optional-pill">Optional</span>
      </div>

      {/* Example card */}
      <div className="affiliations-examples-card">
        <div className="affiliations-examples-title">
          Helpful examples you can include
        </div>
        <ul className="affiliations-examples-list">
          <li>ASCE Member (since 2022)</li>
          <li>ACI Concrete Field Testing Technician – Grade I</li>
          <li>Engineer-in-Training (EIT), State of Hawaii</li>
          <li>OSHA 30-Hour Construction Safety</li>
        </ul>
        <p className="affiliations-examples-footnote">
          You may also list relevant trade unions, technical societies, or
          other licenses and certifications.
        </p>
      </div>

      {/* Main input */}
      <div className="field affiliations-field">
        <div className="affiliations-label-row">
          <label htmlFor="affiliations">
            Professional Affiliations, Licenses, or Memberships
          </label>
          <span className="affiliations-note">You can write in bullet form.</span>
        </div>
        <textarea
          id="affiliations"
          rows={6}
          value={value}
          onChange={(e) => updateField("affiliations", e.target.value)}
          placeholder={`Examples:\n• ASCE Member (since 2022)\n• ACI Concrete Field Testing Technician – Grade I\n• Engineer-in-Training (EIT), State of Hawaii\n• OSHA 30-Hour Construction Safety\n\nIf none, type: N/A`}
        />
        <div className="affiliations-footer-row">
          <p className="affiliations-helper">
            Focus on memberships and credentials that support your application
            for this role.
          </p>
          <span className={counterClass}>
            {length} / {maxRecommended} recommended
          </span>
        </div>
      </div>
    </section>
  );
}

export default StepAffiliations;
