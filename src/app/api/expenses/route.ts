import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { description, amount, category, date, barberShopId } =
      await request.json();

    if (!description || !amount || !category || !date || !barberShopId) {
      return NextResponse.json(
        { error: "Todos os campos são obrigatórios" },
        { status: 400 },
      );
    }

    // Verificar se a barbearia pertence ao usuário
    const barbershop = await db.barberShop.findFirst({
      where: {
        id: barberShopId,
        ownerId: session.user.id,
      },
    });

    if (!barbershop) {
      return NextResponse.json(
        { error: "Barbearia não encontrada" },
        { status: 404 },
      );
    }

    const expense = await db.expense.create({
      data: {
        description,
        amount: Number(amount),
        category,
        date: new Date(date),
        barberShopId,
      },
    });

    return NextResponse.json(expense, { status: 201 });
  } catch (error) {
    console.error("Erro ao criar despesa:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 },
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const barberShopId = searchParams.get("barberShopId");

    if (!barberShopId) {
      return NextResponse.json(
        { error: "barberShopId é obrigatório" },
        { status: 400 },
      );
    }

    // Verificar se a barbearia pertence ao usuário
    const barbershop = await db.barberShop.findFirst({
      where: {
        id: barberShopId,
        ownerId: session.user.id,
      },
    });

    if (!barbershop) {
      return NextResponse.json(
        { error: "Barbearia não encontrada" },
        { status: 404 },
      );
    }

    const expenses = await db.expense.findMany({
      where: {
        barberShopId,
      },
      orderBy: {
        date: "desc",
      },
    });

    return NextResponse.json(expenses);
  } catch (error) {
    console.error("Erro ao buscar despesas:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 },
    );
  }
}
