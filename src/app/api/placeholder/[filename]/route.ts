import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(
  request: NextRequest,
  { params }: { params: { filename: string } },
) {
  try {
    const { filename } = params;

    // Criar uma imagem SVG simples como placeholder
    const svg = `
      <svg width="400" height="300" xmlns="http://www.w3.org/2000/svg">
        <rect width="400" height="300" fill="#f3f4f6"/>
        <rect x="20" y="20" width="360" height="260" fill="#e5e7eb" rx="8"/>
        <text x="200" y="150" font-family="Arial, sans-serif" font-size="16" fill="#6b7280" text-anchor="middle">
          ${filename}
        </text>
        <text x="200" y="180" font-family="Arial, sans-serif" font-size="14" fill="#9ca3af" text-anchor="middle">
          Placeholder Image
        </text>
      </svg>
    `;

    return new NextResponse(svg, {
      headers: {
        "Content-Type": "image/svg+xml",
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch (error) {
    console.error("Erro ao gerar placeholder:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 },
    );
  }
}
