"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Download, Check, Smartphone } from "lucide-react";

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: "accepted" | "dismissed";
    platform: string;
  }>;
  prompt(): Promise<void>;
}

export default function PWATest() {
  const [installPrompt, setInstallPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [canInstall, setCanInstall] = useState(false);

  useEffect(() => {
    // Verifica se já está instalado
    if (window.matchMedia("(display-mode: standalone)").matches) {
      setIsInstalled(true);
    }

    // Escuta o evento beforeinstallprompt
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      const prompt = e as BeforeInstallPromptEvent;
      setInstallPrompt(prompt);
      setCanInstall(true);
    };

    // Escuta o evento appinstalled
    const handleAppInstalled = () => {
      setIsInstalled(true);
      setCanInstall(false);
      setInstallPrompt(null);
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
    if (!installPrompt) return;

    try {
      await installPrompt.prompt();
      const { outcome } = await installPrompt.userChoice;

      if (outcome === "accepted") {
        console.log("PWA instalado com sucesso!");
      } else {
        console.log("Instalação cancelada pelo usuário");
      }

      setInstallPrompt(null);
      setCanInstall(false);
    } catch (error) {
      console.error("Erro ao instalar PWA:", error);
    }
  };

  if (isInstalled) {
    return (
      <div className="flex items-center gap-2 p-3 bg-green-100 border border-green-300 rounded-lg">
        <Check className="h-5 w-5 text-green-600" />
        <span className="text-green-800 font-medium">App instalado!</span>
      </div>
    );
  }

  if (!canInstall) {
    return (
      <div className="flex items-center gap-2 p-3 bg-blue-100 border border-blue-300 rounded-lg">
        <Smartphone className="h-5 w-5 text-blue-600" />
        <span className="text-blue-800">Instale como PWA</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 p-3 bg-amber-100 border border-amber-300 rounded-lg">
      <Button onClick={handleInstall} className="flex items-center gap-2">
        <Download className="h-4 w-4" />
        Instalar App
      </Button>
      <span className="text-amber-800 text-sm">Disponível para instalação</span>
    </div>
  );
}
