import React from "react";

function StepEEO({ form, updateField }) {
  return (
    <section className="form-section">
      <h2>EEO Voluntary Self-Identification Survey (Applicant Data)</h2>

      <div className="grid grid-2">
        <div className="field">
          <label>Name</label>
          <input
            type="text"
            value={form.eeoName}
            onChange={(e) => updateField("eeoName", e.target.value)}
          />
        </div>
        <div className="field">
          <label>Date</label>
          <input
            type="date"
            value={form.eeoDate}
            onChange={(e) => updateField("eeoDate", e.target.value)}
          />
        </div>
      </div>

      <p className="legal-text">
        The Equal Employment Opportunity Commission (EEOC) requires all private
        employers with 100 or more employees as well as federal contractors and
        first-tier subcontractors with 50 or more employees AND contracts of at
        least $50,000 complete an EEO-1 report each year. Covered employers must
        invite employees to self-identify gender and race for this report.
      </p>

      <p className="legal-text">
        Completion of this form is voluntary and your choice to complete it will
        not affect your opportunity for employment, or the terms or conditions
        of your employment. This form will be used for EEO-1 reporting purposes
        only and will be kept separate from all other personnel records only
        accessed by the Human Resources department.
      </p>

      <p className="legal-text">
        If you choose not to self-identify at this time, the federal government
        requires Geolabs, Inc. to determine this information by visual survey
        and/or other available information.
      </p>

      <section className="form-section">
        <h3>GENDER: (Check ONE of the options)</h3>
        <div className="grid grid-3">
          <label className="checkbox-field">
            <input
              type="radio"
              name="eeoGender"
              value="Male"
              checked={form.eeoGender === "Male"}
              onChange={(e) => updateField("eeoGender", e.target.value)}
            />
            Male
          </label>
          <label className="checkbox-field">
            <input
              type="radio"
              name="eeoGender"
              value="Female"
              checked={form.eeoGender === "Female"}
              onChange={(e) => updateField("eeoGender", e.target.value)}
            />
            Female
          </label>
        </div>
      </section>

      <section className="form-section">
        <h3>ETHNICITY: (Check ONE category only)</h3>

        <div className="field">
          <label className="checkbox-field">
            <input
              type="radio"
              name="eeoEthnicity"
              value="Hispanic or Latino"
              checked={form.eeoEthnicity === "Hispanic or Latino"}
              onChange={(e) => updateField("eeoEthnicity", e.target.value)}
            />
            Hispanic or Latino: A person of Cuban, Mexican, Puerto Rican, South
            or Central American, of other Spanish culture or origin, regardless
            of race.
          </label>
        </div>

        <div className="field">
          <label className="checkbox-field">
            <input
              type="radio"
              name="eeoEthnicity"
              value="White (not Hispanic or Latino)"
              checked={
                form.eeoEthnicity === "White (not Hispanic or Latino)"
              }
              onChange={(e) => updateField("eeoEthnicity", e.target.value)}
            />
            White (not Hispanic or Latino: A person having origins in any of the
            original peoples of Europe, Middle East or North Africa.
          </label>
        </div>

        <div className="field">
          <label className="checkbox-field">
            <input
              type="radio"
              name="eeoEthnicity"
              value="Black or African American (not Hispanic or Latino)"
              checked={
                form.eeoEthnicity ===
                "Black or African American (not Hispanic or Latino)"
              }
              onChange={(e) => updateField("eeoEthnicity", e.target.value)}
            />
            Black or African American (not Hispanic or Latino): A person having
            origins in any of the black racial groups of Africa.
          </label>
        </div>

        <div className="field">
          <label className="checkbox-field">
            <input
              type="radio"
              name="eeoEthnicity"
              value="Native Hawaiian or other Pacific Islander (not Hispanic or Latino)"
              checked={
                form.eeoEthnicity ===
                "Native Hawaiian or other Pacific Islander (not Hispanic or Latino)"
              }
              onChange={(e) => updateField("eeoEthnicity", e.target.value)}
            />
            Native Hawaiian or other Pacific Islander (not Hispanic or Latino):
            A person having origins in any of the peoples of Hawaii, Guam,
            Samoa, or other Pacific Islands.
          </label>
        </div>

        <div className="field">
          <label className="checkbox-field">
            <input
              type="radio"
              name="eeoEthnicity"
              value="Asian (not Hispanic or Latino)"
              checked={form.eeoEthnicity === "Asian (not Hispanic or Latino)"}
              onChange={(e) => updateField("eeoEthnicity", e.target.value)}
            />
            Asian (not Hispanic or Latino): A person having origins in any of
            the original peoples of the Far East, Southeast Asia, or the Indian
            Subcontinent, including, for example, Cambodia, China, India, Japan,
            Korea, Malaysia, Pakistan, the Philippine Islands, Thailand, and
            Vietnam.
          </label>
        </div>

        <div className="field">
          <label className="checkbox-field">
            <input
              type="radio"
              name="eeoEthnicity"
              value="Native American or Alaskan Native (not Hispanic or Latino)"
              checked={
                form.eeoEthnicity ===
                "Native American or Alaskan Native (not Hispanic or Latino)"
              }
              onChange={(e) => updateField("eeoEthnicity", e.target.value)}
            />
            Native American or Alaskan Native (not Hispanic or Latino): A person
            having origins in any of the original peoples of North and South
            America (including Central America), and who maintain tribal
            affiliation or community attachment.
          </label>
        </div>

        <div className="field">
          <label className="checkbox-field">
            <input
              type="radio"
              name="eeoEthnicity"
              value="Two or More Races (not Hispanic or Latino)"
              checked={
                form.eeoEthnicity ===
                "Two or More Races (not Hispanic or Latino)"
              }
              onChange={(e) => updateField("eeoEthnicity", e.target.value)}
            />
            Two or More Races (not Hispanic or Latino): All persons who identify
            with more than one of the above five races. (For the purpose of this
            group, identifying as Hispanic or Latino and only one of the listed
            five race groups does not qualify)
          </label>
        </div>

        <div className="field">
          <label className="checkbox-field">
            <input
              type="radio"
              name="eeoEthnicity"
              value="I do not wish to disclose."
              checked={form.eeoEthnicity === "I do not wish to disclose."}
              onChange={(e) => updateField("eeoEthnicity", e.target.value)}
            />
            I do not wish to disclose.
          </label>
        </div>
      </section>
    </section>
  );
}

export default StepEEO;
