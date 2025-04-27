"use server";

import { revalidatePath } from "next/cache";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/prisma";

interface CreateBarbershopParams {
  name: string;
  address: string;
  phones: string[];
  description?: string;
  imageUrl?: string;
}

export const createBarbershop = async (params: CreateBarbershopParams) => {
  const session = await getServerSession(authOptions);

  if (!session || !session.user || !session.user.admin) {
    throw new Error("Usuário não autorizado");
  }

  await db.barberShop.create({
    data: {
      name: params.name,
      address: params.address,
      phones: params.phones,
      description: params.description ?? "",
      imageUrl: params.imageUrl ?? "",
      ownerId: session.user.id,
    },
  });

  // Revalida páginas importantes
  revalidatePath("/dashboard");
  revalidatePath("/barbershops");
};
