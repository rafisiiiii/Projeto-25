import { Label } from "@radix-ui/react-label";
import { AlertCircle } from "lucide-react";
import {
  Controller,
  useFormContext,
  type FieldValues,
  type Path,
} from "react-hook-form";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

type Option = {
  label: string;
  value: string;
};

interface RHFSelectTagInputProps<T extends FieldValues> {
  name: Path<T>;
  options: Option[];
  placeholder?: string;
  label?: string;
}

export const RHFSelect = <T extends FieldValues>({
  name,
  label,
  options,
  placeholder,
}: RHFSelectTagInputProps<T>) => {
  const { control } = useFormContext<T>();

  return (
    <Controller
      control={control}
      name={name}
      render={({
        field: { value, onChange },
        fieldState: { invalid, error },
      }) => (
        <div>
          {label && (
            <Label
              htmlFor={label}
              data-error={invalid}
              className="data-[error=true]:text-red-400 font-semibold mb-1">
              {label}
            </Label>
          )}
          <Select onValueChange={onChange} value={value}>
            <SelectTrigger
              data-error={invalid}
              className="data-[error=true]:text-red-400 data-[error=true]:focus-visible:ring-red-400 focus:ring-blue-200 focus-visible:ring-blue-200 focus-visible:border-blue-200 data-[error=true]:border-red-400  data-[error=true]:[&>svg]:text-red-400 font-semibold mb-1 w-full">
              <SelectValue placeholder={placeholder} />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>{label}</SelectLabel>
                {options.map((op, i) => (
                  <SelectItem key={`${i}_${op.value}`} value={op.value}>
                    {op.label}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>

          {invalid && error?.message && (
            <span className="inline-flex items-center gap-2 text-xs font-light text-red-500 bg-red-100 rounded-md px-2 py-0.5 mt-1">
              <AlertCircle className="size-4" /> {error.message}
            </span>
          )}
        </div>
      )}
    />
  );
};
