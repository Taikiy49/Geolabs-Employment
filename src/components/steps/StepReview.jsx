import React, { useMemo, useState } from "react";
import "../../styles/StepReview.css";

// ---------------------------------------------------------
// API base
// ---------------------------------------------------------
// PROD: VITE_API_URL should be "https://geolabs-employment.net"
// DEV: default to local Flask
const API_BASE =
  (import.meta?.env?.VITE_API_URL || "").replace(/\/+$/, "") ||
  (window.location.hostname === "localhost"
    ? "http://127.0.0.1:5000"
    : "https://geolabs-employment.net");

// Put the word-for-word text you show on the signing step(s) here.
const ALCOHOL_DRUG_PROGRAM_TEXT = `
Alcohol & Drug Testing Program

[PASTE THE WORD-FOR-WORD TEXT YOU DISPLAY ON THE SIGNING STEP HERE]
`;

const REQUIRED_NOTICE_TEXT = `
Employment Application & Required Notices

[OPTIONAL: PASTE ANY WORD-FOR-WORD REQUIRED NOTICE TEXT HERE]
`;

function StepReview({ form, resumeFile }) {
  const [submitting, setSubmitting] = useState(false);
  const [submitState, setSubmitState] = useState({ ok: false, error: "" });

  const formatVetStatus = () => {
    if (form.vetStatus === "protected") return "Protected veteran";
    if (form.vetStatus === "notProtected") return "Not a protected veteran";
    if (form.vetStatus === "noAnswer") return "Chose not to self-identify";
    return "—";
  };

  const renderValue = (value) => (value ? value : "—");
  const isEmpty = (value) => !value;

  const payload = useMemo(() => {
    return {
      submittedAt: new Date().toISOString(),
      form,
      computed: {
        vetStatusLabel: formatVetStatus(),
      },
      legalText: {
        alcoholDrugProgram: ALCOHOL_DRUG_PROGRAM_TEXT,
        requiredNotice: REQUIRED_NOTICE_TEXT,
      },
      clientMeta: {
        userAgent: navigator.userAgent,
        language: navigator.language,
        platform: navigator.platform,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      },
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form]);

  const handleSubmit = async () => {
    setSubmitState({ ok: false, error: "" });
    setSubmitting(true);

    try {
      // ✅ multipart form: payload JSON + resume file
      const fd = new FormData();
      fd.append("payload", JSON.stringify(payload));

      if (resumeFile instanceof File) {
        fd.append("resume", resumeFile, resumeFile.name);
      }

      const res = await fetch(`${API_BASE}/api/submit-application`, {
        method: "POST",
        credentials: "include",
        body: fd,
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data?.error || "Submission failed.");
      }

      setSubmitState({ ok: true, error: "" });
    } catch (e) {
      setSubmitState({ ok: false, error: e?.message || "Submission failed." });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="form-section review-section">
      <div className="review-header">
        <div>
          <h2>Review &amp; Confirm</h2>
          <p className="section-help">
            Please confirm the information below before submitting your application. If you need to make changes, use the Back button to
            update any step.
          </p>
        </div>
        <div className="review-meta">
          <span className="review-pill">Final review</span>
          <span className="review-hint">Your answers will be securely submitted to Geolabs, Inc.</span>
        </div>
      </div>

      {(submitState.ok || submitState.error) && (
        <div
          className={`review-banner ${submitState.ok ? "review-banner-success" : "review-banner-error"}`}
          role="status"
        >
          {submitState.ok ? (
            <>
              <strong>Submitted!</strong> Your application was sent to the Geolabs, Inc. team.
            </>
          ) : (
            <>
              <strong>Couldn’t submit.</strong> {submitState.error}
            </>
          )}
        </div>
      )}

      <div className="review-grid">
        <div className="review-card">
          <div className="review-card-header">
            <h3>Employment Application</h3>
            <span className="review-chip review-chip-primary">Core application details</span>
          </div>
          <dl className="review-list">
            <div className="review-list-row">
              <dt>Name</dt>
              <dd className={isEmpty(form.name) ? "review-empty" : ""}>{renderValue(form.name)}</dd>
            </div>
            <div className="review-list-row">
              <dt>Position Applying For</dt>
              <dd className={isEmpty(form.position) ? "review-empty" : ""}>{renderValue(form.position)}</dd>
            </div>
            <div className="review-list-row">
              <dt>Preferred Location</dt>
              <dd className={isEmpty(form.location) ? "review-empty" : ""}>{renderValue(form.location)}</dd>
            </div>
            <div className="review-list-row">
              <dt>Contact</dt>
              <dd className={isEmpty(form.email) && isEmpty(form.phone) ? "review-empty" : ""}>
                {form.email || "—"}
                {form.phone && <span className="review-contact-secondary"> / {form.phone}</span>}
              </dd>
            </div>
            <div className="review-list-row">
              <dt>Resume Attachment</dt>
              <dd className={!resumeFile ? "review-empty" : ""}>
                {resumeFile ? resumeFile.name : "No resume uploaded"}
              </dd>
            </div>
          </dl>
        </div>

        <div className="review-card">
          <div className="review-card-header">
            <h3>Self-Identification</h3>
            <span className="review-chip">EEO &amp; Voluntary Data</span>
          </div>
          <dl className="review-list">
            <div className="review-list-row">
              <dt>EEO Gender</dt>
              <dd className={isEmpty(form.eeoGender) ? "review-empty" : ""}>{renderValue(form.eeoGender)}</dd>
            </div>
            <div className="review-list-row">
              <dt>EEO Ethnicity</dt>
              <dd className={isEmpty(form.eeoEthnicity) ? "review-empty" : ""}>{renderValue(form.eeoEthnicity)}</dd>
            </div>
            <div className="review-list-row">
              <dt>Disability Status</dt>
              <dd className={isEmpty(form.disabilityStatus) ? "review-empty" : ""}>{renderValue(form.disabilityStatus)}</dd>
            </div>
            <div className="review-list-row">
              <dt>Veteran Status</dt>
              <dd className={isEmpty(form.vetStatus) || formatVetStatus() === "—" ? "review-empty" : ""}>
                {formatVetStatus()}
              </dd>
            </div>
          </dl>
          <p className="review-note">These responses are voluntary and used only for reporting and compliance purposes.</p>
        </div>

        <div className="review-card">
          <div className="review-card-header">
            <h3>Alcohol &amp; Drug Testing Agreement</h3>
            <span className="review-chip review-chip-attestation">Applicant attestation</span>
          </div>
          <dl className="review-list">
            <div className="review-list-row">
              <dt>Signature of Applicant</dt>
              <dd className={isEmpty(form.drugAgreementSignature) ? "review-empty" : ""}>
                {renderValue(form.drugAgreementSignature)}
              </dd>
            </div>
            <div className="review-list-row">
              <dt>Date</dt>
              <dd className={isEmpty(form.drugAgreementDate) ? "review-empty" : ""}>
                {renderValue(form.drugAgreementDate)}
              </dd>
            </div>
          </dl>
          <p className="review-note">
            By signing, you confirm you have read and understand the Alcohol &amp; Drug Testing Program requirements.
          </p>
        </div>
      </div>

      <div className="review-footer">
        <p>
          When you submit, your application will be sent to the Geolabs, Inc. team for review. You can still go back to edit any step
          before final submission.
        </p>

        <div className="review-actions">
          <button type="button" className="review-submit" onClick={handleSubmit} disabled={submitting}>
            {submitting ? "Submitting..." : "Submit Application"}
          </button>

          <span className="review-actions-hint">
            This will email a print-ready PDF{" "}
            {resumeFile ? <>and attach the resume</> : <> (no resume attached)</>} to{" "}
            <strong>tyamashita@geolabs.net</strong>.
          </span>
        </div>
      </div>
    </section>
  );
}

export default StepReview;
