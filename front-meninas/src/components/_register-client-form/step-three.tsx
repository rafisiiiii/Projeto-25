import { zodResolver } from "@hookform/resolvers/zod";
import { useMultiStepForm } from "./multi-step-form-provider";

import { useForm } from "react-hook-form";
import {
  overviewSchema,
  stepThreeSchema,
  type OverviewSchema,
  type StepThreeSchema,
} from "./schema";
import { RHFForm } from "../rhf/rhf-form";
import { Button } from "../ui/button";
import { RHFInput } from "../rhf/rhf-input";
import { RHFSelect } from "../rhf/rhf-select";
import {
  formatZodErrors,
  objectIsEmpty,
  STATES,
  type ErrorFormatted,
} from "@/lib/utils";
import { useEffect, useState } from "react";
import { Switch } from "../ui/switch";
import { Label } from "../ui/label";
import { useRequester } from "@/hooks/use-requester";
import { api } from "@/lib/axios";
import { CircleCheckBigIcon, Frown, Loader2 } from "lucide-react";
import toast from "react-hot-toast";

export const StepThree = () => {
  const [useCompanyAddress, setCompanyAddress] = useState(false);
  const [errors, setError] = useState<ErrorFormatted[]>([]);
  const { data, setFormData, clearFormData } = useMultiStepForm();

  const methods = useForm({
    resolver: zodResolver(stepThreeSchema),
    mode: "all",
    defaultValues: {
      zipCode: data.zipCode || "",
      neighborhood: data.neighborhood || "",
      address: (data.address && data.address.split("n°")[0]) || "",
      city: data.city || "",
      cityCode: data.cityCode || null,
      country: data.country || null,
      state: data.state || "",
      houseNumber: data.houseNumber || "",
    },
  });

  const { mutation, isPending } = useRequester({
    mutateFn: (data: OverviewSchema) =>
      api.post("/client/register", {
        ...data,
      }),
    onSuccess: () => {
      toast.success("Cadastrado com sucesso!");
      clearFormData();
    },
    onError: (error: any) => {
      toast.error("Opá, algo deu errado :(");
      console.log(error);
      if (error.response.data === "client with this taxId already exists") {
        setError([
          {
            campo: "CPF/CNPJ",
            mensagem: "Já tem um cliente com esse cpj/cnpj cadastrado",
          },
        ]);
      }
    },
  });

  useEffect(() => {
    if (useCompanyAddress && data.companyAddress) {
      methods.setValue("zipCode", data.companyAddress.zip);
      methods.setValue("cityCode", data.companyAddress.municipality.toString());
      methods.setValue("address", data.companyAddress.street);
      methods.setValue("neighborhood", data.companyAddress.district);
      methods.setValue("city", data.companyAddress.city);
      data.companyAddress.number !== "S/N" &&
        methods.setValue("houseNumber", data.companyAddress.number.toString());
      methods.setValue("state", data.companyAddress.state);
      methods.setValue("country", data.companyAddress.country.name);
      methods.clearErrors();
    } else {
      methods.reset();
    }
  }, [useCompanyAddress, data.companyAddress, methods]);

  const onSubmit = (formData: StepThreeSchema) => {
    if (isPending) return;
    setFormData(formData);

    const {
      data: body,
      success,
      error,
    } = overviewSchema.safeParse({ ...data, ...formData });

    if (success) {
      // console.log(body);
      mutation(body);
      return;
    } else {
      setError(formatZodErrors(error));
    }
  };
  const hasError = !objectIsEmpty(methods.formState.errors);
  return (
    <div className="inline-flex w-full justify-between items-center">
      <div className="space-y-4 w-full">
        <div>
          <h2
            data-valid={methods.formState.isValid}
            data-error={hasError}
            className="inline-flex items-center text-2xl data-[error=true]:bg-red-100 data-[error=true]:text-red-500 font-semibold text-gray-900 bg-zinc-200 data-[valid=true]:text-green-700 data-[valid=true]:bg-green-100 px-2 rounded-lg w-fit transition-colors ease-in">
            Endereço
            {methods.formState.isValid && (
              <CircleCheckBigIcon className="ml-2 animate-fade-in" />
            )}
            {hasError && (
              <Frown className="ml-2 animate-fade-in text-red-500" />
            )}
          </h2>
        </div>
        {errors.length > 0 && (
          <div className="bg-red-100 border rounded-md flex flex-wrap ring-2 ring-red-500 gap-2 px-2 py-4">
            {errors.map(({ campo, mensagem }, i) => (
              <div key={i}>
                <p className="text-sm font-bold">
                  {campo}: <span className="font-normal">{mensagem}</span>
                </p>
              </div>
            ))}
          </div>
        )}
        {data.type && data.type === "J" && (
          <div className="w-full inline-flex items-center">
            <div className="ml-auto flex items-center space-x-2">
              <Label htmlFor="company-address">
                Usar o endereço da empresa
              </Label>
              <Switch
                onCheckedChange={(v) => setCompanyAddress(v)}
                className=" data-[state=checked]:bg-blue-200"
                id="company-address"
              />
            </div>
          </div>
        )}
        <RHFForm methods={methods}>
          <form
            onSubmit={methods.handleSubmit(onSubmit)}
            className="space-y-6 w-full">
            <div className="grid grid-cols-4 gap-6">
              <div className="col-span-1">
                <RHFInput<StepThreeSchema>
                  name="zipCode"
                  label="CEP"
                  mask="cep"
                  placeholder="00000-000"
                />
              </div>
              <div className="col-span-1">
                <RHFInput<StepThreeSchema>
                  name="cityCode"
                  label="Codigo do município"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-6">
              <div className="col-span-2">
                <RHFInput<StepThreeSchema> name="address" label="Endereço" />
              </div>
              <RHFInput<StepThreeSchema>
                name="houseNumber"
                label="Numero da casa"
                placeholder="n°"
              />
            </div>
            <div className="grid grid-cols-2 gap-6">
              <RHFInput<StepThreeSchema> name="neighborhood" label="Bairro" />
              <RHFInput<StepThreeSchema> name="city" label="Cidade" />
            </div>
            <div className="grid grid-cols-2 gap-6 items-center">
              <RHFSelect<StepThreeSchema>
                options={STATES}
                name="state"
                label="Estado"
                placeholder="Selecione o estado"
              />
              <RHFInput<StepThreeSchema>
                name="country"
                label="Pais"
                placeholder="Selecione o pais"
              />
            </div>

            <Button
              disabled={isPending}
              className="w-full bg-blue-500 hover:bg-blue-400 text-white py-6">
              {isPending && <Loader2 className="animate-spin" />}
              {isPending ? "Cadastrando" : "Cadastrar"}
            </Button>
          </form>
        </RHFForm>
      </div>
    </div>
  );
};
