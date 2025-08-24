import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const barbershopId = searchParams.get("barbershopId");

    if (!barbershopId) {
      return NextResponse.json(
        { error: "ID da barbearia é obrigatório" },
        { status: 400 },
      );
    }

    const bookings = await db.booking.findMany({
      where: {
        userId: session.user.id,
        service: {
          barberShopId: barbershopId,
        },
        date: {
          gte: new Date(),
        },
      },
      include: {
        service: true,
      },
      orderBy: {
        date: "asc",
      },
    });

    return NextResponse.json({
      bookings,
    });
  } catch (error) {
    console.error("Erro ao buscar agendamentos:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 },
    );
  }
}
