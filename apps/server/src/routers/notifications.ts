import * as z from "zod";

import { prisma } from "@omnifex/db";

import { protectedProcedure } from "../lib/orpc";

export const notificationsRouter = {
  getUnreadCount: protectedProcedure.handler(async ({ context }) => {
    return prisma.notification.count({ where: { userId: context.session.user.id, readAt: null } });
  }),

  getRecent: protectedProcedure.handler(async ({ context }) => {
    return prisma.notification.findMany({
      where: { userId: context.session.user.id },
      orderBy: { createdAt: "desc" },
      take: 20,
    });
  }),

  markAsRead: protectedProcedure
    .input(z.object({ id: z.string().trim().min(1) }))
    .handler(async ({ input, context }) => {
      await prisma.notification.updateMany({
        data: { readAt: new Date() },
        where: { id: input.id, userId: context.session.user.id, readAt: null },
      });
    }),

  markAllAsRead: protectedProcedure.handler(async ({ context }) => {
    await prisma.notification.updateMany({
      data: { readAt: new Date() },
      where: { userId: context.session.user.id, readAt: null },
    });
  }),
};
