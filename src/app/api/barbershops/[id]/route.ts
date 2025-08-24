import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const barbershop = await db.barberShop.findUnique({
      where: { id: params.id },
      include: {
        services: {
          orderBy: { name: "asc" },
        },
      },
    });

    if (!barbershop) {
      return NextResponse.json(
        { error: "Barbearia não encontrada" },
        { status: 404 },
      );
    }

    return NextResponse.json(barbershop);
  } catch (error) {
    console.error("Erro ao buscar barbearia:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 },
    );
  }
}
