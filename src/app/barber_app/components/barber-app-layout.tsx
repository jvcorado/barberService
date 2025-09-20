"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { PWAClientInstallBanner } from "@/src/components/pwa-client-install-banner";
import { OfflineIndicator } from "@/components/offline-indicator";
import { BackgroundSync } from "@/components/background-sync";
import { useBarbershopColors } from "@/hooks/use-barbershop-colors";
import { Menu } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useState } from "react";
import { useDate } from "../contexts/date-context";

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

            <Button
              variant="ghost"
              size="icon"
              className="w-12 h-12 rounded-full bg-white/10 text-white hover:bg-white/20 transition-all duration-200"
            >
              <Menu className="h-6 w-6" />
            </Button>
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
