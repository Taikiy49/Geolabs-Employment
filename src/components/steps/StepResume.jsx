import React, { useEffect, useState } from "react";
import "../../styles/StepResume.css";

// ------------------------------------------------------------------
// API endpoints
// ------------------------------------------------------------------
const DEFAULT_API_URL = "http://127.0.0.1:5000/api/parse-resume";

// Support both CRA-style (process.env.REACT_APP_...) and Vite (import.meta.env.VITE_...)
const API_URL =
  (typeof import.meta !== "undefined" &&
    import.meta.env &&
    import.meta.env.VITE_RESUME_API_URL) ||
  (typeof process !== "undefined" &&
    process.env &&
    process.env.REACT_APP_PARSE_RESUME_URL) ||
  DEFAULT_API_URL;

const HEALTH_URL = API_URL.replace("/api/parse-resume", "/api/health");

// Helpful for debugging
console.log("🧾 StepResume using API_URL =", API_URL);
console.log("🩺 StepResume using HEALTH_URL =", HEALTH_URL);

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
  const [serverStatus, setServerStatus] = useState(null); // null | "ok" | "degraded" | "down"
  const [isDragging, setIsDragging] = useState(false);
  const [lastParseTime, setLastParseTime] = useState(null);

  // track whether parsed data has been applied to the form
  const [hasAppliedSinceParse, setHasAppliedSinceParse] = useState(false);
  const [lastAppliedAt, setLastAppliedAt] = useState(null);

  const [autoFillSections, setAutoFillSections] = useState({
    contact: true,
    employment: true,
    education: true,
    skills: true,
    references: true,
  });

  // ------------------------------------
  // Health check on mount
  // ------------------------------------
  useEffect(() => {
    const checkHealth = async () => {
      try {
        console.log("🔍 Checking health at:", HEALTH_URL);
        const res = await fetch(HEALTH_URL, { method: "GET" });
        if (!res.ok) {
          console.warn("⚠️ Health check returned non-200:", res.status);
          setServerStatus("degraded");
          return;
        }
        const data = await res.json();
        console.log("✅ Health response:", data);
        if (data && data.status === "ok" && data.autofill_ready) {
          setServerStatus("ok");
        } else {
          setServerStatus("degraded");
        }
      } catch (e) {
        console.error("❌ Health check failed:", e);
        setServerStatus("down");
      }
    };
    checkHealth();
  }, []);

  // ------------------------------------
  // File helpers
  // ------------------------------------
  const MAX_FILE_SIZE_MB = 5;
  const allowedExtensions = [".pdf", ".doc", ".docx", ".txt"];

  const getFileExtension = (name) => {
    if (!name || !name.includes(".")) return "";
    return "." + name.split(".").pop().toLowerCase();
  };

  const validateFile = (selectedFile) => {
    if (!selectedFile) return "No file selected.";

    const ext = getFileExtension(selectedFile.name);
    if (!allowedExtensions.includes(ext)) {
      return `Unsupported file type: ${ext}. Please upload PDF, DOC, DOCX, or TXT.`;
    }

    const sizeMb = selectedFile.size / (1024 * 1024);
    if (sizeMb > MAX_FILE_SIZE_MB) {
      return `File is too large (${sizeMb.toFixed(
        1
      )} MB). Max allowed is ${MAX_FILE_SIZE_MB} MB.`;
    }

    return null;
  };

  // ------------------------------------
  // File change / drag & drop
  // ------------------------------------
  const resetParsedState = () => {
    setParsedPreview(null);
    setDebugMeta(null);
    setStatus("idle");
    setHasAppliedSinceParse(false);
    setError("");
  };

  const handleFileChange = (e) => {
    const selected = e.target.files?.[0] || null;
    if (!selected) return;

    const validationError = validateFile(selected);
    if (validationError) {
      setError(validationError);
      setFile(null);
      resetParsedState();
      return;
    }

    setFile(selected);
    resetParsedState();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files?.[0];
    if (!droppedFile) return;

    const validationError = validateFile(droppedFile);
    if (validationError) {
      setError(validationError);
      setFile(null);
      resetParsedState();
      return;
    }

    setFile(droppedFile);
    resetParsedState();
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    if (!isDragging) setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    if (isDragging) setIsDragging(false);
  };

  // ------------------------------------
  // Section toggles
  // ------------------------------------
  const toggleSection = (key) => {
    setAutoFillSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  // ------------------------------------
  // Upload + parsing
  // ------------------------------------
  const handleUploadAndParse = async () => {
    if (!file) {
      setError("Please select a resume file first.");
      return;
    }

    const validationError = validateFile(file);
    if (validationError) {
      setError(validationError);
      return;
    }

    console.log("🚀 Uploading resume to:", API_URL, "file:", file.name);

    setStatus("uploading");
    setError("");
    setParsedPreview(null);
    setDebugMeta(null);
    setHasAppliedSinceParse(false);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch(API_URL, {
        method: "POST",
        body: formData,
      });

      let data = null;
      try {
        data = await res.json();
      } catch {
        // ignore JSON parse errors, handled below
      }

      if (!res.ok) {
        console.error("❌ Server returned non-OK:", res.status, data);
        throw new Error(
          (data && data.error) || "Resume processing failed on the server."
        );
      }

      if (!data || !data.parsed) {
        console.error("❌ No parsed data in response:", data);
        throw new Error("No parsed data returned from server.");
      }

      console.log("✅ Parsed resume data:", data);

      setParsedPreview(data.parsed);
      setDebugMeta(data.meta || null);
      setStatus("parsed");
      setLastParseTime(new Date().toISOString());
      setHasAppliedSinceParse(false);
    } catch (err) {
      console.error("❌ Resume Upload Error:", err);
      setError(err.message || "Something went wrong during processing.");
      setStatus("error");
    }
  };

  // ------------------------------------
  // Autofill logic
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

    updateField("educationTrade", safeApply(form.educationTrade, edu.trade));
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

    setHasAppliedSinceParse(true);
    setLastAppliedAt(new Date().toISOString());
  };

  // ------------------------------------
  // Status UI
  // ------------------------------------
  const renderStatus = () => {
    if (status === "uploading") {
      return (
        <div className="resume-status resume-status-uploading">
          <div className="resume-status-dot" />
          <div>
            <div className="resume-status-title">Analyzing your resume…</div>
            <div className="resume-status-subtitle">
              Extracting work history, education, skills, and contact details.
              This usually takes just a few seconds.
            </div>
          </div>
        </div>
      );
    }
    if (status === "parsed") {
      return (
        <div className="resume-status resume-status-success">
          <div className="resume-status-dot" />
          <div>
            <div className="resume-status-title">
              Resume processed successfully!
            </div>
            <div className="resume-status-subtitle">
              Review the snapshot, toggle sections, and then apply everything to
              your application.
            </div>
          </div>
        </div>
      );
    }
    if (status === "error") {
      return (
        <div className="resume-status resume-status-error">
          <div className="resume-status-dot" />
          <div>
            <div className="resume-status-title">Something went wrong.</div>
            <div className="resume-status-subtitle">{error}</div>
          </div>
        </div>
      );
    }
    return null;
  };

  const renderServerStatus = () => {
    if (!serverStatus) return null;
    if (serverStatus === "ok") {
      return (
        <div className="resume-server-chip resume-server-chip-ok">
          <span className="resume-server-dot" />
          Smart autofill online
        </div>
      );
    }
    if (serverStatus === "degraded") {
      return (
        <div className="resume-server-chip resume-server-chip-warn">
          <span className="resume-server-dot" />
          Connected, but autofill may be limited
        </div>
      );
    }
    if (serverStatus === "down") {
      return (
        <div className="resume-server-chip resume-server-chip-error">
          <span className="resume-server-dot" />
          Unable to reach resume helper
        </div>
      );
    }
    return null;
  };

  const renderParsedSnapshot = () => {
    if (!parsedPreview) return null;

    const c = parsedPreview.contact || {};
    const jobs = parsedPreview.employment || [];
    const edu = parsedPreview.education || {};
    const skills = parsedPreview.skills || {};

    return (
      <div className="resume-snapshot-grid">
        <div className="resume-snapshot-card">
          <div className="resume-snapshot-title">Contact Snapshot</div>
          <div className="resume-snapshot-body">
            <div className="resume-snapshot-line">
              <span className="label">Name</span>
              <span>{c.name || "—"}</span>
            </div>
            <div className="resume-snapshot-line">
              <span className="label">Email</span>
              <span>{c.email || "—"}</span>
            </div>
            <div className="resume-snapshot-line">
              <span className="label">Phone</span>
              <span>{c.phone || "—"}</span>
            </div>
            <div className="resume-snapshot-line">
              <span className="label">Location</span>
              <span>
                {c.city || c.state || c.zip
                  ? [c.city, c.state, c.zip].filter(Boolean).join(", ")
                  : "—"}
              </span>
            </div>
          </div>
        </div>

        <div className="resume-snapshot-card">
          <div className="resume-snapshot-title">Recent Experience</div>
          <div className="resume-snapshot-body">
            {jobs.length === 0 && (
              <div className="text-muted">Not detected.</div>
            )}
            {jobs.slice(0, 3).map((job, idx) => (
              <div key={idx} className="resume-snapshot-job">
                <div className="resume-snapshot-job-title">
                  {job.position || "Position not detected"}
                </div>
                <div className="resume-snapshot-job-meta">
                  {job.company || "Company not detected"}
                  {job.dateFrom || job.dateTo
                    ? ` • ${[job.dateFrom, job.dateTo]
                        .filter(Boolean)
                        .join(" – ")}`
                    : ""}
                </div>
                {job.duties && (
                  <div className="resume-snapshot-job-duties">
                    {job.duties}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="resume-snapshot-card">
          <div className="resume-snapshot-title">Education & Skills</div>
          <div className="resume-snapshot-body">
            <div className="resume-snapshot-line">
              <span className="label">Latest School</span>
              <span>{edu.graduate || edu.trade || edu.high || "—"}</span>
            </div>
            <div className="resume-snapshot-line">
              <span className="label">Major</span>
              <span>
                {edu.graduateMajor || edu.tradeMajor || edu.highMajor || "—"}
              </span>
            </div>
            <div className="resume-snapshot-line">
              <span className="label">Typing Speed</span>
              <span>
                {skills.typingSpeed ? `${skills.typingSpeed} WPM` : "—"}
              </span>
            </div>
            <div className="resume-snapshot-line">
              <span className="label">Computer Skills</span>
              <span>{skills.computerSkills || "—"}</span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // ------------------------------------
  // JSX
  // ------------------------------------
  const showNotAppliedWarning = parsedPreview && !hasAppliedSinceParse;

  return (
    <div className="form-step resume-step">
      <section className="form-section resume-section">
        <div className="resume-section-header">
          <div>
            <h2>Upload Your Resume</h2>
            <p className="section-help">
              Upload your resume and we’ll automatically pre-fill your
              application. You stay in control — review and edit everything
              before submitting.
            </p>
          </div>
          <div className="resume-section-meta">
            {renderServerStatus()}
            {lastParseTime && (
              <div className="resume-last-run">
                Last analyzed:{" "}
                {new Date(lastParseTime).toLocaleString(undefined, {
                  dateStyle: "short",
                  timeStyle: "short",
                })}
              </div>
            )}
            {showNotAppliedWarning && (
              <div className="resume-not-applied-pill">
                ⚠ Data not yet applied to application
              </div>
            )}
            {hasAppliedSinceParse && lastAppliedAt && (
              <div className="resume-applied-pill">
                ✅ Applied to application at{" "}
                {new Date(lastAppliedAt).toLocaleTimeString(undefined, {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </div>
            )}
          </div>
        </div>

        {/* Visual mini-stepper */}
        <div className="resume-mini-steps">
          <div
            className={`resume-mini-step ${
              status !== "idle" ? "completed" : "active"
            }`}
          >
            <span className="bubble">1</span>
            <span>Upload file</span>
          </div>
          <div
            className={`resume-mini-step ${
              status === "uploading"
                ? "active"
                : status === "parsed"
                ? "completed"
                : ""
            }`}
          >
            <span className="bubble">2</span>
            <span>Analyze resume</span>
          </div>
          <div
            className={`resume-mini-step ${
              parsedPreview ? (hasAppliedSinceParse ? "completed" : "active") : ""
            }`}
          >
            <span className="bubble">3</span>
            <span>Apply to application</span>
          </div>
        </div>

        <div className="resume-upload-card">
          <div className="resume-upload-body">
            <label
              className={`resume-dropzone ${
                isDragging ? "resume-dropzone-dragging" : ""
              }`}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
            >
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
                    {file ? file.name : "Click, or drag and drop your resume"}
                  </div>
                  <div className="resume-dropzone-caption">
                    PDF, DOC, DOCX, or TXT · up to {MAX_FILE_SIZE_MB} MB · clear
                    text works best.
                  </div>
                </div>
              </div>
            </label>

            <div className="resume-upload-actions">
              <button
                type="button"
                className="btn primary"
                onClick={handleUploadAndParse}
                disabled={!file || status === "uploading"}
              >
                {status === "uploading"
                  ? "Analyzing…"
                  : "Upload & Analyze Resume"}
              </button>
              <div className="resume-secondary-hint">
                You can always edit fields after autofill.
              </div>
            </div>
          </div>

          {renderStatus()}

          {parsedPreview && (
            <div className="resume-mapping-panel">
              <div className="resume-mapping-header">
                <div>
                  <h3>Autofill Controls</h3>
                  <p className="section-help">
                    Choose which sections are allowed to pre-fill. Turning a
                    section off keeps your current answers untouched.
                  </p>
                </div>
                <button
                  type="button"
                  className="btn small ghost"
                  onClick={() =>
                    setAutoFillSections({
                      contact: true,
                      employment: true,
                      education: true,
                      skills: true,
                      references: true,
                    })
                  }
                >
                  Reset toggles
                </button>
              </div>

              <div className="resume-toggle-grid">
                {Object.keys(autoFillSections).map((key) => (
                  <button
                    key={key}
                    type="button"
                    className={`resume-toggle-pill ${
                      autoFillSections[key] ? "active" : ""
                    }`}
                    onClick={() => toggleSection(key)}
                  >
                    <span className="pill-dot" />
                    <span className="pill-label">
                      {key.charAt(0).toUpperCase() + key.slice(1)}
                    </span>
                    <span className="pill-state">
                      {autoFillSections[key] ? "On" : "Off"}
                    </span>
                  </button>
                ))}
              </div>

              <div className="resume-mapping-actions">
                <button
                  type="button"
                  className="btn primary resume-apply-btn"
                  onClick={handleApplyToForm}
                  disabled={!parsedPreview}
                >
                  {hasAppliedSinceParse
                    ? "Apply Again to Application"
                    : "Apply to Application"}
                </button>
                <span className="form-controls-note">
                  We never overwrite blanks with guesses — only clearly detected
                  values.
                </span>
              </div>

              {hasAppliedSinceParse && (
                <div className="resume-apply-confirm">
                  ✅ Imported into the application. You can still edit any field
                  manually.
                </div>
              )}

              {renderParsedSnapshot()}

              <details className="resume-preview-details">
                <summary>Developer view: raw extracted data</summary>
                <pre className="resume-preview-json">
                  {JSON.stringify(parsedPreview, null, 2)}
                </pre>
              </details>

              {debugMeta && (
                <p className="section-help resume-meta-footnote">
                  Parsed from: <strong>{debugMeta.filename}</strong> ·
                  Characters processed:{" "}
                  <strong>{debugMeta.characters_used}</strong>
                  {debugMeta.truncated && (
                    <>
                      {" "}
                      ·{" "}
                      <span className="warn">
                        truncated for internal limits
                      </span>
                    </>
                  )}
                </p>
              )}
            </div>
          )}
        </div>

        {status === "error" && !parsedPreview && (
          <div className="resume-inline-error">
            <strong>Tip:</strong> Try exporting your resume as a simple PDF or
            TXT file and avoid image-only scans.
          </div>
        )}
      </section>
    </div>
  );
}

export default StepResume;
