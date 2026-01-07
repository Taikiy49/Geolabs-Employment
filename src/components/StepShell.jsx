import React from "react";

function StepShell({
  title,
  stepIndex,
  totalSteps,
  children,
  onNext,
  onBack,
  onPrint,

  // navigation
  isLastStep = false,
  hideFooterNav = false,
  nextLabel = "Next",

  // animation
  direction,

  // optional: let StepReview provide its own footer content
  footerContent = null,
}) {
  const animationClass =
    direction === "forward" ? "animate-slide-forward" : "animate-slide-back";

  return (
    <div className="step-shell">
      {(title || typeof totalSteps === "number" || onPrint) && (
        <div className="step-shell-header">
          <div>
            {title && <h2 className="step-title">{title}</h2>}
            {typeof totalSteps === "number" && (
              <p className="step-subtitle">
                Step {stepIndex + 1} / {totalSteps}
              </p>
            )}
          </div>

          {onPrint && (
            <div className="step-shell-header-actions">
              <button type="button" className="btn outline" onClick={onPrint}>
                Print / Save as PDF
              </button>
            </div>
          )}
        </div>
      )}

      <div className={`step-content ${animationClass}`}>{children}</div>

      {!hideFooterNav && (
        <div className="step-shell-footer">
          <div className="step-shell-footer-left">
            {stepIndex > 0 && (
              <button type="button" className="btn outline" onClick={onBack}>
                Back
              </button>
            )}
          </div>

          <div className="step-shell-footer-right">
            {footerContent ? (
              footerContent
            ) : (
              <>
                {!isLastStep && (
                  <button type="button" className="btn primary" onClick={onNext}>
                    {nextLabel}
                  </button>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default StepShell;
