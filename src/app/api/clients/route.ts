import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Buscar a barberia do usuário logado
    const userBarbershop = await db.barberShop.findFirst({
      where: {
        ownerId: session.user.id,
      },
      select: {
        id: true,
      },
    });

    if (!userBarbershop) {
      return NextResponse.json({ clients: [] });
    }

    // Buscar usuários que têm agendamentos nesta barberia
    const usersWithBookings = await db.user.findMany({
      where: {
        bookings: {
          some: {
            barberShopId: userBarbershop.id,
          },
        },
      },
      include: {
        bookings: {
          where: {
            barberShopId: userBarbershop.id,
          },
          include: {
            service: {
              select: {
                name: true,
                price: true,
              },
            },
          },
          orderBy: {
            date: "desc",
          },
        },
      },
      orderBy: { name: "asc" },
    });

    const clients = usersWithBookings.map((user) => ({
      id: user.id,
      name: user.name || "Usuário sem nome",
      avatarUrl: user.image,
      email: user.email,
      phone: (user as any).phone || null,
      role: "client",
      code: user.id.slice(0, 8).toUpperCase(),
      totalBookings: user.bookings?.length || 0,
      lastBooking: user.bookings?.[0] || null,
    }));

    return NextResponse.json({ clients });
  } catch (error) {
    console.error("Erro ao buscar clientes:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 },
    );
  }
}
