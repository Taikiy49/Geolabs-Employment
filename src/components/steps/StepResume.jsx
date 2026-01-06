import React, { useEffect, useState } from "react";
import "../../styles/StepResume.css";

// ---------------------------------------------------------
// API base
// ---------------------------------------------------------
// ---------------------------------------------------------
// API base
// ---------------------------------------------------------
// PROD: VITE_API_URL should be "https://geolabs-employment.net"
// DEV: default to local Flask
const API_BASE =
  (import.meta?.env?.VITE_API_URL || "").replace(/\/+$/, "") ||
  (window.location.hostname === "localhost"
    ? "http://127.0.0.1:5001"
    : "https://api.geolabs-employment.net");

const PARSE_URL = `${API_BASE}/api/parse-resume`;
const HEALTH_URL = `${API_BASE}/api/health`;

console.log("🧾 StepResume using PARSE_URL =", PARSE_URL);
console.log("🩺 StepResume using HEALTH_URL =", HEALTH_URL);

function StepResume({
  form,
  updateField,
  updateEmploymentField,
  updateReferenceField,
  onApplyParsedResume,
  onResumeFileSelected, // ✅ NEW: App will pass this
}) {
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState("idle"); // idle | uploading | parsed | error
  const [error, setError] = useState("");
  const [parsedPreview, setParsedPreview] = useState(null);
  const [debugMeta, setDebugMeta] = useState(null);
  const [serverStatus, setServerStatus] = useState(null); // null | "ok" | "degraded" | "down"
  const [isDragging, setIsDragging] = useState(false);
  const [lastParseTime, setLastParseTime] = useState(null);
  const [autoAppliedAt, setAutoAppliedAt] = useState(null);

  // ------------------------------------
  // Health check on mount
  // ------------------------------------
  useEffect(() => {
    const checkHealth = async () => {
      try {
        const res = await fetch(HEALTH_URL, { method: "GET" });
        if (!res.ok) {
          setServerStatus("degraded");
          return;
        }
        const data = await res.json();
        if (data && data.status === "ok" && data.autofill_ready) {
          setServerStatus("ok");
        } else {
          setServerStatus("degraded");
        }
      } catch {
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
    setError("");
    setAutoAppliedAt(null);
  };

  const setResumeFileEverywhere = (selected) => {
    setFile(selected);
    // ✅ store in App for final submit
    if (typeof onResumeFileSelected === "function") {
      onResumeFileSelected(selected);
    }
  };

  const handleFileChange = (e) => {
    const selected = e.target.files?.[0] || null;
    if (!selected) return;

    const validationError = validateFile(selected);
    if (validationError) {
      setError(validationError);
      setResumeFileEverywhere(null);
      resetParsedState();
      return;
    }

    setResumeFileEverywhere(selected);
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
      setResumeFileEverywhere(null);
      resetParsedState();
      return;
    }

    setResumeFileEverywhere(droppedFile);
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
  // Autofill logic
  // ------------------------------------
  const isBlank = (v) => v == null || String(v).trim() === "";

  const fillIfEmpty = (field, incoming) => {
    if (incoming == null) return;
    if (!isBlank(form[field])) return;
    updateField(field, incoming);
  };

  const fillEmploymentFieldIfEmpty = (idx, field, incoming) => {
    if (incoming == null) return;
    const current = form.employment?.[idx]?.[field];
    if (!isBlank(current)) return;
    updateEmploymentField(idx, field, incoming);
  };

  const fillReferenceFieldIfEmpty = (idx, field, incoming) => {
    if (incoming == null) return;
    const current = form.references?.[idx]?.[field];
    if (!isBlank(current)) return;
    updateReferenceField(idx, field, incoming);
  };

  const normalizePhone = (p) => (p == null ? "" : String(p).trim());

  const applyAllToForm = (parsed) => {
    if (!parsed) return;

    const contact = parsed.contact || {};
    const jobs = Array.isArray(parsed.employment) ? parsed.employment : [];
    const edu = parsed.education || {};
    const skills = parsed.skills || {};
    const refs = Array.isArray(parsed.references) ? parsed.references : [];

    // Contact
    fillIfEmpty("name", contact.name);
    fillIfEmpty("email", contact.email);
    fillIfEmpty("phone", normalizePhone(contact.phone));
    fillIfEmpty("cell", normalizePhone(contact.cell || contact.mobile));

    fillIfEmpty("address", contact.address);
    fillIfEmpty("city", contact.city);
    fillIfEmpty("state", contact.state);
    fillIfEmpty("zip", contact.zip);

    if (isBlank(form.location)) {
      const locationGuess =
        contact.location ||
        [contact.city, contact.state, contact.zip].filter(Boolean).join(", ");
      if (!isBlank(locationGuess)) updateField("location", locationGuess);
    }

    if (isBlank(form.position) && parsed.targetRole) {
      updateField("position", parsed.targetRole);
    }

    // Employment up to 3
    for (let i = 0; i < 3; i++) {
      const job = jobs[i] || {};
      fillEmploymentFieldIfEmpty(i, "company", job.company);
      fillEmploymentFieldIfEmpty(i, "address", job.address);
      fillEmploymentFieldIfEmpty(i, "phone", normalizePhone(job.phone));
      fillEmploymentFieldIfEmpty(i, "position", job.position);
      fillEmploymentFieldIfEmpty(i, "dateFrom", job.dateFrom || job.startDate);
      fillEmploymentFieldIfEmpty(i, "dateTo", job.dateTo || job.endDate);
      fillEmploymentFieldIfEmpty(i, "duties", job.duties || job.summary);
      fillEmploymentFieldIfEmpty(i, "supervisor", job.supervisor);
      fillEmploymentFieldIfEmpty(
        i,
        "reasonForLeaving",
        job.reasonForLeaving || job.reason
      );
    }

    // Education (object format)
    fillIfEmpty("educationGraduate", edu.graduate);
    fillIfEmpty("educationGraduateYears", edu.graduateYears);
    fillIfEmpty("educationGraduateMajor", edu.graduateMajor);

    fillIfEmpty("educationTrade", edu.trade);
    fillIfEmpty("educationTradeYears", edu.tradeYears);
    fillIfEmpty("educationTradeMajor", edu.tradeMajor);

    fillIfEmpty("educationHigh", edu.high);
    fillIfEmpty("educationHighYears", edu.highYears);
    fillIfEmpty("educationHighMajor", edu.highMajor);

    // Skills
    fillIfEmpty("typingSpeed", skills.typingSpeed);
    fillIfEmpty("tenKey", skills.tenKey);
    if (isBlank(form.tenKeyMode) && skills.tenKeyMode) {
      updateField("tenKeyMode", skills.tenKeyMode);
    }
    fillIfEmpty("computerSkills", skills.computerSkills);
    if (isBlank(form.driverLicense) && skills.driverLicense) {
      updateField("driverLicense", skills.driverLicense);
    }

    // References up to 3
    for (let i = 0; i < Math.min(refs.length, 3); i++) {
      const r = refs[i] || {};
      fillReferenceFieldIfEmpty(i, "name", r.name);
      fillReferenceFieldIfEmpty(i, "company", r.company);
      fillReferenceFieldIfEmpty(i, "phone", normalizePhone(r.phone));
    }

    if (typeof onApplyParsedResume === "function") {
      const extra = {};
      if (parsed.position && isBlank(form.position)) extra.position = parsed.position;
      if (parsed.location && isBlank(form.location)) extra.location = parsed.location;
      if (Object.keys(extra).length) onApplyParsedResume(extra);
    }

    setAutoAppliedAt(new Date().toISOString());
  };

  // ------------------------------------
  // Upload + parsing (AUTO APPLY)
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

    setStatus("uploading");
    setError("");
    setParsedPreview(null);
    setDebugMeta(null);
    setAutoAppliedAt(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch(PARSE_URL, {
        method: "POST",
        body: formData,
      });

      let data = null;
      try {
        data = await res.json();
      } catch {
        // ignore
      }

      if (!res.ok) {
        throw new Error((data && data.error) || "Resume processing failed on the server.");
      }

      if (!data || !data.parsed) {
        throw new Error("No parsed data returned from server.");
      }

      setParsedPreview(data.parsed);
      setDebugMeta(data.meta || null);
      setStatus("parsed");
      setLastParseTime(new Date().toISOString());

      // ✅ AUTO APPLY RIGHT AWAY
      applyAllToForm(data.parsed);
    } catch (err) {
      setError(err.message || "Something went wrong during processing.");
      setStatus("error");
    }
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
              We’ll automatically fill your application fields. You can edit or remove anything afterward.
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
            <div className="resume-status-title">Autofill complete ✅</div>
            <div className="resume-status-subtitle">
              We filled what we could detect. You can modify or delete any autofilled text before submitting.
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
    return (
      <div className="resume-server-chip resume-server-chip-error">
        <span className="resume-server-dot" />
        Unable to reach resume helper
      </div>
    );
  };

  const renderParsedSnapshot = () => {
    if (!parsedPreview) return null;

    const c = parsedPreview.contact || {};
    const jobs = Array.isArray(parsedPreview.employment) ? parsedPreview.employment : [];
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
              <span>{c.phone || c.cell || "—"}</span>
            </div>
            <div className="resume-snapshot-line">
              <span className="label">Location</span>
              <span>
                {c.city || c.state || c.zip ? [c.city, c.state, c.zip].filter(Boolean).join(", ") : "—"}
              </span>
            </div>
          </div>
        </div>

        <div className="resume-snapshot-card">
          <div className="resume-snapshot-title">Recent Experience</div>
          <div className="resume-snapshot-body">
            {jobs.length === 0 && <div className="text-muted">Not detected.</div>}
            {jobs.slice(0, 3).map((job, idx) => (
              <div key={idx} className="resume-snapshot-job">
                <div className="resume-snapshot-job-title">{job.position || "Position not detected"}</div>
                <div className="resume-snapshot-job-meta">
                  {job.company || "Company not detected"}
                  {job.dateFrom || job.dateTo
                    ? ` • ${[job.dateFrom, job.dateTo].filter(Boolean).join(" – ")}`
                    : ""}
                </div>
                {job.duties && <div className="resume-snapshot-job-duties">{job.duties}</div>}
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
              <span>{edu.graduateMajor || edu.tradeMajor || edu.highMajor || "—"}</span>
            </div>
            <div className="resume-snapshot-line">
              <span className="label">Typing Speed</span>
              <span>{skills.typingSpeed ? `${skills.typingSpeed} WPM` : "—"}</span>
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
  return (
    <div className="form-step resume-step">
      <section className="form-section resume-section">
        <div className="resume-section-header">
          <div>
            <h2>Upload Your Resume</h2>
            <p className="section-help">
              Upload your resume and we’ll automatically pre-fill your application. You can edit or remove anything before submitting.
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
            {autoAppliedAt && (
              <div className="resume-applied-pill">
                ✅ Autofilled at{" "}
                {new Date(autoAppliedAt).toLocaleTimeString(undefined, {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </div>
            )}
          </div>
        </div>

        <div className="resume-upload-card">
          <div className="resume-upload-body">
            <label
              className={`resume-dropzone ${isDragging ? "resume-dropzone-dragging" : ""} ${
                status === "uploading" ? "resume-dropzone-loading" : ""
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
                  <div className="resume-dropzone-title">{file ? file.name : "Click, or drag and drop your resume"}</div>
                  <div className="resume-dropzone-caption">
                    PDF, DOC, DOCX, or TXT · up to {MAX_FILE_SIZE_MB} MB
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
                {status === "uploading" ? "Analyzing…" : "Upload & Analyze Resume"}
              </button>
              <div className="resume-secondary-hint">Autofill won’t overwrite fields you’ve already filled.</div>
            </div>
          </div>

          {renderStatus()}

          {parsedPreview && (
            <>
              {renderParsedSnapshot()}

              <details className="resume-preview-details">
                <summary>Developer view: raw extracted data</summary>
                <pre className="resume-preview-json">{JSON.stringify(parsedPreview, null, 2)}</pre>
              </details>

              {debugMeta && (
                <p className="section-help resume-meta-footnote">
                  Parsed from: <strong>{debugMeta.filename}</strong> · Characters processed:{" "}
                  <strong>{debugMeta.characters_used}</strong>
                  {debugMeta.truncated && (
                    <>
                      {" "}
                      · <span className="warn">truncated for internal limits</span>
                    </>
                  )}
                </p>
              )}
            </>
          )}
        </div>

        {status === "error" && !parsedPreview && (
          <div className="resume-inline-error">
            <strong>Tip:</strong> Try exporting your resume as a simple PDF or TXT file and avoid image-only scans.
          </div>
        )}
      </section>
    </div>
  );
}

export default StepResume;
