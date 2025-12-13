import { ORPCError } from "@orpc/server";
import * as z from "zod";

import { prisma } from "@omnifex/db";

import { protectedProcedure } from "../lib/orpc";

const toDoListInputSchema = z.object({
  name: z.string().trim().min(1),
  featuredOnDashboard: z.boolean(),
});

export const toDoListsRouter = {
  getAll: protectedProcedure.handler(async ({ context }) => {
    return prisma.toDoList.findMany({
      where: { userId: context.session.user.id },
      orderBy: { name: "asc" },
      include: {
        items: true,
      },
    });
  }),

  get: protectedProcedure.input(z.object({ id: z.string().trim().min(1) })).handler(async ({ input, context }) => {
    return prisma.toDoList.findUnique({
      where: { id: input.id, userId: context.session.user.id },
      include: {
        items: { orderBy: [{ completed: "asc" }, { name: "asc" }] },
      },
    });
  }),

  getForDashboard: protectedProcedure.handler(async ({ context }) => {
    return prisma.toDoList.findFirst({
      where: { userId: context.session.user.id, featuredOnDashboard: true },
      include: {
        items: {
          where: { completed: false },
          orderBy: { name: "asc" },
        },
      },
    });
  }),

  create: protectedProcedure.input(toDoListInputSchema).handler(async ({ input, context }) => {
    if (input.featuredOnDashboard) {
      await prisma.toDoList.updateMany({
        where: { userId: context.session.user.id },
        data: { featuredOnDashboard: false },
      });
    }

    return prisma.toDoList.create({ data: { ...input, userId: context.session.user.id } });
  }),

  update: protectedProcedure
    .input(toDoListInputSchema.extend({ id: z.string().trim().min(1) }))
    .handler(async ({ input, context }) => {
      const { id, ...data } = input;

      if (input.featuredOnDashboard) {
        await prisma.toDoList.updateMany({
          where: { userId: context.session.user.id },
          data: { featuredOnDashboard: false },
        });
      }

      return prisma.toDoList.update({ data, where: { id, userId: context.session.user.id } });
    }),

  delete: protectedProcedure.input(z.object({ id: z.string().trim().min(1) })).handler(async ({ input, context }) => {
    return prisma.toDoList.delete({ where: { id: input.id, userId: context.session.user.id } });
  }),

  createItem: protectedProcedure
    .input(z.object({ listId: z.string().trim().min(1), name: z.string().trim().min(1) }))
    .handler(async ({ input, context }) => {
      const toDoList = await prisma.toDoList.findUnique({
        where: { id: input.listId, userId: context.session.user.id },
      });

      if (!toDoList) {
        throw new ORPCError("FORBIDDEN");
      }

      return prisma.toDoListItem.create({ data: input });
    }),

  updateItem: protectedProcedure
    .input(z.object({ id: z.int(), listId: z.string().trim().min(1), completed: z.boolean() }))
    .handler(async ({ input, context }) => {
      const { id, listId, completed } = input;

      return prisma.toDoListItem.update({
        data: { completed },
        where: { id, list: { id: listId, userId: context.session.user.id } },
      });
    }),

  deleteItem: protectedProcedure.input(z.object({ id: z.int() })).handler(async ({ input, context }) => {
    return prisma.toDoListItem.delete({ where: { id: input.id, list: { userId: context.session.user.id } } });
  }),
};
