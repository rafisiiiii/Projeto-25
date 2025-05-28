import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { ZodError, type ZodIssue } from "zod";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatCNPJ = (value: string) => {
  return value
    .replace(/\D/g, "")
    .replace(/^(\d{2})(\d)/, "$1.$2")
    .replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3")
    .replace(/\.(\d{3})(\d)/, ".$1/$2")
    .replace(/(\d{4})(\d)/, "$1-$2")
    .substring(0, 18);
};

export const formatCPF = (value: string) => {
  return value
    .replace(/\D/g, "")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})\.(\d{3})(\d)/, "$1.$2.$3")
    .replace(/\.(\d{3})(\d)/, ".$1-$2")
    .substring(0, 14);
};

export const formatCEP = (value: string) => {
  return value
    .replace(/\D/g, "")
    .replace(/(\d{5})(\d)/, "$1-$2")
    .substring(0, 9);
};

export const formatDate = (value: string) => {
  return value
    .replace(/\D/g, "")
    .replace(/(\d{2})(\d)/, "$1/$2")
    .replace(/(\d{2})\/(\d{2})(\d)/, "$1/$2/$3")
    .replace(/\/(\d{4})(\d)/, "$1/$2/$3")
    .substring(0, 10);
};

export const formatPhone = (value: string) => {
  value = value.replace(/\D/g, "");

  if (value.length <= 10) {
    return value
      .replace(/^(\d{2})(\d)/g, "($1) $2")
      .replace(/(\d{4})(\d)/, "$1-$2")
      .substring(0, 14);
  } else {
    return value
      .replace(/^(\d{2})(\d)/g, "($1) $2")
      .replace(/(\d{5})(\d)/, "$1-$2")
      .substring(0, 15);
  }
};

export const formatCpfCnpj = (value: string) => {
  value = value.replace(/\D/g, "");

  if (value.length <= 11) {
    return formatCPF(value);
  } else {
    return formatCNPJ(value);
  }
};

export const STATES = [
  { label: "Acre", value: "AC" },
  { label: "Alagoas", value: "AL" },
  { label: "Amapá", value: "AP" },
  { label: "Amazonas", value: "AM" },
  { label: "Bahia", value: "BA" },
  { label: "Ceará", value: "CE" },
  { label: "Distrito Federal", value: "DF" },
  { label: "Espírito Santo", value: "ES" },
  { label: "Goiás", value: "GO" },
  { label: "Maranhão", value: "MA" },
  { label: "Mato Grosso", value: "MT" },
  { label: "Mato Grosso do Sul", value: "MS" },
  { label: "Minas Gerais", value: "MG" },
  { label: "Pará", value: "PA" },
  { label: "Paraíba", value: "PB" },
  { label: "Paraná", value: "PR" },
  { label: "Pernambuco", value: "PE" },
  { label: "Piauí", value: "PI" },
  { label: "Rio de Janeiro", value: "RJ" },
  { label: "Rio Grande do Norte", value: "RN" },
  { label: "Rio Grande do Sul", value: "RS" },
  { label: "Rondônia", value: "RO" },
  { label: "Roraima", value: "RR" },
  { label: "Santa Catarina", value: "SC" },
  { label: "São Paulo", value: "SP" },
  { label: "Sergipe", value: "SE" },
  { label: "Tocantins", value: "TO" },
];

const fieldTranslations: Record<string, string> = {
  address: "Endereço",
  state: "Estado",
  cityCode: "Código da cidade",
  zipCode: "CEP",
  country: "País",
  city: "Cidade",
  neighborhood: "Bairro",
  houseNumber: "Número da casa",
  name: "Nome",
  storeCode: "Loja",
  taxId: "CNPJ/CPF",
  openingDate: "Data de abertura",
  tradeName: "Nome fantasia",
  type: "Tipo",
  email: "E-mail",
  homepage: "Site",
  phone: "Telefone",
  areaCode: "DDD",
};

export type ErrorFormatted = {
  campo: string;
  mensagem: string;
};

export function formatZodErrors(error: ZodError): ErrorFormatted[] {
  const formatIssue = (issue: ZodIssue): ErrorFormatted => {
    const rawField = issue.path[0] as string;
    const campo = fieldTranslations[rawField] || rawField;
    return { campo, mensagem: issue.message };
  };

  const result: ErrorFormatted[] = [];

  for (const issue of error.issues) {
    if (issue.code === "invalid_union" && issue.unionErrors) {
      for (const unionError of issue.unionErrors) {
        for (const nestedIssue of unionError.issues) {
          result.push(formatIssue(nestedIssue));
        }
      }
    } else {
      result.push(formatIssue(issue));
    }
  }

  return result;
}

export function objectIsEmpty<T extends object>(obj: T) {
  for (const prop in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, prop)) {
      return false;
    }
  }

  return true;
}
