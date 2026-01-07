import React, { useMemo, useState } from "react";
import "../../styles/StepReview.css";

const API_BASE =
  (import.meta?.env?.VITE_API_URL || "").replace(/\/+$/, "") ||
  (window.location.hostname === "localhost"
    ? "http://127.0.0.1:5001"
    : "https://api.geolabs-employment.net");

const ALCOHOL_DRUG_PROGRAM_TEXT = `
Alcohol & Drug Testing Program

[PASTE THE WORD-FOR-WORD TEXT YOU DISPLAY ON THE SIGNING STEP HERE]
`;

const REQUIRED_NOTICE_TEXT = `
Employment Application & Required Notices

[OPTIONAL: PASTE ANY WORD-FOR-WORD REQUIRED NOTICE TEXT HERE]
`;

function StepReview({ form, resumeFile, onReset }) {
  const [submitting, setSubmitting] = useState(false);
  const [submitState, setSubmitState] = useState({ ok: false, error: "" });

  const [confirmChecked, setConfirmChecked] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  const formatVetStatus = () => {
    if (form?.vetStatus === "protected") return "Protected veteran";
    if (form?.vetStatus === "notProtected") return "Not a protected veteran";
    if (form?.vetStatus === "noAnswer") return "Chose not to self-identify";
    return "—";
  };

  const renderValue = (v) => (v ? v : "—");
  const isEmpty = (v) => !v;

  const missingCritical = useMemo(() => {
    const missing = [];
    if (!form?.name) missing.push("Full Name");
    if (!form?.position) missing.push("Position Applying For");
    if (!form?.location) missing.push("Preferred Location");
    if (!form?.email && !form?.phone) missing.push("Email or Phone");
    if (!form?.drugAgreementSignature) missing.push("Alcohol & Drug Signature");
    if (!form?.drugAgreementDate) missing.push("Alcohol & Drug Date");
    return missing;
  }, [form]);

  const payload = useMemo(() => {
    return {
      submittedAt: new Date().toISOString(),
      form,
      computed: { vetStatusLabel: formatVetStatus() },
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

  const canSubmit =
    !submitting &&
    !submitState.ok &&
    confirmChecked &&
    missingCritical.length === 0;

  const doSubmit = async () => {
    setSubmitState({ ok: false, error: "" });
    setSubmitting(true);

    try {
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
      if (!res.ok) throw new Error(data?.error || "Submission failed.");

      setSubmitState({ ok: true, error: "" });
      setModalOpen(false);
    } catch (e) {
      setSubmitState({ ok: false, error: e?.message || "Submission failed." });
      setModalOpen(false);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="form-section review-section">
      <div className="review-header">
        <div>
          <h2>Review &amp; Submit</h2>
          <p className="section-help">
            Please confirm the information below. When you submit, your
            application will be securely sent to Geolabs, Inc.
          </p>
        </div>

        <div className="review-meta">
          <span className="review-pill">Final step</span>
          <span className="review-hint">Secure submission</span>
        </div>
      </div>

      {(submitState.ok || submitState.error) && (
        <div
          className={`review-banner ${
            submitState.ok ? "review-banner-success" : "review-banner-error"
          }`}
          role="status"
        >
          {submitState.ok ? (
            <>
              <strong>Submitted!</strong> Your application was sent successfully.
            </>
          ) : (
            <>
              <strong>Couldn’t submit.</strong> {submitState.error}
            </>
          )}
        </div>
      )}

      {missingCritical.length > 0 && !submitState.ok && (
        <div className="review-banner review-banner-warn" role="status">
          <strong>Missing required items:</strong> {missingCritical.join(", ")}.
          Please go back and complete them.
        </div>
      )}

      <div className="review-grid">
        <div className="review-card">
          <div className="review-card-header">
            <h3>Application</h3>
            <span className="review-chip review-chip-primary">Core details</span>
          </div>

          <dl className="review-list">
            <div className="review-list-row">
              <dt>Name</dt>
              <dd className={isEmpty(form?.name) ? "review-empty" : ""}>
                {renderValue(form?.name)}
              </dd>
            </div>
            <div className="review-list-row">
              <dt>Position Applying For</dt>
              <dd className={isEmpty(form?.position) ? "review-empty" : ""}>
                {renderValue(form?.position)}
              </dd>
            </div>
            <div className="review-list-row">
              <dt>Preferred Location</dt>
              <dd className={isEmpty(form?.location) ? "review-empty" : ""}>
                {renderValue(form?.location)}
              </dd>
            </div>
            <div className="review-list-row">
              <dt>Contact</dt>
              <dd
                className={
                  isEmpty(form?.email) && isEmpty(form?.phone) ? "review-empty" : ""
                }
              >
                {form?.email || "—"}
                {form?.phone && (
                  <span className="review-contact-secondary">
                    {" "}
                    / {form.phone}
                  </span>
                )}
              </dd>
            </div>
            <div className="review-list-row">
              <dt>Resume</dt>
              <dd className={!resumeFile ? "review-empty" : ""}>
                {resumeFile ? resumeFile.name : "No resume uploaded"}
              </dd>
            </div>
          </dl>
        </div>

        <div className="review-card">
          <div className="review-card-header">
            <h3>Self-Identification</h3>
            <span className="review-chip">EEO (Voluntary)</span>
          </div>

          <dl className="review-list">
            <div className="review-list-row">
              <dt>Veteran Status</dt>
              <dd
                className={
                  isEmpty(form?.vetStatus) || formatVetStatus() === "—"
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

        <div className="review-card">
          <div className="review-card-header">
            <h3>Alcohol &amp; Drug Testing</h3>
            <span className="review-chip review-chip-attestation">
              Attestation
            </span>
          </div>

          <dl className="review-list">
            <div className="review-list-row">
              <dt>Signature (Typed)</dt>
              <dd
                className={isEmpty(form?.drugAgreementSignature) ? "review-empty" : ""}
              >
                {renderValue(form?.drugAgreementSignature)}
              </dd>
            </div>
            <div className="review-list-row">
              <dt>Date</dt>
              <dd className={isEmpty(form?.drugAgreementDate) ? "review-empty" : ""}>
                {renderValue(form?.drugAgreementDate)}
              </dd>
            </div>
          </dl>
        </div>
      </div>

      {/* Final actions */}
      <div className="review-final">
        <div className="review-final-card">
          <div className="review-final-top">
            <div>
              <h3>Confirm &amp; Submit</h3>
              <p className="review-final-sub">
                Check the box to confirm, then submit. You’ll see a final
                “Are you sure?” prompt.
              </p>
            </div>

            {/* Small status tag on the right */}
            <span className={"review-status-tag" + (canSubmit ? " ready" : "")}>
              {submitState.ok
                ? "Submitted"
                : canSubmit
                ? "Ready to submit"
                : "Not ready"}
            </span>
          </div>

          <label className="review-confirm">
            <input
              type="checkbox"
              checked={confirmChecked}
              onChange={(e) => setConfirmChecked(e.target.checked)}
              disabled={submitting || submitState.ok}
            />
            <span>
              I confirm the information above is accurate and I want to submit
              this application.
            </span>
          </label>

          <div className="review-actions">
            <button
              type="button"
              className="review-btn review-btn-primary"
              onClick={() => canSubmit && setModalOpen(true)}
              disabled={!canSubmit}
            >
              {submitting ? "Submitting..." : "Submit Application"}
            </button>

            {submitState.ok && typeof onReset === "function" && (
              <button
                type="button"
                className="review-btn review-btn-ghost"
                onClick={onReset}
              >
                Start new application
              </button>
            )}
          </div>

          {!confirmChecked && !submitState.ok && (
            <p className="review-minihelp">
              Check the confirmation box to enable submission.
            </p>
          )}

          {missingCritical.length > 0 && !submitState.ok && (
            <p className="review-minihelp">
              You still have missing required items above.
            </p>
          )}
        </div>
      </div>

      {/* Confirm modal */}
      {modalOpen && (
        <div
          className="review-modalOverlay"
          role="dialog"
          aria-modal="true"
          onMouseDown={(e) => {
            if (e.target.classList.contains("review-modalOverlay")) setModalOpen(false);
          }}
        >
          <div className="review-modal">
            <div className="review-modal-header">
              <h4>Submit application?</h4>
              <button
                type="button"
                className="review-modal-close"
                onClick={() => setModalOpen(false)}
                aria-label="Close"
              >
                ✕
              </button>
            </div>

            <p className="review-modal-text">
              This will send your application to Geolabs, Inc. for review.
            </p>

            <div className="review-modal-actions">
              <button
                type="button"
                className="review-btn review-btn-secondary"
                onClick={() => setModalOpen(false)}
                disabled={submitting}
              >
                Cancel
              </button>

              <button
                type="button"
                className="review-btn review-btn-primary"
                onClick={doSubmit}
                disabled={submitting}
              >
                {submitting ? "Submitting..." : "Yes, submit"}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

export default StepReview;
