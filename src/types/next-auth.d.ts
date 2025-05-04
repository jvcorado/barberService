import NextAuth from "next-auth";
import { Barbershop } from "@prisma/client"; // importa o tipo

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      admin: boolean;
      barbershop?: Barbershop | null; // aqui vai o objeto Barbershop
    };
  }

  interface User {
    id: string;
    admin: boolean;
  }
}
