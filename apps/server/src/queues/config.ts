import type { DefaultJobOptions, QueueOptions } from "bullmq";
import { secondsInMonth, secondsInQuarter } from "date-fns/constants";

import { env } from "../env";

export const defaultJobOptions = {
  removeOnComplete: { age: secondsInMonth },
  removeOnFail: { age: secondsInQuarter },
} satisfies DefaultJobOptions;

export const defaultQueueOptions = {
  connection: { url: env.REDIS_URL },
  defaultJobOptions,
} satisfies QueueOptions;
