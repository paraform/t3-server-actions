import NextAuth, { type DefaultSession } from "next-auth";
import authConfig from "@/server/auth/config";
import { DrizzleAdapter } from "@auth/drizzle-adapter";

import { db } from "@/server/db";
import { mysqlTable } from "@/server/db/schema";
import { getAccountByUserId, getUserById } from "./actions";

/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */
declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      // ...other properties
      // role: UserRole;
    } & DefaultSession["user"];
  }

  // interface User {
  //   // ...other properties
  //   // role: UserRole;
  // }
}

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 *
 * @see https://next-auth.js.org/configuration/options
 */

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  callbacks: {
    async signIn({ user, account }) {
      // Allow OAuth without email verification
      if (account?.provider !== "email") return true;
      if (user.id) {
        const existingUser = await getUserById(user.id);
        // Prevent sign in without email verification
        if (!existingUser?.emailVerified) return false;
      }
      return true;
    },
    async session(opts) {
      if (!("token" in opts)) throw "unreachable with session strategy";
      return {
        ...opts.session,
        user: {
          ...opts.session.user,
          id: opts.token.id as string,
        },
      };
    },
    async jwt({ token }) {
      if (!token.sub) return token;
      const existingUser = await getUserById(token.sub);
      if (!existingUser) return token;
      const existingAccount = await getAccountByUserId(existingUser.id);

      token.isOAuth = !!existingAccount;
      token.id = existingUser.id;
      token.name = existingUser.name;
      token.email = existingUser.email;

      return token;
    },
  },
  adapter: DrizzleAdapter(db, mysqlTable),
  session: { strategy: "jwt" },
  ...authConfig,
});
