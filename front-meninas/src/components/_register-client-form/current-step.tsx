import { useMultiStepForm } from "./multi-step-form-provider";
import { StepOneForm } from "./step-one";
import { StepThree } from "./step-three";
import { StepTwoForm } from "./step-two";

export const CurrentStep = () => {
  const { currentStep } = useMultiStepForm();

  if (currentStep === 0) return <StepOneForm />;
  if (currentStep === 1) return <StepTwoForm />;
  if (currentStep === 2) return <StepThree />;

  return <p>Se perdeu no formularia ?</p>;
};
