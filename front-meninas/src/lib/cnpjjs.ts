import { Cnpja } from "@cnpja/sdk";

export const cnpja = new Cnpja({ apiKey: import.meta.env.VITE_CNPJJA_API_KEY });
