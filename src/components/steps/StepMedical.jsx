import React from "react";

function StepMedical({ form, updateField }) {
  return (
    <section className="form-section">
      <h2>Medical Information</h2>

      <p className="legal-text">
        After an offer of employment is made, but before employment duties
        begin, applicants are required to undergo a pre-employment physical
        including drug and alcohol testing at the Company’s expense and by a
        Company chosen physician, with the offer of employment conditioned on
        the result of such examination. Employees, at any time during the
        course of their employment, may be required to undergo an annual
        physical examination including drug and alcohol testing at the Company’s
        expense and by a Company chosen physician. I authorize the physician
        conducting the examination and any laboratory testing and any specimen
        obtained by the physician, to disclose the results of the examination
        and the laboratory test to the Company.
      </p>

      <div className="field inline-initials">
        <label>Applicant’s Initial</label>
        <input
          type="text"
          value={form.medInitials}
          onChange={(e) => updateField("medInitials", e.target.value)}
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
          onChange={(e) => updateField("ableToPerformJob", e.target.value)}
        />
      </div>
    </section>
  );
}

export default StepMedical;
