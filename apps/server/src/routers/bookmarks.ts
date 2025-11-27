import * as z from "zod";

import { prisma } from "@omnifex/db";

import { protectedProcedure } from "../lib/orpc";

const bookmarkInputSchema = z.object({
  name: z.string().trim().min(1),
  url: z.url(),
  iconUrl: z.url().nullable(),
});

export const bookmarksRouter = {
  getAll: protectedProcedure.handler(async ({ context }) => {
    return prisma.bookmark.findMany({
      where: { userId: context.session.user.id },
      orderBy: { name: "asc" },
    });
  }),

  create: protectedProcedure.input(bookmarkInputSchema).handler(async ({ input, context }) => {
    return prisma.bookmark.create({ data: { ...input, userId: context.session.user.id } });
  }),

  update: protectedProcedure.input(bookmarkInputSchema.extend({ id: z.int() })).handler(async ({ input, context }) => {
    const { id, ...bookmarkData } = input;

    return prisma.bookmark.update({ data: bookmarkData, where: { id, userId: context.session.user.id } });
  }),

  delete: protectedProcedure.input(z.object({ id: z.int() })).handler(async ({ input, context }) => {
    return prisma.bookmark.delete({ where: { id: input.id, userId: context.session.user.id } });
  }),
};
