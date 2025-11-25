// src/components/steps/StepSkills.jsx
import React from "react";
import "../../styles/StepSkills.css";

function StepSkills({ form, updateField }) {
  return (
    <div className="form-step skills-step">
      <section className="form-section skills-section">
        <div className="skills-header-row">
          <div>
            <h2>Skills & Qualifications</h2>
            <p className="section-help">
              Tell us about the experience, tools, and strengths that make you a good
              fit for this position.
            </p>
          </div>
          <div className="skills-meta">
            <span className="skills-chip skills-chip-step">Step 5</span>
            <span className="skills-chip skills-chip-focus">
              Helps us match you to the right role
            </span>
          </div>
        </div>

        {/* Quick overview */}
        <div className="skills-card skills-card-overview">
          <h3 className="skills-card-title">Experience Snapshot</h3>
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
              <p className="field-hint">
                Include experience from similar roles, internships, and related work.
              </p>
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
              <p className="field-hint">
                List your main specialties or the type of work you enjoy most.
              </p>
            </div>
          </div>
        </div>

        {/* Technical & software */}
        <div className="skills-card">
          <div className="skills-card-header-row">
            <h3 className="skills-card-title">Technical Skills & Tools</h3>
            <span className="skills-chip skills-chip-optional">
              Tailor to the role
            </span>
          </div>
          <div className="grid grid-2">
            <div className="field">
              <label>Technical Skills & Field / Lab Tools</label>
              <textarea
                rows={3}
                placeholder="e.g., soil classification, compaction testing, concrete testing, drilling support, construction observation, materials sampling…"
                value={form.skillsTechnical || ""}
                onChange={(e) => updateField("skillsTechnical", e.target.value)}
              />
              <p className="field-hint">
                You can list field procedures, lab tests, inspection tasks, or other
                hands-on technical skills.
              </p>
            </div>
            <div className="field">
              <label>Software & Programs</label>
              <textarea
                rows={3}
                placeholder="e.g., Microsoft Office (Word, Excel, Outlook), Adobe Acrobat, CAD, GIS, data entry systems, field reporting apps…"
                value={form.skillsSoftware || ""}
                onChange={(e) => updateField("skillsSoftware", e.target.value)}
              />
              <p className="field-hint">
                Include any engineering, drafting, GIS, data-entry, or reporting tools
                you are familiar with.
              </p>
            </div>
          </div>
        </div>

        {/* Field / comms */}
        <div className="skills-card">
          <h3 className="skills-card-title">Field, Lab & Team Skills</h3>
          <div className="grid grid-2">
            <div className="field">
              <label>Field / Laboratory Experience</label>
              <textarea
                rows={3}
                placeholder="Describe any field work, laboratory testing, inspection, or construction monitoring experience."
                value={form.skillsFieldLab || ""}
                onChange={(e) => updateField("skillsFieldLab", e.target.value)}
              />
              <p className="field-hint">
                Mention typical tasks, project types, and any responsibilities you
                regularly handled.
              </p>
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
              <p className="field-hint">
                Include how you work with others, share information, and contribute to
                safe and efficient projects.
              </p>
            </div>
          </div>
        </div>

        {/* Certifications */}
        <div className="skills-card">
          <div className="skills-card-header-row">
            <h3 className="skills-card-title">Certifications & Training</h3>
            <span className="skills-chip skills-chip-optional">
              Optional but recommended
            </span>
          </div>
          <div className="field">
            <label>
              Certifications, Licenses, or Training{" "}
              <span className="optional-tag">(if any)</span>
            </label>
            <textarea
              rows={3}
              placeholder="e.g., OSHA 10/30, ACI, NICET, ISTC, first aid/CPR, other technical training or certifications."
              value={form.skillsCertifications || ""}
              onChange={(e) =>
                updateField("skillsCertifications", e.target.value)
              }
            />
            <p className="field-hint">
              Include current or recently expired credentials. You can also note
              anything you are actively working toward.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default StepSkills;
