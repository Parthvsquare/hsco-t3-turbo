import type {
  DefaultSession,
  NextAuthConfig,
  Session as NextAuthSession,
} from "next-auth";
import { skipCSRFCheck } from "@auth/core";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import GoogleProvider from "next-auth/providers/google";

import type { RoleEnum, SubscribePlanEnum } from "@acme/db/schema";
import { db } from "@acme/db/client";
import { Account, Session, User as UserTable } from "@acme/db/schema";

import { env } from "../env";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: RoleEnum;
      subscribedPlans: SubscribePlanEnum;
    } & DefaultSession["user"];
  }
}

const adapter = DrizzleAdapter(db, {
  usersTable: UserTable,
  accountsTable: Account,
  sessionsTable: Session,
});

export const isSecureContext = env.NODE_ENV !== "development";

export const authConfig = {
  adapter,
  // In development, we need to skip checks to allow Expo to work
  ...(!isSecureContext
    ? {
        skipCSRFCheck: skipCSRFCheck,
        trustHost: true,
      }
    : {}),
  secret: env.AUTH_SECRET,
  providers: [
    GoogleProvider({
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
      profile(profile) {
        console.log("===> ~ profile:", profile);
        let role: RoleEnum;
        if (
          profile.email === "pvsquareservices@gmail.com" ||
          profile.email === "sumansasmal028@gmail.com"
        ) {
          role = "admin";
        } else {
          role = "basic";
        }

        return { ...profile, role: role };
      },
    }),
  ],
  callbacks: {
    redirect({ url, baseUrl }) {
      // Allows relative callback URLs
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      // Allows callback URLs on the same origin
      else if (new URL(url).origin === baseUrl) return url;
      return baseUrl;
    },
    authorized: ({ auth }) => {
      // Only allow access to admin users
      return auth?.user.role === "admin";
    },
    session: (opts) => {
      if (!("user" in opts))
        throw new Error("unreachable with session strategy");

      return {
        ...opts.session,
        user: {
          ...opts.session.user,
          id: opts.user.id,
          role: opts.session.user.role,
          subscribedPlans: opts.session.user.subscribedPlans,
        },
      };
    },
  },
} satisfies NextAuthConfig;

export const validateToken = async (
  token: string,
): Promise<NextAuthSession | null> => {
  const sessionToken = token.slice("Bearer ".length);
  const session = await adapter.getSessionAndUser?.(sessionToken);

  const user = await adapter.getUserByEmail?.(session?.user.email!);

  console.log("===> ~ user:", user);

  return session
    ? {
        user: {
          ...session.user,
          role: "admin",
          subscribedPlans: "all",
        },
        expires: session.session.expires.toISOString(),
      }
    : null;
};

export const invalidateSessionToken = async (token: string) => {
  const sessionToken = token.slice("Bearer ".length);
  await adapter.deleteSession?.(sessionToken);
};
