// src/components/ApplicationForm.jsx
import React, { useMemo, useState } from "react";

// Steps (your existing styled components from earlier)
import StepApplicationInfo from "./steps/StepApplicationInfo";
import StepGeneralInfo from "./steps/StepGeneralInfo";
import StepEmployment from "./steps/StepEmployment";
import StepEducation from "./steps/StepEducation";
import StepSkills from "./steps/StepSkills";
import StepReferences from "./steps/StepReferences";
import StepMedical from "./steps/StepMedical";
import StepAffiliations from "./steps/StepAffiliations";
import StepEmploymentCertification from "./steps/StepEmploymentCertification";
import StepEEO from "./steps/StepEEO";
import StepDisability from "./steps/StepDisability";
import StepVeteran from "./steps/StepVeteran";
import StepAgreement from "./steps/StepAgreement";
import StepReview from "./steps/StepReview";

const emptyEmployment = {
  company: "",
  phone: "",
  position: "",
  dateFrom: "",
  dateTo: "",
  duties: "",
  reasonForLeaving: "",
  supervisor: "",
};

const emptyReference = { name: "", company: "", phone: "" };

const emptyForm = {
  // Step 1
  date: "",
  position: "",
  location: "",
  referredBy: "",

  // Step 2
  name: "",
  address: "",
  city: "",
  state: "",
  zip: "",
  email: "",
  phone: "",
  cell: "",

  // Step 3 (up to 3 jobs)
  employment: [{ ...emptyEmployment }, { ...emptyEmployment }, { ...emptyEmployment }],

  // Step 4 (Education)
  highestEducationLevel: "",
  educationSchoolName: "",
  educationSchoolLocation: "",
  educationDegree: "",
  educationFieldOfStudy: "",
  educationYears: "",
  educationAdditional: "",

  // Step 5 (Skills)
  skillsYearsExperience: "",
  skillsPrimaryFocus: "",
  skillsTechnical: "",
  skillsSoftware: "",
  skillsFieldLab: "",
  skillsCommunication: "",
  skillsCertifications: "",

  // Step 6 (References)
  references: [{ ...emptyReference }, { ...emptyReference }], // StepReferences will pad to 2 if needed
  certifyInitials: "",

  // Step 7 (Medical)
  medInitials: "",
  ableToPerformJob: "",

  // Step 8 (Affiliations)
  affiliations: "",

  // Step 9 (Employment cert / disclosures)
  fcrInitials: "",
  knowEmployee: "",
  knowEmployeeName: "",
  applicationCertificationDate: "",
  applicationCertificationSignature: "",

  // Step 10 (EEO)
  eeoName: "",
  eeoDate: "",
  eeoGender: "",
  eeoEthnicity: "",

  // Step 11 (Disability)
  disabilityName: "",
  disabilityDate: "",
  disabilityEmployeeId: "",
  disabilityStatus: "",
  disabilitySignature: "",
  disabilitySignatureDate: "",

  // Step 12 (Veteran)
  vetStatus: "",
  vetName: "",
  vetDate: "",

  // Step 13 (Alcohol/Drug)
  drugAgreementAcknowledge: false,
  drugAgreementSignature: "",
  drugAgreementDate: "",
};

