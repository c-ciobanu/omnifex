import type { StandardRPCCustomJsonSerializer } from "@orpc/client/standard";
import { Decimal } from "decimal.js";

export const decimalSerializer: StandardRPCCustomJsonSerializer = {
  type: 21,
  condition: (data): data is Decimal => Decimal.isDecimal(data),
  serialize: (data: Decimal) => data.toJSON(),
  deserialize: (data: string) => new Decimal(data),
};
