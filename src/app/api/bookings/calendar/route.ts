import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/prisma";
import { startOfDay, endOfDay, startOfWeek, endOfWeek } from "date-fns";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const dateParam = searchParams.get("date");
    const barbershopId = searchParams.get("barbershopId");

    console.log("🔍 Buscando agendamentos:", { dateParam, barbershopId });

    if (!barbershopId) {
      return NextResponse.json(
        { error: "ID da barbearia é obrigatório" },
        { status: 400 },
      );
    }

    let startDate: Date;
    let endDate: Date;

    if (dateParam) {
      // Converter a data para o início e fim do dia no fuso horário local
      const selectedDate = new Date(dateParam + "T00:00:00");
      startDate = startOfDay(selectedDate);
      endDate = endOfDay(selectedDate);
    } else {
      // Se não houver data, busca a semana atual
      const today = new Date();
      startDate = startOfWeek(today, { weekStartsOn: 0 }); // Domingo
      endDate = endOfWeek(today, { weekStartsOn: 0 }); // Sábado
    }

    console.log("📅 Período de busca:", {
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      startDateLocal: startDate.toLocaleDateString("pt-BR"),
      endDateLocal: endDate.toLocaleDateString("pt-BR"),
    });

    // Buscar agendamentos para a data/esemana especificada
    const bookings = await db.booking.findMany({
      where: {
        OR: [
          // Agendamentos diretamente vinculados à barbearia
          { barberShopId: barbershopId },
          // Agendamentos vinculados através do serviço
          {
            service: {
              barberShopId: barbershopId,
            },
          },
        ],
        date: {
          gte: startDate,
          lte: endDate,
        },
      },
      orderBy: {
        date: "asc",
      },
      include: {
        service: {
          select: {
            id: true,
            name: true,
            duration: true,
            price: true,
            barberShopId: true,
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
    });

    console.log("📋 Agendamentos encontrados:", bookings.length);
    console.log("📋 Detalhes dos agendamentos:", bookings);

    // Buscar serviços da barbearia para calcular duração
    const services = await db.barbershopService.findMany({
      where: {
        barberShopId: barbershopId,
      },
      select: {
        id: true,
        name: true,
        duration: true,
        price: true,
      },
    });

    console.log("🔧 Serviços encontrados:", services.length);

    return NextResponse.json({
      bookings,
      services,
      dateRange: {
        start: startDate,
        end: endDate,
      },
    });
  } catch (error) {
    console.error("❌ Erro ao buscar agendamentos:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 },
    );
  }
}
