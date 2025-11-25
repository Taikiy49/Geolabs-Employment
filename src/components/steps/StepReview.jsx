import React from "react";
import "../../styles/StepReview.css";

function StepReview({ form }) {
  const formatVetStatus = () => {
    if (form.vetStatus === "protected") return "Protected veteran";
    if (form.vetStatus === "notProtected") return "Not a protected veteran";
    if (form.vetStatus === "noAnswer") return "Chose not to self-identify";
    return "—";
  };

  const renderValue = (value) => (value ? value : "—");
  const isEmpty = (value) => !value;

  return (
    <section className="form-section review-section">
      {/* Header */}
      <div className="review-header">
        <div>
          <h2>Review &amp; Confirm</h2>
          <p className="section-help">
            Please confirm the information below before submitting your
            application. If you need to make changes, use the Back button to
            update any step.
          </p>
        </div>
        <div className="review-meta">
          <span className="review-pill">Final review</span>
          <span className="review-hint">
            Your answers will be securely submitted to Geolabs, Inc.
          </span>
        </div>
      </div>

      {/* Summary cards */}
      <div className="review-grid">
        {/* Employment Application */}
        <div className="review-card">
          <div className="review-card-header">
            <h3>Employment Application</h3>
            <span className="review-chip review-chip-primary">
              Core application details
            </span>
          </div>
          <dl className="review-list">
            <div className="review-list-row">
              <dt>Name</dt>
              <dd className={isEmpty(form.name) ? "review-empty" : ""}>
                {renderValue(form.name)}
              </dd>
            </div>
            <div className="review-list-row">
              <dt>Position Applying For</dt>
              <dd className={isEmpty(form.position) ? "review-empty" : ""}>
                {renderValue(form.position)}
              </dd>
            </div>
            <div className="review-list-row">
              <dt>Preferred Location</dt>
              <dd className={isEmpty(form.location) ? "review-empty" : ""}>
                {renderValue(form.location)}
              </dd>
            </div>
            <div className="review-list-row">
              <dt>Contact</dt>
              <dd
                className={
                  isEmpty(form.email) && isEmpty(form.phone)
                    ? "review-empty"
                    : ""
                }
              >
                {form.email || "—"}
                {form.phone && (
                  <span className="review-contact-secondary">
                    {" "}
                    / {form.phone}
                  </span>
                )}
              </dd>
            </div>
          </dl>
        </div>

        {/* Self-Identification */}
        <div className="review-card">
          <div className="review-card-header">
            <h3>Self-Identification</h3>
            <span className="review-chip">EEO &amp; Voluntary Data</span>
          </div>
          <dl className="review-list">
            <div className="review-list-row">
              <dt>EEO Gender</dt>
              <dd className={isEmpty(form.eeoGender) ? "review-empty" : ""}>
                {renderValue(form.eeoGender)}
              </dd>
            </div>
            <div className="review-list-row">
              <dt>EEO Ethnicity</dt>
              <dd className={isEmpty(form.eeoEthnicity) ? "review-empty" : ""}>
                {renderValue(form.eeoEthnicity)}
              </dd>
            </div>
            <div className="review-list-row">
              <dt>Disability Status</dt>
              <dd
                className={isEmpty(form.disabilityStatus) ? "review-empty" : ""}
              >
                {renderValue(form.disabilityStatus)}
              </dd>
            </div>
            <div className="review-list-row">
              <dt>Veteran Status</dt>
              <dd
                className={
                  isEmpty(form.vetStatus) || formatVetStatus() === "—"
                    ? "review-empty"
                    : ""
                }
              >
                {formatVetStatus()}
              </dd>
            </div>
          </dl>
          <p className="review-note">
            These responses are voluntary and used only for reporting and
            compliance purposes.
          </p>
        </div>

        {/* Agreements */}
        <div className="review-card">
          <div className="review-card-header">
            <h3>Alcohol &amp; Drug Testing Agreement</h3>
            <span className="review-chip review-chip-attestation">
              Applicant attestation
            </span>
          </div>
          <dl className="review-list">
            <div className="review-list-row">
              <dt>Signature of Applicant</dt>
              <dd
                className={
                  isEmpty(form.drugAgreementSignature) ? "review-empty" : ""
                }
              >
                {renderValue(form.drugAgreementSignature)}
              </dd>
            </div>
            <div className="review-list-row">
              <dt>Date</dt>
              <dd
                className={
                  isEmpty(form.drugAgreementDate) ? "review-empty" : ""
                }
              >
                {renderValue(form.drugAgreementDate)}
              </dd>
            </div>
          </dl>
          <p className="review-note">
            By signing, you confirm you have read and understand the Alcohol &
            Drug Testing Program requirements.
          </p>
        </div>
      </div>

      {/* Footer reminder */}
      <div className="review-footer">
        <p>
          When you submit, your application will be sent to the Geolabs, Inc.
          team for review. You can still go back to edit any step before final
          submission.
        </p>
      </div>
    </section>
  );
}

export default StepReview;
