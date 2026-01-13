// src/components/steps/StepAgreement.jsx
import React, { useMemo } from "react";
import "../../styles/StepAgreement.css";
import { ALCOHOL_DRUG_PROGRAM_TEXT } from "../../legal/legalTexts";

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
    if (!form.drugAgreementDate) updateField("drugAgreementDate", todayISO);
  };

  return (
    <section className="form-section agreement-section">
      <div className="agreement-header">
        <div className="agreement-title">
          <h2>Agreement to Comply with Geolabs, Inc. Alcohol &amp; Drug Testing Program</h2>
          <p className="section-help">
            To be completed by all applicants for all positions. Please review the statement below and sign to acknowledge
            your understanding and agreement.
          </p>
        </div>

        <div className="agreement-meta">
          <span className="agreement-pill">Required</span>
          {programUrl ? (
            <a href={programUrl} target="_blank" rel="noreferrer" className="agreement-link">
              View program
            </a>
          ) : null}
        </div>
      </div>

      {/* Exact text (shared single source of truth) */}
      <div className="agreement-card">
        {ALCOHOL_DRUG_PROGRAM_TEXT.split("\n\n").map((p, idx) => (
          <p key={idx} className={`legal-text ${p.includes("ANY APPLICANT") ? "agreement-warning" : ""}`}>
            {p}
          </p>
        ))}
      </div>

      <div className="agreement-ack">
        <label className="agreement-check">
          <input
            type="checkbox"
            checked={agreed}
            onChange={handleChange("drugAgreementAcknowledge")}
          />
          <span>
            I have read, understand, and agree to comply with the Alcohol &amp; Drug Testing Program.
          </span>
        </label>
      </div>

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
            <div className="field-help">Typing your name serves as your electronic signature.</div>
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
              <button type="button" className="btn subtle" onClick={fillToday} disabled={!agreed}>
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
