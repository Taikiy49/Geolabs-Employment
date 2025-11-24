import React from "react";

function StepAgreement({ form, updateField }) {
  return (
    <section className="form-section">
      <h2>
        AGREEMENT OF APPLICANT TO COMPLY WITH GEOLABS, INC. ALCOHOL AND DRUG
        TESTING PROGRAM
      </h2>

      <p className="legal-text">
        (To be completed by all applicants for all positions)
      </p>

      <p className="legal-text">
        The Company has a vital interest in maintaining a safe, productive and
        efficient working environment for its employees and the public. Using or
        being under the influence of alcohol and/or drugs on the job may pose
        serious safety and health risks not only for the user, but also to
        co workers and the public.
      </p>

      <p className="legal-text">
        To meet this compelling interest, and because the Company is required to
        comply with the Department of Transportation&apos;s Illegal Drugs and
        Alcohol Testing Regulations (49 CFR Parta 40 and 382), applicants who
        wish to be considered for employment must agree to SUBMIT TO PRE
        EMPLOYMENT ALCOHOL AND DRUG TESTING.
      </p>

      <p className="legal-text">
        By completing and signing this Notice and the attached Application of
        Employment, the employee applicant understands and agrees to submit to
        an alcohol and drug testing as provided for in the Company’s Alcohol and
        Drug Program. In addition to pre-¬employment testing, the program also
        sets forth requirements for reasonable suspicion testing, post-accident
        testing, random testing, return to duty testing and follow up testing. A
        copy of the program may be obtained from the HR Manager who is also the
        Designated Employer Representative (DER).
      </p>

      <p className="legal-text">
        I further acknowledge that though Hawai`i may allow for medical
        marijuana use by prescription, federal law prohibits such use and
        Geolabs, Inc. follows federal law. I understand that if my work results
        in my being covered by DOT regulations, a positive test result for
        marijuana will result in appropriate disciplinary action and neither
        Geolabs, Inc. nor its MRO will accept a medical marijuana prescription
        to overturn a positive test result for marijuana. I understand that if I
        am not subject to DOT regulations and I produce a valid medical
        marijuana prescription, I will be required to ask my physician to change
        my prescription to a medication that is legal under federal law and to
        comply with all other testing and reporting requirements in this policy.
      </p>

      <p className="legal-text">
        ANY APPLICANT WHO IS UNWILLING TO AGREE TO THESE CONDITIONS SHOULD NOT
        APPLY FOR EMPLOYMENT WITH GEOLABS, INC.
      </p>

      <div className="grid grid-2">
        <div className="field">
          <label>Signature of Applicant</label>
          <input
            type="text"
            value={form.drugAgreementSignature}
            onChange={(e) =>
              updateField("drugAgreementSignature", e.target.value)
            }
          />
        </div>
        <div className="field">
          <label>Date</label>
          <input
            type="date"
            value={form.drugAgreementDate}
            onChange={(e) =>
              updateField("drugAgreementDate", e.target.value)
            }
          />
        </div>
      </div>
    </section>
  );
}

export default StepAgreement;
