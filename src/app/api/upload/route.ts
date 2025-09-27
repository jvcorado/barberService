import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { existsSync } from "fs";

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

    // Validar tipo de arquivo
    if (!file.type.startsWith("image/")) {
      return NextResponse.json(
        { error: "Apenas arquivos de imagem são permitidos" },
        { status: 400 },
      );
    }

    // Validar tamanho do arquivo (máximo 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { error: "Arquivo muito grande. Máximo 5MB" },
        { status: 400 },
      );
    }

    // Criar diretório de uploads se não existir
    const uploadsDir = join(process.cwd(), "public", "uploads");
    if (!existsSync(uploadsDir)) {
      await mkdir(uploadsDir, { recursive: true });
    }

    // Gerar nome único para o arquivo
    const fileId = Math.random().toString(36).substring(2, 15);
    const fileExtension = file.name.split(".").pop() || "jpg";
    const fileName = `${fileId}.${fileExtension}`;
    const filePath = join(uploadsDir, fileName);

    // Converter File para Buffer e salvar
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await writeFile(filePath, buffer);

    // Retornar URL pública da imagem
    const imageUrl = `/uploads/${fileName}`;

    return NextResponse.json({ url: imageUrl }, { status: 200 });
  } catch (error) {
    console.error("Erro no upload:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 },
    );
  }
}
