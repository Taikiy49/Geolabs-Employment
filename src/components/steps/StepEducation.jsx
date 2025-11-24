// src/components/steps/StepEducation.jsx
import React from "react";

const EDUCATION_LEVELS = [
  { value: "less-than-high-school", label: "Less than high school diploma" },
  { value: "high-school", label: "High school diploma or GED" },
  { value: "some-college", label: "Some college, no degree" },
  { value: "associate", label: "Associate’s degree (AA / AS / AAS)" },
  { value: "bachelor", label: "Bachelor’s degree (BA / BS / BEng / etc.)" },
  { value: "post-bacc-cert", label: "Post-baccalaureate certificate" },
  { value: "master", label: "Master’s degree (MA / MS / MEng / etc.)" },
  { value: "professional", label: "Professional degree (JD / MD / PharmD / etc.)" },
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

    // Custom label text depending on level
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
      degreeLabel = "Degree (e.g., BS Civil Engineering, MS Geotechnical Engineering)";
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
        <h3>{heading}</h3>
        {extraHelp && <p className="section-help">{extraHelp}</p>}

        <div className="grid grid-2">
          <div className="field">
            <label>{schoolLabel}</label>
            <input
              type="text"
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
              value={form.educationDegree || ""}
              onChange={(e) =>
                updateField("educationDegree", e.target.value)
              }
            />
          </div>
          <div className="field">
            <label>Field of Study / Emphasis</label>
            <input
              type="text"
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
          <label>Additional Education (optional)</label>
          <textarea
            rows={3}
            placeholder="List any additional schools, degrees, licenses, or certifications you would like us to consider."
            value={form.educationAdditional || ""}
            onChange={(e) =>
              updateField("educationAdditional", e.target.value)
            }
          />
        </div>
      </div>
    );
  };

  return (
    <section className="form-section">
      <h2>Education</h2>
      <p className="section-help">
        Please select your highest level of education completed and provide
        details. You may list additional education in the optional section.
      </p>

      <div className="field">
        <label>Highest Level of Education Completed</label>
        <select
          value={highestLevel}
          onChange={handleLevelChange}
        >
          <option value="">Select one...</option>
          {EDUCATION_LEVELS.map((level) => (
            <option key={level.value} value={level.value}>
              {level.label}
            </option>
          ))}
        </select>
        <p className="text-muted">
          This should reflect the highest level you have fully completed.
        </p>
      </div>

      {/* Animated-ish card area */}
      <div className="education-details-wrapper">
        {renderDetailsCard()}
      </div>
    </section>
  );
}

export default StepEducation;
