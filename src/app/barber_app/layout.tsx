"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import BarberAppLayout from "./components/barber-app-layout";
import BottomNav from "./components/bottom-nav";
import { PWAInstallBanner } from "@/components/pwa-install-banner";
import { usePWA } from "@/hooks/use-pwa";
import Head from "next/head";
import OfflineIndicator from "./components/offline-indicator";

interface BarberShop {
  id: string;
  name: string;
  // outras propriedades se necessário
}

export default function BarberAppRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [barbershop, setBarbershop] = useState<BarberShop | null>(null);
  const { isInstallable, installApp } = usePWA();

  useEffect(() => {
    if (status === "loading") return;
    if (status === "unauthenticated") {
      router.push("/");
      return;
    }
    if (session?.user) {
      fetchBarbershopData();
    }
  }, [status, session]);

  // Registra service worker para PWA
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/sw.js", { scope: "/barber_app" })
        .then((registration) => {
          console.log("Service Worker registrado:", registration);
        })
        .catch((error) => {
          console.log("Erro ao registrar Service Worker:", error);
        });
    }
  }, []);

  const fetchBarbershopData = async () => {
    const response = await fetch("/api/barbershops/me");
    if (response.ok) {
      const data = await response.json();
      setBarbershop(data.barbershop);
    }
  };

  // mostrar loading simples enquanto busca barbershop
  if (status === "loading" || !barbershop) {
    return <div className="min-h-screen" />;
  }

  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#000000" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="BarberApp" />
        <link rel="manifest" href="/barber_app/manifest.json" />
        <link rel="apple-touch-icon" href="/logo.png" />
      </Head>
      <BarberAppLayout barbershop={barbershop}>
        <div className="flex-1 flex flex-col overflow-hidden mb-28">
          {children}
        </div>
        <div className="fixed bottom-0 left-0 right-0 z-10">
          <BottomNav />
        </div>
        {/* PWA Install Banner */}
        {isInstallable && <PWAInstallBanner />}
        {/* Offline Indicator */}
        <OfflineIndicator />
      </BarberAppLayout>
    </>
  );
}
