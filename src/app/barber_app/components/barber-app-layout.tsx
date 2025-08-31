"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { PWAClientInstallBanner } from "@/src/components/pwa-client-install-banner";
import { OfflineIndicator } from "@/components/offline-indicator";
import { BackgroundSync } from "@/components/background-sync";
import { useBarbershopColors } from "@/hooks/use-barbershop-colors";

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

  // Loading state
  if (status === "loading") {
    return (
      <div className="min-h-screen flex flex-col">
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div
              className="animate-spin rounded-full h-8 w-8 border-b-2 mx-auto mb-4"
              style={{ borderColor: colors.primaryColor }}
            ></div>
            <p style={{ color: colors.textColor }}>Carregando...</p>
          </div>
        </div>
      </div>
    );
  }

  // No session state
  if (status === "unauthenticated") {
    return (
      <div className="min-h-screen flex flex-col">
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="mb-4" style={{ color: colors.textColor }}>
              Você precisa estar logado para acessar o app
            </p>
            <Button onClick={() => router.push("/api/auth/signin")}>
              Entrar
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-white text-black">
      {/* PWA Components */}
      <OfflineIndicator />
      <PWAClientInstallBanner />
      <BackgroundSync />

      {/* Main Content */}
      <main className="flex-1 flex flex-col">{children}</main>
    </div>
  );
}
