import React from "react";
import "../../styles/StepEmploymentCertification.css";

function StepEmploymentCertification({ form, updateField }) {
  return (
    <section className="form-section employment-cert-section">
      {/* Main header */}
      <div className="employment-cert-header">
        <div>
          <h2>Employment Certification & Disclosures</h2>
          <p className="section-help">
            Please review the following disclosures carefully and provide your
            initials and signature where requested.
          </p>
        </div>
        <span className="employment-cert-required-pill">Required</span>
      </div>

      {/* FCRA + background disclosure */}
      <div className="employment-cert-card">
        <div className="employment-cert-card-header">
          <h3>Fair Credit Reporting Act Disclosure Statement</h3>
        </div>

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

        <div className="field inline-initials">
          <div className="inline-label-row">
            <label>Applicant’s Initial</label>
            <span className="inline-helper">
              Please initial to acknowledge you have read this disclosure.
            </span>
          </div>
          <input
            type="text"
            value={form.fcrInitials}
            onChange={(e) => updateField("fcrInitials", e.target.value)}
          />
        </div>
      </div>

      {/* Other – knowing current employees */}
      <div className="employment-cert-card">
        <div className="employment-cert-card-header">
          <h3>Other Information</h3>
          <p className="section-help">
            If you know anyone currently employed by Geolabs, please let us
            know. This is for conflict-of-interest and internal routing only.
          </p>
        </div>

        <div className="grid grid-2">
          <div className="field">
            <label>
              Do you know anyone presently working for our company?
            </label>
            <input
              type="text"
              value={form.knowEmployee}
              onChange={(e) => updateField("knowEmployee", e.target.value)}
              placeholder="Yes / No"
            />
          </div>
          <div className="field">
            <label>If yes, who?</label>
            <input
              type="text"
              value={form.knowEmployeeName}
              onChange={(e) =>
                updateField("knowEmployeeName", e.target.value)
              }
              placeholder="Name(s) of current employee(s)"
            />
          </div>
        </div>
      </div>

      {/* Work eligibility note */}
      <div className="employment-cert-card subtle-card">
        <div className="employment-cert-card-header">
          <h3>Work Eligibility Note</h3>
        </div>
        <p className="legal-text">
          It is the policy of this company to hire only U.S. citizens and aliens
          who are authorized to work in this country. As a condition of
          employment, you will be required to produce original documents
          establishing your identity and authorization to work, and to complete
          the U.S. Citizenship and Immigration Services’ Form I-9.
        </p>
      </div>

      {/* Certification & At-Will Acknowledgement */}
      <div className="employment-cert-card">
        <div className="employment-cert-card-header">
          <h3>Certification &amp; At-Will Acknowledgement</h3>
        </div>

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

        <div className="grid grid-2 employment-cert-signature-row">
          <div className="field">
            <label>Application Date</label>
            <input
              type="date"
              value={form.applicationCertificationDate}
              onChange={(e) =>
                updateField("applicationCertificationDate", e.target.value)
              }
            />
          </div>
          <div className="field">
            <label>Applicant’s Signature</label>
            <input
              type="text"
              value={form.applicationCertificationSignature}
              onChange={(e) =>
                updateField(
                  "applicationCertificationSignature",
                  e.target.value
                )
              }
              placeholder="Type your full name"
            />
            <p className="signature-helper">
              By typing your name, you acknowledge this as your electronic
              signature.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default StepEmploymentCertification;
