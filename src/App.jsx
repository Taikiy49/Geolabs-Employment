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
  address: "",
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
  // Application / General
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

  // Employment
  employment: [
    { ...emptyEmployment },
    { ...emptyEmployment },
    { ...emptyEmployment },
  ],

  // Education
  educationGraduate: "",
  educationGraduateYears: "",
  educationGraduateMajor: "",
  educationTrade: "",
  educationTradeYears: "",
  educationTradeMajor: "",
  educationHigh: "",
  educationHighYears: "",
  educationHighMajor: "",

  // Skills
  typingSpeed: "",
  tenKey: "",
  tenKeyMode: "touch",
  computerSkills: "",
  driverLicense: "",
  driverNone: false,

  // References
  references: [
    { ...emptyReference },
    { ...emptyReference },
    { ...emptyReference },
  ],
  certifyInitials: "",

  // Medical & affiliations
  medInitials: "",
  ableToPerformJob: "",
  affiliations: "",

  // Employment Application – FCRA / Other / certification
  fcrInitials: "",
  knowEmployee: "",
  knowEmployeeName: "",
  applicationCertificationDate: "",
  applicationCertificationSignature: "",

  // Self-ID: EEO
  eeoName: "",
  eeoDate: "",
  eeoGender: "",
  eeoEthnicity: "",

  // Self-ID: Disability
  disabilityName: "",
  disabilityDate: "",
  disabilityEmployeeId: "",
  disabilityStatus: "",
  disabilitySignature: "",
  disabilitySignatureDate: "",

  // Self-ID: Protected Veteran
  vetStatus: "",
  vetName: "",
  vetDate: "",

  // Alcohol & Drug Testing Program
  drugAgreementSignature: "",
  drugAgreementDate: "",
};

const steps = [
  // Intro step (jobs + benefits + Apply Now)
  { id: "intro", label: "Start & Openings", Component: StepIntro },

  // Smart resume upload/autofill step
  { id: "resume", label: "Resume Import", Component: StepResume },

  // Employment Application branch
  { id: "application", label: "Application Info", Component: StepApplicationInfo },
  { id: "general", label: "General Info", Component: StepGeneralInfo },
  { id: "employment", label: "Employment", Component: StepEmployment },
  { id: "education", label: "Education", Component: StepEducation },
  { id: "skills", label: "Skills", Component: StepSkills },
  { id: "references", label: "References", Component: StepReferences },
  { id: "medical", label: "Medical", Component: StepMedical },
  { id: "affiliations", label: "Affiliations", Component: StepAffiliations },
  {
    id: "employment-cert",
    label: "Employment Cert.",
    Component: StepEmploymentCertification,
  },

  // Self-identification branch
  { id: "eeo", label: "EEO Self-ID", Component: StepEEO },
  { id: "disability", label: "Disability Self-ID", Component: StepDisability },
  { id: "veteran", label: "Protected Veteran", Component: StepVeteran },

  // Alcohol & Drug testing branch
  { id: "alcohol-drug", label: "Alcohol & Drug", Component: StepAgreement },

  // Final review
  { id: "review", label: "Review & Submit", Component: StepReview },
];

// Branches for the progress bar
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

  const updateField = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const updateEmploymentField = (index, field, value) => {
    setForm((prev) => {
      const employment = [...prev.employment];
      employment[index] = { ...employment[index], [field]: value };
      return { ...prev, employment };
    });
  };

  const updateReferenceField = (index, field, value) => {
    setForm((prev) => {
      const references = [...prev.references];
      references[index] = { ...references[index], [field]: value };
      return { ...prev, references };
    });
  };

  // Called by StepResume to merge parsed resume fields into the application
  const applyParsedResume = (partial) => {
    setForm((prev) => ({
      ...prev,
      ...partial,
    }));
  };

  const goNext = () => {
    setDirection("forward");
    setStepIndex((i) => Math.min(i + 1, steps.length - 1));
  };

  const goBack = () => {
    setDirection("back");
    setStepIndex((i) => Math.max(i - 1, 0));
  };

  const handleSubmit = () => {
    console.log("FINAL APPLICATION:", form);
    alert(
      "Application submitted! (Data is in the console – connect this to your backend when ready.)"
    );
  };

  const handlePrint = () => {
    window.print();
  };

  const CurrentStep = steps[stepIndex].Component;
  const isIntro = stepIndex === 0;

  return (
    <div className="app-root">
      <header className="app-header">
        <div className="app-header-inner">
          <div className="app-header-logo">
            <img
              src="/geolabs.png"
              alt="Geolabs Logo"
              className="app-header-logo-img"
            />
            <span className="logo-text">GEOLABS, INC.</span>
          </div>

          <div className="app-header-meta">
            <span className="app-header-subtitle">
              Employment Application &amp; Required Notices
            </span>
            <span className="app-header-tag">
              Secure · Confidential · Online
            </span>
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
            onSubmit={handleSubmit}
            onPrint={handlePrint}
            isLastStep={stepIndex === steps.length - 1}
            direction={direction}
            hideFooterNav={isIntro} // hide bottom Next/Back on intro
            nextLabel={isIntro ? "Apply Now" : "Next"}
          >
            <CurrentStep
              form={form}
              updateField={updateField}
              updateEmploymentField={updateEmploymentField}
              updateReferenceField={updateReferenceField}
              onNext={isIntro ? goNext : undefined} // intro gets its own Apply Now button
              onApplyParsedResume={applyParsedResume} // used by StepResume
            />
          </StepShell>
        </div>
      </main>

      <footer className="app-footer">
        94-429 Koaki Street, Suite 200 · Waipahu, HI 96797 · Equal Opportunity
        Employer
      </footer>
    </div>
  );
}

export default App;
