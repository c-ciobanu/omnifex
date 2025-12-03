import type { BetterAuthOptions } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { betterAuth } from "better-auth/minimal";
import { admin, username } from "better-auth/plugins";

import { BookListType, MovieListType, prisma } from "@omnifex/db";

export function initAuth() {
  const config = {
    database: prismaAdapter(prisma, {
      provider: "postgresql",
    }),
    trustedOrigins: [process.env.CORS_ORIGIN ?? ""],
    emailAndPassword: {
      enabled: true,
    },
    databaseHooks: {
      user: {
        create: {
          after: async (user) => {
            await prisma.movieList.createMany({
              data: [
                { name: "Watchlist", type: MovieListType.WATCHLIST, userId: user.id },
                { name: "Watched", type: MovieListType.WATCHED, userId: user.id },
              ],
            });

            await prisma.bookList.createMany({
              data: [
                { name: "Reading List", type: BookListType.READING_LIST, userId: user.id },
                { name: "Read", type: BookListType.READ, userId: user.id },
              ],
            });
          },
        },
      },
    },
    plugins: [username(), admin()],
    advanced: {
      defaultCookieAttributes: {
        sameSite: "none",
        secure: true,
        httpOnly: true,
      },
    },
    onAPIError: {
      onError(error, ctx) {
        console.error("BETTER AUTH API ERROR", error, ctx);
      },
    },
  } satisfies BetterAuthOptions;

  return betterAuth(config);
}

export type Auth = ReturnType<typeof initAuth>;
export type Session = Auth["$Infer"]["Session"];
