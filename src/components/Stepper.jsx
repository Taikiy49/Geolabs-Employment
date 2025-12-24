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

  // Determine active branch based on activeIndex
  const activeBranchIndex = useMemo(() => {
    if (!branches.length) return -1;
    return branches.findIndex(
      (b) => activeIndex >= b.from && activeIndex <= b.to
    );
  }, [branches, activeIndex]);

  const activeBranch =
    activeBranchIndex >= 0 ? branches[activeBranchIndex] : null;

  // Visible steps = only current branch, excluding review step so we don’t duplicate
  const visibleSteps = useMemo(() => {
    const base = !activeBranch
      ? steps
      : steps.slice(activeBranch.from, activeBranch.to + 1);

    if (reviewIndex == null) return base;

    // If no branches, base indexes are global indexes.
    if (!activeBranch) return base.filter((_, i) => i !== reviewIndex);

    // If branches, we need to remove the review if it falls within the sliced range
    return base.filter((_, i) => activeBranch.from + i !== reviewIndex);
  }, [steps, activeBranch, reviewIndex]);

  // Convert visible index to global index (handles removed review in the middle)
  const toGlobalIndex = (visibleIdx) => {
    if (!activeBranch) {
      if (reviewIndex == null) return visibleIdx;
      // if review index was removed and it was before/at this visible position, shift by +1
      return visibleIdx >= reviewIndex ? visibleIdx + 1 : visibleIdx;
    }

    const candidate = activeBranch.from + visibleIdx;

    // if review was removed inside this branch and it is <= candidate, shift by +1
    if (
      reviewIndex != null &&
      reviewIndex >= activeBranch.from &&
      reviewIndex <= activeBranch.to &&
      reviewIndex <= candidate
    ) {
      return candidate + 1;
    }

    return candidate;
  };

  return (
    <div className="stepper">
      {/* Branch indicator row (LEFT) + Review & Submit (RIGHT) */}
      {branches.length > 0 && (
        <div className="stepper-branches-row">
  {branches.length > 0 ? (
    <div className="stepper-branches">
      {branches.map((branch, idx) => {
        const isActive = activeIndex >= branch.from && activeIndex <= branch.to;
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
  ) : (
    <div /> /* keeps spacing so Review stays right */
  )}

  {reviewIndex != null && (
    <button
      type="button"
      className={"stepper-review-pill" + (isOnReview ? " active" : "")}
      onClick={() => onStepClick(reviewIndex)}
    >
      Review &amp; Submit
    </button>
  )}
</div>

      )}

      {/* Steps row (filtered to active branch) */}
      <div className="stepper-steps">
        {visibleSteps.map((step, visibleIdx) => {
          const globalIdx = toGlobalIndex(visibleIdx);
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
              <div className="stepper-circle">{visibleIdx + 1}</div>
              <div className="stepper-label">{step.label}</div>
            </button>
          );
        })}
      </div>

      {/* Decorative progress bar */}
      <div className="stepper-progress" />
    </div>
  );
}

export default Stepper;
