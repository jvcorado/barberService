"use server";

import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/prisma";

interface UpdateWorkingHoursParams {
  barbershopId: string;
  workingDays: number[];
  openingTime: string;
  closingTime: string;
  appointmentInterval: number;
}

export const updateWorkingHours = async (params: UpdateWorkingHoursParams) => {
  const session = await getServerSession(authOptions);

  if (!session || !session.user || !session.user.admin) {
    throw new Error("Usuário não autorizado");
  }

  // Verificar se a barbearia pertence ao usuário
  const barbershop = await db.barberShop.findFirst({
    where: {
      id: params.barbershopId,
      ownerId: session.user.id,
    },
  });

  if (!barbershop) {
    throw new Error("Barbearia não encontrada ou não pertence a este usuário");
  }

  // Validar horários
  const openingTime = new Date(`2000-01-01T${params.openingTime}:00`);
  const closingTime = new Date(`2000-01-01T${params.closingTime}:00`);

  if (openingTime >= closingTime) {
    throw new Error(
      "Horário de abertura deve ser anterior ao horário de fechamento",
    );
  }

  // Atualizar os horários
  await db.barberShop.update({
    where: {
      id: params.barbershopId,
    },
    data: {
      workingDays: params.workingDays,
      openingTime: params.openingTime,
      closingTime: params.closingTime,
      appointmentInterval: params.appointmentInterval,
    },
  });

  // Revalidar páginas relacionadas
  revalidatePath("/barber_app/schedule");
  revalidatePath("/barber_app/services");
  revalidatePath("/barber_app");
};
