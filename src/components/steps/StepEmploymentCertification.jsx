// src/components/steps/StepEmploymentCertification.jsx
import React, { useMemo } from "react";
import "../../styles/StepEmploymentCertification.css";

function StepEmploymentCertification({ form, updateField }) {
  const handleChange = (field) => (e) => updateField(field, e.target.value);

  // Small UX helpers (no new fields added; keeps your existing data model)
  const fcrInitials = (form.fcrInitials || "").toUpperCase();
  const sig = form.applicationCertificationSignature || "";

  const signatureLooksValid = useMemo(() => {
    // not "validation", just a gentle hint
    const cleaned = sig.trim();
    return cleaned.length >= 3 && cleaned.includes(" ");
  }, [sig]);

  return (
    <section className="form-section employment-cert-section">
      {/* Header */}
      <div className="employment-cert-header-row">
        <div>
          <h2>Employment Certification &amp; Disclosures</h2>
          <p className="section-help">
            Please review the disclosures carefully and provide your initials and
            signature where requested.
          </p>
        </div>

        <div className="employment-cert-meta">
          <span className="ec-chip ec-chip-step">Final Step</span>
          <span className="ec-chip ec-chip-required">Required</span>
        </div>
      </div>

      {/* FCRA Disclosure */}
      <div className="employment-cert-card">
        <div className="employment-cert-card-header">
          <h3>Fair Credit Reporting Act Disclosure Statement</h3>
          <p className="section-help">
            Initial below to acknowledge that you have read and understand this
            disclosure.
          </p>
        </div>

        <div className="legal-block">
          <p className="legal-text">
            By this document, the Company discloses to you that a consumer report,
            including an investigative consumer report containing information as to
            your character, general reputation, personal characteristics, and mode
            of living, may be obtained for employment purposes as part of the
            pre-employment background investigation and at any time during your
            employment. Should an investigative consumer report be requested, you
            will have the right to request a complete and accurate disclosure of
            the nature and scope of the investigation requested and a written
            summary of your rights under the Fair Credit Reporting Act.
          </p>

          <p className="legal-text">
            I agree that Geolabs, Inc. is hereby authorized to inquire into my
            background, prior employment, and criminal records and may consider
            any criminal conviction record that I may have after it makes a
            conditional offer of employment. The Company may withdraw a
            conditional employment offer if I have a criminal conviction record
            which bears a rational relationship to the duties and responsibilities
            of the position for which I am applying. Any criminal conviction
            records that are more than five (5) years old for misdemeanors and
            seven (7) years for felonies (excluding periods of incarceration) or
            that involve certain Family Court matters will not be considered.
          </p>
        </div>

        <div className="field employment-cert-initials-field">
          <div className="employment-cert-label-row">
            <label>
              Applicant’s Initial <span className="required-tag">*</span>
            </label>
            <span className="employment-cert-note">
              Enter 2–4 letters (e.g., TY)
            </span>
          </div>

          <input
            type="text"
            value={fcrInitials}
            onChange={(e) => updateField("fcrInitials", e.target.value)}
            placeholder="Initials"
            maxLength={4}
            autoCapitalize="characters"
            inputMode="text"
          />

          <p className="field-hint">
            Your initials confirm you have read the disclosure above.
          </p>
        </div>
      </div>

      {/* Other Info */}
      <div className="employment-cert-card">
        <div className="employment-cert-card-header">
          <h3>Other Information</h3>
          <p className="section-help">
            If you know anyone currently employed by Geolabs, please let us know.
            This is used for internal routing and conflict-of-interest review only.
          </p>
        </div>

        <div className="grid grid-2">
          <div className="field">
            <label>Do you know anyone presently working for our company?</label>
            <input
              type="text"
              value={form.knowEmployee || ""}
              onChange={handleChange("knowEmployee")}
              placeholder="Yes / No"
            />
            <p className="field-hint">If “Yes”, please include their name(s).</p>
          </div>

          <div className="field">
            <label>If yes, who?</label>
            <input
              type="text"
              value={form.knowEmployeeName || ""}
              onChange={handleChange("knowEmployeeName")}
              placeholder="Name(s) of current employee(s)"
            />
            <p className="field-hint">Example: “Jane Doe (Project Engineer)”</p>
          </div>
        </div>
      </div>

      {/* Work Eligibility Note */}
      <div className="employment-cert-card employment-cert-card-subtle">
        <div className="employment-cert-card-header">
          <h3>Work Eligibility Note</h3>
        </div>

        <div className="legal-block">
          <p className="legal-text">
            It is the policy of this company to hire only U.S. citizens and aliens
            who are authorized to work in this country. As a condition of
            employment, you will be required to produce original documents
            establishing your identity and authorization to work, and to complete
            the U.S. Citizenship and Immigration Services’ Form I-9.
          </p>
        </div>
      </div>

      {/* Certification */}
      <div className="employment-cert-card">
        <div className="employment-cert-card-header">
          <h3>Certification &amp; At-Will Acknowledgement</h3>
          <p className="section-help">
            Your signature below confirms the statements in this section.
          </p>
        </div>

        <div className="legal-block">
          <p className="legal-text">
            I certify that all information provided on the application is complete
            and accurate. I understand that my application will not be considered
            if it is incomplete. Further, I understand that false, misleading, or
            incomplete information could lead to a decision not to hire or be
            grounds for termination. I hereby authorize any investigation of the
            above or related work experience, education, or reputation information
            for purposes of consideration of my application for employment.
          </p>

          <p className="legal-text">
            This application is not a contract and cannot create a contract. I
            understand that if I am employed, my employment is “at will” and can
            be terminated at any time, either by the Company, or myself with or
            without cause or reason and with or without notice.
          </p>
        </div>

        <div className="grid grid-2 employment-cert-signature-row">
          <div className="field">
            <label>
              Application Date <span className="required-tag">*</span>
            </label>
            <input
              type="date"
              value={form.applicationCertificationDate || ""}
              onChange={handleChange("applicationCertificationDate")}
            />
            <p className="field-hint">Use today’s date unless instructed otherwise.</p>
          </div>

          <div className="field">
            <label>
              Applicant’s Signature <span className="required-tag">*</span>
            </label>
            <input
              type="text"
              value={sig}
              onChange={handleChange("applicationCertificationSignature")}
              placeholder="Type your full name"
              autoComplete="name"
            />

            <p className="signature-helper">
              By typing your name, you acknowledge this as your electronic signature.
              {!signatureLooksValid && sig.trim().length > 0 && (
                <span className="signature-helper-warn">
                  {" "}
                  (Tip: enter first and last name)
                </span>
              )}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default StepEmploymentCertification;