function ApplicationForm() {
  const STEPS = useMemo(
    () => [
      { id: "application", title: "Application Info" },
      { id: "general", title: "General Info" },
      { id: "employment", title: "Employment" },
      { id: "education", title: "Education" },
      { id: "skills", title: "Skills" },
      { id: "references", title: "References" },
      { id: "medical", title: "Medical" },
      { id: "affiliations", title: "Affiliations" },
      { id: "cert", title: "Certification & Disclosures" },
      { id: "eeo", title: "EEO (Voluntary)" },
      { id: "disability", title: "Disability (Voluntary)" },
      { id: "veteran", title: "Veteran (Voluntary)" },
      { id: "agreement", title: "Alcohol/Drug Agreement" },
      { id: "review", title: "Review & Submit" },
    ],
    []
  );

  const [stepIndex, setStepIndex] = useState(0);
  const step = STEPS[stepIndex];

  const [form, setForm] = useState({ ...emptyForm });
  const [resumeFile, setResumeFile] = useState(null);

  // Generic single-field update
  const updateField = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  // Employment array update
  const updateEmploymentField = (index, field, value) => {
    setForm((prev) => {
      const employment = [...(prev.employment || [])];
      employment[index] = { ...(employment[index] || {}), [field]: value };
      return { ...prev, employment };
    });
  };

  // References array update
  const updateReferenceField = (index, field, value) => {
    setForm((prev) => {
      const references = [...(prev.references || [])];
      references[index] = { ...(references[index] || {}), [field]: value };
      return { ...prev, references };
    });
  };

  const goNext = () => setStepIndex((i) => Math.min(i + 1, STEPS.length - 1));
  const goBack = () => setStepIndex((i) => Math.max(i - 1, 0));
  const goTo = (id) => {
    const idx = STEPS.findIndex((s) => s.id === id);
    if (idx >= 0) setStepIndex(idx);
  };

  const handleReset = () => {
    setForm({ ...emptyForm });
    setResumeFile(null);
    setStepIndex(0);
  };

  const handlePrint = () => window.print();

  const isFirst = stepIndex === 0;
  const isLast = step.id === "review";

  // Optional: You can provide these URLs to the steps
  const programUrl = ""; // e.g. "https://www.geolabs-employment.net/alcohol-drug-program.pdf"

  return (
    <div className="form-root">
      {/* Top controls */}
      <div className="form-controls">
        <button type="button" className="btn outline" onClick={handlePrint}>
          Print / Save as PDF
        </button>

        <div className="form-controls-right">
          <div className="form-stepper">
            <span className="form-stepper-pill">
              Step {stepIndex + 1} / {STEPS.length}
            </span>
            <span className="form-stepper-title">{step.title}</span>
          </div>
        </div>
      </div>

      {/* Quick nav (handy for internal testing) */}
      <div className="form-progress">
        {STEPS.map((s, idx) => (
          <button
            key={s.id}
            type="button"
            className={`form-progress-item ${idx === stepIndex ? "active" : ""}`}
            onClick={() => goTo(s.id)}
          >
            {s.title}
          </button>
        ))}
      </div>

      {/* Optional Resume upload (kept here so you don’t re-add old fields like 10-key) */}
      {step.id === "application" && (
        <section className="form-section" style={{ marginBottom: 16 }}>
          <div className="field">
            <label htmlFor="resume">Resume (optional)</label>
            <input
              id="resume"
              type="file"
              accept=".pdf,.doc,.docx,.txt"
              onChange={(e) => setResumeFile(e.target.files?.[0] || null)}
            />
            <p className="section-help">
              If provided, it will be attached to the submission email as a PDF.
            </p>
          </div>
        </section>
      )}

      {/* --------------------- STEP RENDER --------------------- */}
      {step.id === "application" && (
        <StepApplicationInfo form={form} updateField={updateField} />
      )}

      {step.id === "general" && (
        <StepGeneralInfo form={form} updateField={updateField} />
      )}

      {step.id === "employment" && (
        <StepEmployment
          form={form}
          updateEmploymentField={(i, field, value) =>
            updateEmploymentField(i, field, value)
          }
        />
      )}

      {step.id === "education" && (
        <StepEducation form={form} updateField={updateField} />
      )}

      {step.id === "skills" && (
        <StepSkills form={form} updateField={updateField} />
      )}

      {step.id === "references" && (
        <StepReferences
          form={form}
          updateReferenceField={(i, field, value) =>
            updateReferenceField(i, field, value)
          }
          updateField={updateField}
        />
      )}

      {step.id === "medical" && (
        <StepMedical form={form} updateField={updateField} />
      )}

      {step.id === "affiliations" && (
        <StepAffiliations form={form} updateField={updateField} />
      )}

      {step.id === "cert" && (
        <StepEmploymentCertification form={form} updateField={updateField} />
      )}

      {step.id === "eeo" && (
        <StepEEO form={form} updateField={updateField} programUrl={programUrl} />
      )}

      {step.id === "disability" && (
        <StepDisability form={form} updateField={updateField} />
      )}

      {step.id === "veteran" && (
        <StepVeteran form={form} updateField={updateField} />
      )}

      {step.id === "agreement" && (
        <StepAgreement form={form} updateField={updateField} programUrl={programUrl} />
      )}

      {step.id === "review" && (
        <StepReview
          form={form}
          resumeFile={resumeFile}
          onReset={handleReset}
        />
      )}

      {/* Wizard nav */}
      {!isLast && (
        <div className="form-controls bottom">
          <button type="button" className="btn outline" onClick={goBack} disabled={isFirst}>
            Back
          </button>

          <button type="button" className="btn primary" onClick={goNext}>
            Next
          </button>
        </div>
      )}
    </div>
  );
}

export default ApplicationForm;
