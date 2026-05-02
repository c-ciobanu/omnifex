import * as z from "zod";

import { prisma } from "@omnifex/db";

import { protectedProcedure } from "../lib/orpc";

const recipeInputSchema = z.object({
  name: z.string().trim().min(1),
  instructions: z.array(z.string().trim().min(1)).min(1),
  ingredients: z
    .array(
      z.object({
        name: z.string().trim().min(1),
        quantity: z.string().trim().min(1),
        unit: z.string().trim().min(1).nullable(),
      }),
    )
    .min(1),
});

export const recipesRouter = {
  getAll: protectedProcedure.handler(({ context }) => {
    return prisma.recipe.findMany({
      where: { userId: context.session.user.id },
      orderBy: { name: "asc" },
    });
  }),

  get: protectedProcedure.input(z.object({ id: z.string().min(1) })).handler(({ input, context }) => {
    return prisma.recipe.findUnique({
      where: { id: input.id, userId: context.session.user.id },
      include: {
        ingredients: true,
      },
    });
  }),

  create: protectedProcedure.input(recipeInputSchema).handler(({ input, context }) => {
    const { ingredients, ...recipeData } = input;

    return prisma.recipe.create({
      data: {
        ...recipeData,
        userId: context.session.user.id,
        ingredients: { create: ingredients },
      },
    });
  }),

  update: protectedProcedure
    .input(recipeInputSchema.extend({ id: z.string().trim().min(1) }))
    .handler(({ input, context }) => {
      const { id, ingredients, ...recipeData } = input;

      return prisma.recipe.update({
        where: { id, userId: context.session.user.id },
        data: {
          ...recipeData,
          ingredients: { deleteMany: {}, create: ingredients },
        },
      });
    }),

  delete: protectedProcedure.input(z.object({ id: z.string().trim().min(1) })).handler(({ input, context }) => {
    return prisma.recipe.delete({ where: { id: input.id, userId: context.session.user.id } });
  }),
};
