import React from "react";
import "../../styles/StepApplicationInfo.css";

const LOCATION_OPTIONS = [
  { value: "", label: "Select location…" },
  {
    value: "Oahu – 94-429 Koaki Street, Suite 200, Waipahu, HI 96797",
    label: "Oahu – Waipahu, HI",
  },
  {
    value: "Maui – 780 Alua Street, 1st Floor, Wailuku, HI 96793",
    label: "Maui – Wailuku, HI",
  },
  {
    value: "Kauai – 1639 Haleukana Street, Unit #5, Lihue, HI 96766",
    label: "Kauai – Lihue, HI",
  },
  {
    value: "Oakland – 344 20th Street, Suite 340, Oakland, CA 94612",
    label: "Oakland – Oakland, CA",
  },
];

function StepApplicationInfo({ form, updateField }) {
  return (
    <div className="form-step">
      <section className="form-section">
        <h2>Application Information</h2>
        <p className="section-help">
          Please complete the basic information for your application. You will
          be able to enter your employment history, education, and other details
          in the following steps.
        </p>
        <div className="grid grid-3">
          <div className="field">
            <label htmlFor="date">Date</label>
            <input
              id="date"
              type="date"
              value={form.date}
              onChange={(e) => updateField("date", e.target.value)}
            />
          </div>
          <div className="field">
            <label htmlFor="position">Position Applying For</label>
            <input
              id="position"
              type="text"
              placeholder="e.g., Staff Engineer"
              value={form.position}
              onChange={(e) => updateField("position", e.target.value)}
            />
          </div>
          <div className="field">
            <label htmlFor="location">Location</label>
            <select
              id="location"
              value={form.location}
              onChange={(e) => updateField("location", e.target.value)}
            >
              {LOCATION_OPTIONS.map((opt) => (
                <option key={opt.value || "blank"} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="field">
          <label htmlFor="referredBy">Referred by</label>
          <input
            id="referredBy"
            type="text"
            value={form.referredBy}
            onChange={(e) => updateField("referredBy", e.target.value)}
          />
        </div>
      </section>
    </div>
  );
}

export default StepApplicationInfo;
