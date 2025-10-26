import z from "zod";

import { prisma } from "@omnifex/db";

import { publicProcedure } from "../lib/orpc";

export const todoRouter = {
  getAll: publicProcedure.handler(async () => {
    return await prisma.user.findMany({
      orderBy: {
        id: "asc",
      },
    });
  }),

  delete: publicProcedure.input(z.object({ id: z.string() })).handler(async ({ input }) => {
    return await prisma.user.delete({
      where: { id: input.id },
    });
  }),
};
