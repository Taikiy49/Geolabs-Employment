// src/components/steps/StepVeteran.jsx
import React, { useMemo } from "react";
import "../../styles/StepVeteran.css";

function StepVeteran({ form, updateField }) {
  const handleChange = (field) => (e) => updateField(field, e.target.value);

  const todayISO = useMemo(() => {
    const d = new Date();
    return d.toISOString().split("T")[0];
  }, []);

  const fillToday = () => {
    if (!form.vetDate) updateField("vetDate", todayISO);
  };

  const clearStatus = () => updateField("vetStatus", "");

  const showDefinitions = form.vetStatus === "protected";

  return (
    <section className="form-section veteran-section">
      {/* Header */}
      <div className="veteran-header">
        <div className="veteran-title">
          <h2>
            Affirmative Action: Invitation to Self-Identify as a Protected
            Veteran (VEVRAA)
          </h2>
          <p className="section-help">
            This information is collected for affirmative action reporting only.
            Your decision to self-identify (now or later) is voluntary and will
            not affect your application or employment.
          </p>
        </div>

        <div className="veteran-meta">
          <span className="veteran-meta-line">VEVRAA – OFCCP</span>
          <span className="veteran-pill">Voluntary self-identification</span>
        </div>
      </div>

      {/* Intro copy (clean card like others) */}
      <div className="veteran-intro-card">
        <p className="legal-text">
          Under the regulations implementing the affirmative action provisions
          of the Vietnam Era Veterans’ Readjustment Assistance Act (VEVRAA) of
          1972 issued by the Office of Federal Contract Compliance Programs
          (OFCCP), federal contractors are required to invite applicants and
          current employees to inform the contractor whether they are veterans
          belonging to one or more of the categories of veterans covered under
          VEVRAA who wish to benefit under the contractor’s affirmative action
          program (AAP) for covered veterans.
        </p>
        <p className="legal-text">
          In extending this invitation, we advise you that: (a) workers and
          applicants are under no obligation to respond but may do so in the
          future if they choose; (b) responses will remain confidential within
          the Human Resources department; and (c) responses will be used only
          for the necessary information to include in our affirmative action
          plan.
        </p>
        <p className="legal-text">
          Refusal to provide this information will have no bearing on your
          application and will not subject you to any adverse treatment.
        </p>
        <p className="legal-text">
          Please review the definitions below and then select the option that
          best applies to you.
        </p>
      </div>

      {/* Main card */}
      <div className="veteran-card">
        <div className="veteran-card-header">
          <div>
            <h3>Veteran status</h3>
            <p className="veteran-subtitle">
              Select one option, or choose “I do not wish to self-identify.”
            </p>
          </div>

          <button type="button" className="veteran-clear" onClick={clearStatus}>
            Clear
          </button>
        </div>

        <div className="veteran-radio-stack">
          <label
            className={`veteran-radio-card ${
              form.vetStatus === "protected" ? "is-selected" : ""
            }`}
          >
            <input
              type="radio"
              name="vetStatus"
              value="protected"
              checked={form.vetStatus === "protected"}
              onChange={handleChange("vetStatus")}
            />
            <span className="veteran-option">
              <span className="veteran-option-main">
                I identify as one or more classifications of protected veterans
              </span>
              <span className="veteran-option-desc">
                Includes Disabled Veteran, Recently Separated Veteran,
                Active-Duty Wartime/Campaign Badge Veteran, or Armed Forces
                Service Medal Veteran.
              </span>
            </span>
          </label>

          {/* Collapsible definitions - only open when protected is selected */}
          <details className="veteran-definitions" open={showDefinitions}>
            <summary className="veteran-definitions-summary">
              Definitions of protected veteran categories
              <span className="veteran-definitions-hint">
                (expand/collapse)
              </span>
            </summary>

            <div className="veteran-definitions-card">
              <p className="legal-text">
                <strong>Disabled Veteran</strong>
              </p>
              <p className="legal-text">
                A. A veteran of the U.S. military, ground, naval or air service
                who is entitled to compensation (or who but for the receipt of
                military retired pay would be entitled to compensation) under
                laws administered by the Secretary of Veterans Affairs, or
              </p>
              <p className="legal-text">
                B. A person who was discharged or released from active duty
                because of a service-connected disability.
              </p>

              <p className="legal-text">
                <strong>Recently Separated Veteran</strong>
              </p>
              <p className="legal-text">
                Any veteran during the three-year period beginning on the date
                of such veteran’s discharge or release from active duty in the
                U.S. military, ground, naval or air service.
              </p>

              <p className="legal-text">
                <strong>Active-Duty Wartime or Campaign Badge Veteran</strong>
              </p>
              <p className="legal-text">
                A veteran who served on active duty in the U.S. military,
                ground, naval or air service during a war, or in a campaign or
                expedition for which a campaign badge has been authorized under
                the laws administered by the Department of Defense.
              </p>

              <p className="legal-text">
                <strong>Armed Forces Service Medal Veteran</strong>
              </p>
              <p className="legal-text">
                A veteran who, while serving on active duty in the U.S.
                military, ground, naval or air service, participated in a
                United States military operation for which an Armed Forces
                service medal was awarded pursuant to Executive Order No. 12985
                (61 FR 129, 3 CFR, 1996 Comp., p. 159).
              </p>
            </div>
          </details>

          <label
            className={`veteran-radio-card ${
              form.vetStatus === "notProtected" ? "is-selected" : ""
            }`}
          >
            <input
              type="radio"
              name="vetStatus"
              value="notProtected"
              checked={form.vetStatus === "notProtected"}
              onChange={handleChange("vetStatus")}
            />
            <span className="veteran-option">
              <span className="veteran-option-main">I am not a protected veteran</span>
            </span>
          </label>

          <label
            className={`veteran-radio-card ${
              form.vetStatus === "noAnswer" ? "is-selected" : ""
            }`}
          >
            <input
              type="radio"
              name="vetStatus"
              value="noAnswer"
              checked={form.vetStatus === "noAnswer"}
              onChange={handleChange("vetStatus")}
            />
            <span className="veteran-option">
              <span className="veteran-option-main">I do not wish to self-identify</span>
            </span>
          </label>
        </div>
      </div>

      {/* Signature */}
      <div className="veteran-signature-card">
        <div className="veteran-signature-grid">
          <div className="field">
            <label>Signature of Applicant</label>
            <input
              type="text"
              className="veteran-signature-input"
              placeholder="Type your full name"
              value={form.vetName || ""}
              onChange={handleChange("vetName")}
              autoComplete="name"
            />
            <p className="field-hint">
              By typing your name, you acknowledge this as your electronic signature.
            </p>
          </div>

          <div className="field">
            <label>Date</label>
            <div className="veteran-date-row">
              <input
                type="date"
                className="veteran-date-input"
                value={form.vetDate || ""}
                onChange={handleChange("vetDate")}
              />
              <button type="button" className="btn subtle veteran-today-btn" onClick={fillToday}>
                Today
              </button>
            </div>
            <p className="field-hint">Optional.</p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default StepVeteran;
