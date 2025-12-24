import { ORPCError } from "@orpc/server";
import * as z from "zod";

import { prisma } from "@omnifex/db";

import { env } from "../env";
import { protectedProcedure } from "../lib/orpc";
import { deleteObject, getPresignedDownloadUrl, getPresignedUploadUrl } from "../lib/s3";

const allowedContentTypes = ["text/plain", "application/pdf", "image/jpeg", "image/png"];

function generateObjectKey(userId: string, fileName: string): string {
  return `${userId}/files/${fileName}`;
}

export const filesRouter = {
  getAll: protectedProcedure.handler(async ({ context }) => {
    return prisma.file.findMany({
      where: { userId: context.session.user.id },
      orderBy: { updatedAt: "desc" },
      omit: {
        key: true,
      },
    });
  }),

  createPresignedUploadUrl: protectedProcedure
    .input(z.object({ fileName: z.string().min(1), contentType: z.string().min(1), contentSize: z.int() }))
    .handler(async ({ input, context }) => {
      const { fileName, contentType, contentSize } = input;
      const userId = context.session.user.id;

      if (!allowedContentTypes.includes(contentType)) {
        throw new ORPCError("CONFLICT", { message: "File type not allowed" });
      }

      if (contentSize > env.S3_MAX_BYTES_UPLOAD_SIZE) {
        throw new ORPCError("CONFLICT", { message: "File size too big" });
      }

      return getPresignedUploadUrl(generateObjectKey(userId, fileName), contentType, contentSize);
    }),

  create: protectedProcedure
    .input(z.object({ fileName: z.string().min(1), contentType: z.string().min(1), contentSize: z.int() }))
    .handler(async ({ input, context }) => {
      const { fileName, contentType, contentSize } = input;
      const userId = context.session.user.id;

      if (!allowedContentTypes.includes(contentType)) {
        throw new ORPCError("CONFLICT", { message: "File type not allowed" });
      }

      if (contentSize > env.S3_MAX_BYTES_UPLOAD_SIZE) {
        throw new ORPCError("CONFLICT", { message: "File size too big" });
      }

      return prisma.file.create({
        data: {
          name: fileName,
          key: generateObjectKey(userId, fileName),
          contentType,
          contentSize,
          userId,
        },
      });
    }),

  createPresignedDownloadUrl: protectedProcedure
    .input(z.object({ id: z.string().min(1) }))
    .handler(async ({ input, context }) => {
      const file = await prisma.file.findUnique({
        where: { id: input.id, userId: context.session.user.id },
      });

      if (!file) {
        throw new ORPCError("NOT_FOUND");
      }

      return getPresignedDownloadUrl(file.key, file.name);
    }),

  delete: protectedProcedure.input(z.object({ id: z.string().min(1) })).handler(async ({ input, context }) => {
    const file = await prisma.file.findUnique({
      where: { id: input.id, userId: context.session.user.id },
    });

    if (!file) {
      throw new ORPCError("NOT_FOUND");
    }

    await deleteObject(file.key);

    return prisma.file.delete({ where: { id: input.id, userId: context.session.user.id } });
  }),
};
