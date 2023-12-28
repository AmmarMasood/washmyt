import React, { useEffect } from "react";

interface IStepperProps {
  currentStep: number;
}
const greenStep = "bg-green-600 h-1 w-full rounded-full";
const grayStep = "bg-gray-300 h-1 w-full rounded-full";
const stepperC = "flex items-center flex-col justify-between w-full";
const stepperTxt = "text-sm text-center mb-2 font-semibold";

const allSteps = [
  "Requested Wash",
  "Pending Confirmation",
  "Ready to Pay",
  "Confirmed & Paid",
  "Wash Complete",
];

function Stepper(props: IStepperProps) {
  const { currentStep } = props;
  const [steps, setSteps] = React.useState<any>([]);

  useEffect(() => {
    const newSteps = allSteps.map((step, index) => {
      if (index < currentStep) {
        return {
          step,
          stepColor: greenStep,
          textColor: `${stepperTxt} text-black-500`,
        };
      } else if (index === currentStep) {
        return {
          step,
          stepColor: grayStep,
          textColor: `${stepperTxt} text-green-600`,
        };
      } else {
        return {
          step,
          stepColor: grayStep,
          textColor: `${stepperTxt} text-gray-300`,
        };
      }
    });
    setSteps(newSteps);
  }, [currentStep]);
  return (
    <div className="grid grid-cols-5 gap-5">
      {steps.map((step: any, index: number) => {
        return (
          <div className={stepperC} key={index}>
            <p className={step.textColor}>{step.step}</p>
            <div className={step.stepColor}></div>
          </div>
        );
      })}
    </div>
  );
}

export default Stepper;
