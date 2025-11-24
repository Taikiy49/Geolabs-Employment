import React from "react";

function StepSkills({ form, updateField }) {
  return (
    <section className="form-section">
      <h2>Skills</h2>
      <p className="section-help">
        Share the skills, tools, and experience that are most relevant to the position.
      </p>

      {/* Quick overview */}
      <div className="grid grid-2">
        <div className="field">
          <label>Years of Relevant Experience</label>
          <input
            type="text"
            placeholder="e.g., 0–1, 2–3, 4+"
            value={form.skillsYearsExperience || ""}
            onChange={(e) =>
              updateField("skillsYearsExperience", e.target.value)
            }
          />
        </div>
        <div className="field">
          <label>Primary Area(s) of Focus</label>
          <input
            type="text"
            placeholder="e.g., Geotechnical, Field Testing, Lab Testing, Drafting"
            value={form.skillsPrimaryFocus || ""}
            onChange={(e) =>
              updateField("skillsPrimaryFocus", e.target.value)
            }
          />
        </div>
      </div>

      {/* Technical / tools */}
      <div className="grid grid-2">
        <div className="field">
          <label>Technical Skills & Tools</label>
          <textarea
            rows={3}
            placeholder="e.g., soil classification, compaction testing, concrete testing, drilling support, construction observation, materials sampling…"
            value={form.skillsTechnical || ""}
            onChange={(e) =>
              updateField("skillsTechnical", e.target.value)
            }
          />
        </div>
        <div className="field">
          <label>Software & Programs</label>
          <textarea
            rows={3}
            placeholder="e.g., Microsoft Office (Word, Excel, Outlook), Adobe Acrobat, CAD, GIS, data entry systems, field reporting apps…"
            value={form.skillsSoftware || ""}
            onChange={(e) =>
              updateField("skillsSoftware", e.target.value)
            }
          />
        </div>
      </div>

      {/* Field / lab + communication */}
      <div className="grid grid-2">
        <div className="field">
          <label>Field / Laboratory Experience</label>
          <textarea
            rows={3}
            placeholder="Describe any field work, laboratory testing, inspection, or construction monitoring experience."
            value={form.skillsFieldLab || ""}
            onChange={(e) =>
              updateField("skillsFieldLab", e.target.value)
            }
          />
        </div>
        <div className="field">
          <label>Communication & Team Skills</label>
          <textarea
            rows={3}
            placeholder="e.g., report writing, data summarizing, working with engineers, communicating with contractors or clients, teamwork, safety awareness…"
            value={form.skillsCommunication || ""}
            onChange={(e) =>
              updateField("skillsCommunication", e.target.value)
            }
          />
        </div>
      </div>

      {/* Certifications */}
      <div className="field">
        <label>Certifications, Licenses, or Training (if any)</label>
        <textarea
          rows={3}
          placeholder="e.g., OSHA 10/30, ACI, NICET, ISTC, first aid/CPR, other technical training or certifications."
          value={form.skillsCertifications || ""}
          onChange={(e) =>
            updateField("skillsCertifications", e.target.value)
          }
        />
      </div>
    </section>
  );
}

export default StepSkills;
