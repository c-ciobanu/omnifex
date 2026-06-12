import { Worker } from "bullmq";

import { prisma } from "@omnifex/db";

import type { CreateReminderNotificationDataType } from "../queues/index";
import { createReminderNotificationQueue } from "../queues/index";
import { defaultWorkerOptions } from "./config";

export const createReminderNotificationWorker = new Worker<CreateReminderNotificationDataType>(
  createReminderNotificationQueue.name,
  async (job) => {
    const { reminderId } = job.data;

    const reminder = await prisma.reminder.findUnique({ where: { id: reminderId } });

    if (!reminder) {
      throw new Error("Reminder not found");
    }

    await prisma.notification.create({
      data: {
        userId: reminder.userId,
        reminderId: reminder.id,
        title: reminder.title,
        body: reminder.notes,
      },
    });
  },
  defaultWorkerOptions,
);
