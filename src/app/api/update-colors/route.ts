import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    console.log("🔄 API update-colors chamada");

    // Verificar autenticação
    const session = await getServerSession(authOptions);
    console.log("🔐 Sessão:", session ? "Autenticado" : "Não autenticado");

    if (!session?.user) {
      console.log("❌ Usuário não autenticado");
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    console.log("✅ Usuário autenticado:", session.user.email);

    const body = await request.json();
    console.log("📦 Body recebido:", body);

    const {
      primaryColor,
      secondaryColor,
      accentColor,
      backgroundColor,
      textColor,
    } = body;

    // Validar se as cores são válidas
    const colorRegex = /^#[0-9A-F]{6}$/i;
    if (
      !colorRegex.test(primaryColor) ||
      !colorRegex.test(secondaryColor) ||
      !colorRegex.test(accentColor) ||
      !colorRegex.test(backgroundColor) ||
      !colorRegex.test(textColor)
    ) {
      console.log("❌ Cores inválidas");
      return NextResponse.json({ error: "Cores inválidas" }, { status: 400 });
    }

    console.log("✅ Cores validadas");

    // Buscar a barbearia do usuário
    console.log("🔍 Buscando barbearia para o usuário:", session.user.id);
    const barbershop = await prisma.barberShop.findFirst({
      where: {
        ownerId: session.user.id,
      },
    });

    if (!barbershop) {
      console.log("❌ Barbearia não encontrada");
      return NextResponse.json(
        { error: "Barbearia não encontrada" },
        { status: 404 },
      );
    }

    console.log("✅ Barbearia encontrada:", barbershop.name);

    // Atualizar as cores
    console.log("🔄 Atualizando cores da barbearia...");
    const updatedBarbershop = await prisma.barberShop.update({
      where: {
        id: barbershop.id,
      },
      data: {
        primaryColor,
        secondaryColor,
        accentColor,
        backgroundColor,
        textColor,
      },
    });

    console.log("✅ Cores atualizadas com sucesso");
    console.log("🏪 Barbearia atualizada:", updatedBarbershop.name);

    return NextResponse.json({
      message: "Cores atualizadas com sucesso",
      barbershop: updatedBarbershop,
    });
  } catch (error) {
    console.error("❌ Erro ao atualizar cores:", error);
    console.error("📋 Stack trace:", error.stack);
    return NextResponse.json(
      { error: "Erro interno do servidor", details: error.message },
      { status: 500 },
    );
  } finally {
    await prisma.$disconnect();
  }
}
