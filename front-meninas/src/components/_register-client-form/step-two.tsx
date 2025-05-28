import { useForm } from "react-hook-form";
import { RHFForm } from "../rhf/rhf-form";
import { Button } from "../ui/button";
import { ArrowRight, CircleCheckBigIcon, Frown } from "lucide-react";
import { useMultiStepForm } from "./multi-step-form-provider";
import { zodResolver } from "@hookform/resolvers/zod";
import { stepTwoSchema, type StepTwoSchema } from "./schema";
import { RHFInput } from "../rhf/rhf-input";
import { objectIsEmpty } from "@/lib/utils";

export const StepTwoForm = () => {
  const { data, setFormData, setCurrentStep } = useMultiStepForm();

  const methods = useForm({
    resolver: zodResolver(stepTwoSchema),
    mode: "all",
    defaultValues: {
      email: data.email || "",
      phone: (data.areaCode && data.phone && data.areaCode + data.phone) || "",
      areaCode: data.areaCode || "",
      homepage: data.homepage || "",
    },
  });

  const onSubmit = (data: StepTwoSchema) => {
    setFormData(data);
    setCurrentStep(2);
  };
  const hasError = !objectIsEmpty(methods.formState.errors);

  return (
    <div className="w-full">
      <div className="space-y-4 w-full">
        <div>
          <h2
            data-valid={methods.formState.isValid}
            data-error={hasError}
            className="inline-flex items-center text-2xl data-[error=true]:bg-red-100 data-[error=true]:text-red-500 font-semibold text-gray-900 bg-zinc-200 data-[valid=true]:text-green-700 data-[valid=true]:bg-green-100 px-2 rounded-lg w-fit transition-colors ease-in">
            Informações para contato
            {methods.formState.isValid && (
              <CircleCheckBigIcon className="ml-2 animate-fade-in" />
            )}
            {hasError && (
              <Frown className="ml-2 animate-fade-in text-red-500" />
            )}
          </h2>
        </div>

        <RHFForm methods={methods}>
          <form
            onSubmit={methods.handleSubmit(onSubmit)}
            className="space-y-6 w-full">
            <div className="grid space-y-6">
              <div>
                <RHFInput<StepTwoSchema>
                  name="email"
                  label="Email"
                  type="email"
                  placeholder="@email.com"
                />
              </div>

              <div>
                <RHFInput<StepTwoSchema>
                  name="phone"
                  label="Telefone"
                  mask="phone"
                  placeholder="(dd) xxxx-xxxx"
                />
              </div>

              <div>
                <RHFInput<StepTwoSchema>
                  name="homepage"
                  label="Homepage"
                  placeholder="http://algumsite.com"
                />
              </div>
            </div>

            <Button className="w-full bg-blue-500 hover:bg-blue-400 text-white py-6">
              Continuar <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </form>
        </RHFForm>
      </div>
    </div>
  );
};
