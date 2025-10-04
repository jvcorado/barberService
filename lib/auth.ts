import { PrismaAdapter } from "@auth/prisma-adapter";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { db } from "@/lib/prisma";
import { AuthOptions } from "next-auth";
import bcrypt from "bcryptjs";

export const authOptions: AuthOptions = {
  adapter: PrismaAdapter(db) as any,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Senha", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const user = await db.user.findUnique({
          where: {
            email: credentials.email,
          },
        });

        if (!user || !user.password) {
          return null;
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.password,
        );

        if (!isPasswordValid) {
          return null;
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
          admin: user.admin,
        };
      },
    }),
  ],
  pages: {
    error: "/clientlogin",
  },
  callbacks: {
    async session({ session, user }) {
      const dbUser = await db.user.findUnique({
        where: {
          id: user.id,
        },
        include: {
          barbershop: true, // inclui a barbearia associada
        },
      });

      if (!dbUser) return session;

      session.user = {
        ...session.user,
        id: user.id,
        admin: dbUser.admin,
        ...(dbUser.admin &&
          dbUser.barbershop && { barbershop: dbUser.barbershop }),
      } as any;

      return session;
    },
  },

  secret: process.env.NEXT_AUTH_SECRET,
};
