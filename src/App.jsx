import React, { useState } from "react";
import "./App.css";

import Stepper from "./components/Stepper.jsx";
import StepShell from "./components/StepShell.jsx";

// Steps
import StepIntro from "./components/steps/StepIntro.jsx";
import StepResume from "./components/steps/StepResume.jsx";
import StepApplicationInfo from "./components/steps/StepApplicationInfo.jsx";
import StepGeneralInfo from "./components/steps/StepGeneralInfo.jsx";
import StepEmployment from "./components/steps/StepEmployment.jsx";
import StepEducation from "./components/steps/StepEducation.jsx";
import StepSkills from "./components/steps/StepSkills.jsx";
import StepReferences from "./components/steps/StepReferences.jsx";
import StepMedical from "./components/steps/StepMedical.jsx";
import StepAffiliations from "./components/steps/StepAffiliations.jsx";
import StepEmploymentCertification from "./components/steps/StepEmploymentCertification.jsx";
import StepEEO from "./components/steps/StepEEO.jsx";
import StepDisability from "./components/steps/StepDisability.jsx";
import StepVeteran from "./components/steps/StepVeteran.jsx";
import StepAgreement from "./components/steps/StepAgreement.jsx";
import StepReview from "./components/steps/StepReview.jsx";

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

const initialFormState = {
  date: "",
  position: "",
  location: "",
  referredBy: "",

  name: "",
  address: "",
  city: "",
  state: "",
  zip: "",
  email: "",
  phone: "",
  cell: "",

  employment: [{ ...emptyEmployment }, { ...emptyEmployment }, { ...emptyEmployment }],

  highestEducationLevel: "",
  educationSchoolName: "",
  educationSchoolLocation: "",
  educationDegree: "",
  educationFieldOfStudy: "",
  educationYears: "",
  educationAdditional: "",

  skillsYearsExperience: "",
  skillsPrimaryFocus: "",
  skillsTechnical: "",
  skillsSoftware: "",
  skillsFieldLab: "",
  skillsCommunication: "",
  skillsCertifications: "",

  references: [{ ...emptyReference }, { ...emptyReference }, { ...emptyReference }],
  certifyInitials: "",

  medInitials: "",
  ableToPerformJob: "",

  affiliations: "",

  fcrInitials: "",
  knowEmployee: "",
  knowEmployeeName: "",
  applicationCertificationDate: "",
  applicationCertificationSignature: "",

  eeoName: "",
  eeoDate: "",
  eeoGender: "",
  eeoEthnicity: "",

  disabilityName: "",
  disabilityDate: "",
  disabilityEmployeeId: "",
  disabilityStatus: "",
  disabilitySignature: "",
  disabilitySignatureDate: "",

  vetStatus: "",
  vetName: "",
  vetDate: "",

  drugAgreementSignature: "",
  drugAgreementDate: "",
};

const steps = [
  { id: "intro", label: "Start & Openings", Component: StepIntro },
  { id: "resume", label: "Resume Import", Component: StepResume },
  { id: "application", label: "Application Info", Component: StepApplicationInfo },
  { id: "general", label: "General Info", Component: StepGeneralInfo },
  { id: "employment", label: "Employment", Component: StepEmployment },
  { id: "education", label: "Education", Component: StepEducation },
  { id: "skills", label: "Skills", Component: StepSkills },
  { id: "references", label: "References", Component: StepReferences },
  { id: "medical", label: "Medical", Component: StepMedical },
  { id: "affiliations", label: "Affiliations", Component: StepAffiliations },
  { id: "employment-cert", label: "Employment Cert.", Component: StepEmploymentCertification },
  { id: "eeo", label: "EEO Self-ID", Component: StepEEO },
  { id: "disability", label: "Disability Self-ID", Component: StepDisability },
  { id: "veteran", label: "Protected Veteran", Component: StepVeteran },
  { id: "alcohol-drug", label: "Alcohol & Drug", Component: StepAgreement },
  { id: "review", label: "Review & Submit", Component: StepReview },
];

const branches = [
  { label: "Employment Application", from: 0, to: 10 },
  { label: "Self-Identification", from: 11, to: 13 },
  { label: "Alcohol & Drug Testing Program", from: 14, to: 14 },
  { label: "Review & Submit", from: 15, to: 15 },
];

function App() {
  const [form, setForm] = useState(initialFormState);
  const [stepIndex, setStepIndex] = useState(0);
  const [direction, setDirection] = useState("forward");
  const [resumeFile, setResumeFile] = useState(null);

  const updateField = (field, value) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const updateEmploymentField = (index, field, value) => {
    setForm((prev) => {
      const employment = [...(prev.employment || [])];
      employment[index] = { ...(employment[index] || {}), [field]: value };
      return { ...prev, employment };
    });
  };

  const updateReferenceField = (index, field, value) => {
    setForm((prev) => {
      const references = [...(prev.references || [])];
      references[index] = { ...(references[index] || {}), [field]: value };
      return { ...prev, references };
    });
  };

  const applyParsedResume = (partial) =>
    setForm((prev) => ({ ...prev, ...partial }));

  const goNext = () => {
    setDirection("forward");
    setStepIndex((i) => Math.min(i + 1, steps.length - 1));
  };

  const goBack = () => {
    setDirection("back");
    setStepIndex((i) => Math.max(i - 1, 0));
  };

  const handlePrint = () => window.print();

  const CurrentStep = steps[stepIndex].Component;
  const isIntro = stepIndex === 0;

  return (
    <div className="app-root">
      <header className="app-header">
        <div className="app-header-inner">
          <div className="app-header-left">
            <div className="app-header-logo">
              {/* Put your PNG in /public (example name below) */}
              <div className="app-header-logo-wrap">
                <img
                  src="/geolabs-50th.png"
                  alt="Geolabs 50th Anniversary Logo"
                  className="app-header-logo-img app-header-logo-img-50th"
                  draggable="false"
                />
              </div>
            </div>
          </div>

          <div className="app-header-meta">
            <span className="app-header-subtitle">
              Employment Application &amp; Required Notices
            </span>
            <span className="app-header-tag">Secure · Confidential · Online</span>
          </div>
        </div>
      </header>

      <main className="app-main">
        <div className="wizard-shell">
          <Stepper
            steps={steps}
            branches={branches}
            activeIndex={stepIndex}
            onStepClick={(index) => setStepIndex(index)}
          />

          <StepShell
            title={steps[stepIndex].label}
            stepIndex={stepIndex}
            totalSteps={steps.length}
            onNext={goNext}
            onBack={goBack}
            onPrint={handlePrint}
            isLastStep={stepIndex === steps.length - 1}
            direction={direction}
            hideFooterNav={isIntro}
            nextLabel={isIntro ? "Apply Now" : "Next"}
          >
            <CurrentStep
              form={form}
              updateField={updateField}
              updateEmploymentField={updateEmploymentField}
              updateReferenceField={updateReferenceField}
              onNext={isIntro ? goNext : undefined}
              onApplyParsedResume={applyParsedResume}
              resumeFile={resumeFile}
              onResumeFileSelected={setResumeFile}
            />
          </StepShell>
        </div>
      </main>

      <footer className="app-footer">
        94-429 Koaki Street, Suite 200 · Waipahu, HI 96797 · Equal Opportunity Employer
      </footer>
    </div>
  );
}

export default App;
