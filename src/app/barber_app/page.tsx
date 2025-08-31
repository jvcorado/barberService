"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import BarberAppLayout from "./components/barber-app-layout";
import { Button } from "@/components/ui/button";
import { usePWA } from "@/hooks/use-pwa";
import { PWAToast } from "@/components/pwa-toast";
import { useBarbershopColors } from "@/hooks/use-barbershop-colors";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import ImprovedCalendar from "./components/improved-calendar";
import {
  Plus,
  Filter,
  MoreVertical,
  Bell,
  Calendar,
  Users,
  FileText,
  Zap,
  ShoppingBag,
} from "lucide-react";

interface Barbershop {
  id: string;
  name: string;
  address: string;
  imageUrl?: string | null;
  primaryColor?: string;
  secondaryColor?: string;
  backgroundColor?: string;
  textColor?: string;
  services: any[];
}

interface Barber {
  id: string;
  name: string;
  imageUrl?: string;
  workingHours: string;
}

export default function BarberAppPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const {} = usePWA();
  const { colors } = useBarbershopColors();
  const [barbershop, setBarbershop] = useState<Barbershop | null>(null);
  const [barbers, setBarbers] = useState<Barber[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate] = useState(new Date());

  // Debug: verificar dados do calendário
  useEffect(() => {
    console.log("🏪 Barbearia:", barbershop);
  }, [barbershop]);

  // Dados mockados para barbeiros (pode ser expandido para buscar do banco)
  const mockBarbers: Barber[] = [
    {
      id: "1",
      name: "Patricia Taylor",
      imageUrl: "/logo.png",
      workingHours: "10:00-19:00",
    },
    {
      id: "2",
      name: "Michael Brown",
      imageUrl: "/logo.png",
      workingHours: "10:00-19:00",
    },
  ];

  useEffect(() => {
    if (status === "loading") return;

    if (status === "unauthenticated") {
      router.push("/");
      return;
    }

    if (session?.user) {
      fetchBarbershopData();
    }
  }, [session, status]);

  const fetchBarbershopData = async () => {
    try {
      const response = await fetch("/api/barbershops/me");
      if (response.ok) {
        const data = await response.json();
        setBarbershop(data.barbershop);
        setBarbers(mockBarbers);
      } else {
        router.push("/register");
      }
    } catch (error) {
      console.error("Erro ao buscar dados:", error);
      router.push("/register");
    } finally {
      setLoading(false);
    }
  };

  const formatSelectedDate = () => {
    const today = new Date();
    if (format(selectedDate, "yyyy-MM-dd") === format(today, "yyyy-MM-dd")) {
      return "Hoje";
    }
    return format(selectedDate, "dd/MM", { locale: ptBR });
  };

  // Loading state
  if (loading || status === "loading") {
    return (
      <div
        className="min-h-screen flex flex-col"
        style={{ backgroundColor: colors.backgroundColor }}
      >
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
  if (status === "unauthenticated" || !barbershop) {
    return (
      <div
        className="min-h-screen flex flex-col"
        style={{ backgroundColor: colors.backgroundColor }}
      >
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
    <div
      className="h-full flex flex-col overflow-hidden"
      style={{
        backgroundColor: colors.backgroundColor || "#f9fafb",
        color: colors.textColor || "#111827",
      }}
    >
      {/* Improved Calendar Component */}
      <div className="flex-1 overflow-hidden">
        <ImprovedCalendar
          barbershopId={barbershop?.id || ""}
          barbers={barbers}
          onAddBooking={() => {
            console.log("Adicionar agendamento");
            // Add your booking logic here
          }}
        />
      </div>

      {/* Toast PWA */}
    </div>
  );
}
