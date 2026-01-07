import React, { useMemo } from "react";
import "../../styles/StepAgreement.css";

function StepAgreement({ form, updateField, programUrl }) {
  const handleChange = (field) => (e) => {
    const { type, checked, value } = e.target;
    updateField(field, type === "checkbox" ? checked : value);
  };

  const todayISO = useMemo(() => {
    const d = new Date();
    return d.toISOString().split("T")[0];
  }, []);

  const agreed = !!form.drugAgreementAcknowledge;

  const fillToday = () => {
    if (!form.drugAgreementDate) {
      updateField("drugAgreementDate", todayISO);
    }
  };

  return (
    <section className="form-section agreement-section">
      {/* Header */}
      <div className="agreement-header">
        <div className="agreement-title">
          <h2>
            Agreement to Comply with Geolabs, Inc. Alcohol &amp; Drug Testing
            Program
          </h2>
          <p className="section-help">
            To be completed by all applicants for all positions. Please review
            the statement below and sign to acknowledge your understanding and
            agreement.
          </p>
        </div>

        <div className="agreement-meta">
          <span className="agreement-pill">Required</span>
          {programUrl && (
            <a
              href={programUrl}
              target="_blank"
              rel="noreferrer"
              className="agreement-link"
            >
              View program
            </a>
          )}
        </div>
      </div>

      {/* FULL AGREEMENT TEXT */}
      <div className="agreement-card">
        <p className="legal-text">
          The Company has a vital interest in maintaining a safe, productive,
          and efficient working environment for its employees and the public.
          Using or being under the influence of alcohol and/or drugs on the job
          may pose serious safety and health risks not only for the user, but
          also to co-workers and the public.
        </p>

        <p className="legal-text">
          To meet this compelling interest, and because the Company is required
          to comply with the Department of Transportation&apos;s Illegal Drugs
          and Alcohol Testing Regulations (49 CFR Parts 40 and 382), applicants
          who wish to be considered for employment must agree to submit to
          pre-employment alcohol and drug testing.
        </p>

        <p className="legal-text">
          By completing and signing this Notice and the attached Application for
          Employment, the applicant understands and agrees to submit to alcohol
          and drug testing as provided for in the Company’s Alcohol and Drug
          Program. In addition to pre-employment testing, the program also sets
          forth requirements for reasonable suspicion testing, post-accident
          testing, random testing, return-to-duty testing, and follow-up
          testing. A copy of the program may be obtained from the HR Manager,
          who is also the Designated Employer Representative (DER).
        </p>

        <p className="legal-text">
          I further acknowledge that though Hawai‘i may allow for medical
          marijuana use by prescription, federal law prohibits such use and
          Geolabs, Inc. follows federal law. I understand that if my work
          results in my being covered by DOT regulations, a positive test result
          for marijuana will result in appropriate disciplinary action and
          neither Geolabs, Inc. nor its Medical Review Officer (MRO) will accept
          a medical marijuana prescription to overturn a positive test result
          for marijuana. I understand that if I am not subject to DOT
          regulations and I produce a valid medical marijuana prescription, I
          may be required to work with my physician to transition to a
          medication that is legal under federal law and to comply with all
          other testing and reporting requirements in this policy.
        </p>

        <p className="legal-text agreement-warning">
          ANY APPLICANT WHO IS UNWILLING TO AGREE TO THESE CONDITIONS SHOULD NOT
          APPLY FOR EMPLOYMENT WITH GEOLABS, INC.
        </p>
      </div>

      {/* Acknowledgement */}
      <div className="agreement-ack">
        <label className="agreement-check">
          <input
            type="checkbox"
            checked={agreed}
            onChange={handleChange("drugAgreementAcknowledge")}
          />
          <span>
            I have read, understand, and agree to comply with the Alcohol &amp;
            Drug Testing Program.
          </span>
        </label>
      </div>

      {/* Signature */}
      <div className="agreement-signature-card">
        <div className="agreement-signature-grid">
          <div className="field">
            <label>Signature of Applicant</label>
            <input
              type="text"
              className="signature-input"
              value={form.drugAgreementSignature || ""}
              onChange={handleChange("drugAgreementSignature")}
              placeholder="Type your full legal name"
              disabled={!agreed}
              autoComplete="name"
            />
            <div className="field-help">
              Typing your name serves as your electronic signature.
            </div>
          </div>

          <div className="field">
            <label>Date</label>
            <div className="date-row">
              <input
                type="date"
                className="date-input"
                value={form.drugAgreementDate || ""}
                onChange={handleChange("drugAgreementDate")}
                disabled={!agreed}
              />
              <button
                type="button"
                className="btn subtle"
                onClick={fillToday}
                disabled={!agreed}
              >
                Today
              </button>
            </div>
          </div>
        </div>

        {!agreed && (
          <div className="agreement-lock">
            Please acknowledge the agreement to enable signature and date.
          </div>
        )}
      </div>
    </section>
  );
}

export default StepAgreement;
