import type { WorkerOptions } from "bullmq";

import { env } from "../env";

export const defaultWorkerOptions = {
  connection: { url: env.REDIS_URL },
  autorun: false,
} satisfies WorkerOptions;
