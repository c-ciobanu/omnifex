import { ORPCError } from "@orpc/server";
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
        items: { orderBy: [{ bought: "asc" }, { name: "asc" }] },
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

  createItem: protectedProcedure
    .input(z.object({ listId: z.string().min(1), name: z.string().min(1) }))
    .handler(async ({ input, context }) => {
      const shoppingList = await prisma.shoppingList.findUnique({
        where: { id: input.listId, userId: context.session.user.id },
      });

      if (!shoppingList) {
        throw new ORPCError("FORBIDDEN");
      }

      return prisma.shoppingListItem.create({ data: input });
    }),

  updateItem: protectedProcedure
    .input(z.object({ id: z.int(), listId: z.string().min(1), bought: z.boolean() }))
    .handler(async ({ input, context }) => {
      const { id, listId, bought } = input;

      return prisma.shoppingListItem.update({
        data: { bought },
        where: { id, list: { id: listId, userId: context.session.user.id } },
      });
    }),

  deleteItem: protectedProcedure.input(z.object({ id: z.int() })).handler(async ({ input, context }) => {
    return prisma.shoppingListItem.delete({ where: { id: input.id, list: { userId: context.session.user.id } } });
  }),
};
