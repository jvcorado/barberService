import { PrismaAdapter } from "@auth/prisma-adapter";
import GoogleProvider from "next-auth/providers/google";
import { db } from "@/lib/prisma";
import { AuthOptions } from "next-auth";

export const authOptions: AuthOptions = {
  adapter: PrismaAdapter(db) as any,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
  ],
  callbacks: {
    async session({ session, user }) {
      const dbUser = await db.user.findUnique({
        where: {
          id: user.id,
        },
      });

      if (!dbUser) return session;

      session.user = {
        ...session.user,
        id: user.id,
        admin: dbUser.admin,
      } as any;

      return session;
    },
  },
  secret: process.env.NEXT_AUTH_SECRET,
};
