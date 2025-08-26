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

    // Por enquanto, retornar uma URL mock
    // Em produção, você pode integrar com Firebase, AWS S3, etc.
    const mockUrl = `https://via.placeholder.com/400x300/cccccc/666666?text=${encodeURIComponent(file.name)}`;

    return NextResponse.json({ url: mockUrl }, { status: 200 });
  } catch (error) {
    console.error("Erro no upload:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 },
    );
  }
}
