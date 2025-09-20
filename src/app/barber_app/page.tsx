"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { format, addDays, subDays } from "date-fns";
import { ptBR } from "date-fns/locale";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePWA } from "@/hooks/use-pwa";
import { useBarbershopColors } from "@/hooks/use-barbershop-colors";
import ImprovedCalendar from "./components/improved-calendar";
import { useDate } from "./contexts/date-context";

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
  const { isInstallable } = usePWA();
  const { colors } = useBarbershopColors();
  const [barbershop, setBarbershop] = useState<Barbershop | null>(null);
  const [barbers, setBarbers] = useState<Barber[]>([]);
  const [loading, setLoading] = useState(true);
  const { selectedDate, setSelectedDate } = useDate();

  const handlePreviousDay = useCallback(() => {
    const newDate = subDays(selectedDate, 1);
    setSelectedDate(newDate);
  }, [selectedDate, setSelectedDate]);

  const handleNextDay = useCallback(() => {
    const newDate = addDays(selectedDate, 1);
    setSelectedDate(newDate);
  }, [selectedDate, setSelectedDate]);

  const goToToday = useCallback(() => {
    setSelectedDate(new Date());
  }, [setSelectedDate]);

  const isToday =
    format(selectedDate, "yyyy-MM-dd") === format(new Date(), "yyyy-MM-dd");

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

  // Loading state
  if (loading || status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-black">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
      </div>
    );
  }

  // No session state
  if (status === "unauthenticated" || !barbershop) {
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
    <div className="pb-28">
      {/* Improved Calendar Component */}
      <div className="flex-1 overflow-hidden">
        <ImprovedCalendar
          barbershopId={barbershop?.id || ""}
          barbers={barbers}
          onAddBooking={() => {
            console.log("Adicionar agendamento");
          }}
        />
      </div>
    </div>
  );
}
