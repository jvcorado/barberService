import { useState, useEffect } from "react";

interface PWAStatus {
  isInstallable: boolean;
  isInstalled: boolean;
  isOnline: boolean;
  hasServiceWorker: boolean;
  hasNotifications: boolean;
  isStandalone: boolean;
}

export function usePWAStatus() {
  const [status, setStatus] = useState<PWAStatus>({
    isInstallable: false,
    isInstalled: false,
    isOnline: typeof navigator !== "undefined" ? navigator.onLine : true,
    hasServiceWorker:
      typeof navigator !== "undefined" && "serviceWorker" in navigator,
    hasNotifications: typeof window !== "undefined" && "Notification" in window,
    isStandalone: false,
  });

  useEffect(() => {
    // Verificar se está no browser
    if (typeof window === "undefined") return;

    // Verifica se está em modo standalone (instalado)
    const checkStandalone = () => {
      const isStandalone =
        window.matchMedia("(display-mode: standalone)").matches ||
        (window.navigator as any).standalone === true;

      setStatus((prev) => ({ ...prev, isStandalone }));
    };

    // Verifica conectividade
    const handleOnline = () =>
      setStatus((prev) => ({ ...prev, isOnline: true }));
    const handleOffline = () =>
      setStatus((prev) => ({ ...prev, isOnline: false }));

    // Verifica se o service worker está ativo
    const checkServiceWorker = async () => {
      if ("serviceWorker" in navigator) {
        try {
          const registrations =
            await navigator.serviceWorker.getRegistrations();
          const hasActiveSW = registrations.some((reg) => reg.active);
          setStatus((prev) => ({ ...prev, hasServiceWorker: hasActiveSW }));
        } catch (error) {
          console.error("Erro ao verificar service worker:", error);
        }
      }
    };

    // Event listeners
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    window.addEventListener("load", checkStandalone);

    // Verificações iniciais
    checkStandalone();
    checkServiceWorker();

    // Cleanup
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
      window.removeEventListener("load", checkStandalone);
    };
  }, []);

  // Função para atualizar status de instalação
  const updateInstallStatus = (isInstallable: boolean) => {
    setStatus((prev) => ({ ...prev, isInstallable }));
  };

  // Função para marcar como instalado
  const markAsInstalled = () => {
    setStatus((prev) => ({ ...prev, isInstalled: true, isInstallable: false }));
  };

  return {
    ...status,
    updateInstallStatus,
    markAsInstalled,
  };
}
