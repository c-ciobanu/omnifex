import { differenceInMilliseconds } from "date-fns";
import * as z from "zod";

import { prisma } from "@omnifex/db";

import { protectedProcedure } from "../lib/orpc";
import { createReminderNotificationQueue } from "../queues";

const reminderInputSchema = z.object({
  title: z.string().trim().min(1),
  notes: z.string().trim().nullable(),
  date: z.iso.datetime(),
});

async function scheduleCreateReminderNotification(reminderId: string, date: Date) {
  const existingJob = await createReminderNotificationQueue.getJob(reminderId);

  if (existingJob) {
    await existingJob.remove();
  }

  await createReminderNotificationQueue.add(
    reminderId,
    { reminderId },
    { jobId: reminderId, delay: differenceInMilliseconds(date, new Date()) },
  );
}

export const remindersRouter = {
  getAll: protectedProcedure
    .input(z.object({ filter: z.enum(["upcoming", "previous"]) }))
    .handler(async ({ input, context }) => {
      const now = new Date();

      return prisma.reminder.findMany({
        where: {
          userId: context.session.user.id,
          date: input.filter === "upcoming" ? { gte: now } : { lt: now },
        },
        orderBy: { date: input.filter === "upcoming" ? "asc" : "desc" },
      });
    }),

  create: protectedProcedure.input(reminderInputSchema).handler(async ({ input, context }) => {
    const reminder = await prisma.reminder.create({
      data: { ...input, userId: context.session.user.id },
    });

    await scheduleCreateReminderNotification(reminder.id, new Date(input.date));

    return reminder;
  }),

  update: protectedProcedure
    .input(reminderInputSchema.extend({ id: z.string().trim().min(1) }))
    .handler(async ({ input, context }) => {
      const { id, ...data } = input;

      const reminder = await prisma.reminder.update({
        where: { id, userId: context.session.user.id },
        data,
      });

      await scheduleCreateReminderNotification(reminder.id, new Date(data.date));

      return reminder;
    }),

  delete: protectedProcedure.input(z.object({ id: z.string().trim().min(1) })).handler(async ({ input, context }) => {
    const existingJob = await createReminderNotificationQueue.getJob(input.id);

    if (existingJob) {
      await existingJob.remove();
    }

    return prisma.reminder.delete({ where: { id: input.id, userId: context.session.user.id } });
  }),
};
