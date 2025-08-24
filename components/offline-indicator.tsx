import { usePWA } from "@/hooks/use-pwa";
import { Wifi, WifiOff } from "lucide-react";

export function OfflineIndicator() {
  const { isOnline } = usePWA();

  if (isOnline) {
    return null;
  }

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-yellow-500 text-white px-4 py-2 text-center text-sm font-medium animate-in slide-in-from-top-2 duration-300">
      <div className="flex items-center justify-center gap-2">
        <WifiOff className="h-4 w-4" />
        <span>
          Modo Offline - Algumas funcionalidades podem não estar disponíveis
        </span>
      </div>
    </div>
  );
}
