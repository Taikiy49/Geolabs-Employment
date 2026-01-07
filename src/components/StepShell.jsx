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

  // optional: let StepReview provide its own buttons/footer if you want
  footerContent = null,
}) {
  const animationClass =
    direction === "forward" ? "animate-slide-forward" : "animate-slide-back";

  return (
    <div className="step-shell">
      {/* optional header (if you already have this somewhere else, you can remove) */}
      {(title || typeof totalSteps === "number") && (
        <div className="step-shell-header">
          <div>
            {title && <h2 className="step-shell-title">{title}</h2>}
            {typeof totalSteps === "number" && (
              <p className="step-shell-sub">
                Step {stepIndex + 1} / {totalSteps}
              </p>
            )}
          </div>

          {onPrint && (
            <button type="button" className="btn outline" onClick={onPrint}>
              Print / Save as PDF
            </button>
          )}
        </div>
      )}

      <div className={`step-content ${animationClass}`}>{children}</div>

      {!hideFooterNav && (
        <div className="step-shell-footer">
          {/* Left side */}
          <div className="step-shell-footer-left">
            {stepIndex > 0 && (
              <button type="button" className="btn outline" onClick={onBack}>
                Back
              </button>
            )}
          </div>

          {/* Right side */}
          <div className="step-shell-footer-right">
            {/* If a step wants to render its own footer (e.g. review step), do it here */}
            {footerContent ? (
              footerContent
            ) : (
              <>
                {/* Important: NO submit button here */}
                {!isLastStep && (
                  <button type="button" className="btn primary" onClick={onNext}>
                    {nextLabel}
                  </button>
                )}

                {/* If it IS last step and footerContent not provided, we simply show nothing.
                    This prevents the “dead submit button” issue completely. */}
                {isLastStep && null}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default StepShell;
