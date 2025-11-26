import React from "react";
import "../../styles/StepVeteran.css";

function StepVeteran({ form, updateField }) {
  const handleChange = (field) => (e) => {
    updateField(field, e.target.value);
  };

  return (
    <section className="form-section veteran-section">
      {/* Header */}
      <div className="veteran-header">
        <div>
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
          <span>VEVRAA – OFCCP</span>
          <span className="veteran-pill">Voluntary self-identification</span>
        </div>
      </div>

      {/* Intro copy */}
      <div className="veteran-intro">
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
        <h3>Veteran status</h3>

        <div className="veteran-radio-group">
          <label className="veteran-radio">
            <input
              type="radio"
              name="vetStatus"
              value="protected"
              checked={form.vetStatus === "protected"}
              onChange={handleChange("vetStatus")}
            />
            <span>
              I identify as one or more of the following classifications of
              protected veterans:
            </span>
          </label>

          <div className="veteran-definitions-card">
            <p className="legal-text">
              <strong>Disabled Veteran</strong>
            </p>
            <p className="legal-text">
              A. A veteran of the U.S. military, ground, naval or air service
              who is entitled to compensation (or who but for the receipt of
              military retired pay would be entitled to compensation) under laws
              administered by the Secretary of Veterans Affairs, or
            </p>
            <p className="legal-text">
              B. A person who was discharged or released from active duty
              because of a service-connected disability.
            </p>

            <p className="legal-text">
              <strong>Recently Separated Veteran</strong>
            </p>
            <p className="legal-text">
              Any veteran during the three-year period beginning on the date of
              such veteran’s discharge or release from active duty in the U.S.
              military, ground, naval or air service.
            </p>

            <p className="legal-text">
              <strong>Active-Duty Wartime or Campaign Badge Veteran</strong>
            </p>
            <p className="legal-text">
              A veteran who served on active duty in the U.S. military, ground,
              naval or air service during a war, or in a campaign or expedition
              for which a campaign badge has been authorized under the laws
              administered by the Department of Defense.
            </p>

            <p className="legal-text">
              <strong>Armed Forces Service Medal Veteran</strong>
            </p>
            <p className="legal-text">
              A veteran who, while serving on active duty in the U.S. military,
              ground, naval or air service, participated in a United States
              military operation for which an Armed Forces service medal was
              awarded pursuant to Executive Order No. 12985 (61 FR 129, 3 CFR,
              1996 Comp., p. 159).
            </p>
          </div>

          <label className="veteran-radio">
            <input
              type="radio"
              name="vetStatus"
              value="notProtected"
              checked={form.vetStatus === "notProtected"}
              onChange={handleChange("vetStatus")}
            />
            <span>I am not a protected veteran</span>
          </label>

          <label className="veteran-radio">
            <input
              type="radio"
              name="vetStatus"
              value="noAnswer"
              checked={form.vetStatus === "noAnswer"}
              onChange={handleChange("vetStatus")}
            />
            <span>I do not wish to self-identify</span>
          </label>
        </div>
      </div>

      {/* Signature row */}
      <div className="grid grid-2 veteran-signature-row">
        <div className="field">
          <label>Signature of Applicant</label>
          <input
            type="text"
            placeholder="Type your full name"
            value={form.vetName || ""}
            onChange={handleChange("vetName")}
          />
        </div>
        <div className="field">
          <label>Date</label>
          <input
            type="date"
            value={form.vetDate || ""}
            onChange={handleChange("vetDate")}
          />
        </div>
      </div>
    </section>
  );
}

export default StepVeteran;
