import React from "react";

function StepAffiliations({ form, updateField }) {
  return (
    <section className="form-section">
      <h2>Professional Affiliations</h2>

      <p className="section-help">
        This section is optional. List any memberships, licenses, or
        professional organizations related to your work (for example: ASCE,
        ACI, IEEE, trade unions, engineering societies, or certifications like
        EIT, OSHA 10/30, ACI Field Tech, etc.). If none, you may simply enter
        “N/A”.
      </p>

      <div className="field">
        <label htmlFor="affiliations">
          Professional Affiliations, Licenses, or Memberships
        </label>
        <textarea
          id="affiliations"
          rows={5}
          value={form.affiliations}
          onChange={(e) => updateField("affiliations", e.target.value)}
          placeholder={`Examples:
• ASCE Member (since 2022)
• ACI Concrete Field Testing Technician – Grade I
• Engineer-in-Training (EIT), State of Hawaii
• OSHA 30-Hour Construction Safety

If none, type: N/A`}
        />
      </div>
    </section>
  );
}

export default StepAffiliations;
