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

    const barbershop = await db.barberShop.findFirst({
      where: {
        ownerId: session.user.id,
      },
      include: {
        services: true,
      },
    });

    if (!barbershop) {
      return NextResponse.json(
        { error: "Barbearia não encontrada" },
        { status: 404 },
      );
    }

    // Buscar agendamentos
    const bookings = await db.booking.findMany({
      where: {
        barberShopId: barbershop.id,
        date: {
          gte: new Date(new Date().setHours(0, 0, 0, 0)),
        },
      },
      orderBy: {
        date: "asc",
      },
      take: 10,
      include: {
        service: true,
        user: true,
      },
    });

    return NextResponse.json({
      barbershop,
      bookings,
    });
  } catch (error) {
    console.error("Erro ao buscar barbearia:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 },
    );
  }
}
