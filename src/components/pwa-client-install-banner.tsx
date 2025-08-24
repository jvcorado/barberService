"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { X, Download, Smartphone } from "lucide-react";
import { useBarbershopColors } from "@/hooks/use-barbershop-colors";

export function PWAClientInstallBanner() {
  const [showBanner, setShowBanner] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const { colors } = useBarbershopColors();

  useEffect(() => {
    // Verificar se já foi instalado
    const isInstalled = localStorage.getItem("pwa-client-installed") === "true";
    const isStandalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      (window.navigator as any).standalone === true;

    if (isInstalled || isStandalone) {
      return;
    }

    // Listener para evento de instalação
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowBanner(true);
    };

    // Listener para evento de instalação concluída
    const handleAppInstalled = () => {
      setShowBanner(false);
      localStorage.setItem("pwa-client-installed", "true");
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("appinstalled", handleAppInstalled);

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt,
      );
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) {
      return;
    }

    try {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;

      if (outcome === "accepted") {
        setShowBanner(false);
        localStorage.setItem("pwa-client-installed", "true");
      }

      setDeferredPrompt(null);
    } catch (error) {
      console.error("Erro ao instalar app:", error);
    }
  };

  const handleDismiss = () => {
    setShowBanner(false);
    localStorage.setItem("pwa-client-install-dismissed", "true");
  };

  if (!showBanner) {
    return null;
  }

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-50 border-t p-4 shadow-lg"
      style={{
        backgroundColor: colors.secondaryColor,
        borderColor: colors.primaryColor,
      }}
    >
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div
            className="flex h-10 w-10 items-center justify-center rounded-full"
            style={{ backgroundColor: colors.primaryColor }}
          >
            <Smartphone
              className="h-5 w-5"
              style={{ color: colors.secondaryColor }}
            />
          </div>

          <div className="flex-1">
            <h3
              className="font-semibold"
              style={{ color: colors.primaryColor }}
            >
              Instalar App
            </h3>
            <p className="text-sm" style={{ color: colors.textColor }}>
              Instale o app para uma experiência melhor
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            size="sm"
            onClick={handleInstall}
            style={{
              backgroundColor: colors.primaryColor,
              color: colors.secondaryColor,
            }}
          >
            <Download className="h-4 w-4 mr-2" />
            Instalar
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={handleDismiss}
            style={{ color: colors.textColor }}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
