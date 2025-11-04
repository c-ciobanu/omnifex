import type { WorkerOptions } from "bullmq";

import { env } from "../env";

export const defaultWorkerOptions = {
  connection: {
    host: env.REDIS_HOST,
    port: env.REDIS_PORT,
  },
  autorun: false,
} satisfies WorkerOptions;
