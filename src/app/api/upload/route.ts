import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("image") as File;

    if (!file) {
      return NextResponse.json(
        { error: "Arquivo não enviado" },
        { status: 400 },
      );
    }

    // Gerar um ID único para o arquivo
    const fileId = Math.random().toString(36).substring(2, 15);
    const fileExtension = file.name.split(".").pop() || "jpg";

    // Criar uma URL mock mais robusta
    // Em produção, você pode integrar com Firebase, AWS S3, etc.
    const mockUrl = `/api/placeholder/${fileId}.${fileExtension}`;

    return NextResponse.json({ url: mockUrl }, { status: 200 });
  } catch (error) {
    console.error("Erro no upload:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 },
    );
  }
}
