// src/components/steps/StepEEO.jsx
import React, { useMemo } from "react";
import "../../styles/StepEEO.css";

function StepEEO({ form, updateField, programUrl }) {
  const handleChange = (field) => (e) => updateField(field, e.target.value);

  const todayISO = useMemo(() => {
    const d = new Date();
    return d.toISOString().split("T")[0];
  }, []);

  const fillToday = () => {
    if (!form.eeoDate) updateField("eeoDate", todayISO);
  };

  const clearGender = () => updateField("eeoGender", "");
  const clearEthnicity = () => updateField("eeoEthnicity", "");

  return (
    <section className="form-section eeo-section">
      {/* Header */}
      <div className="eeo-header-row">
        <div className="eeo-title">
          <h2>EEO Voluntary Self-Identification Survey (Applicant Data)</h2>
          <p className="section-help">
            This information is collected for federal EEO-1 reporting purposes only.
            It is voluntary and will not affect your opportunity for employment.
          </p>
        </div>

        <div className="eeo-meta">
          <span className="eeo-chip eeo-chip-voluntary">Voluntary &amp; confidential</span>
          {programUrl ? (
            <a className="eeo-link" href={programUrl} target="_blank" rel="noreferrer">
              Learn more
            </a>
          ) : null}
        </div>
      </div>

      {/* Name + Date */}
      <div className="eeo-top-grid">
        <div className="field">
          <label>Name</label>
          <input
            type="text"
            value={form.eeoName || ""}
            onChange={handleChange("eeoName")}
            placeholder="Optional"
            autoComplete="name"
          />
          <p className="field-hint">You may leave this blank if you prefer not to provide it.</p>
        </div>

        <div className="field">
          <label>Date</label>
          <div className="eeo-date-row">
            <input
              type="date"
              value={form.eeoDate || ""}
              onChange={handleChange("eeoDate")}
              className="eeo-date-input"
            />
            <button type="button" className="btn subtle eeo-today-btn" onClick={fillToday}>
              Today
            </button>
          </div>
          <p className="field-hint">Optional.</p>
        </div>
      </div>

      {/* Intro */}
      <div className="eeo-intro-card">
        <p className="legal-text">
          The Equal Employment Opportunity Commission (EEOC) requires certain employers to complete an EEO-1 report each
          year. Covered employers must invite employees and applicants to self-identify gender and race for this report.
        </p>
        <p className="legal-text">
          Completion of this form is voluntary and your decision to provide or withhold this information will not affect
          your opportunity for employment, or the terms or conditions of your employment. This form will be used for
          EEO-1 reporting purposes only and will be kept separate from all other personnel records and accessed only by
          Human Resources.
        </p>
        <p className="legal-text">
          If you choose not to self-identify at this time, the federal government allows Geolabs, Inc. to determine this
          information by visual survey and/or other available information.
        </p>
      </div>

      {/* Gender */}
      <div className="eeo-card">
        <div className="eeo-card-header">
          <div>
            <h3>Gender</h3>
            <p className="eeo-card-subtitle">Select one option, or choose “I do not wish to disclose.”</p>
          </div>

          <button type="button" className="eeo-clear" onClick={clearGender}>
            Clear
          </button>
        </div>

        <div className="eeo-radio-grid eeo-radio-grid-3">
          <label
            className={`eeo-radio-card ${
              form.eeoGender === "Male" ? "is-selected" : ""
            }`}
          >
            <input
              type="radio"
              name="eeoGender"
              value="Male"
              checked={form.eeoGender === "Male"}
              onChange={handleChange("eeoGender")}
            />
            <span className="eeo-radio-label">Male</span>
          </label>

          <label
            className={`eeo-radio-card ${
              form.eeoGender === "Female" ? "is-selected" : ""
            }`}
          >
            <input
              type="radio"
              name="eeoGender"
              value="Female"
              checked={form.eeoGender === "Female"}
              onChange={handleChange("eeoGender")}
            />
            <span className="eeo-radio-label">Female</span>
          </label>

          <label
            className={`eeo-radio-card ${
              form.eeoGender === "I do not wish to disclose." ? "is-selected" : ""
            }`}
          >
            <input
              type="radio"
              name="eeoGender"
              value="I do not wish to disclose."
              checked={form.eeoGender === "I do not wish to disclose."}
              onChange={handleChange("eeoGender")}
            />
            <span className="eeo-radio-label">I do not wish to disclose.</span>
          </label>
        </div>

        <p className="eeo-footnote">
          This section is voluntary. If you do not wish to answer, you may leave it blank.
        </p>
      </div>

      {/* Race / Ethnicity */}
      <div className="eeo-card">
        <div className="eeo-card-header">
          <div>
            <h3>Race / Ethnicity</h3>
            <p className="eeo-card-subtitle">Select one category that best describes you.</p>
          </div>

          <button type="button" className="eeo-clear" onClick={clearEthnicity}>
            Clear
          </button>
        </div>

        <div className="eeo-radio-stack">
          <label
            className={`eeo-radio-card eeo-radio-long ${
              form.eeoEthnicity === "Hispanic or Latino" ? "is-selected" : ""
            }`}
          >
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
                A person of Cuban, Mexican, Puerto Rican, South or Central American, or other Spanish culture or origin,
                regardless of race.
              </span>
            </span>
          </label>

          <label
            className={`eeo-radio-card eeo-radio-long ${
              form.eeoEthnicity === "White (not Hispanic or Latino)" ? "is-selected" : ""
            }`}
          >
            <input
              type="radio"
              name="eeoEthnicity"
              value="White (not Hispanic or Latino)"
              checked={form.eeoEthnicity === "White (not Hispanic or Latino)"}
              onChange={handleChange("eeoEthnicity")}
            />
            <span className="eeo-option-text">
              <span className="eeo-option-main">White (not Hispanic or Latino)</span>
              <span className="eeo-option-desc">
                A person having origins in any of the original peoples of Europe, the Middle East, or North Africa.
              </span>
            </span>
          </label>

          <label
            className={`eeo-radio-card eeo-radio-long ${
              form.eeoEthnicity === "Black or African American (not Hispanic or Latino)" ? "is-selected" : ""
            }`}
          >
            <input
              type="radio"
              name="eeoEthnicity"
              value="Black or African American (not Hispanic or Latino)"
              checked={form.eeoEthnicity === "Black or African American (not Hispanic or Latino)"}
              onChange={handleChange("eeoEthnicity")}
            />
            <span className="eeo-option-text">
              <span className="eeo-option-main">Black or African American (not Hispanic or Latino)</span>
              <span className="eeo-option-desc">
                A person having origins in any of the Black racial groups of Africa.
              </span>
            </span>
          </label>

          <label
            className={`eeo-radio-card eeo-radio-long ${
              form.eeoEthnicity ===
              "Native Hawaiian or other Pacific Islander (not Hispanic or Latino)"
                ? "is-selected"
                : ""
            }`}
          >
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
                Native Hawaiian or Other Pacific Islander (not Hispanic or Latino)
              </span>
              <span className="eeo-option-desc">
                A person having origins in any of the peoples of Hawaii, Guam, Samoa, or other Pacific Islands.
              </span>
            </span>
          </label>

          <label
            className={`eeo-radio-card eeo-radio-long ${
              form.eeoEthnicity === "Asian (not Hispanic or Latino)" ? "is-selected" : ""
            }`}
          >
            <input
              type="radio"
              name="eeoEthnicity"
              value="Asian (not Hispanic or Latino)"
              checked={form.eeoEthnicity === "Asian (not Hispanic or Latino)"}
              onChange={handleChange("eeoEthnicity")}
            />
            <span className="eeo-option-text">
              <span className="eeo-option-main">Asian (not Hispanic or Latino)</span>
              <span className="eeo-option-desc">
                A person having origins in any of the original peoples of the Far East, Southeast Asia, or the Indian
                Subcontinent (for example, Cambodia, China, India, Japan, Korea, Malaysia, Pakistan, the Philippines,
                Thailand, and Vietnam).
              </span>
            </span>
          </label>

          <label
            className={`eeo-radio-card eeo-radio-long ${
              form.eeoEthnicity ===
              "Native American or Alaskan Native (not Hispanic or Latino)"
                ? "is-selected"
                : ""
            }`}
          >
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
                A person having origins in any of the original peoples of North and South America (including Central
                America), and who maintains tribal affiliation or community attachment.
              </span>
            </span>
          </label>

          <label
            className={`eeo-radio-card eeo-radio-long ${
              form.eeoEthnicity === "Two or More Races (not Hispanic or Latino)" ? "is-selected" : ""
            }`}
          >
            <input
              type="radio"
              name="eeoEthnicity"
              value="Two or More Races (not Hispanic or Latino)"
              checked={form.eeoEthnicity === "Two or More Races (not Hispanic or Latino)"}
              onChange={handleChange("eeoEthnicity")}
            />
            <span className="eeo-option-text">
              <span className="eeo-option-main">Two or More Races (not Hispanic or Latino)</span>
              <span className="eeo-option-desc">
                All persons who identify with more than one of the above five races. (Identifying as Hispanic or Latino
                and only one of the listed race groups does not qualify for this category.)
              </span>
            </span>
          </label>

          <label
            className={`eeo-radio-card eeo-radio-long ${
              form.eeoEthnicity === "I do not wish to disclose." ? "is-selected" : ""
            }`}
          >
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

        <p className="eeo-footnote">
          This section is voluntary. If you do not wish to answer, you may leave it blank.
        </p>
      </div>
    </section>
  );
}

export default StepEEO;
