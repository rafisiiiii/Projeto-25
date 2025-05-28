import type React from "react";
import {
  type FieldValues,
  FormProvider,
  type UseFormReturn,
} from "react-hook-form";
export const RHFForm = <T extends FieldValues>({
  children,
  methods,
}: {
  children: React.ReactNode;
  methods: UseFormReturn<T>;
}) => {
  return <FormProvider {...methods}>{children}</FormProvider>;
};
