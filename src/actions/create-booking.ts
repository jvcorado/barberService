"use server";

import { revalidatePath } from "next/cache";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/prisma";

interface CreateBookingParams {
  serviceId: string;
  date: Date;
  barberShopId: string;
}

export const createBooking = async (params: CreateBookingParams) => {
  try {
    console.log("Iniciando criação de agendamento:", params);

    const session = await getServerSession(authOptions);
    console.log("Sessão do usuário:", session);

    if (!session || !session.user) {
      console.log("Usuário não autenticado");
      return { success: false, error: "Usuário não autenticado" };
    }

    const userId = (session.user as any).id;
    console.log("ID do usuário:", userId);

    if (!userId) {
      console.log("ID do usuário não encontrado na sessão");
      return { success: false, error: "ID do usuário não encontrado" };
    }

    // Verificar se o serviço existe
    const service = await db.barbershopService.findUnique({
      where: { id: params.serviceId },
    });

    if (!service) {
      console.log("Serviço não encontrado:", params.serviceId);
      return { success: false, error: "Serviço não encontrado" };
    }

    // Verificar se a barbearia existe
    const barbershop = await db.barberShop.findUnique({
      where: { id: params.barberShopId },
    });

    if (!barbershop) {
      console.log("Barbearia não encontrada:", params.barberShopId);
      return { success: false, error: "Barbearia não encontrada" };
    }

    console.log("Criando agendamento...");
    const booking = await db.booking.create({
      data: {
        serviceId: params.serviceId,
        date: params.date,
        userId: userId,
        barberShopId: params.barberShopId,
      },
    });

    console.log("Agendamento criado com sucesso:", booking);

    revalidatePath("/barbershops/[id]");
    revalidatePath("/bookings");
    revalidatePath("/barber_app/client");

    return { success: true, booking };
  } catch (error) {
    console.error("Erro ao criar agendamento:", error);
    return { success: false, error: `Erro ao criar agendamento: ${error}` };
  }
};
