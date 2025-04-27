"use server";

import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/prisma";

interface CreateServiceParams {
  name: string;
  description?: string;
  price: number;
  imageUrl?: string;
  duration?: number;
}

export const createService = async (params: CreateServiceParams) => {
  const session = await getServerSession(authOptions);

  if (!session || !session.user || !session.user.admin) {
    throw new Error("Usuário não autorizado");
  }

  const barbershop = await db.barberShop.findUnique({
    where: {
      ownerId: session.user.id,
    },
  });

  if (!barbershop) {
    throw new Error("Barbearia não encontrada para este usuário");
  }

  await db.barbershopService.create({
    data: {
      name: params.name,
      description: params.description ?? "",
      price: params.price,
      imageUrl: params.imageUrl ?? "",
      duration: params.duration ?? 30,
      barberShopId: barbershop.id,
    },
  });

  // Revalida páginas relacionadas aos serviços
  revalidatePath("/dashboard/services");
  revalidatePath("/dashboard");
};
