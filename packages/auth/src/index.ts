import type { BetterAuthOptions } from "better-auth";
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { username } from "better-auth/plugins";

import { prisma } from "@omnifex/db";

export function initAuth() {
  const config = {
    database: prismaAdapter(prisma, {
      provider: "postgresql",
    }),
    trustedOrigins: [process.env.CORS_ORIGIN ?? ""],
    emailAndPassword: {
      enabled: true,
    },
    plugins: [username()],
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
