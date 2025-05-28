import { useForm } from "react-hook-form";
import { useMultiStepForm } from "./multi-step-form-provider";
import { zodResolver } from "@hookform/resolvers/zod";
import { stepOneSchema, type StepOneSchema } from "./schema";
import { RHFInput } from "../rhf/rhf-input";
import { Button } from "../ui/button";
import { ArrowRight, CircleCheckBigIcon, Frown } from "lucide-react";
import { RHFForm } from "../rhf/rhf-form";
import { Separator } from "../ui/separator";
import { Badge } from "../ui/badge";
import { useState } from "react";
import { cnpja } from "@/lib/cnpjjs";
import { Skeleton } from "../ui/skeleton";
import { objectIsEmpty } from "@/lib/utils";

export const StepOneForm = () => {
  const [isFetchingCnpj, setIsFetchingCnpj] = useState(false);
  const { data, setFormData, setCurrentStep } = useMultiStepForm();
  const methods = useForm({
    resolver: zodResolver(stepOneSchema),
    defaultValues: {
      name: data.name || "",
      taxId: data.taxId || "",
      type: data.type || null,
      tradeName: data.tradeName || null,
      openingDate: data.openingDate || null,
      storeCode: data.storeCode || "",
    },
  });

  const handleCpfCnpj = async (value: string) => {
    if (value.length === 14) {
      try {
        setIsFetchingCnpj(true);
        methods.clearErrors();

        const data = await cnpja.office.read({
          taxId: value,
        });

        methods.setValue("tradeName", data.alias || data.company.name);
        methods.setValue(
          "openingDate",
          data.founded.split("-").reverse().join("")
        );
        methods.setValue("type", "J");
        setFormData({ companyAddress: data.address });
      } catch (e) {
        console.log(e);
        methods.setError("taxId", { message: "CNPJ invalido" });
      } finally {
        setIsFetchingCnpj(false);
      }
    }
    if (value.length === 11) {
      methods.setValue("tradeName", null);
      methods.setValue("openingDate", null);
      methods.setValue("type", "F");
    }
    methods.setFocus("taxId");
  };

  const isCNPJ = methods.watch("taxId");

  const onSubmit = (data: StepOneSchema) => {
    setFormData(data);
    setCurrentStep(1);
  };

  // console.log(methods.formState.errors);

  const hasError = !objectIsEmpty(methods.formState.errors);

  return (
    <div className="w-full">
      <div className="space-y-4 w-full">
        <div>
          <h2
            data-valid={methods.formState.isValid}
            data-error={hasError}
            className="inline-flex items-center text-2xl data-[error=true]:bg-red-100 data-[error=true]:text-red-500 font-semibold text-gray-900 bg-zinc-200 data-[valid=true]:text-green-700 data-[valid=true]:bg-green-100 px-2 rounded-lg w-fit transition-colors ease-in">
            Informações iniciais
            {methods.formState.isValid && (
              <CircleCheckBigIcon className="ml-2 animate-fade-in" />
            )}
            {hasError && (
              <Frown className="ml-2 animate-fade-in text-red-500" />
            )}
          </h2>
          <p className="text-gray-500 mt-1 tracking-tight">
            Pode deixar que alguns campos a gente resolve por você : )
          </p>
        </div>
        <div className="w-full inline-flex items-center justify-end">
          {isCNPJ && [11, 14].includes(isCNPJ.length) && (
            <div className="bg-blue-50 px-2 rounded-sm">
              <span className="text-sm font-normal mr-2">
                Tipo de cadastro:{" "}
              </span>
              <Badge className="bg-blue-500 font-semibold">
                {{ 14: "Pessoa jurídica", 11: "Pessoa Física" }[isCNPJ.length]}
              </Badge>
            </div>
          )}
        </div>
        <RHFForm methods={methods}>
          <form
            onSubmit={methods.handleSubmit(onSubmit)}
            className="space-y-6 w-full">
            <div>
              <div>
                <RHFInput<StepOneSchema>
                  name="storeCode"
                  label="Loja"
                  className="w-15"
                  minLength={2}
                  maxLength={2}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <RHFInput<StepOneSchema>
                  name="taxId"
                  label="CPF/CNPJ"
                  mask="cpf/cnpj"
                  changeInterceptor={handleCpfCnpj}
                />
              </div>
              <div>
                {isCNPJ && isCNPJ.length === 11 && (
                  <RHFInput<StepOneSchema>
                    name="openingDate"
                    label="Data de nascimento"
                    mask="date"
                  />
                )}
                {isCNPJ && isCNPJ.length === 14 && !isFetchingCnpj && (
                  <RHFInput<StepOneSchema>
                    name="openingDate"
                    label="Data de abertura"
                    mask="date"
                  />
                )}
                {isCNPJ && isCNPJ.length === 14 && isFetchingCnpj && (
                  <div className="pt-4">
                    <Skeleton className="col-span-1 h-10" />
                  </div>
                )}
              </div>
            </div>
            {isCNPJ && isCNPJ.length === 14 && !isFetchingCnpj && (
              <div className="grid col-span-2 gap-6">
                <RHFInput<StepOneSchema>
                  name="tradeName"
                  label="Nome fantasia"
                />
              </div>
            )}
            {isCNPJ && isCNPJ.length === 14 && isFetchingCnpj && (
              <div className="pt-4">
                <Skeleton className="col-span-1 h-10" />
              </div>
            )}
            <Separator className="my-4" />
            <div className="grid grid-cols-2">
              <div className="col-span-2">
                <RHFInput<StepOneSchema>
                  name="name"
                  label="Nome/Razão Social"
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
