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

    // Buscar a barbearia do usuário
    const barbershop = await db.barberShop.findFirst({
      where: {
        ownerId: session.user.id,
      },
      select: {
        id: true,
        name: true,
        primaryColor: true,
        secondaryColor: true,
        accentColor: true,
        backgroundColor: true,
        textColor: true,
      },
    });

    if (!barbershop) {
      return NextResponse.json(
        { error: "Barbearia não encontrada" },
        { status: 404 },
      );
    }

    return NextResponse.json({
      barbershop,
    });
  } catch (error) {
    console.error("Erro ao buscar cores:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 },
    );
  }
}
