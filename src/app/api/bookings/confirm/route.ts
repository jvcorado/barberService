import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/prisma";

export async function PATCH(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const { bookingId } = await request.json();

    if (!bookingId) {
      return NextResponse.json(
        { error: "ID do agendamento é obrigatório" },
        { status: 400 },
      );
    }

    // Buscar o agendamento
    const booking = await db.booking.findUnique({
      where: { id: bookingId },
      include: { user: true },
    });

    if (!booking) {
      return NextResponse.json(
        { error: "Agendamento não encontrado" },
        { status: 404 },
      );
    }

    // Verificar se o agendamento pertence ao usuário
    if (booking.userId !== session.user.id) {
      return NextResponse.json(
        { error: "Você não tem permissão para confirmar este agendamento" },
        { status: 403 },
      );
    }

    // Verificar se o agendamento pode ser confirmado
    if (booking.status === "CANCELLED") {
      return NextResponse.json(
        { error: "Não é possível confirmar um agendamento cancelado" },
        { status: 400 },
      );
    }

    if (booking.status === "COMPLETED") {
      return NextResponse.json(
        { error: "Este agendamento já foi concluído" },
        { status: 400 },
      );
    }

    if (booking.status === "CONFIRMED") {
      return NextResponse.json(
        { error: "Este agendamento já foi confirmado" },
        { status: 400 },
      );
    }

    // Atualizar o status do agendamento
    const updatedBooking = await db.booking.update({
      where: { id: bookingId },
      data: { status: "CONFIRMED" },
      include: { service: true },
    });

    return NextResponse.json({
      success: true,
      booking: updatedBooking,
      message: "Agendamento confirmado com sucesso!",
    });
  } catch (error) {
    console.error("Erro ao confirmar agendamento:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 },
    );
  }
}
