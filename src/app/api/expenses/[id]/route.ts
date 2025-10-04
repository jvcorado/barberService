import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/prisma";

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = params;

    // Buscar a despesa e verificar se pertence ao usuário
    const expense = await db.expense.findUnique({
      where: { id },
      include: {
        barberShop: true,
      },
    });

    if (!expense) {
      return NextResponse.json(
        { error: "Despesa não encontrada" },
        { status: 404 },
      );
    }

    if (expense.barberShop.ownerId !== session.user.id) {
      return NextResponse.json(
        { error: "Você não tem permissão para deletar esta despesa" },
        { status: 403 },
      );
    }

    await db.expense.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Despesa deletada com sucesso" });
  } catch (error) {
    console.error("Erro ao deletar despesa:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 },
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = params;
    const { description, amount, category, date } = await request.json();

    // Buscar a despesa e verificar se pertence ao usuário
    const expense = await db.expense.findUnique({
      where: { id },
      include: {
        barberShop: true,
      },
    });

    if (!expense) {
      return NextResponse.json(
        { error: "Despesa não encontrada" },
        { status: 404 },
      );
    }

    if (expense.barberShop.ownerId !== session.user.id) {
      return NextResponse.json(
        { error: "Você não tem permissão para editar esta despesa" },
        { status: 403 },
      );
    }

    const updatedExpense = await db.expense.update({
      where: { id },
      data: {
        description,
        amount: Number(amount),
        category,
        date: new Date(date),
      },
    });

    return NextResponse.json(updatedExpense);
  } catch (error) {
    console.error("Erro ao atualizar despesa:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 },
    );
  }
}
