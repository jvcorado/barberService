"use server";

import { db } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export const deleteService = async (serviceId: string) => {
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
      id: serviceId,
      barberShopId: barbershop.id,
    },
  });

  if (!service) {
    throw new Error("Serviço não encontrado ou não pertence a esta barbearia");
  }

  // Deletar o serviço
  await db.barbershopService.delete({
    where: {
      id: serviceId,
    },
  });

  // Revalidar páginas relacionadas
  revalidatePath("/barber_app/services");
  revalidatePath("/dashboard/services");
  revalidatePath("/dashboard");
};
