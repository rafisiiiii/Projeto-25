import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertCircle } from "lucide-react";
import {
  cn,
  formatCEP,
  formatCpfCnpj,
  formatDate,
  formatPhone,
} from "@/lib/utils";
import {
  Controller,
  useFormContext,
  type FieldValues,
  type Path,
} from "react-hook-form";
import { useCallback } from "react";

interface RHFInputProps<T extends FieldValues>
  extends React.ComponentProps<"input"> {
  name: Path<T>;
  label?: string;
  labelClassName?: string;
  mask?: "phone" | "cpf/cnpj" | "cep" | "date";
  changeInterceptor?: (...value: any[]) => void;
}

export const RHFInput = <T extends FieldValues>({
  label,
  name,
  labelClassName,
  className,
  type = "text",
  mask,
  changeInterceptor,
  ...props
}: RHFInputProps<T>) => {
  const { control } = useFormContext();

  const cleanFormat = (value: string) => {
    return value.replace(/\D/g, "").trim();
  };

  const applyMask = useCallback((value: string, maskType?: string) => {
    if (!value) return "";

    switch (maskType) {
      case "phone":
        return formatPhone(value);
      case "cpf/cnpj":
        return formatCpfCnpj(value);
      case "cep":
        return formatCEP(value);
      case "date":
        return formatDate(value);
      default:
        return value;
    }
  }, []);

  return (
    <Controller
      control={control}
      name={name}
      render={({
        field: { value, onChange, ref },
        fieldState: { invalid, error },
      }) => {
        const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
          const inputValue = e.target.value;
          const formattedValue = mask
            ? applyMask(inputValue, mask)
            : inputValue;

          if (mask) {
            changeInterceptor && changeInterceptor(cleanFormat(formattedValue));
            onChange(cleanFormat(formattedValue));
          } else {
            changeInterceptor && changeInterceptor(inputValue);
            onChange(inputValue);
          }
        };

        return (
          <div className="w-full">
            {label && (
              <Label
                data-error={invalid}
                htmlFor={label}
                className={cn(
                  "data-[error=true]:text-red-400 font-semibold mb-1",
                  labelClassName
                )}>
                {label}
              </Label>
            )}
            <Input
              ref={ref}
              data-error={invalid}
              id={label}
              type={type}
              onChange={handleChange}
              value={
                mask && value ? applyMask(value.toString(), mask) : value || ""
              }
              className={cn(
                "focus:ring-blue-200 focus-visible:ring-blue-200 focus-visible:border-blue-200 data-[error=true]:border-red-400 data-[error=true]:focus-visible:ring-red-400 w-full",
                className
              )}
              {...props}
            />
            {invalid && error?.message && (
              <span className="inline-flex items-center gap-2 text-xs font-light text-red-500 bg-red-100 rounded-md px-2 py-0.5 mt-1">
                <AlertCircle className="size-4" /> {error.message}
              </span>
            )}
          </div>
        );
      }}
    />
  );
};
