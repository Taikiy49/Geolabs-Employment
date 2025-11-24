import React, { useState } from "react";

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

function ApplicationForm() {
  const [form, setForm] = useState({
    date: "",
    position: "",
    location: "",
    referredBy: "",
    name: "",
    ssn: "",
    address: "",
    city: "",
    state: "",
    zip: "",
    email: "",
    phone: "",
    cell: "",
    employment: [ { ...emptyEmployment }, { ...emptyEmployment }, { ...emptyEmployment } ],
    educationGraduate: "",
    educationGraduateYears: "",
    educationGraduateMajor: "",
    educationTrade: "",
    educationTradeYears: "",
    educationTradeMajor: "",
    educationHigh: "",
    educationHighYears: "",
    educationHighMajor: "",
    typingSpeed: "",
    tenKey: "",
    tenKeyMode: "touch",
    otherMachines: "",
    computerSkills: "",
    languages: "",
    driverLicense: "",
    driverNone: false,
    references: [
      { name: "", company: "", phone: "" },
      { name: "", company: "", phone: "" },
      { name: "", company: "", phone: "" },
    ],
    medInitials: "",
    ableToPerformJob: "",
    affiliations: "",
    fcrInitials: "",
    knowEmployee: "",
    knowEmployeeName: "",
    certifyInitials: "",
    vetStatus: "",
    vetName: "",
    vetDate: "",
    drugAgreementSignature: "",
    drugAgreementDate: "",
  });

  const handleChange = (field) => (e) => {
    const value =
      e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleEmploymentChange = (index, field) => (e) => {
    const value = e.target.value;
    setForm((prev) => {
      const employment = [...prev.employment];
      employment[index] = { ...employment[index], [field]: value };
      return { ...prev, employment };
    });
  };

  const handleReferenceChange = (index, field) => (e) => {
    const value = e.target.value;
    setForm((prev) => {
      const references = [...prev.references];
      references[index] = { ...references[index], [field]: value };
      return { ...prev, references };
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Application submitted:", form);
    alert(
      "Application captured in the browser console.\nFor production, send this to your backend / email."
    );
  };

  const handlePrint = () => window.print();

  return (
    <form className="form-root" onSubmit={handleSubmit}>
      {/* Controls */}
      <div className="form-controls">
        <button type="submit" className="btn primary">
          Submit (Demo)
        </button>
        <button type="button" className="btn outline" onClick={handlePrint}>
          Print / Save as PDF
        </button>
        <p className="form-controls-note">
          This prototype only stores data in your browser. In production,
          connect this form to a backend (email, database, or HR system).
        </p>
      </div>

      {/* Application Header */}
      <section className="form-section">
        <h2>Application Information</h2>
        <div className="grid grid-3">
          <div className="field">
            <label htmlFor="date">Date</label>
            <input
              id="date"
              type="date"
              value={form.date}
              onChange={handleChange("date")}
            />
          </div>
          <div className="field">
            <label htmlFor="position">Position Applying For</label>
            <input
              id="position"
              type="text"
              value={form.position}
              onChange={handleChange("position")}
            />
          </div>
          <div className="field">
            <label htmlFor="location">Location</label>
            <input
              id="location"
              type="text"
              value={form.location}
              onChange={handleChange("location")}
            />
          </div>
        </div>
        <div className="field">
          <label htmlFor="referredBy">Referred by</label>
          <input
            id="referredBy"
            type="text"
            value={form.referredBy}
            onChange={handleChange("referredBy")}
          />
        </div>
      </section>

      {/* General Info */}
      <section className="form-section">
        <h2>General Information</h2>
        <div className="field">
          <label htmlFor="name">Name</label>
          <input
            id="name"
            type="text"
            value={form.name}
            onChange={handleChange("name")}
            required
          />
        </div>
        <div className="grid grid-2">
          <div className="field">
            <label htmlFor="ssn">Social Security No.</label>
            <input
              id="ssn"
              type="text"
              value={form.ssn}
              onChange={handleChange("ssn")}
            />
          </div>
        </div>
        <div className="grid grid-4">
          <div className="field">
            <label htmlFor="address">Address</label>
            <input
              id="address"
              type="text"
              value={form.address}
              onChange={handleChange("address")}
            />
          </div>
          <div className="field">
            <label htmlFor="city">City</label>
            <input
              id="city"
              type="text"
              value={form.city}
              onChange={handleChange("city")}
            />
          </div>
          <div className="field">
            <label htmlFor="state">State</label>
            <input
              id="state"
              type="text"
              value={form.state}
              onChange={handleChange("state")}
            />
          </div>
          <div className="field">
            <label htmlFor="zip">Zip Code</label>
            <input
              id="zip"
              type="text"
              value={form.zip}
              onChange={handleChange("zip")}
            />
          </div>
        </div>
        <div className="grid grid-3">
          <div className="field">
            <label htmlFor="email">Email Address</label>
            <input
              id="email"
              type="email"
              value={form.email}
              onChange={handleChange("email")}
            />
          </div>
          <div className="field">
            <label htmlFor="phone">Telephone No.</label>
            <input
              id="phone"
              type="tel"
              value={form.phone}
              onChange={handleChange("phone")}
            />
          </div>
          <div className="field">
            <label htmlFor="cell">Cellular No.</label>
            <input
              id="cell"
              type="tel"
              value={form.cell}
              onChange={handleChange("cell")}
            />
          </div>
        </div>
      </section>

      {/* Employment Record */}
      <section className="form-section">
        <h2>Employment Record</h2>
        <p className="section-help">
          Starting with your present or most recent position, list previous
          employers. Include self-employment, military service, summer, and
          part-time jobs.
        </p>

        {form.employment.map((job, i) => (
          <div key={i} className="employment-block">
            <h3>Employer #{i + 1}</h3>
            <div className="grid grid-2">
              <div className="field">
                <label>Company Name / Address</label>
                <input
                  type="text"
                  value={job.company}
                  onChange={handleEmploymentChange(i, "company")}
                />
              </div>
              <div className="field">
                <label>Phone</label>
                <input
                  type="tel"
                  value={job.phone}
                  onChange={handleEmploymentChange(i, "phone")}
                />
              </div>
            </div>
            <div className="grid grid-3">
              <div className="field">
                <label>Position</label>
                <input
                  type="text"
                  value={job.position}
                  onChange={handleEmploymentChange(i, "position")}
                />
              </div>
              <div className="field">
                <label>Date Employed (From)</label>
                <input
                  type="text"
                  value={job.dateFrom}
                  onChange={handleEmploymentChange(i, "dateFrom")}
                  placeholder="MM/YYYY"
                />
              </div>
              <div className="field">
                <label>Date Employed (To)</label>
                <input
                  type="text"
                  value={job.dateTo}
                  onChange={handleEmploymentChange(i, "dateTo")}
                  placeholder="MM/YYYY or Present"
                />
              </div>
            </div>
            <div className="field">
              <label>Duties</label>
              <textarea
                rows={3}
                value={job.duties}
                onChange={handleEmploymentChange(i, "duties")}
              />
            </div>
            <div className="grid grid-2">
              <div className="field">
                <label>Reason for Leaving</label>
                <input
                  type="text"
                  value={job.reasonForLeaving}
                  onChange={handleEmploymentChange(i, "reasonForLeaving")}
                />
              </div>
              <div className="field">
                <label>Supervisor / Title</label>
                <input
                  type="text"
                  value={job.supervisor}
                  onChange={handleEmploymentChange(i, "supervisor")}
                />
              </div>
            </div>
          </div>
        ))}
      </section>

      {/* Education */}
      <section className="form-section">
        <h2>Education</h2>

        <div className="education-row">
          <h3>Graduate / College</h3>
          <div className="grid grid-3">
            <div className="field">
              <label>School Name & Location</label>
              <input
                type="text"
                value={form.educationGraduate}
                onChange={handleChange("educationGraduate")}
              />
            </div>
            <div className="field">
              <label>No. of Years Completed</label>
              <input
                type="text"
                value={form.educationGraduateYears}
                onChange={handleChange("educationGraduateYears")}
              />
            </div>
            <div className="field">
              <label>Degree / Major</label>
              <input
                type="text"
                value={form.educationGraduateMajor}
                onChange={handleChange("educationGraduateMajor")}
              />
            </div>
          </div>
        </div>

        <div className="education-row">
          <h3>Business / Trade / Technical</h3>
          <div className="grid grid-3">
            <div className="field">
              <label>School Name & Location</label>
              <input
                type="text"
                value={form.educationTrade}
                onChange={handleChange("educationTrade")}
              />
            </div>
            <div className="field">
              <label>No. of Years Completed</label>
              <input
                type="text"
                value={form.educationTradeYears}
                onChange={handleChange("educationTradeYears")}
              />
            </div>
            <div className="field">
              <label>Degree / Major</label>
              <input
                type="text"
                value={form.educationTradeMajor}
                onChange={handleChange("educationTradeMajor")}
              />
            </div>
          </div>
        </div>

        <div className="education-row">
          <h3>High School</h3>
          <div className="grid grid-3">
            <div className="field">
              <label>School Name & Location</label>
              <input
                type="text"
                value={form.educationHigh}
                onChange={handleChange("educationHigh")}
              />
            </div>
            <div className="field">
              <label>No. of Years Completed</label>
              <input
                type="text"
                value={form.educationHighYears}
                onChange={handleChange("educationHighYears")}
              />
            </div>
            <div className="field">
              <label>Degree / Major</label>
              <input
                type="text"
                value={form.educationHighMajor}
                onChange={handleChange("educationHighMajor")}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Skills */}
      <section className="form-section">
        <h2>Skills</h2>
        <div className="grid grid-3">
          <div className="field">
            <label>Typing (wpm)</label>
            <input
              type="text"
              value={form.typingSpeed}
              onChange={handleChange("typingSpeed")}
            />
          </div>
          <div className="field">
            <label>10-Key</label>
            <input
              type="text"
              value={form.tenKey}
              onChange={handleChange("tenKey")}
            />
          </div>
          <div className="field">
            <label>10-Key Mode</label>
            <select
              value={form.tenKeyMode}
              onChange={handleChange("tenKeyMode")}
            >
              <option value="touch">Touch</option>
              <option value="sight">Sight</option>
            </select>
          </div>
        </div>
        <div className="field">
          <label>Other Machines</label>
          <input
            type="text"
            value={form.otherMachines}
            onChange={handleChange("otherMachines")}
          />
        </div>
        <div className="field">
          <label>Computer (Hardware / Software)</label>
          <textarea
            rows={3}
            value={form.computerSkills}
            onChange={handleChange("computerSkills")}
          />
        </div>
        <div className="field">
          <label>Foreign Languages</label>
          <input
            type="text"
            value={form.languages}
            onChange={handleChange("languages")}
          />
        </div>
        <div className="grid grid-2">
          <div className="field">
            <label>Driver’s License Number and Type</label>
            <input
              type="text"
              value={form.driverLicense}
              onChange={handleChange("driverLicense")}
              disabled={form.driverNone}
            />
          </div>
          <div className="field checkbox-field">
            <label>
              <input
                type="checkbox"
                checked={form.driverNone}
                onChange={handleChange("driverNone")}
              />{" "}
              I do not have a driver’s license
            </label>
          </div>
        </div>
      </section>

      {/* References */}
      <section className="form-section">
        <h2>References</h2>
        <p className="section-help">
          Employers for the past ten years (or professional references).
        </p>
        {form.references.map((ref, i) => (
          <div key={i} className="grid grid-3 reference-row">
            <div className="field">
              <label>Name / Title</label>
              <input
                type="text"
                value={ref.name}
                onChange={handleReferenceChange(i, "name")}
              />
            </div>
            <div className="field">
              <label>Company</label>
              <input
                type="text"
                value={ref.company}
                onChange={handleReferenceChange(i, "company")}
              />
            </div>
            <div className="field">
              <label>Telephone No.</label>
              <input
                type="tel"
                value={ref.phone}
                onChange={handleReferenceChange(i, "phone")}
              />
            </div>
          </div>
        ))}
        <div className="field inline-initials">
          <label>Applicant’s Initials (authorization to contact employers)</label>
          <input
            type="text"
            value={form.certifyInitials}
            onChange={handleChange("certifyInitials")}
          />
        </div>
      </section>

      {/* Medical Info */}
      <section className="form-section">
        <h2>Medical Information & Essential Functions</h2>
        <p className="legal-text">
          After an offer of employment is made, but before employment duties
          begin, applicants are required to undergo a pre-employment physical
          including drug and alcohol testing at the Company’s expense and by a
          Company chosen physician, with the offer conditioned on the results
          of the examination. Employees may also be required to undergo
          periodic examinations at the Company’s expense.
        </p>
        <div className="field inline-initials">
          <label>Applicant’s Initials (medical disclosure authorization)</label>
          <input
            type="text"
            value={form.medInitials}
            onChange={handleChange("medInitials")}
          />
        </div>
        <div className="field">
          <label>
            Are you able to perform the essential functions of this job with or
            without reasonable accommodation?
          </label>
          <input
            type="text"
            placeholder="Yes / No – if no, please explain"
            value={form.ableToPerformJob}
            onChange={handleChange("ableToPerformJob")}
          />
        </div>
      </section>

      {/* Professional Affiliations */}
      <section className="form-section">
        <h2>Professional Affiliations</h2>
        <div className="field">
          <textarea
            rows={3}
            value={form.affiliations}
            onChange={handleChange("affiliations")}
          />
        </div>
      </section>

      {/* Fair Credit Reporting Act */}
      <section className="form-section">
        <h2>Fair Credit Reporting Act Disclosure</h2>
        <p className="legal-text">
          A consumer report, including an investigative consumer report, may be
          obtained for employment purposes as part of the pre-employment
          background investigation and at any time during your employment.
          Additional information regarding the nature and scope of any
          investigative report will be provided upon written request.
        </p>
        <div className="field inline-initials">
          <label>Applicant’s Initials (FCRA acknowledgement)</label>
          <input
            type="text"
            value={form.fcrInitials}
            onChange={handleChange("fcrInitials")}
          />
        </div>
      </section>

      {/* Other */}
      <section className="form-section">
        <h2>Other Information</h2>
        <div className="field">
          <label>Do you know anyone presently working for Geolabs, Inc.?</label>
          <input
            type="text"
            placeholder="Yes / No"
            value={form.knowEmployee}
            onChange={handleChange("knowEmployee")}
          />
        </div>
        <div className="field">
          <label>If yes, who?</label>
          <input
            type="text"
            value={form.knowEmployeeName}
            onChange={handleChange("knowEmployeeName")}
          />
        </div>
      </section>

      {/* Veteran Self-Identification */}
      <section className="form-section">
        <h2>Protected Veteran Self-Identification (VEVRAA)</h2>
        <p className="legal-text">
          Completion of this section is voluntary and will not affect your
          opportunity for employment. Information will be kept confidential and
          used only in accordance with applicable laws and regulations.
        </p>
        <div className="field">
          <label>Veteran Status</label>
          <select
            value={form.vetStatus}
            onChange={handleChange("vetStatus")}
          >
            <option value="">Please select…</option>
            <option value="protected">
              I identify as one or more classifications of protected veteran
            </option>
            <option value="notProtected">I am not a protected veteran</option>
            <option value="noAnswer">I do not wish to self-identify</option>
          </select>
        </div>
        <div className="grid grid-2">
          <div className="field">
            <label>Print Name / Signature</label>
            <input
              type="text"
              value={form.vetName}
              onChange={handleChange("vetName")}
            />
          </div>
          <div className="field">
            <label>Date</label>
            <input
              type="date"
              value={form.vetDate}
              onChange={handleChange("vetDate")}
            />
          </div>
        </div>
      </section>

      {/* Alcohol & Drug Testing Program */}
      <section className="form-section">
        <h2>Agreement to Comply with Alcohol &amp; Drug Testing Program</h2>
        <p className="legal-text">
          Geolabs, Inc. maintains a safe, productive and efficient working
          environment. Applicants who wish to be considered for employment must
          agree to submit to pre-employment alcohol and drug testing, and may
          also be required to submit to testing under other circumstances as
          described in the Company&apos;s Alcohol and Drug Program.
        </p>
        <p className="legal-text">
          Though Hawai‘i may allow for medical marijuana use by prescription,
          federal law prohibits such use and Geolabs, Inc. follows federal law.
          A positive test result for marijuana may result in disciplinary action
          consistent with Company policy and applicable regulations.
        </p>
        <div className="grid grid-2">
          <div className="field">
            <label>Signature of Applicant</label>
            <input
              type="text"
              value={form.drugAgreementSignature}
              onChange={handleChange("drugAgreementSignature")}
            />
          </div>
          <div className="field">
            <label>Date</label>
            <input
              type="date"
              value={form.drugAgreementDate}
              onChange={handleChange("drugAgreementDate")}
            />
          </div>
        </div>
      </section>

      {/* Certification */}
      <section className="form-section">
        <h2>Certification &amp; At-Will Acknowledgement</h2>
        <p className="legal-text">
          I certify that all information provided in this application is
          complete and accurate. I understand that false, misleading, or
          incomplete information may result in a decision not to hire or be
          grounds for termination. I understand that this application does not
          create a contract of employment and that, if employed, my employment
          is at-will and may be terminated at any time by either party with or
          without cause or notice.
        </p>
        <div className="grid grid-2">
          <div className="field">
            <label>Application Date</label>
            <input
              type="date"
              value={form.date}
              onChange={handleChange("date")}
            />
          </div>
          <div className="field">
            <label>Applicant’s Signature (type full name)</label>
            <input
              type="text"
              value={form.name}
              onChange={handleChange("name")}
            />
          </div>
        </div>
      </section>

      {/* Final Buttons (bottom as well) */}
      <div className="form-controls bottom">
        <button type="submit" className="btn primary">
          Submit (Demo)
        </button>
        <button type="button" className="btn outline" onClick={handlePrint}>
          Print / Save as PDF
        </button>
      </div>
    </form>
  );
}

export default ApplicationForm;
