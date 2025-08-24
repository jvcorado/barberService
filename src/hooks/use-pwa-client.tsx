"use client";

import { useState, useEffect } from "react";

interface PWAStatus {
  isInstalled: boolean;
  isStandalone: boolean;
  canInstall: boolean;
  isOnline: boolean;
  hasServiceWorker: boolean;
  hasNotifications: boolean;
}

export function usePWAClient() {
  const [status, setStatus] = useState<PWAStatus>({
    isInstalled: false,
    isStandalone: false,
    canInstall: false,
    isOnline: navigator.onLine,
    hasServiceWorker: false,
    hasNotifications: false,
  });

  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  useEffect(() => {
    // Verificar se está em modo standalone
    const isStandalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      (window.navigator as any).standalone === true;

    // Verificar se tem service worker
    const hasServiceWorker = "serviceWorker" in navigator;

    // Verificar permissões de notificação
    const hasNotifications =
      "Notification" in window && Notification.permission === "granted";

    setStatus((prev) => ({
      ...prev,
      isStandalone,
      hasServiceWorker,
      hasNotifications,
    }));

    // Listener para eventos de instalação
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setStatus((prev) => ({ ...prev, canInstall: true }));
    };

    // Listener para eventos de instalação
    const handleAppInstalled = () => {
      setStatus((prev) => ({
        ...prev,
        isInstalled: true,
        canInstall: false,
      }));
      setDeferredPrompt(null);
    };

    // Listener para status online/offline
    const handleOnline = () =>
      setStatus((prev) => ({ ...prev, isOnline: true }));
    const handleOffline = () =>
      setStatus((prev) => ({ ...prev, isOnline: false }));

    // Adicionar listeners
    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("appinstalled", handleAppInstalled);
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    // Verificar se já está instalado
    if (isStandalone) {
      setStatus((prev) => ({ ...prev, isInstalled: true }));
    }

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt,
      );
      window.removeEventListener("appinstalled", handleAppInstalled);
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  // Função para instalar o app
  const installApp = async () => {
    if (!deferredPrompt) {
      console.log("Não é possível instalar o app");
      return false;
    }

    try {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;

      if (outcome === "accepted") {
        setStatus((prev) => ({
          ...prev,
          isInstalled: true,
          canInstall: false,
        }));
        setDeferredPrompt(null);
        return true;
      }

      return false;
    } catch (error) {
      console.error("Erro ao instalar app:", error);
      return false;
    }
  };

  // Função para solicitar permissão de notificação
  const requestNotificationPermission = async () => {
    if (!("Notification" in window)) {
      return false;
    }

    try {
      const permission = await Notification.requestPermission();
      const hasNotifications = permission === "granted";

      setStatus((prev) => ({ ...prev, hasNotifications }));
      return hasNotifications;
    } catch (error) {
      console.error("Erro ao solicitar permissão de notificação:", error);
      return false;
    }
  };

  // Função para enviar notificação
  const sendNotification = (title: string, options?: NotificationOptions) => {
    if (!status.hasNotifications) {
      console.log("Notificações não permitidas");
      return false;
    }

    try {
      new Notification(title, {
        icon: "/logo.png",
        badge: "/logo.png",
        tag: "barber-app-client",
        ...options,
      });
      return true;
    } catch (error) {
      console.error("Erro ao enviar notificação:", error);
      return false;
    }
  };

  // Função para sincronizar dados em background
  const syncInBackground = async (tag: string = "background-sync") => {
    if (
      !("serviceWorker" in navigator) ||
      !("sync" in navigator.serviceWorker)
    ) {
      return false;
    }

    try {
      const registration = await navigator.serviceWorker.ready;
      // Type assertion para acessar a propriedade sync
      const syncRegistration = registration as any;
      if (
        syncRegistration.sync &&
        typeof syncRegistration.sync.register === "function"
      ) {
        await syncRegistration.sync.register(tag);
        return true;
      }
      return false;
    } catch (error) {
      console.error("Erro ao registrar sincronização:", error);
      return false;
    }
  };

  return {
    ...status,
    installApp,
    requestNotificationPermission,
    sendNotification,
    syncInBackground,
  };
}
