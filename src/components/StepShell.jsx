import React from "react";

function StepShell({
  title,
  stepIndex,
  totalSteps,
  children,
  onNext,
  onBack,
  onSubmit,
  onPrint,
  isLastStep,
  direction,
  hideFooterNav = false,
  nextLabel = "Next",
}) {
  const animationClass =
    direction === "forward" ? "animate-slide-forward" : "animate-slide-back";

  return (
    <div className="step-shell">
      
      <div className={`step-content ${animationClass}`}>{children}</div>

      {!hideFooterNav && (
        <div className="step-shell-footer">
          <div>
            {stepIndex > 0 && (
              <button type="button" className="btn outline" onClick={onBack}>
                Back
              </button>
            )}
          </div>
          <div>
            {!isLastStep && (
              <button type="button" className="btn primary" onClick={onNext}>
                {nextLabel}
              </button>
            )}
            {isLastStep && (
              <button type="button" className="btn primary" onClick={onSubmit}>
                Submit
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default StepShell;
