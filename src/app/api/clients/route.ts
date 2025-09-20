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

    // Buscar usuários do prisma – podem ser clientes
    const users = await db.user.findMany({
      select: {
        id: true,
        name: true,
        image: true,
        email: true,
      },
      orderBy: { name: "asc" },
    });

    const clients = users.map((u) => ({
      id: u.id,
      name: u.name || "Usuário sem nome",
      avatarUrl: u.image,
      email: u.email,
      role: "receiver", // placeholder – ajustar depois
      code: u.id.slice(0, 8).toUpperCase(),
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
