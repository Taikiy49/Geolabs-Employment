import React from "react";

function StepDisability({ form, updateField }) {
  return (
    <section className="form-section">
      <h2>Voluntary Self-Identification of Disability</h2>
      <p className="legal-text">
        Form CC-305 OMB Control Number 1250-0005
        <br />
        Page 1 of 1 Expires 04/30/2026
      </p>

      <div className="grid grid-3">
        <div className="field">
          <label>Name</label>
          <input
            type="text"
            value={form.disabilityName}
            onChange={(e) => updateField("disabilityName", e.target.value)}
          />
        </div>
        <div className="field">
          <label>Date</label>
          <input
            type="date"
            value={form.disabilityDate}
            onChange={(e) => updateField("disabilityDate", e.target.value)}
          />
        </div>
        <div className="field">
          <label>Employee ID (if applicable)</label>
          <input
            type="text"
            value={form.disabilityEmployeeId}
            onChange={(e) =>
              updateField("disabilityEmployeeId", e.target.value)
            }
          />
        </div>
      </div>

      <h3>Why are you being asked to complete this form?</h3>
      <p className="legal-text">
        We are a federal contractor or subcontractor. The law requires us to
        provide equal employment opportunity to qualified people with
        disabilities. We have a goal of having at least 7% of our workers as
        people with disabilities. The law says we must measure our progress
        towards this goal. To do this, we must ask applicants and employees if
        they have a disability or have ever had one. People can become
        disabled, so we need to ask this question at least every five years.
      </p>

      <p className="legal-text">
        Completing this form is voluntary, and we hope that you will choose to
        do so. Your answer is confidential. No one who makes hiring decisions
        will see it. Your decision to complete the form and your answer will not
        harm you in any way. If you want to learn more about the law or this
        form, visit the U.S. Department of Labor’s Office of Federal Contract
        Compliance Programs (OFCCP) website at www.dol.gov/ofccp.
      </p>

      <h3>How do you know if you have a disability?</h3>
      <p className="legal-text">
        A disability is a condition that substantially limits one or more of
        your “major life activities.” If you have or have ever had such a
        condition, you are a person with a disability. Disabilities include, but
        are not limited to:
      </p>

      <ul className="legal-text">
        <li>
          Alcohol or other substance use disorder (not currently using drugs
          illegally)
        </li>
        <li>
          Autoimmune disorder, for example, lupus, fibromyalgia, rheumatoid
          arthritis, HIV/AIDS
        </li>
        <li>Blind or low vision</li>
        <li>Cancer (past or present)</li>
        <li>Cardiovascular or heart disease</li>
        <li>Celiac disease</li>
        <li>Cerebral palsy</li>
        <li>Deaf or serious difficulty hearing</li>
        <li>Diabetes</li>
        <li>
          Disfigurement, for example, disfigurement caused by burns, wounds,
          accidents, or congenital disorders
        </li>
        <li>Epilepsy or other seizure disorder</li>
        <li>
          Gastrointestinal disorders, for example, Crohn&apos;s Disease,
          irritable bowel syndrome
        </li>
        <li>Intellectual or developmental disability</li>
        <li>
          Mental health conditions, for example, depression, bipolar disorder,
          anxiety disorder, schizophrenia, PTSD
        </li>
        <li>Missing limbs or partially missing limbs</li>
        <li>
          Mobility impairment, benefiting from the use of a wheelchair, scooter,
          walker, leg brace(s) and/or other supports
        </li>
        <li>
          Nervous system condition, for example, migraine headaches,
          Parkinson’s disease, multiple sclerosis (MS)
        </li>
        <li>
          Neurodivergence, for example, attention-deficit/hyperactivity disorder
          (ADHD), autism spectrum disorder, dyslexia, dyspraxia, other learning
          disabilities
        </li>
        <li>Partial or complete paralysis (any cause)</li>
        <li>
          Pulmonary or respiratory conditions, for example, tuberculosis,
          asthma, emphysema
        </li>
        <li>Short stature (dwarfism)</li>
        <li>Traumatic brain injury</li>
      </ul>

      <div className="form-section">
        <p className="legal-text">Please check one of the boxes below:</p>

        <div className="field">
          <label className="checkbox-field">
            <input
              type="radio"
              name="disabilityStatus"
              value="Yes, I have a disability, or have had one in the past"
              checked={
                form.disabilityStatus ===
                "Yes, I have a disability, or have had one in the past"
              }
              onChange={(e) =>
                updateField("disabilityStatus", e.target.value)
              }
            />
            Yes, I have a disability, or have had one in the past
          </label>
        </div>

        <div className="field">
          <label className="checkbox-field">
            <input
              type="radio"
              name="disabilityStatus"
              value="No, I do not have a disability and have not had one in the past"
              checked={
                form.disabilityStatus ===
                "No, I do not have a disability and have not had one in the past"
              }
              onChange={(e) =>
                updateField("disabilityStatus", e.target.value)
              }
            />
            No, I do not have a disability and have not had one in the past
          </label>
        </div>

        <div className="field">
          <label className="checkbox-field">
            <input
              type="radio"
              name="disabilityStatus"
              value="I do not want to answer"
              checked={
                form.disabilityStatus === "I do not want to answer"
              }
              onChange={(e) =>
                updateField("disabilityStatus", e.target.value)
              }
            />
            I do not want to answer
          </label>
        </div>
      </div>

      <p className="legal-text">
        PUBLIC BURDEN STATEMENT: According to the Paperwork Reduction Act of
        1995 no persons are required to respond to a collection of information
        unless such collection displays a valid OMB control number. This survey
        should take about 5 minutes to complete.
      </p>

      <div className="form-section">
        <h3>For Employer Use Only</h3>
        <p className="legal-text">
          Employers may modify this section of the form as needed for
          recordkeeping purposes.
          <br />
          For example:
          <br />
          Job Title: Date of Hire:
        </p>
      </div>

      <div className="grid grid-2">
        <div className="field">
          <label>Signature</label>
          <input
            type="text"
            value={form.disabilitySignature}
            onChange={(e) =>
              updateField("disabilitySignature", e.target.value)
            }
          />
        </div>
        <div className="field">
          <label>Date</label>
          <input
            type="date"
            value={form.disabilitySignatureDate}
            onChange={(e) =>
              updateField("disabilitySignatureDate", e.target.value)
            }
          />
        </div>
      </div>
    </section>
  );
}

export default StepDisability;
