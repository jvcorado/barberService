import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { existsSync } from "fs";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}

export async function POST(request: NextRequest) {
  try {
    console.log("Iniciando upload de imagem...");

    const formData = await request.formData();
    const file = formData.get("image") as File;

    console.log("Arquivo recebido:", {
      name: file?.name,
      size: file?.size,
      type: file?.type,
    });

    if (!file) {
      console.log("Erro: Arquivo não enviado");
      return NextResponse.json(
        { error: "Arquivo não enviado" },
        { status: 400 },
      );
    }

    // Validar tipo de arquivo
    const allowedTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/gif",
      "image/webp",
    ];
    if (!allowedTypes.includes(file.type)) {
      console.log("Erro: Tipo de arquivo inválido:", file.type);
      return NextResponse.json(
        {
          error: `Tipo de arquivo não suportado. Tipos permitidos: ${allowedTypes.join(", ")}`,
        },
        { status: 400 },
      );
    }

    // Validar tamanho do arquivo (máximo 5MB)
    if (file.size > 5 * 1024 * 1024) {
      console.log("Erro: Arquivo muito grande:", file.size);
      return NextResponse.json(
        { error: "Arquivo muito grande. Máximo 5MB" },
        { status: 400 },
      );
    }

    // Criar diretório de uploads se não existir
    const uploadsDir = join(process.cwd(), "public", "uploads");
    console.log("Diretório de uploads:", uploadsDir);

    if (!existsSync(uploadsDir)) {
      console.log("Criando diretório de uploads...");
      await mkdir(uploadsDir, { recursive: true });
    }

    // Gerar nome único para o arquivo
    const fileId = Math.random().toString(36).substring(2, 15);
    const fileExtension = file.name.split(".").pop() || "jpg";
    const fileName = `${fileId}.${fileExtension}`;
    const filePath = join(uploadsDir, fileName);

    console.log("Salvando arquivo:", {
      fileName,
      filePath,
    });

    // Converter File para Buffer e salvar
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await writeFile(filePath, buffer);

    // Verificar se o arquivo foi salvo
    if (!existsSync(filePath)) {
      console.log("Erro: Arquivo não foi salvo corretamente");
      return NextResponse.json(
        { error: "Erro ao salvar arquivo" },
        { status: 500 },
      );
    }

    // Retornar URL pública da imagem
    const imageUrl = `/uploads/${fileName}`;
    console.log("Upload concluído com sucesso:", imageUrl);

    return NextResponse.json(
      { url: imageUrl },
      {
        status: 200,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "POST",
          "Access-Control-Allow-Headers": "Content-Type",
        },
      },
    );
  } catch (error) {
    console.error("Erro detalhado no upload:", {
      message: error instanceof Error ? error.message : "Erro desconhecido",
      stack: error instanceof Error ? error.stack : undefined,
      error,
    });
    return NextResponse.json(
      {
        error: "Erro interno do servidor",
        details: error instanceof Error ? error.message : "Erro desconhecido",
      },
      { status: 500 },
    );
  }
}
