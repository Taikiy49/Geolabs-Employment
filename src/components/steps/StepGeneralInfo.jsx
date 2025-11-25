import React from "react";
import "../../styles/StepGeneralInfo.css";

function StepGeneralInfo({ form, updateField }) {
  return (
    <div className="form-step general-info-step">
      <section className="form-section general-info-card general-info-section">
        {/* Header row with title + meta chips */}
        <div className="general-info-header-row">
          <div>
            <h2>General Information</h2>
            <p className="section-help">
              Tell us how we can contact you. This information will be used for
              communication about your application and potential next steps.
            </p>
          </div>
          <div className="general-info-meta">
            <span className="gi-chip gi-chip-step">Step 2</span>
            <span className="gi-chip gi-chip-required">Required</span>
          </div>
        </div>

        {/* Name */}
        <div className="field general-info-name-field">
          <label htmlFor="name">
            Full Name <span className="required-tag">*</span>
          </label>
          <input
            id="name"
            type="text"
            placeholder="e.g., First M. Last"
            value={form.name}
            onChange={(e) => updateField("name", e.target.value)}
            required
          />
          <div className="field-hint">
            Use your legal name as it appears on official documents.
          </div>
        </div>

        {/* Address row */}
        <div className="grid grid-4 general-info-address-grid">
          <div className="field">
            <label htmlFor="address">Address</label>
            <input
              id="address"
              type="text"
              placeholder="Street address"
              value={form.address}
              onChange={(e) => updateField("address", e.target.value)}
            />
          </div>
          <div className="field">
            <label htmlFor="city">City</label>
            <input
              id="city"
              type="text"
              placeholder="City"
              value={form.city}
              onChange={(e) => updateField("city", e.target.value)}
            />
          </div>
          <div className="field">
            <label htmlFor="state">State</label>
            <input
              id="state"
              type="text"
              placeholder="State"
              value={form.state}
              onChange={(e) => updateField("state", e.target.value)}
            />
          </div>
          <div className="field">
            <label htmlFor="zip">Zip Code</label>
            <input
              id="zip"
              type="text"
              placeholder="ZIP"
              value={form.zip}
              onChange={(e) => updateField("zip", e.target.value)}
            />
          </div>
        </div>
        <p className="field-hint subtle-hint">
          Your address helps us understand your proximity to office locations.
        </p>

        {/* Contact row */}
        <div className="grid grid-3 general-info-contact-grid">
          <div className="field">
            <label htmlFor="email">
              Email Address <span className="required-tag">*</span>
            </label>
            <input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={(e) => updateField("email", e.target.value)}
            />
            <div className="field-hint">
              We’ll use this email for all application-related communication.
            </div>
          </div>
          <div className="field">
            <label htmlFor="phone">
              Telephone No. <span className="optional-tag">(optional)</span>
            </label>
            <input
              id="phone"
              type="tel"
              placeholder="Primary phone"
              value={form.phone}
              onChange={(e) => updateField("phone", e.target.value)}
            />
            <div className="field-hint">
              Landline or alternate contact number (if applicable).
            </div>
          </div>
          <div className="field">
            <label htmlFor="cell">
              Cellular No. <span className="optional-tag">(optional)</span>
            </label>
            <input
              id="cell"
              type="tel"
              placeholder="Mobile phone"
              value={form.cell}
              onChange={(e) => updateField("cell", e.target.value)}
            />
            <div className="field-hint">
              Mobile number is preferred for time-sensitive updates.
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default StepGeneralInfo;
