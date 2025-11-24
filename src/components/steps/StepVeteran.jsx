import React from "react";

function StepVeteran({ form, updateField }) {
  return (
    <section className="form-section">
      <h2>
        Affirmative Action: Applicant Invitation to Self-Identify as a Protected
        Veteran (VEVRAA)
      </h2>

      <p className="legal-text">
        Under the regulations implementing the affirmative action provisions of
        the Vietnam Era Veterans’ Readjustment Assistance Act (VEVRAA) of 1972
        issued by the Office of Federal Contract Compliance Programs (OFCCP), a
        federal contractor is required to invite applicants and current
        employees to inform the contractor whether they are veterans belonging
        to one or more of the categories of veterans covered under VEVRAA who
        wish to benefit under the contractor’s affirmative action program (AAP)
        for covered veterans.
      </p>

      <p className="legal-text">
        In extending this invitation, we advise you that: (a) workers and
        applicants are under no obligation to respond but may do so in the
        future if they choose; (b) responses will remain confidential within the
        human resource department; and (c) responses will be used only for the
        necessary information to include in our affirmative action plan.
      </p>

      <p className="legal-text">
        Refusal to provide this information will have no bearing on your
        application and will not subject you to any adverse treatment.
      </p>

      <p className="legal-text">
        Please complete the information requested below. Thank you for your
        cooperation.
      </p>

      <div className="form-section">
        <h3>Veteran Status</h3>

        <div className="field">
          <label className="checkbox-field">
            <input
              type="radio"
              name="vetStatus"
              value="protected"
              checked={form.vetStatus === "protected"}
              onChange={(e) => updateField("vetStatus", e.target.value)}
            />
            I identify as one or more of the following classifications of
            protected veterans:
          </label>
        </div>

        <div className="field legal-text" style={{ paddingLeft: "1.5rem" }}>
          <p>• Disabled Veteran:</p>
          <p>
            A. A veteran of the U.S. military, ground, naval or air service who
            is entitled to compensation (or who but for the receipt of military
            retired pay would be entitled to compensation) under laws
            administered by the Secretary of Veterans Affairs, or
          </p>
          <p>
            B. A person who was discharged or released from active duty because
            of a service-connected disability.
          </p>

          <p>• Recently separated veteran:</p>
          <p>
            Any veteran during the three-year period beginning on the date of
            such veteran’s discharge or release from active duty in the U.S.
            military, ground, naval or air service.
          </p>

          <p>• Active-duty wartime or campaign badge veteran:</p>
          <p>
            A veteran who served on active duty in the U.S. military, ground,
            naval or air service during a war, or in a campaign or expedition
            for which a campaign badge has been authorized under the laws
            administered by the Department of Defense.
          </p>

          <p>• Armed Forces Service Medal Veteran:</p>
          <p>
            A veteran who, while serving on active duty in the U.S. military,
            ground, naval or air service, participated in a United States
            military operation for which an Armed Forces service medal was
            awarded pursuant to Executive Order No. 12985 (61FR 129, 3 CFR, 1996
            Comp., p. 159).
          </p>
        </div>

        <div className="field">
          <label className="checkbox-field">
            <input
              type="radio"
              name="vetStatus"
              value="notProtected"
              checked={form.vetStatus === "notProtected"}
              onChange={(e) => updateField("vetStatus", e.target.value)}
            />
            I am not a protected veteran
          </label>
        </div>

        <div className="field">
          <label className="checkbox-field">
            <input
              type="radio"
              name="vetStatus"
              value="noAnswer"
              checked={form.vetStatus === "noAnswer"}
              onChange={(e) => updateField("vetStatus", e.target.value)}
            />
            I do not wish to self-identify
          </label>
        </div>
      </div>

      <div className="grid grid-2">
        <div className="field">
          <label>Print Name / Signature</label>
          <input
            type="text"
            value={form.vetName}
            onChange={(e) => updateField("vetName", e.target.value)}
          />
        </div>
        <div className="field">
          <label>Date</label>
          <input
            type="date"
            value={form.vetDate}
            onChange={(e) => updateField("vetDate", e.target.value)}
          />
        </div>
      </div>
    </section>
  );
}

export default StepVeteran;
