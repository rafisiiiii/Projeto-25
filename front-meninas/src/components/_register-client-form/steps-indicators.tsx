import { cn } from "@/lib/utils";
import { useMultiStepForm } from "./multi-step-form-provider";

export const StepsIndicators = () => {
  const { currentStep, setCurrentStep } = useMultiStepForm();
  return (
    <div className="flex items-center justify-between mb-2 px-12 w-full transition-transform">
      {Array.from({ length: 3 }).map((_, index) => (
        <div
          key={index}
          className={cn(
            "flex items-center",
            index + 1 === 3 ? "w-fit" : "w-full"
          )}>
          <div
            onClick={() => {
              setCurrentStep(index);
            }}
            className={cn(
              "flex items-center justify-center w-8 h-8 rounded-md ring-4 ring-blue-200 ",
              index <= currentStep
                ? "bg-blue-500 text-white"
                : " text-gray-500 bg-blue-100"
            )}>
            {index + 1}
          </div>
          {index < 3 - 1 && (
            <div className="flex-1 h-1 mx-2">
              <div
                className={`h-full ${
                  index < currentStep ? "bg-blue-600" : "bg-gray-200"
                }`}
              />
            </div>
          )}
        </div>
      ))}
    </div>
  );
};
