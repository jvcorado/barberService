import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

const linkAccountSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "Senha deve ter pelo menos 6 caracteres"),
});

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const body = await request.json();
    const { email, password } = linkAccountSchema.parse(body);

    // Verificar se o usuário atual já tem uma conta Google
    const currentUser = await db.user.findUnique({
      where: { id: session.user.id },
      include: { accounts: true },
    });

    if (!currentUser) {
      return NextResponse.json(
        { error: "Usuário não encontrado" },
        { status: 404 },
      );
    }

    // Verificar se já tem conta Google
    const hasGoogleAccount = currentUser.accounts.some(
      (account) => account.provider === "google",
    );

    if (!hasGoogleAccount) {
      return NextResponse.json(
        { error: "Usuário atual não tem conta Google" },
        { status: 400 },
      );
    }

    // Verificar se o email já está sendo usado por outro usuário
    const existingUser = await db.user.findUnique({
      where: { email },
    });

    if (existingUser && existingUser.id !== session.user.id) {
      return NextResponse.json(
        { error: "Email já está sendo usado por outro usuário" },
        { status: 400 },
      );
    }

    // Criptografar a senha
    const hashedPassword = await bcrypt.hash(password, 12);

    // Atualizar o usuário atual com email e senha
    const updatedUser = await db.user.update({
      where: { id: session.user.id },
      data: {
        email,
        password: hashedPassword,
        isEmailVerified: true, // Se já tem conta Google, consideramos verificado
      },
    });

    // Remover a senha do retorno
    const { password: _, ...userWithoutPassword } = updatedUser;

    return NextResponse.json(
      {
        message: "Contas vinculadas com sucesso",
        user: userWithoutPassword,
      },
      { status: 200 },
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Dados inválidos", details: error.errors },
        { status: 400 },
      );
    }

    console.error("Erro ao vincular contas:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 },
    );
  }
}
