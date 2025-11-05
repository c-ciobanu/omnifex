import * as z from "zod";

import { prisma } from "@omnifex/db";

import { protectedProcedure, publicProcedure } from "../lib/orpc";

export const documentsRouter = {
  getAll: protectedProcedure.handler(async ({ context }) => {
    return prisma.document.findMany({
      where: { userId: context.session.user.id },
      orderBy: { updatedAt: "desc" },
    });
  }),

  get: publicProcedure.input(z.object({ id: z.string().min(1) })).handler(async ({ input, context }) => {
    const document = await prisma.document.findUnique({ where: { id: input.id } });

    if (document && (document.isPublic || document.userId === context.session?.user.id)) {
      return { ...document, isEditable: document.userId === context.session?.user.id };
    }

    return null;
  }),

  create: protectedProcedure
    .input(z.object({ title: z.string().min(1), body: z.string().optional() }))
    .handler(async ({ input, context }) => {
      return prisma.document.create({ data: { ...input, userId: context.session.user.id } });
    }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.string().min(1),
        title: z.string().min(1).optional(),
        body: z.string().optional(),
        isPublic: z.boolean().optional(),
      }),
    )
    .handler(async ({ input, context }) => {
      const { id, ...documentData } = input;

      return prisma.document.update({ data: documentData, where: { id, userId: context.session.user.id } });
    }),

  delete: protectedProcedure.input(z.object({ id: z.string().min(1) })).handler(async ({ input, context }) => {
    return prisma.document.delete({ where: { id: input.id, userId: context.session.user.id } });
  }),
};
