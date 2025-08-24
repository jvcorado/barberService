import { useEffect, useState } from "react";
import { usePWA } from "@/hooks/use-pwa";
import { RefreshCw, CheckCircle } from "lucide-react";

export function BackgroundSync() {
  const { isOnline } = usePWA();
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSync, setLastSync] = useState<Date | null>(null);

  useEffect(() => {
    if (isOnline && !isSyncing) {
      // Simula sincronização quando volta online
      handleSync();
    }
  }, [isOnline]);

  const handleSync = async () => {
    if (!isOnline) return;

    setIsSyncing(true);

    try {
      // Simula sincronização de dados
      await new Promise((resolve) => setTimeout(resolve, 2000));

      setLastSync(new Date());

      // Aqui você pode implementar a sincronização real
      // Por exemplo, sincronizar agendamentos offline
      console.log("Sincronização em background concluída");
    } catch (error) {
      console.error("Erro na sincronização:", error);
    } finally {
      setIsSyncing(false);
    }
  };

  if (!isOnline) return null;

  return (
    <div className="fixed top-16 right-4 z-40">
      <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-3">
        <div className="flex items-center gap-2">
          {isSyncing ? (
            <>
              <RefreshCw className="h-4 w-4 text-blue-500 animate-spin" />
              <span className="text-xs text-gray-600">Sincronizando...</span>
            </>
          ) : (
            <>
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span className="text-xs text-gray-600">
                {lastSync ? "Sincronizado" : "Online"}
              </span>
            </>
          )}
        </div>

        {lastSync && (
          <div className="text-xs text-gray-500 mt-1">
            Última sincronização: {lastSync.toLocaleTimeString()}
          </div>
        )}
      </div>
    </div>
  );
}
