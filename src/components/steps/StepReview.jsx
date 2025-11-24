import React from "react";

function StepReview({ form }) {
  return (
    <section className="form-section">
      <h2>Review &amp; Confirm</h2>
      <p className="section-help">
        Please review the information you have provided. Use the Back button to
        make corrections before submitting.
      </p>

      <div className="review-grid">
        <div className="review-card">
          <h3>Employment Application</h3>
          <p>
            <strong>Name:</strong> {form.name || "-"}
          </p>
          <p>
            <strong>Position Applying For:</strong> {form.position || "-"}
          </p>
          <p>
            <strong>Location:</strong> {form.location || "-"}
          </p>
          <p>
            <strong>Contact:</strong> {form.email || "-"}{" "}
            {form.phone ? ` / ${form.phone}` : ""}
          </p>
        </div>

        <div className="review-card">
          <h3>Self-Identification</h3>
          <p>
            <strong>EEO Gender:</strong> {form.eeoGender || "-"}
          </p>
          <p>
            <strong>EEO Ethnicity:</strong> {form.eeoEthnicity || "-"}
          </p>
          <p>
            <strong>Disability Status:</strong> {form.disabilityStatus || "-"}
          </p>
          <p>
            <strong>Veteran Status:</strong>{" "}
            {form.vetStatus === "protected"
              ? "Protected veteran"
              : form.vetStatus === "notProtected"
              ? "Not a protected veteran"
              : form.vetStatus === "noAnswer"
              ? "Chose not to self-identify"
              : "-"}
          </p>
        </div>

        <div className="review-card">
          <h3>Alcohol &amp; Drug Testing Program</h3>
          <p>
            <strong>Signature of Applicant:</strong>{" "}
            {form.drugAgreementSignature || "-"}
          </p>
          <p>
            <strong>Date:</strong> {form.drugAgreementDate || "-"}
          </p>
        </div>
      </div>
    </section>
  );
}

export default StepReview;
