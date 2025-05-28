import { Separator } from "../ui/separator";
import { CurrentStep } from "./current-step";
import { MultiStepFormProvider } from "./multi-step-form-provider";

import { StepsIndicators } from "./steps-indicators";

export const RegisterFrom = () => {
  return (
    <MultiStepFormProvider>
      <div className="max-w-5xl mx-auto pt-5 px-4">
        <div className="bg-white w-full rounded-lg shadow-sm border p-8 mx-auto flex flex-col items-center justify-center">
          <StepsIndicators />
          <Separator className="my-5" />
          <CurrentStep />
        </div>
      </div>
    </MultiStepFormProvider>
  );
};
