// src/components/steps/StepEducation.jsx
import React from "react";
import "../../styles/StepEducation.css";

const EDUCATION_LEVELS = [
  { value: "less-than-high-school", label: "Less than high school diploma" },
  { value: "high-school", label: "High school diploma or GED" },
  { value: "some-college", label: "Some college, no degree" },
  { value: "associate", label: "Associate’s degree (AA / AS / AAS)" },
  { value: "bachelor", label: "Bachelor’s degree (BA / BS / BEng / etc.)" },
  { value: "post-bacc-cert", label: "Post-baccalaureate certificate" },
  { value: "master", label: "Master’s degree (MA / MS / MEng / etc.)" },
  {
    value: "professional",
    label: "Professional degree (JD / MD / PharmD / etc.)",
  },
  { value: "doctorate", label: "Doctorate (PhD / EdD / etc.)" },
  { value: "trade-vocational", label: "Trade / technical / vocational program" },
  { value: "other", label: "Other" },
];

function StepEducation({ form, updateField }) {
  const highestLevel = form.highestEducationLevel || "";

  const handleLevelChange = (e) => {
    const value = e.target.value;
    updateField("highestEducationLevel", value);
  };

  const renderDetailsCard = () => {
    if (!highestLevel) {
      return (
        <p className="text-muted education-hint">
          Select your highest level of education above to enter school details.
        </p>
      );
    }

    let heading = "Education Details";
    let schoolLabel = "School Name & Location";
    let degreeLabel = "Degree / Diploma or Program";
    let extraHelp = "";

    if (highestLevel === "less-than-high-school") {
      heading = "Education Details (Less than High School)";
      schoolLabel = "Last School Attended & Location";
      degreeLabel = "Highest Grade Completed";
      extraHelp =
        "Example: “10th grade”, “11th grade”, etc. If you attended multiple schools, list the most recent.";
    } else if (highestLevel === "high-school") {
      heading = "Education Details (High School / GED)";
      schoolLabel = "High School or GED Program Name & Location";
      degreeLabel = "Diploma Type (e.g., High School Diploma / GED)";
    } else if (highestLevel === "some-college") {
      heading = "Education Details (Some College)";
      schoolLabel = "College / University Name & Location";
      degreeLabel = "Program or Major (if applicable)";
      extraHelp =
        "If you attended more than one college, list the most recent or the one with the most credits.";
    } else if (
      highestLevel === "associate" ||
      highestLevel === "bachelor" ||
      highestLevel === "post-bacc-cert" ||
      highestLevel === "master" ||
      highestLevel === "professional" ||
      highestLevel === "doctorate"
    ) {
      heading = "Education Details (College / Graduate / Professional)";
      schoolLabel = "College / University Name & Location";
      degreeLabel =
        "Degree (e.g., BS Civil Engineering, MS Geotechnical Engineering)";
    } else if (highestLevel === "trade-vocational") {
      heading = "Education Details (Trade / Technical / Vocational)";
      schoolLabel = "School / Training Program Name & Location";
      degreeLabel = "Program or Certification";
    } else if (highestLevel === "other") {
      heading = "Education Details (Other)";
      schoolLabel = "School / Program Name & Location";
      degreeLabel = "Degree / Certificate / Program";
    }

    return (
      <div className="education-details-card">
        <div className="education-card-header">
          <div>
            <h3>{heading}</h3>
            {extraHelp && <p className="section-help">{extraHelp}</p>}
          </div>
          <span className="edu-chip edu-chip-summary">
            Tailored to:{" "}
            <span className="edu-chip-label">
              {
                (EDUCATION_LEVELS.find((l) => l.value === highestLevel) || {})
                  .label
              }
            </span>
          </span>
        </div>

        <div className="grid grid-2">
          <div className="field">
            <label>{schoolLabel}</label>
            <input
              type="text"
              placeholder="School or program name and location"
              value={form.educationSchoolName || ""}
              onChange={(e) =>
                updateField("educationSchoolName", e.target.value)
              }
            />
          </div>
          <div className="field">
            <label>City / State (or Country)</label>
            <input
              type="text"
              placeholder="e.g., Honolulu, HI or Tokyo, Japan"
              value={form.educationSchoolLocation || ""}
              onChange={(e) =>
                updateField("educationSchoolLocation", e.target.value)
              }
            />
          </div>
        </div>

        <div className="grid grid-3">
          <div className="field">
            <label>{degreeLabel}</label>
            <input
              type="text"
              placeholder="e.g., BS Computer Science, GED, HVAC Certification"
              value={form.educationDegree || ""}
              onChange={(e) => updateField("educationDegree", e.target.value)}
            />
          </div>
          <div className="field">
            <label>Field of Study / Emphasis</label>
            <input
              type="text"
              placeholder="e.g., Structural Engineering, Accounting"
              value={form.educationFieldOfStudy || ""}
              onChange={(e) =>
                updateField("educationFieldOfStudy", e.target.value)
              }
            />
          </div>
          <div className="field">
            <label>Graduation Year or Years Attended</label>
            <input
              type="text"
              placeholder="e.g., 2023 or 2019–2022"
              value={form.educationYears || ""}
              onChange={(e) => updateField("educationYears", e.target.value)}
            />
          </div>
        </div>

        <div className="field">
          <label>
            Additional Education{" "}
            <span className="optional-tag">(optional)</span>
          </label>
          <textarea
            rows={3}
            placeholder="List any additional schools, degrees, licenses, or certifications you would like us to consider."
            value={form.educationAdditional || ""}
            onChange={(e) =>
              updateField("educationAdditional", e.target.value)
            }
          />
          <p className="field-hint">
            You can also include in-progress programs or professional licenses
            here.
          </p>
        </div>
      </div>
    );
  };

  return (
    <div className="form-step education-step">
      <section className="form-section education-section">
        <div className="education-header-row">
          <div>
            <h2>Education</h2>
            <p className="section-help">
              Tell us about your education background. Start with your highest
              level completed; you can optionally add more details below.
            </p>
          </div>
          <div className="education-meta">
            <span className="edu-chip edu-chip-step">Step 4</span>
            <span className="edu-chip edu-chip-required">Required section</span>
          </div>
        </div>

        <div className="field">
          <label>Highest Level of Education Completed</label>
          <select value={highestLevel} onChange={handleLevelChange}>
            <option value="">Select one...</option>
            {EDUCATION_LEVELS.map((level) => (
              <option key={level.value} value={level.value}>
                {level.label}
              </option>
            ))}
          </select>
          <p className="text-muted education-subnote">
            This should reflect the highest level you have fully completed.
          </p>
        </div>

        <div className="education-details-wrapper">{renderDetailsCard()}</div>
      </section>
    </div>
  );
}

export default StepEducation;
