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
        { error: "Você não tem permissão para cancelar este agendamento" },
        { status: 403 },
      );
    }

    // Verificar se o agendamento já foi cancelado
    if (booking.status === "CANCELLED") {
      return NextResponse.json(
        { error: "Este agendamento já foi cancelado" },
        { status: 400 },
      );
    }

    // Verificar se o agendamento já foi concluído
    if (booking.status === "COMPLETED") {
      return NextResponse.json(
        { error: "Não é possível cancelar um agendamento já concluído" },
        { status: 400 },
      );
    }

    // Calcular se o cancelamento é com menos de 24 horas
    const now = new Date();
    const bookingDate = new Date(booking.date);
    const timeDifference = bookingDate.getTime() - now.getTime();
    const hoursDifference = timeDifference / (1000 * 60 * 60);

    const isLessThan24Hours = hoursDifference < 24;

    // Atualizar o status do agendamento
    const updatedBooking = await db.booking.update({
      where: { id: bookingId },
      data: { status: "CANCELLED" },
      include: { service: true },
    });

    return NextResponse.json({
      success: true,
      booking: updatedBooking,
      isLessThan24Hours,
      message: isLessThan24Hours
        ? "Agendamento cancelado com menos de 24 horas de antecedência. Isso pode afetar sua credibilidade."
        : "Agendamento cancelado com sucesso.",
    });
  } catch (error) {
    console.error("Erro ao cancelar agendamento:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 },
    );
  }
}
