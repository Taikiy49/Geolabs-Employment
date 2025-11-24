import React from "react";

function Stepper({ steps, branches = [], activeIndex, onStepClick }) {
  return (
    <div className="stepper">
      {/* Branch indicator row */}
      {branches.length > 0 && (
        <div className="stepper-branches">
          {branches.map((branch, idx) => {
            const isActive =
              activeIndex >= branch.from && activeIndex <= branch.to;
            return (
              <button
                key={idx}
                type="button"
                className={
                  "stepper-branch-pill" + (isActive ? " active" : "")
                }
                onClick={() => onStepClick(branch.from)}
              >
                {branch.label}
              </button>
            );
          })}
        </div>
      )}

      {/* Steps row */}
      <div className="stepper-steps">
        {steps.map((step, index) => {
          const isActive = index === activeIndex;
          const isCompleted = index < activeIndex;
          return (
            <button
              key={step.id}
              type="button"
              className={
                "stepper-item" +
                (isActive ? " active" : "") +
                (isCompleted ? " completed" : "")
              }
              onClick={() => onStepClick(index)}
            >
              <div className="stepper-circle">{index + 1}</div>
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
