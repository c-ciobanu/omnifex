import * as z from "zod";

import { prisma } from "@omnifex/db";

import { protectedProcedure } from "../lib/orpc";

export const shoppingListsRouter = {
  getAll: protectedProcedure.handler(async ({ context }) => {
    return prisma.shoppingList.findMany({
      where: { userId: context.session.user.id },
      orderBy: { name: "asc" },
      include: {
        items: true,
      },
    });
  }),

  get: protectedProcedure.input(z.object({ id: z.string().min(1) })).handler(async ({ input, context }) => {
    return prisma.shoppingList.findUnique({
      where: { id: input.id, userId: context.session.user.id },
      include: {
        items: { orderBy: { name: "asc" } },
      },
    });
  }),

  create: protectedProcedure.input(z.object({ name: z.string().min(1) })).handler(async ({ input, context }) => {
    return prisma.shoppingList.create({ data: { ...input, userId: context.session.user.id } });
  }),

  update: protectedProcedure
    .input(z.object({ id: z.string().min(1), name: z.string().min(1) }))
    .handler(async ({ input, context }) => {
      const { id, ...data } = input;

      return prisma.shoppingList.update({ data, where: { id, userId: context.session.user.id } });
    }),

  delete: protectedProcedure.input(z.object({ id: z.string().min(1) })).handler(async ({ input, context }) => {
    return prisma.shoppingList.delete({ where: { id: input.id, userId: context.session.user.id } });
  }),
};
