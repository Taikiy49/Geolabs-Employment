import React from "react";
import "../../styles/StepGeneralInfo.css";
function StepGeneralInfo({ form, updateField }) {
  return (
    <section className="form-section">
      <h2>General Information</h2>

      <div className="field">
        <label>Name</label>
        <input
          type="text"
          value={form.name}
          onChange={(e) => updateField("name", e.target.value)}
          required
        />
      </div>

      {/* Social Security No. removed */}

      <div className="grid grid-4">
        <div className="field">
          <label>Address</label>
          <input
            type="text"
            value={form.address}
            onChange={(e) => updateField("address", e.target.value)}
          />
        </div>
        <div className="field">
          <label>City</label>
          <input
            type="text"
            value={form.city}
            onChange={(e) => updateField("city", e.target.value)}
          />
        </div>
        <div className="field">
          <label>State</label>
          <input
            type="text"
            value={form.state}
            onChange={(e) => updateField("state", e.target.value)}
          />
        </div>
        <div className="field">
          <label>Zip Code</label>
          <input
            type="text"
            value={form.zip}
            onChange={(e) => updateField("zip", e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-3">
        <div className="field">
          <label>Email Address</label>
          <input
            type="email"
            value={form.email}
            onChange={(e) => updateField("email", e.target.value)}
          />
        </div>
        <div className="field">
          <label>Telephone No.</label>
          <input
            type="tel"
            value={form.phone}
            onChange={(e) => updateField("phone", e.target.value)}
          />
        </div>
        <div className="field">
          <label>Cellular No.</label>
          <input
            type="tel"
            value={form.cell}
            onChange={(e) => updateField("cell", e.target.value)}
          />
        </div>
      </div>
    </section>
  );
}

export default StepGeneralInfo;
