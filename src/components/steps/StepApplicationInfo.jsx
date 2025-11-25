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
    <div className="form-step application-info-step">
      <section className="form-section application-info-card">
        {/* Header row with title + meta chips */}
        <div className="application-info-header-row">
          <div>
            <h2>Application Information</h2>
            <p className="section-help">
              Start by confirming the basics for this application. You’ll add
              your employment history, education, and other details in the next
              steps.
            </p>
          </div>
          <div className="application-info-meta">
            <span className="app-chip app-chip-step">Step 1</span>
            <span className="app-chip app-chip-required">Required</span>
          </div>
        </div>

        {/* Main grid row: date / position / location */}
        <div className="grid grid-3 application-info-grid">
          <div className="field">
            <label htmlFor="date">Date</label>
            <input
              id="date"
              type="date"
              value={form.date}
              onChange={(e) => updateField("date", e.target.value)}
            />
            <div className="field-hint">Use today’s date or the date submitted.</div>
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
            <div className="field-hint">
              Match the job title from the posting if possible.
            </div>
          </div>

          <div className="field">
            <label htmlFor="location">Preferred Office Location</label>
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
            <div className="field-hint">
              Choose the office you&apos;re primarily applying to.
            </div>
          </div>
        </div>

        {/* Referred by */}
        <div className="field application-info-referred">
          <label htmlFor="referredBy">
            Referred by <span className="optional-tag">(optional)</span>
          </label>
          <input
            id="referredBy"
            type="text"
            placeholder="e.g., Jane Doe, current employee"
            value={form.referredBy}
            onChange={(e) => updateField("referredBy", e.target.value)}
          />
          <div className="field-hint">
            If someone encouraged you to apply, list their name here.
          </div>
        </div>
      </section>
    </div>
  );
}

export default StepApplicationInfo;
