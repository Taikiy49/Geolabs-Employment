import React from "react";

const emptyReference = { name: "", company: "", phone: "" };

function StepReferences({ form, updateReferenceField, updateField }) {
  const references = form.references || [];

  const handleAddReference = () => {
    const next = [...references, { ...emptyReference }];
    updateField("references", next);
  };

  const handleRemoveReference = (index) => {
    // keep minimum of ONE reference
    if (references.length <= 1) return;
    const next = references.filter((_, i) => i !== index);
    updateField("references", next);
  };

  return (
    <section className="form-section">
      <h2>References</h2>
      <p className="section-help">Please list at least one reference.</p>

      {references.map((ref, i) => (
        <div key={i} className="reference-row">
          <div className="reference-row-header">
            <div className="reference-row-title">Reference #{i + 1}</div>

            {references.length > 1 && (
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
                value={ref.name}
                onChange={(e) =>
                  updateReferenceField(i, "name", e.target.value)
                }
              />
            </div>

            <div className="field">
              <label>Company</label>
              <input
                type="text"
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
                value={ref.phone}
                onChange={(e) =>
                  updateReferenceField(i, "phone", e.target.value)
                }
              />
            </div>
          </div>
        </div>
      ))}

      <div className="form-controls">
        <button
          type="button"
          className="btn outline"
          onClick={handleAddReference}
        >
          Add Reference
        </button>
      </div>

      <div className="field inline-initials">
        <label>Applicant’s Initial (authorization to contact references)</label>
        <input
          type="text"
          value={form.certifyInitials}
          onChange={(e) => updateField("certifyInitials", e.target.value)}
        />
      </div>
    </section>
  );
}

export default StepReferences;
