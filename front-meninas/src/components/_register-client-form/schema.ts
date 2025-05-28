import { z } from "zod";

export const stringOrNullSchema = z
  .string()
  .trim()
  .nullable()
  .transform((value) => {
    if (value === "") return null;
    return value;
  }); //  "" -> null

export const openingDateSchema = z
  .string()
  .trim()
  .min(8, "Data é obrigatório")
  .max(8, "Data deve conter exatamente 8 dígitos")
  .regex(
    /^[0-9]{8}$/,
    "A data precisa ter apenas números no formato DD/MM/AAAA"
  )
  .refine((value) => {
    const day = parseInt(value.slice(0, 2));
    const month = parseInt(value.slice(2, 4));
    const year = parseInt(value.slice(4, 8));

    const currentYear = new Date().getFullYear();
    if (year < 1500 || year > currentYear) {
      return false;
    }

    if (month < 1 || month > 12) {
      return false;
    }

    const daysInMonth = [0, 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

    if (
      month === 2 &&
      ((year % 4 === 0 && year % 100 !== 0) || year % 400 === 0)
    ) {
      if (day < 1 || day > 29) return false;
    } else {
      if (day < 1 || day > daysInMonth[month]) return false;
    }

    return true;
  }, "Data inválida")
  .refine((value) => {
    const day = parseInt(value.slice(0, 2));
    const month = parseInt(value.slice(2, 4)) - 1;
    const year = parseInt(value.slice(4, 8));

    const date = new Date(year, month, day);

    return (
      date.getDate() === day &&
      date.getMonth() === month &&
      date.getFullYear() === year
    );
  }, "Data não existe no calendário");

export const tradeNameSchema = z
  .string()
  .trim()
  .min(1, "Nome fantasia é obrigatório");
export const taxSchema = z
  .string({ required_error: "Diga algum documento" })
  .trim()
  .transform((val) => {
    return val ? val.replace(/\D/g, "") : val;
  })
  .refine((val) => {
    return val.length === 11 || val.length === 14;
  }, "Digite um CPF ou CNPJ válido");

export const typeSchema = z.string().trim();

export const taxIdSchema = z
  .object({
    taxId: taxSchema,
    openingDate: openingDateSchema.nullable(),
    tradeName: tradeNameSchema.nullable(),
    type: typeSchema.nullable(),
  })
  .transform((data) => {
    const isCNPJ = data.taxId.length === 14;
    const type = isCNPJ ? "J" : "F";

    if (type === "F") {
      return {
        type,
        taxId: data.taxId,
        openingDate: data.openingDate,
        tradeName: null,
      };
    }

    return {
      type,
      taxId: data.taxId,
      openingDate: data.openingDate,
      tradeName: data.tradeName,
    };
  })
  .refine(
    (data) => {
      if (data.taxId === null) {
        return (
          data.openingDate === null &&
          data.tradeName === null &&
          data.type === null
        );
      }

      if (data.type === "J") {
        return data.openingDate !== null && data.openingDate !== "";
      }

      if (data.type === "F") {
        return data.openingDate !== null && data.openingDate !== "";
      }

      return true;
    },
    {
      message: "Data é um campo obrigatório",
      path: ["openingDate"],
    }
  )
  .refine(
    (data) => {
      if (data.taxId === null) {
        return (
          data.openingDate === null &&
          data.tradeName === null &&
          data.type === null
        );
      }

      if (data.type === "J") {
        return data.tradeName !== null && data.tradeName !== "";
      }

      if (data.type === "F") {
        return data.tradeName === null;
      }

      return true;
    },
    {
      message: "Dados inconsistentes. Verifique os campos.",
      path: ["taxId"],
    }
  );

export type TaxIdSchema = z.infer<typeof taxIdSchema>;

export const mobilePhoneSchema = stringOrNullSchema.pipe(
  z
    .string()
    .min(11, "Digite um numero de celular válido")
    .max(11, "Digite um numero de celular válido")
    .regex(/^\d+$/)
    .nullable()
);

export const landlinesSchema = stringOrNullSchema.pipe(
  z
    .string()
    .min(10, "Digite um numero de telefone válido")
    .max(10, "Digite um numero de telefone válido")
    .regex(/^\d+$/)
    .nullable()
);

export const areaCodeSchema = stringOrNullSchema.pipe(
  z.string().min(2).max(2).regex(/^\d+$/).nullable()
);
export const emailSchema = stringOrNullSchema.pipe(
  z.string().email().nullable()
);
export const homepageSchema = stringOrNullSchema;
export const phoneSchema = z.union([mobilePhoneSchema, landlinesSchema]);
export const contactSchema = z
  .object({
    email: emailSchema,
    homepage: homepageSchema,
    phone: phoneSchema,
    areaCode: areaCodeSchema,
  })
  .transform((values) => {
    if (values.phone) {
      const ddd = values.phone.slice(0, 2);
      const phone = values.phone.slice(2);

      return { ...values, phone, areaCode: ddd };
    }

    if (values.areaCode) {
      return { ...values, areaCode: null };
    }

    return values;
  });

export const addressSchema = z
  .string({ required_error: "Endereço é um campo obrigatório" })
  .trim()
  .min(1, "Endereço é um campo obrigatório")
  .max(255, "O endereço está muito longo");

export const stateSchema = z
  .string({ required_error: "Estado é um campo obrigatório" })
  .trim()
  .min(2, "Estado invalido")
  .max(2, "Estado invalido")
  .transform((st) => st.toUpperCase());

export const cityCodeSchema = stringOrNullSchema.pipe(
  z
    .string()
    .trim()
    .min(1, "Cidade é um campo obrigatório")
    .max(255, "O nome da cidade está muito longo")
    .nullable()
);

export const nameSchema = z
  .string({ required_error: "Nome é um campo obrigatório" })
  .trim()
  .min(1, "Nome é um campo obrigatório")
  .max(255, "O nome está muito longo");

export const neighborhoodSchema = z
  .string({ required_error: "Bairro é um campo obrigatório" })
  .trim()
  .min(1, "Bairro é um campo obrigatório")
  .max(255, "O nome do bairro está muito longo");

export const zipCodeSchema = stringOrNullSchema.pipe(
  z
    .string()
    .min(8, "Digite um cep valido")
    .max(8, "Digite um cep valido")
    .regex(/^\d+$/)
    .nullable()
);

export const citySchema = z
  .string({ required_error: "Cidade é obrigatório" })
  .trim()
  .min(1, "Cidade é um campo obrigatório")
  .max(255, "Cidade está muito longo");
export const countrySchema = stringOrNullSchema;
export const houseNumberSchema = z
  .string({ required_error: "Numero da casa é obrigatório" })
  .trim()
  .min(1, "Numero da casa é obrigatório")
  .max(50, "Numero da casa invalido")
  .transform((value) => {
    return `n°${value}`;
  });

export const storeCodeSchema = z
  .string({ required_error: "Você precisa selecionar uma loja" })
  .regex(/^\d+$/, "Codigo da loja precisa ser um numero")
  .trim()
  .min(2, "Selecione uma loja")
  .max(2, "Selecione uma loja");

export const stepOneSchema = z
  .object({
    name: nameSchema,
    storeCode: storeCodeSchema,
  })
  .and(taxIdSchema);

export type StepOneSchema = z.infer<typeof stepOneSchema>;

export const locationSchema = z
  .object({
    address: addressSchema,
    state: stateSchema,
    cityCode: cityCodeSchema,
    zipCode: zipCodeSchema,
    country: countrySchema,
    city: citySchema,
    neighborhood: neighborhoodSchema,
    houseNumber: houseNumberSchema,
  })
  .transform(({ houseNumber, address, ...rest }) => {
    return { address: address.concat(" ", houseNumber), houseNumber, ...rest };
  });

export const stepTwoSchema = contactSchema;
export type StepTwoSchema = z.infer<typeof stepTwoSchema>;

export const stepThreeSchema = locationSchema;
export type StepThreeSchema = z.infer<typeof stepThreeSchema>;

export const overviewSchema = z
  .object({
    address: addressSchema,
    state: stateSchema,
    cityCode: cityCodeSchema,
    zipCode: zipCodeSchema,
    country: countrySchema,
    city: citySchema,
    neighborhood: neighborhoodSchema,
    houseNumber: houseNumberSchema,
    email: emailSchema,
    homepage: homepageSchema,
    phone: z.union([
      stringOrNullSchema.pipe(
        z
          .string()
          .min(9, "Digite um numero de celular válido")
          .max(9, "Digite um numero de celular válido")
          .regex(/^\d+$/)
          .nullable()
      ),

      stringOrNullSchema.pipe(
        z
          .string()
          .min(8, "Digite um numero de telefone válido")
          .max(8, "Digite um numero de telefone válido")
          .regex(/^\d+$/)
          .nullable()
      ),
    ]),
    areaCode: areaCodeSchema,
  })
  .and(stepOneSchema);

export const editClientSchema = z
  .object({
    name: nameSchema,
  })
  .and(contactSchema)
  .and(locationSchema);

export type EditClientSchema = z.infer<typeof editClientSchema>;

export type OverviewSchema = z.infer<typeof overviewSchema>;
