import * as z from "zod";

export const zodTypes = {
  requiredString: z.string().trim().min(1),
  optionalString: z
    .string()
    .trim()
    .transform((value) => {
      if (value === "") {
        return undefined;
      }

      return value;
    }),
  nullableString: z
    .string()
    .trim()
    .nullable()
    .transform((value) => {
      if (value === "") {
        return null;
      }

      return value;
    }),
  number: z.coerce.number<number>(),
};
