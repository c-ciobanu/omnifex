import { ORPCError } from "@orpc/server";
import * as z from "zod";

import { prisma } from "@omnifex/db";

import { protectedProcedure } from "../lib/orpc";

export const metricsRouter = {
  getAll: protectedProcedure.handler(async ({ context }) => {
    const metrics = await prisma.metric.findMany({
      where: { userId: context.session.user.id },
      include: { entries: { orderBy: { date: "desc" }, take: 1 } },
    });

    return metrics.map((metric) => ({
      ...metric,
      entries: undefined,
      latestEntry: metric.entries[0],
    }));
  }),

  get: protectedProcedure.input(z.object({ id: z.int() })).handler(async ({ input, context }) => {
    return prisma.metric.findUnique({
      where: { id: input.id, userId: context.session.user.id },
      include: { entries: { orderBy: { date: "desc" } } },
    });
  }),

  create: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1),
        unit: z.string().nullable(),
        entry: z.object({ value: z.number(), date: z.iso.date() }),
      }),
    )
    .handler(async ({ input, context }) => {
      const { entry, ...metricData } = input;

      return prisma.metric.create({
        data: {
          ...metricData,
          userId: context.session.user.id,
          entries: { create: [{ date: new Date(entry.date), value: entry.value }] },
        },
      });
    }),

  update: protectedProcedure
    .input(z.object({ id: z.int(), name: z.string().min(1), unit: z.string().nullable() }))
    .handler(async ({ input, context }) => {
      const { id, ...metricData } = input;

      return prisma.metric.update({ data: metricData, where: { id, userId: context.session.user.id } });
    }),

  delete: protectedProcedure.input(z.object({ id: z.int() })).handler(async ({ input, context }) => {
    return prisma.metric.delete({ where: { id: input.id, userId: context.session.user.id } });
  }),

  createEntry: protectedProcedure
    .input(z.object({ metricId: z.int(), value: z.number(), date: z.iso.date() }))
    .handler(async ({ input, context }) => {
      const { date, ...otherData } = input;

      const metric = await prisma.metric.findUnique({
        where: { id: input.metricId, userId: context.session.user.id },
      });

      if (!metric) {
        throw new ORPCError("FORBIDDEN");
      }

      return prisma.metricEntry.create({ data: { ...otherData, date: new Date(date) } });
    }),

  updateEntry: protectedProcedure
    .input(z.object({ id: z.int(), metricId: z.int(), value: z.number(), date: z.iso.date() }))
    .handler(async ({ input, context }) => {
      const { id, metricId, date, ...otherData } = input;

      return prisma.metricEntry.update({
        data: { ...otherData, date: new Date(date) },
        where: { id, metric: { id: metricId, userId: context.session.user.id } },
      });
    }),

  deleteEntry: protectedProcedure.input(z.object({ id: z.int() })).handler(async ({ input, context }) => {
    return prisma.metricEntry.delete({
      where: { id: input.id, metric: { userId: context.session.user.id } },
    });
  }),
};
