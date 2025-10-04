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
  try {
    console.log("Iniciando updateService com params:", params);

    const session = await getServerSession(authOptions);

    if (!session || !session.user || !session.user.admin) {
      console.log("Erro: Usuário não autorizado");
      throw new Error("Usuário não autorizado");
    }

    console.log("Usuário autorizado:", session.user.email);

    // Verificar se o serviço pertence à barbearia do usuário
    const barbershop = await db.barberShop.findUnique({
      where: {
        ownerId: session.user.id,
      },
    });

    if (!barbershop) {
      console.log("Erro: Barbearia não encontrada");
      throw new Error("Barbearia não encontrada para este usuário");
    }

    console.log("Barbearia encontrada:", barbershop.name);

    const service = await db.barbershopService.findFirst({
      where: {
        id: params.serviceId,
        barberShopId: barbershop.id,
      },
    });

    if (!service) {
      console.log("Erro: Serviço não encontrado");
      throw new Error(
        "Serviço não encontrado ou não pertence a esta barbearia",
      );
    }

    console.log("Serviço encontrado:", service.name);

    // Atualizar o serviço
    const updatedService = await db.barbershopService.update({
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

    console.log("Serviço atualizado com sucesso:", updatedService.name);

    // Revalidar páginas relacionadas
    revalidatePath("/barber_app/services");
    revalidatePath("/dashboard/services");
    revalidatePath("/dashboard");

    console.log("Páginas revalidadas com sucesso");
  } catch (error) {
    console.error("Erro detalhado em updateService:", error);
    throw error;
  }
};
