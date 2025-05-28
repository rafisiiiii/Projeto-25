import { createContext, use, useCallback, useState } from "react";
import type { OverviewSchema } from "./schema";

type Optional<T> = { [K in keyof T]?: T[K] };
type Props = {
  data: Optional<OverviewSchema & { companyAddress: CompanyAddress }>;
  currentStep: number;
  setCurrentStep: (step: number) => void;
  clearFormData: () => void;
  setFormData: (
    data: Optional<OverviewSchema & { companyAddress: CompanyAddress }>
  ) => void;
  clear: () => void;
};

export type CompanyAddress = {
  municipality: number;
  street: string;
  number: string;
  district: string;
  city: string;
  state: string;
  details: string;
  zip: string;
  country: {
    id: number;
    name: string;
  };
};

export const FormProvider = createContext<Props | null>(null);

const LOCAL_STORAGE_REGISTER_CLIENT_KEY = "register_client_form" as const;
const LOCAL_STORAGE_FORM_STEP_KEY = "form_step_key" as const;

export const MultiStepFormProvider = ({
  children,
}: Readonly<{ children: React.ReactNode }>) => {
  const [_step, _setStep] = useState(() => {
    const _step = localStorage.getItem(LOCAL_STORAGE_FORM_STEP_KEY);
    return _step ? parseInt(_step) : 0;
  });
  const [_formData, _setFormData] = useState<Optional<OverviewSchema>>(() => {
    const data = localStorage.getItem(LOCAL_STORAGE_REGISTER_CLIENT_KEY);
    return data ? JSON.parse(data) : {};
  });

  const clearFormData = useCallback(() => {
    localStorage.removeItem(LOCAL_STORAGE_REGISTER_CLIENT_KEY);
    localStorage.removeItem(LOCAL_STORAGE_FORM_STEP_KEY);
    _setFormData({});
    _setStep(0);
  }, [_setFormData, _setStep]);

  const setFormData = useCallback(
    (data: Optional<OverviewSchema>) => {
      //@ts-ignore
      _setFormData((prev) => {
        localStorage.setItem(
          LOCAL_STORAGE_REGISTER_CLIENT_KEY,
          JSON.stringify({ ...prev, ...data })
        );
        return { ...prev, ...data };
      });
    },
    [_setFormData]
  );
  const clear = () => {
    const confirm = window.confirm("Limpar o formulário ?");
    if (confirm) {
      clearFormData();
      window.location.reload();
    }
  };

  const setCurrentStep = useCallback(
    (step: number) => {
      _setStep(() => {
        localStorage.setItem(LOCAL_STORAGE_FORM_STEP_KEY, step.toString());
        return step;
      });
    },
    [_setStep]
  );

  return (
    <FormProvider.Provider
      value={{
        data: _formData,
        currentStep: _step,
        setCurrentStep,
        setFormData,
        clearFormData,
        clear,
      }}>
      {children}
    </FormProvider.Provider>
  );
};

export const useMultiStepForm = () => {
  const context = use(FormProvider);
  if (!context) {
    throw new Error(
      "useMultiStepFrom must be used within a MultiStepFromProvider"
    );
  }

  return context;
};
