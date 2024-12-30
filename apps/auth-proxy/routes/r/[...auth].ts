import type { DefaultSession } from "@auth/core/types";
import { Auth } from "@auth/core";
import { eventHandler, toWebRequest } from "h3";
import GoogleProvider from "next-auth/providers/google";

/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */
declare module "@auth/core" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      // ...other properties
      // role: Role;
      email: string;
    } & DefaultSession["user"];
  }

  // interface User {
  //   // ...other properties
  //   // role: UserRole;
  // }
}

export default eventHandler(async (event) =>
  Auth(toWebRequest(event), {
    basePath: "/r",
    secret: process.env.AUTH_SECRET,
    trustHost: !!process.env.VERCEL,
    session: {
      strategy: "jwt",
    },
    redirectProxyUrl: process.env.AUTH_REDIRECT_PROXY_URL,
    providers: [
      // Discord({
      //   clientId: process.env.AUTH_DISCORD_ID,
      //   clientSecret: process.env.AUTH_DISCORD_SECRET,
      // }),
      GoogleProvider({
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        authorization: {
          params: {
            prompt: "consent",
            access_type: "offline",
            response_type: "code",
          },
        },
      }),
    ],
    callbacks: {
      session: ({ session, token }) => ({
        ...session,
        user: {
          ...session.user,
          id: token.sub,
          email: token.email,
        },
      }),
    },
  }),
);
