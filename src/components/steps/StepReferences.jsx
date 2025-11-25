// src/components/steps/StepReferences.jsx
import React, { useEffect } from "react";
import "../../styles/StepReferences.css";

const emptyReference = { name: "", company: "", phone: "" };
const MIN_REFERENCES = 2;
const MAX_REFERENCES = 3;

function StepReferences({ form, updateReferenceField, updateField }) {
  const references = form.references || [];

  // Ensure at least 2 reference slots exist
  useEffect(() => {
    if (!references || references.length < MIN_REFERENCES) {
      const padded = [...references];
      while (padded.length < MIN_REFERENCES) {
        padded.push({ ...emptyReference });
      }
      updateField("references", padded);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [references]);

  const handleAddReference = () => {
    if (references.length >= MAX_REFERENCES) return;
    const next = [...references, { ...emptyReference }];
    updateField("references", next);
  };

  const handleRemoveReference = (index) => {
    // keep a minimum of TWO references
    if (references.length <= MIN_REFERENCES) return;
    const next = references.filter((_, i) => i !== index);
    updateField("references", next);
  };

  const canAddMore = references.length < MAX_REFERENCES;

  return (
    <div className="form-step references-step">
      <section className="form-section references-section">
        <div className="references-header-row">
          <div>
            <h2>References</h2>
            <p className="section-help">
              Please provide at least two professional references we may contact.
            </p>
          </div>
          <div className="references-meta">
            <span className="references-chip references-chip-primary">
              2–3 references requested
            </span>
            <span className="references-chip references-chip-muted">
              Supervisors or colleagues preferred
            </span>
          </div>
        </div>

        {references.map((ref, i) => (
          <div key={i} className="reference-row">
            <div className="reference-row-header">
              <div className="reference-row-title">
                Reference #{i + 1}
                <span className="reference-row-subtitle">
                  {i === 0 || i === 1
                    ? "Required"
                    : "Optional (additional reference)"}
                </span>
              </div>

              {references.length > MIN_REFERENCES && (
                <button
                  type="button"
                  className="btn ghost reference-remove-btn"
                  onClick={() => handleRemoveReference(i)}
                >
                  Remove
                </button>
              )}
            </div>

            <div className="grid grid-3">
              <div className="field">
                <label>Name / Title</label>
                <input
                  type="text"
                  placeholder="e.g., Jane Doe – Project Manager"
                  value={ref.name}
                  onChange={(e) =>
                    updateReferenceField(i, "name", e.target.value)
                  }
                />
              </div>

              <div className="field">
                <label>Company / Relationship</label>
                <input
                  type="text"
                  placeholder="e.g., Geolabs, Inc. – Direct Supervisor"
                  value={ref.company}
                  onChange={(e) =>
                    updateReferenceField(i, "company", e.target.value)
                  }
                />
              </div>

              <div className="field">
                <label>Contact No.</label>
                <input
                  type="tel"
                  placeholder="e.g., (808) 555-1234"
                  value={ref.phone}
                  onChange={(e) =>
                    updateReferenceField(i, "phone", e.target.value)
                  }
                />
              </div>
            </div>
          </div>
        ))}

        <div className="references-controls-row">
          <button
            type="button"
            className="btn outline"
            onClick={handleAddReference}
            disabled={!canAddMore}
          >
            Add Another Reference
          </button>
          <span className="references-limit-note">
            {canAddMore
              ? "You can add up to one more reference (maximum of 3)."
              : "Maximum of 3 references reached."}
          </span>
        </div>

        <div className="references-authorization-card">
          <h3>Authorization to Contact References</h3>
          <p className="references-authorization-text">
            By initialing below, you authorize Geolabs, Inc. to contact the
            references listed above regarding your employment history and
            qualifications.
          </p>
          <div className="field inline-initials">
            <label>Applicant’s Initials</label>
            <input
              type="text"
              placeholder="e.g., TY"
              value={form.certifyInitials || ""}
              onChange={(e) => updateField("certifyInitials", e.target.value)}
            />
          </div>
        </div>
      </section>
    </div>
  );
}

export default StepReferences;
