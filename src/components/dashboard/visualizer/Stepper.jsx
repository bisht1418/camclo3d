import React from "react";

const Step = ({ isActive, isCompleted, stepNumber, label }) => (
  <div
    className={`step ${
      isCompleted || isActive
        ? "!step-secondary !text-primary"
        : "!text-secondary "
    } text-[1rem] leading-[1.15rem] Barlow mb-1`}
    data-content={isActive ? "⚪" : isCompleted ? "✓" : stepNumber.toString()}
  >
    {label}
  </div>
);

const Stepper = ({ currentStep }) => {
  
  const steps =  ["Category selection", "Upload Image", "Visualizer Image", "Download Image"];

  return (
    <div className="mx-auto mb-20 z-0">
      <ul className="steps steps-vertical lg:steps-horizontal">
        {steps.map((label, index) => {
          const isActive = currentStep === index;
          const isCompleted = currentStep > index;
            
          return (
            <Step
              key={index}
              isActive={isActive}
              isCompleted={isCompleted}
              stepNumber={index + 1}
              label={label}
            />
          );
        })}
      </ul>
    </div>
  );
};

export default Stepper;