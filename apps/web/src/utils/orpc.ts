import type { InferClientOutputs } from "@orpc/client";
import { env } from "@/env";
import { createORPCClient, onError } from "@orpc/client";
import { RPCLink } from "@orpc/client/fetch";
import { createTanstackQueryUtils } from "@orpc/tanstack-query";
import { QueryCache, QueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { decimalSerializer } from "@omnifex/orpc";

import type { AppRouterClient } from "../../../server/src/routers";

export type OrpcClientOutputs = InferClientOutputs<AppRouterClient>;

export const queryClient = new QueryClient({
  queryCache: new QueryCache({
    onError: (error) => {
      toast.error(`Error: ${error.message}`, {
        action: {
          label: "retry",
          onClick: () => {
            void queryClient.invalidateQueries();
          },
        },
      });
    },
  }),
});

export const link = new RPCLink({
  url: `${env.VITE_SERVER_URL}/rpc`,
  fetch(url, options) {
    return fetch(url, {
      ...options,
      credentials: "include",
    });
  },
  customJsonSerializers: [decimalSerializer],
  interceptors: [
    onError((error) => {
      if (error instanceof Error) {
        toast.error(error.message);
      }
    }),
  ],
});

export const client: AppRouterClient = createORPCClient(link);

export const orpc = createTanstackQueryUtils(client);
