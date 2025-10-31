import * as z from "zod";

export const optionalString = z
  .string()
  .trim()
  .transform((value) => {
    if (value === "") {
      return undefined;
    }

    return value;
  });
