import { NextResponse } from "next/server";

export async function GET() {
  const manifest = {
    name: "App do Barbeiro",
    short_name: "BarberApp",
    description:
      "Aplicativo mobile para gerenciamento da barbearia com funcionalidades offline",
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
    shortcuts: [
      {
        name: "Agenda",
        short_name: "Agenda",
        description: "Ver agenda de agendamentos",
        url: "/barber_app",
        icons: [
          {
            src: "/logo.png",
            sizes: "96x96",
          },
        ],
      },
      {
        name: "Serviços",
        short_name: "Serviços",
        description: "Gerenciar serviços",
        url: "/barber_app/services",
        icons: [
          {
            src: "/logo.png",
            sizes: "96x96",
          },
        ],
      },
      {
        name: "Faturamento",
        short_name: "Faturas",
        description: "Ver faturamento",
        url: "/barber_app/invoices",
        icons: [
          {
            src: "/logo.png",
            sizes: "96x96",
          },
        ],
      },
      {
        name: "Clientes",
        short_name: "Clientes",
        description: "Gerenciar clientes",
        url: "/barber_app/clients",
        icons: [
          {
            src: "/logo.png",
            sizes: "96x96",
          },
        ],
      },
    ],
    categories: ["business", "productivity", "lifestyle"],
    lang: "pt-BR",
    prefer_related_applications: false,
    edge_side_panel: {
      preferred_width: 400,
    },
  };

  return NextResponse.json(manifest, {
    headers: {
      "Content-Type": "application/manifest+json",
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
