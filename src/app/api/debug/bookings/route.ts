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

    // Buscar todas as barbearias
    const barbershops = await db.barberShop.findMany({
      select: {
        id: true,
        name: true,
        ownerId: true,
      },
    });

    // Buscar todos os agendamentos
    const allBookings = await db.booking.findMany({
      include: {
        service: {
          select: {
            id: true,
            name: true,
            duration: true,
          },
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        BarberShop: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: {
        date: "desc",
      },
      take: 20, // Últimos 20 agendamentos
    });

    // Buscar serviços
    const services = await db.barbershopService.findMany({
      select: {
        id: true,
        name: true,
        duration: true,
        barberShopId: true,
      },
    });

    return NextResponse.json({
      debug: {
        session: {
          userId: session.user.id,
          email: session.user.email,
        },
        barbershops,
        totalBookings: allBookings.length,
        recentBookings: allBookings,
        totalServices: services.length,
        services,
      },
    });
  } catch (error) {
    console.error("❌ Erro no debug:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor", details: error },
      { status: 500 },
    );
  }
}
