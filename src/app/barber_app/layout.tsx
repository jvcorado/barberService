"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import BarberAppLayout from "./components/barber-app-layout";
import BottomNav from "./components/bottom-nav";

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
    <BarberAppLayout barbershop={barbershop}>
      <div className="flex-1 flex flex-col overflow-hidden mb-32">
        {children}
      </div>
      <div className="fixed bottom-0 left-0 right-0 z-10">
        <BottomNav />
      </div>
    </BarberAppLayout>
  );
}
