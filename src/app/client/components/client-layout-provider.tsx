"use client";

import { useEffect } from "react";
import { PWAClientInstallBanner } from "@/src/components/pwa-client-install-banner";
import { OfflineIndicator } from "@/components/offline-indicator";
import { BackgroundSync } from "@/components/background-sync";

// Componente para registrar o service worker
function ServiceWorkerRegistration() {
  useEffect(() => {
    if (typeof window !== "undefined" && "serviceWorker" in navigator) {
      // Registrar service worker
      navigator.serviceWorker
        .register("/sw-client.js", {
          scope: "/client",
        })
        .then((registration) => {
          console.log("Service Worker registrado com sucesso:", registration);

          // Verificar atualizações
          registration.addEventListener("updatefound", () => {
            const newWorker = registration.installing;
            if (newWorker) {
              newWorker.addEventListener("statechange", () => {
                if (
                  newWorker.state === "installed" &&
                  navigator.serviceWorker.controller
                ) {
                  // Nova versão disponível
                  console.log("Nova versão do app disponível");
                }
              });
            }
          });
        })
        .catch((error) => {
          console.error("Erro ao registrar Service Worker:", error);
        });

      // Solicitar permissão para notificações
      if ("Notification" in window && Notification.permission === "default") {
        Notification.requestPermission();
      }
    }
  }, []);

  return null;
}

export function ClientLayoutProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {/* PWA Components */}
      <ServiceWorkerRegistration />
      <OfflineIndicator />
      <PWAClientInstallBanner />
      <BackgroundSync />

      {children}
    </>
  );
}
