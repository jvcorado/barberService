import { useState, useEffect } from "react";
import { usePWAStatus } from "./use-pwa-status";

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export function usePWA() {
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const {
    isInstallable,
    isInstalled,
    isOnline,
    updateInstallStatus,
    markAsInstalled,
  } = usePWAStatus();

  useEffect(() => {
    // Verificar se está no browser
    if (typeof window === "undefined") return;

    // Intercepta evento de instalação
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      updateInstallStatus(true);
    };

    // Verifica se o service worker está registrado
    const registerServiceWorker = async () => {
      if ("serviceWorker" in navigator) {
        try {
          await navigator.serviceWorker.register("/sw.js");
          console.log("Service Worker registrado com sucesso");
        } catch (error) {
          console.error("Erro ao registrar Service Worker:", error);
        }
      }
    };

    // Event listeners
    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    // Inicialização
    registerServiceWorker();

    // Cleanup
    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt,
      );
    };
  }, []);

  // Função para instalar o app
  const installApp = async () => {
    if (!deferredPrompt) return false;

    try {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;

      if (outcome === "accepted") {
        markAsInstalled();
        setDeferredPrompt(null);
        return true;
      }
    } catch (error) {
      console.error("Erro ao instalar app:", error);
    }

    return false;
  };

  // Função para solicitar permissão de notificação
  const requestNotificationPermission = async () => {
    if (typeof window === "undefined" || !("Notification" in window)) {
      console.log("Este navegador não suporta notificações");
      return false;
    }

    if (Notification.permission === "granted") {
      return true;
    }

    if (Notification.permission === "denied") {
      console.log("Permissão de notificação negada");
      return false;
    }

    try {
      const permission = await Notification.requestPermission();
      return permission === "granted";
    } catch (error) {
      console.error("Erro ao solicitar permissão:", error);
      return false;
    }
  };

  // Função para enviar notificação
  const sendNotification = (title: string, options?: NotificationOptions) => {
    if (Notification.permission === "granted") {
      new Notification(title, options);
    }
  };

  return {
    isInstallable,
    isInstalled,
    isOnline,
    installApp,
    requestNotificationPermission,
    sendNotification,
  };
}
