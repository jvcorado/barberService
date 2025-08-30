import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const error = searchParams.get("error");

    // Log do erro para debug
    console.log("Auth error:", error);

    // Retornar uma resposta de erro estruturada
    return NextResponse.json(
      {
        error: error || "Erro de autenticação desconhecido",
        message: "Ocorreu um erro durante a autenticação",
        timestamp: new Date().toISOString(),
      },
      { status: 400 },
    );
  } catch (error) {
    console.error("Erro ao processar erro de autenticação:", error);
    return NextResponse.json(
      {
        error: "Erro interno do servidor",
        message: "Não foi possível processar o erro de autenticação",
      },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  return NextResponse.json({ error: "Método não permitido" }, { status: 405 });
}
