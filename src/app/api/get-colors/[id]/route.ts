import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const { id } = params;

    // Buscar a barbearia pelo ID
    const barbershop = await db.barberShop.findUnique({
      where: {
        id: id,
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
