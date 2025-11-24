import React, { useState } from "react";

const API_URL = "http://127.0.0.1:5000/api/parse-resume"; 
// Change this later when deploying

function StepResume({
  form,
  updateField,
  updateEmploymentField,
  updateReferenceField,
}) {
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState("idle"); // idle | uploading | parsed | error
  const [error, setError] = useState("");
  const [parsedPreview, setParsedPreview] = useState(null);
  const [debugMeta, setDebugMeta] = useState(null);

  const [autoFillSections, setAutoFillSections] = useState({
    contact: true,
    employment: true,
    education: true,
    skills: true,
    references: true,
  });

  // ------------------------------------
  // File Change
  // ------------------------------------
  const handleFileChange = (e) => {
    const selected = e.target.files?.[0] || null;
    setFile(selected);
    setParsedPreview(null);
    setDebugMeta(null);
    setStatus("idle");
    setError("");
  };

  // ------------------------------------
  // Section Toggles
  // ------------------------------------
  const toggleSection = (key) => {
    setAutoFillSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  // ------------------------------------
  // Upload + Gemini Parsing
  // ------------------------------------
  const handleUploadAndParse = async () => {
    if (!file) {
      setError("Please select a resume file first.");
      return;
    }

    setStatus("uploading");
    setError("");
    setParsedPreview(null);
    setDebugMeta(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch(API_URL, {
        method: "POST",
        body: formData,
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        throw new Error(
          (data && data.error) || "Resume parsing failed on the server."
        );
      }

      if (!data || !data.parsed) {
        throw new Error("No parsed data returned from server.");
      }

      setParsedPreview(data.parsed);
      setDebugMeta(data.meta || null);
      setStatus("parsed");
    } catch (err) {
      console.error("❌ Resume Upload Error:", err);
      setError(err.message || "Something went wrong during parsing.");
      setStatus("error");
    }
  };

  // ------------------------------------
  // Autofill: Filters null fields & applies only when toggle is ON
  // ------------------------------------
  const safeApply = (current, incoming) => {
    return incoming != null ? incoming : current;
  };

  const applyContact = (c) => {
    if (!c || !autoFillSections.contact) return;
    updateField("name", safeApply(form.name, c.name));
    updateField("email", safeApply(form.email, c.email));
    updateField("phone", safeApply(form.phone, c.phone));
    updateField("address", safeApply(form.address, c.address));
    updateField("city", safeApply(form.city, c.city));
    updateField("state", safeApply(form.state, c.state));
    updateField("zip", safeApply(form.zip, c.zip));
  };

  const applyEmployment = (jobs) => {
    if (!jobs || !autoFillSections.employment) return;

    const list = Array.isArray(jobs) ? jobs.slice(0, 3) : [];

    for (let i = 0; i < 3; i++) {
      const job = list[i] || {};
      updateEmploymentField(i, "company", safeApply("", job.company));
      updateEmploymentField(i, "address", safeApply("", job.address));
      updateEmploymentField(i, "phone", safeApply("", job.phone));
      updateEmploymentField(i, "position", safeApply("", job.position));
      updateEmploymentField(i, "dateFrom", safeApply("", job.dateFrom));
      updateEmploymentField(i, "dateTo", safeApply("", job.dateTo));
      updateEmploymentField(i, "duties", safeApply("", job.duties));
      updateEmploymentField(i, "supervisor", safeApply("", job.supervisor));
    }
  };

  const applyEducation = (edu) => {
    if (!edu || !autoFillSections.education) return;

    updateField(
      "educationGraduate",
      safeApply(form.educationGraduate, edu.graduate)
    );
    updateField(
      "educationGraduateYears",
      safeApply(form.educationGraduateYears, edu.graduateYears)
    );
    updateField(
      "educationGraduateMajor",
      safeApply(form.educationGraduateMajor, edu.graduateMajor)
    );

    updateField(
      "educationTrade",
      safeApply(form.educationTrade, edu.trade)
    );
    updateField(
      "educationTradeYears",
      safeApply(form.educationTradeYears, edu.tradeYears)
    );
    updateField(
      "educationTradeMajor",
      safeApply(form.educationTradeMajor, edu.tradeMajor)
    );

    updateField("educationHigh", safeApply(form.educationHigh, edu.high));
    updateField(
      "educationHighYears",
      safeApply(form.educationHighYears, edu.highYears)
    );
    updateField(
      "educationHighMajor",
      safeApply(form.educationHighMajor, edu.highMajor)
    );
  };

  const applySkills = (skills) => {
    if (!skills || !autoFillSections.skills) return;

    updateField("typingSpeed", safeApply(form.typingSpeed, skills.typingSpeed));
    updateField("tenKey", safeApply(form.tenKey, skills.tenKey));
    updateField(
      "computerSkills",
      safeApply(form.computerSkills, skills.computerSkills)
    );
  };

  const applyReferences = (refs) => {
    if (!refs || !autoFillSections.references) return;

    for (let i = 0; i < Math.min(refs.length, 3); i++) {
      const r = refs[i] || {};
      updateReferenceField(i, "name", safeApply("", r.name));
      updateReferenceField(i, "company", safeApply("", r.company));
      updateReferenceField(i, "phone", safeApply("", r.phone));
    }
  };

  const handleApplyToForm = () => {
    if (!parsedPreview) return;

    applyContact(parsedPreview.contact);
    applyEmployment(parsedPreview.employment);
    applyEducation(parsedPreview.education);
    applySkills(parsedPreview.skills);
    applyReferences(parsedPreview.references);
  };

  // ------------------------------------
  // Status UI
  // ------------------------------------
  const renderStatus = () => {
    if (status === "uploading") {
      return (
        <div className="resume-status resume-status-uploading">
          🔍 Analyzing your resume with Gemini… extracting work history,
          education, skills, and contact details.
        </div>
      );
    }
    if (status === "parsed") {
      return (
        <div className="resume-status resume-status-success">
          ✅ Resume analyzed! Review what we found and choose what you want to
          autofill.
        </div>
      );
    }
    if (status === "error") {
      return (
        <div className="resume-status resume-status-error">
          ❌ {error}
        </div>
      );
    }
    return null;
  };

  // ------------------------------------
  // JSX
  // ------------------------------------
  return (
    <div className="form-step resume-step">
      <section className="form-section">
        <h2>Upload Your Resume</h2>
        <p className="section-help">
          Upload your resume and we’ll intelligently pre-fill your application
          using Gemini. You can review everything before submitting.
        </p>

        <div className="resume-upload-card">
          <div className="resume-upload-body">
            <label className="resume-dropzone">
              <input
                type="file"
                accept=".pdf,.doc,.docx,.txt"
                onChange={handleFileChange}
                style={{ display: "none" }}
              />
              <div className="resume-dropzone-inner">
                <div className="resume-dropzone-icon">📄</div>
                <div>
                  <div className="resume-dropzone-title">
                    {file ? file.name : "Click to browse or drop your resume"}
                  </div>
                  <div className="resume-dropzone-caption">
                    PDF, DOCX, or TXT — clear text works best.
                  </div>
                </div>
              </div>
            </label>

            <button
              type="button"
              className="btn primary"
              onClick={handleUploadAndParse}
              disabled={!file || status === "uploading"}
            >
              {status === "uploading" ? "Analyzing…" : "Upload & Analyze Resume"}
            </button>
          </div>

          {renderStatus()}

          {parsedPreview && (
            <div className="resume-mapping-panel">
              <h3>Autofill Options</h3>
              <div className="resume-toggle-grid">
                {Object.keys(autoFillSections).map((key) => (
                  <label key={key} className="resume-toggle">
                    <input
                      type="checkbox"
                      checked={autoFillSections[key]}
                      onChange={() => toggleSection(key)}
                    />
                    <div className="resume-toggle-label">
                      <strong>{key.charAt(0).toUpperCase() + key.slice(1)}</strong>
                    </div>
                  </label>
                ))}
              </div>

              <button
                type="button"
                className="btn outline"
                onClick={handleApplyToForm}
              >
                Apply to Application
              </button>

              <h4>Extracted Data</h4>
              <pre className="resume-preview-json">
                {JSON.stringify(parsedPreview, null, 2)}
              </pre>

              {debugMeta && (
                <p className="section-help">
                  Parsed from: <strong>{debugMeta.filename}</strong>  
                  · Characters analyzed: {debugMeta.characters_used}
                </p>
              )}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

export default StepResume;
