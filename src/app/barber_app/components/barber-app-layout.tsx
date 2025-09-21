"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { PWAClientInstallBanner } from "@/src/components/pwa-client-install-banner";
import { OfflineIndicator } from "@/components/offline-indicator";
import { BackgroundSync } from "@/components/background-sync";
import { useBarbershopColors } from "@/hooks/use-barbershop-colors";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useState, useEffect } from "react";
import { useDate } from "../contexts/date-context";
import BarberMenu from "./barber-menu";

interface BarberAppLayoutProps {
  children: React.ReactNode;
  barbershop: any;
}

export default function BarberAppLayout({
  children,
  barbershop,
}: BarberAppLayoutProps) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { colors } = useBarbershopColors();
  const { selectedDate, setSelectedDate } = useDate();
  const [barbershopData, setBarbershopData] = useState<any>(null);

  // Buscar dados da barberia
  useEffect(() => {
    const fetchBarbershop = async () => {
      try {
        const response = await fetch("/api/barbershops/me");
        if (response.ok) {
          const data = await response.json();
          setBarbershopData(data.barbershop);
        }
      } catch (error) {
        console.error("Erro ao buscar dados da barberia:", error);
      }
    };

    if (session?.user) {
      fetchBarbershop();
    }
  }, [session]);

  // Loading state
  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-black">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
      </div>
    );
  }

  // No session state
  if (status === "unauthenticated") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-black">
        <div className="text-center text-white">
          <h2 className="text-2xl font-bold mb-4">Acesso Negado</h2>
          <p className="text-gray-300 mb-6">
            Você precisa estar logado para acessar o app
          </p>
          <Button
            onClick={() => router.push("/api/auth/signin")}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl"
          >
            Entrar
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
      {/* Header Fixo */}
      <div className="fixed top-0 left-0 right-0 z-40 bg-gradient-to-br from-gray-900 via-black to-gray-900 border-b border-white/10">
        <div className="px-6 pt-6 pb-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-semibold text-white mb-1 capitalize">
                Olá{" "}
                <span className="text-blue-400">
                  {session?.user?.name?.split(" ")[0]}
                </span>
              </h1>
              <p className="text-gray-300 text-sm capitalize">
                {format(new Date(), "EEEE, dd 'de' MMM yyyy", { locale: ptBR })}
              </p>
            </div>

            <BarberMenu
              barbershopId={barbershopData?.id}
              barbershopName={barbershopData?.name}
            />
          </div>
        </div>
      </div>

      {/* PWA Components */}
      <OfflineIndicator />
      <PWAClientInstallBanner />
      <BackgroundSync />

      {/* Main Content com padding para o header fixo */}
      <main className="flex-1 flex flex-col pt-32">{children}</main>
    </div>
  );
}
