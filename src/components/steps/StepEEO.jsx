// src/components/steps/StepEEO.jsx
import React from "react";
import "../../styles/StepEEO.css";

function StepEEO({ form, updateField }) {
  const handleChange = (field) => (e) => updateField(field, e.target.value);

  return (
    <section className="form-section eeo-section">
      {/* Header */}
      <div className="eeo-header-row">
        <div>
          <h2>EEO Voluntary Self-Identification Survey (Applicant Data)</h2>
          <p className="section-help">
            This information is collected for federal EEO-1 reporting purposes
            only. It is voluntary and will not affect your opportunity for
            employment.
          </p>
        </div>

        <div className="eeo-meta">
          <span className="eeo-chip eeo-chip-voluntary">
            Voluntary &amp; confidential
          </span>
        </div>
      </div>

      {/* Name + Date */}
      <div className="grid grid-2 eeo-name-row">
        <div className="field">
          <label>Name</label>
          <input
            type="text"
            value={form.eeoName || ""}
            onChange={handleChange("eeoName")}
            placeholder="Optional"
          />
          <p className="field-hint">
            You may leave this blank if you prefer not to provide it.
          </p>
        </div>

        <div className="field">
          <label>Date</label>
          <input
            type="date"
            value={form.eeoDate || ""}
            onChange={handleChange("eeoDate")}
          />
          <p className="field-hint">Optional.</p>
        </div>
      </div>

      {/* Intro */}
      <div className="eeo-intro-card">
        <p className="legal-text">
          The Equal Employment Opportunity Commission (EEOC) requires certain
          employers to complete an EEO-1 report each year. Covered employers
          must invite employees and applicants to self-identify gender and race
          for this report.
        </p>
        <p className="legal-text">
          Completion of this form is voluntary and your decision to provide or
          withhold this information will not affect your opportunity for
          employment, or the terms or conditions of your employment. This form
          will be used for EEO-1 reporting purposes only and will be kept
          separate from all other personnel records and accessed only by Human
          Resources.
        </p>
        <p className="legal-text">
          If you choose not to self-identify at this time, the federal
          government allows Geolabs, Inc. to determine this information by
          visual survey and/or other available information.
        </p>
      </div>

      {/* Gender */}
      <div className="eeo-card">
        <div className="eeo-card-header">
          <h3>Gender</h3>
          <p className="eeo-card-subtitle">
            Select one option, or choose “I do not wish to disclose.”
          </p>
        </div>

        <div className="eeo-radio-group eeo-radio-group-inline">
          <label className="eeo-radio">
            <input
              type="radio"
              name="eeoGender"
              value="Male"
              checked={form.eeoGender === "Male"}
              onChange={handleChange("eeoGender")}
            />
            <span>Male</span>
          </label>

          <label className="eeo-radio">
            <input
              type="radio"
              name="eeoGender"
              value="Female"
              checked={form.eeoGender === "Female"}
              onChange={handleChange("eeoGender")}
            />
            <span>Female</span>
          </label>

          <label className="eeo-radio">
            <input
              type="radio"
              name="eeoGender"
              value="I do not wish to disclose."
              checked={form.eeoGender === "I do not wish to disclose."}
              onChange={handleChange("eeoGender")}
            />
            <span>I do not wish to disclose.</span>
          </label>
        </div>
      </div>

      {/* Race / Ethnicity */}
      <div className="eeo-card">
        <div className="eeo-card-header">
          <h3>Race / Ethnicity</h3>
          <p className="eeo-card-subtitle">
            Select one category that best describes you.
          </p>
        </div>

        <div className="eeo-radio-group">
          <label className="eeo-radio eeo-radio-long">
            <input
              type="radio"
              name="eeoEthnicity"
              value="Hispanic or Latino"
              checked={form.eeoEthnicity === "Hispanic or Latino"}
              onChange={handleChange("eeoEthnicity")}
            />
            <span className="eeo-option-text">
              <span className="eeo-option-main">Hispanic or Latino</span>
              <span className="eeo-option-desc">
                A person of Cuban, Mexican, Puerto Rican, South or Central
                American, or other Spanish culture or origin, regardless of
                race.
              </span>
            </span>
          </label>

          <label className="eeo-radio eeo-radio-long">
            <input
              type="radio"
              name="eeoEthnicity"
              value="White (not Hispanic or Latino)"
              checked={form.eeoEthnicity === "White (not Hispanic or Latino)"}
              onChange={handleChange("eeoEthnicity")}
            />
            <span className="eeo-option-text">
              <span className="eeo-option-main">
                White (not Hispanic or Latino)
              </span>
              <span className="eeo-option-desc">
                A person having origins in any of the original peoples of
                Europe, the Middle East, or North Africa.
              </span>
            </span>
          </label>

          <label className="eeo-radio eeo-radio-long">
            <input
              type="radio"
              name="eeoEthnicity"
              value="Black or African American (not Hispanic or Latino)"
              checked={
                form.eeoEthnicity ===
                "Black or African American (not Hispanic or Latino)"
              }
              onChange={handleChange("eeoEthnicity")}
            />
            <span className="eeo-option-text">
              <span className="eeo-option-main">
                Black or African American (not Hispanic or Latino)
              </span>
              <span className="eeo-option-desc">
                A person having origins in any of the Black racial groups of
                Africa.
              </span>
            </span>
          </label>

          <label className="eeo-radio eeo-radio-long">
            <input
              type="radio"
              name="eeoEthnicity"
              value="Native Hawaiian or other Pacific Islander (not Hispanic or Latino)"
              checked={
                form.eeoEthnicity ===
                "Native Hawaiian or other Pacific Islander (not Hispanic or Latino)"
              }
              onChange={handleChange("eeoEthnicity")}
            />
            <span className="eeo-option-text">
              <span className="eeo-option-main">
                Native Hawaiian or Other Pacific Islander (not Hispanic or
                Latino)
              </span>
              <span className="eeo-option-desc">
                A person having origins in any of the peoples of Hawaii, Guam,
                Samoa, or other Pacific Islands.
              </span>
            </span>
          </label>

          <label className="eeo-radio eeo-radio-long">
            <input
              type="radio"
              name="eeoEthnicity"
              value="Asian (not Hispanic or Latino)"
              checked={form.eeoEthnicity === "Asian (not Hispanic or Latino)"}
              onChange={handleChange("eeoEthnicity")}
            />
            <span className="eeo-option-text">
              <span className="eeo-option-main">
                Asian (not Hispanic or Latino)
              </span>
              <span className="eeo-option-desc">
                A person having origins in any of the original peoples of the
                Far East, Southeast Asia, or the Indian Subcontinent (for
                example, Cambodia, China, India, Japan, Korea, Malaysia,
                Pakistan, the Philippines, Thailand, and Vietnam).
              </span>
            </span>
          </label>

          <label className="eeo-radio eeo-radio-long">
            <input
              type="radio"
              name="eeoEthnicity"
              value="Native American or Alaskan Native (not Hispanic or Latino)"
              checked={
                form.eeoEthnicity ===
                "Native American or Alaskan Native (not Hispanic or Latino)"
              }
              onChange={handleChange("eeoEthnicity")}
            />
            <span className="eeo-option-text">
              <span className="eeo-option-main">
                Native American or Alaska Native (not Hispanic or Latino)
              </span>
              <span className="eeo-option-desc">
                A person having origins in any of the original peoples of North
                and South America (including Central America), and who maintains
                tribal affiliation or community attachment.
              </span>
            </span>
          </label>

          <label className="eeo-radio eeo-radio-long">
            <input
              type="radio"
              name="eeoEthnicity"
              value="Two or More Races (not Hispanic or Latino)"
              checked={
                form.eeoEthnicity ===
                "Two or More Races (not Hispanic or Latino)"
              }
              onChange={handleChange("eeoEthnicity")}
            />
            <span className="eeo-option-text">
              <span className="eeo-option-main">
                Two or More Races (not Hispanic or Latino)
              </span>
              <span className="eeo-option-desc">
                All persons who identify with more than one of the above five
                races. (Identifying as Hispanic or Latino and only one of the
                listed race groups does not qualify for this category.)
              </span>
            </span>
          </label>

          <label className="eeo-radio eeo-radio-long">
            <input
              type="radio"
              name="eeoEthnicity"
              value="I do not wish to disclose."
              checked={form.eeoEthnicity === "I do not wish to disclose."}
              onChange={handleChange("eeoEthnicity")}
            />
            <span className="eeo-option-text">
              <span className="eeo-option-main">I do not wish to disclose.</span>
            </span>
          </label>
        </div>
      </div>
    </section>
  );
}

export default StepEEO;
