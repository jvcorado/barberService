"use server";

import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/prisma";

interface UpdateServiceParams {
  serviceId: string;
  name: string;
  description?: string;
  price: number;
  imageUrl?: string;
  duration?: number;
}

export const updateService = async (params: UpdateServiceParams) => {
  const session = await getServerSession(authOptions);

  if (!session || !session.user || !session.user.admin) {
    throw new Error("Usuário não autorizado");
  }

  // Verificar se o serviço pertence à barbearia do usuário
  const barbershop = await db.barberShop.findUnique({
    where: {
      ownerId: session.user.id,
    },
  });

  if (!barbershop) {
    throw new Error("Barbearia não encontrada para este usuário");
  }

  const service = await db.barbershopService.findFirst({
    where: {
      id: params.serviceId,
      barberShopId: barbershop.id,
    },
  });

  if (!service) {
    throw new Error("Serviço não encontrado ou não pertence a esta barbearia");
  }

  // Atualizar o serviço
  await db.barbershopService.update({
    where: {
      id: params.serviceId,
    },
    data: {
      name: params.name,
      description: params.description ?? service.description,
      price: params.price,
      imageUrl: params.imageUrl ?? service.imageUrl,
      duration: params.duration ?? service.duration,
    },
  });

  // Revalidar páginas relacionadas
  revalidatePath("/barber_app/services");
  revalidatePath("/dashboard/services");
  revalidatePath("/dashboard");
};
