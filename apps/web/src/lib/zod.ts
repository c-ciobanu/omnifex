import * as z from "zod";

export const zodTypes = {
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
    .transform((value) => {
      if (value === "") {
        return null;
      }

      return value;
    }),
  number: z.coerce.number<number>(),
};
