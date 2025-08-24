import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const barbershopId = searchParams.get("id");

    let barbershopName = "BarberApp";
    let description = "Aplicativo mobile para gerenciamento da barbearia";

    if (barbershopId) {
      const barbershop = await db.barberShop.findUnique({
        where: { id: barbershopId },
        select: { name: true, description: true },
      });

      if (barbershop) {
        barbershopName = barbershop.name;
        description =
          barbershop.description || `Aplicativo da ${barbershop.name}`;
      }
    }

    const manifest = {
      name: barbershopName,
      short_name:
        barbershopName.length > 12
          ? barbershopName.substring(0, 12)
          : barbershopName,
      description: description,
      start_url: "/barber_app",
      display: "standalone",
      background_color: "#000000",
      theme_color: "#000000",
      orientation: "portrait-primary",
      scope: "/barber_app",
      icons: [
        {
          src: "/logo.png",
          sizes: "192x192",
          type: "image/png",
          purpose: "any maskable",
        },
        {
          src: "/logo.png",
          sizes: "512x512",
          type: "image/png",
          purpose: "any maskable",
        },
      ],
      categories: ["business", "productivity", "lifestyle"],
      lang: "pt-BR",
      prefer_related_applications: false,
    };

    return NextResponse.json(manifest, {
      headers: {
        "Content-Type": "application/manifest+json",
        "Cache-Control": "public, max-age=3600",
      },
    });
  } catch (error) {
    console.error("Erro ao gerar manifesto:", error);

    // Fallback para manifesto padrão
    const fallbackManifest = {
      name: "BarberApp",
      short_name: "BarberApp",
      description: "Aplicativo mobile para gerenciamento da barbearia",
      start_url: "/barber_app",
      display: "standalone",
      background_color: "#000000",
      theme_color: "#000000",
      orientation: "portrait-primary",
      scope: "/barber_app",
      icons: [
        {
          src: "/logo.png",
          sizes: "192x192",
          type: "image/png",
          purpose: "any maskable",
        },
        {
          src: "/logo.png",
          sizes: "512x512",
          type: "image/png",
          purpose: "any maskable",
        },
      ],
      categories: ["business", "productivity", "lifestyle"],
      lang: "pt-BR",
      prefer_related_applications: false,
    };

    return NextResponse.json(fallbackManifest, {
      headers: {
        "Content-Type": "application/manifest+json",
      },
    });
  }
}
