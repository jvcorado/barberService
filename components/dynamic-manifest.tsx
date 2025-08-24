"use client";

import { useEffect } from "react";

interface DynamicManifestProps {
  barbershopId?: string;
  barbershopName?: string;
}

export function DynamicManifest({
  barbershopId,
  barbershopName,
}: DynamicManifestProps) {
  useEffect(() => {
    if (typeof window === "undefined" || !barbershopId) return;

    // Remove o link do manifesto estático se existir
    const staticManifest = document.querySelector(
      'link[rel="manifest"][href="/manifest.json"]',
    );
    if (staticManifest) {
      staticManifest.remove();
    }

    // Adiciona o link do manifesto dinâmico
    const dynamicManifest = document.createElement("link");
    dynamicManifest.rel = "manifest";
    dynamicManifest.href = `/api/manifest?id=${barbershopId}`;
    document.head.appendChild(dynamicManifest);

    // Atualiza o título da página se houver nome da barbearia
    if (barbershopName) {
      document.title = `${barbershopName} - Reserva Agora`;

      // Atualiza meta tags para Apple Web App
      const appleMeta = document.querySelector(
        'meta[name="apple-mobile-web-app-title"]',
      );
      if (appleMeta) {
        appleMeta.setAttribute("content", barbershopName);
      } else {
        const meta = document.createElement("meta");
        meta.name = "apple-mobile-web-app-title";
        meta.content = barbershopName;
        document.head.appendChild(meta);
      }
    }

    // Cleanup: restaura o manifesto estático quando o componente é desmontado
    return () => {
      if (dynamicManifest.parentNode) {
        dynamicManifest.remove();
      }

      // Restaura o manifesto estático
      const restoredManifest = document.createElement("link");
      restoredManifest.rel = "manifest";
      restoredManifest.href = "/manifest.json";
      document.head.appendChild(restoredManifest);

      // Restaura o título padrão
      document.title = "Reserva Agora";
    };
  }, [barbershopId, barbershopName]);

  return null;
}
