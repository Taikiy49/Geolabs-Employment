import React, { useMemo } from "react";

function Stepper({
  steps,
  branches = [],
  activeIndex,
  onStepClick,
  reviewStepId = "review-submit",
}) {
  const reviewIndex = useMemo(() => {
    const idx = steps.findIndex((s) => s.id === reviewStepId);
    return idx >= 0 ? idx : null;
  }, [steps, reviewStepId]);

  const isOnReview = reviewIndex != null && activeIndex === reviewIndex;

  const activeBranch = useMemo(() => {
    if (!branches.length) return null;
    return (
      branches.find((b) => activeIndex >= b.from && activeIndex <= b.to) || null
    );
  }, [branches, activeIndex]);

  // Steps shown in the row: if branches exist, show only active branch.
  // Also remove the review step from the row to avoid duplication with the Review pill.
  const visibleSteps = useMemo(() => {
    const base = activeBranch
      ? steps.slice(activeBranch.from, activeBranch.to + 1)
      : steps;

    if (reviewIndex == null) return base;

    return base.filter((s) => s.id !== reviewStepId);
  }, [steps, activeBranch, reviewIndex, reviewStepId]);

  // Convert visible step id to global index
  const stepIdToGlobalIndex = (id) => steps.findIndex((s) => s.id === id);

  return (
    <div className="stepper">
      {/* Branch pills + Review pill */}
      {(branches.length > 0 || reviewIndex != null) && (
        <div className="stepper-branches-row">
          <div className="stepper-branches">
            {branches.map((branch, idx) => {
              const isActive =
                activeIndex >= branch.from && activeIndex <= branch.to;

              return (
                <button
                  key={idx}
                  type="button"
                  className={"stepper-branch-pill" + (isActive ? " active" : "")}
                  onClick={() => onStepClick(branch.from)}
                >
                  {branch.label}
                </button>
              );
            })}
          </div>

          {reviewIndex != null && (
            <button
              type="button"
              className={"stepper-review-pill" + (isOnReview ? " active" : "")}
              onClick={() => onStepClick(reviewIndex)}
              aria-current={isOnReview ? "step" : undefined}
            >
              Review &amp; Submit
            </button>
          )}
        </div>
      )}

      {/* Steps row */}
      <div className="stepper-steps">
        {visibleSteps.map((step, i) => {
          const globalIdx = stepIdToGlobalIndex(step.id);
          const isActive = globalIdx === activeIndex;
          const isCompleted = globalIdx < activeIndex;

          return (
            <button
              key={step.id}
              type="button"
              className={
                "stepper-item" +
                (isActive ? " active" : "") +
                (isCompleted ? " completed" : "")
              }
              onClick={() => onStepClick(globalIdx)}
              aria-current={isActive ? "step" : undefined}
            >
              <div className="stepper-circle">{i + 1}</div>
              <div className="stepper-label">{step.label}</div>
            </button>
          );
        })}
      </div>

      <div className="stepper-progress" />
    </div>
  );
}

export default Stepper;
