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
    <BarberAppLayout barbershop={barbershop}>
      <div
        className="h-screen flex flex-col overflow-hidden"
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

        {/* Navegação Inferior com Efeito Glass */}
        {/* Usamos inset-x-2 bottom-2 para reduzir espaço e pb-safe para acomodar notches */}
        <div className=" p-2 bg-white flex justify-center">
          <div
            className="rounded-2xl p-4 backdrop-blur-xl  w-full max-w-md"
            style={{
              backgroundColor: `${colors.secondaryColor}80`,
              borderColor: `${colors.primaryColor}30`,
              boxShadow: `0 8px 32px ${colors.primaryColor}15`,
            }}
          >
            <div className="flex justify-around items-center">
              <div className="flex flex-col items-center group cursor-pointer transition-all duration-200 hover:scale-110">
                <div
                  className="p-3 rounded-xl transition-all duration-200 group-hover:bg-white/10"
                  style={{ backgroundColor: colors.primaryColor + "20" }}
                >
                  <Calendar
                    className="h-5 w-5"
                    style={{ color: colors.primaryColor }}
                  />
                </div>
                <span
                  className="text-xs mt-2 font-medium"
                  style={{ color: colors.primaryColor }}
                >
                  Agenda
                </span>
              </div>

              <div className="flex flex-col items-center group cursor-pointer transition-all duration-200 hover:scale-110">
                <div
                  className="p-3 rounded-xl transition-all duration-200 group-hover:bg-white/10"
                  style={{ backgroundColor: colors.textColor + "15" }}
                >
                  <Users
                    className="h-5 w-5"
                    style={{ color: colors.textColor }}
                  />
                </div>
                <span
                  className="text-xs mt-2 font-medium"
                  style={{ color: colors.textColor }}
                >
                  Clientes
                </span>
              </div>

              <div className="flex flex-col items-center group cursor-pointer transition-all duration-200 hover:scale-110">
                <div
                  className="p-3 rounded-xl transition-all duration-200 group-hover:bg-white/10"
                  style={{ backgroundColor: colors.textColor + "15" }}
                >
                  <FileText
                    className="h-5 w-5"
                    style={{ color: colors.textColor }}
                  />
                </div>
                <span
                  className="text-xs mt-2 font-medium"
                  style={{ color: colors.textColor }}
                >
                  Faturas
                </span>
              </div>

              <div className="flex flex-col items-center group cursor-pointer transition-all duration-200 hover:scale-110">
                <div
                  className="p-3 rounded-xl transition-all duration-200 group-hover:bg-white/10"
                  style={{ backgroundColor: colors.textColor + "15" }}
                >
                  <Zap
                    className="h-5 w-5"
                    style={{ color: colors.textColor }}
                  />
                </div>
                <span
                  className="text-xs mt-2 font-medium"
                  style={{ color: colors.textColor }}
                >
                  Serviços
                </span>
              </div>

              <div className="flex flex-col items-center group cursor-pointer transition-all duration-200 hover:scale-110">
                <div
                  className="p-3 rounded-xl transition-all duration-200 group-hover:bg-white/10"
                  style={{ backgroundColor: colors.textColor + "15" }}
                >
                  <ShoppingBag
                    className="h-5 w-5"
                    style={{ color: colors.textColor }}
                  />
                </div>
                <span
                  className="text-xs mt-2 font-medium"
                  style={{ color: colors.textColor }}
                >
                  Loja
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Toast PWA */}
      </div>
    </BarberAppLayout>
  );
}
