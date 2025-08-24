import { useState } from "react";
import { Button } from "@/components/ui/button";
import { X, Download, Smartphone } from "lucide-react";
import { usePWA } from "@/hooks/use-pwa";

export function PWAInstallBanner() {
  const { isInstallable, isInstalled, installApp } = usePWA();
  const [isVisible, setIsVisible] = useState(true);

  if (!isInstallable || isInstalled || !isVisible) {
    return null;
  }

  const handleInstall = async () => {
    const success = await installApp();
    if (success) {
      setIsVisible(false);
    }
  };

  const handleDismiss = () => {
    setIsVisible(false);
  };

  return (
    <div className="fixed bottom-20 left-4 right-4 z-50 bg-white border border-gray-200 rounded-lg shadow-lg p-4 animate-in slide-in-from-bottom-4 duration-300">
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
          <Smartphone className="h-5 w-5 text-blue-600" />
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-semibold text-gray-900 mb-1">
            Instalar BarberApp
          </h3>
          <p className="text-xs text-gray-600 mb-3">
            Instale o app para acessar mais rapidamente e receber notificações
          </p>

          <div className="flex gap-2">
            <Button
              size="sm"
              onClick={handleInstall}
              className="flex-1 gap-2 bg-blue-600 hover:bg-blue-700"
            >
              <Download className="h-4 w-4" />
              Instalar
            </Button>

            <Button
              size="sm"
              variant="outline"
              onClick={handleDismiss}
              className="px-3"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
