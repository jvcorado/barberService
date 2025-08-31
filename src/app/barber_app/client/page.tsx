"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import ClientLayout from "./components/client-layout";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import {
  Star,
  ThumbsUp,
  Calendar,
  MapPin,
  Phone,
  MessageCircle,
  Clock,
  ChevronRight,
  Plus,
  Minus,
  Download,
  Bell,
  Wifi,
  WifiOff,
  Instagram,
  Bookmark,
} from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { usePWAClient } from "@/src/hooks/use-pwa-client";
import { useBarbershopColorsById } from "@/hooks/use-barbershop-colors-by-id";

interface Service {
  id: string;
  name: string;
  description?: string | null;
  price: number;
  duration?: number | null;
  imageUrl?: string | null;
}

interface BarberShop {
  id: string;
  name: string;
  address: string;
  imageUrl?: string | null;
  backgroundColor?: string | null;
  textColor?: string | null;
  primaryColor?: string | null;
  secondaryColor?: string | null;
  accentColor?: string | null;
  phones?: string[];
  services: Service[];
  instagram?: string | null;
  tiktok?: string | null;
}

interface Booking {
  id: string;
  date: Date;
  service: Service;
}

export default function ClientPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const barbershopId = searchParams.get("id");
  const pwaStatus = usePWAClient();

  const [barbershop, setBarbershop] = useState<BarberShop | null>(null);
  const [userBookings, setUserBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "loading") return;

    if (status === "unauthenticated") {
      router.push(`/barber_app/client/login?id=${barbershopId}`);
      return;
    }

    if (!barbershopId) {
      router.push("/");
      return;
    }

    if (session?.user) {
      fetchData();
    }
  }, [session, status, barbershopId, router]);

  const fetchData = async () => {
    try {
      // Buscar dados da barbearia
      const barbershopResponse = await fetch(
        `/api/barbershops/${barbershopId}`,
      );
      if (barbershopResponse.ok) {
        const barbershopData = await barbershopResponse.json();
        setBarbershop(barbershopData);

        // Buscar agendamentos do usuário
        const bookingsResponse = await fetch(
          `/api/bookings/user?barbershopId=${barbershopId}`,
        );
        if (bookingsResponse.ok) {
          const bookingsData = await bookingsResponse.json();
          setUserBookings(bookingsData.bookings || []);
        }
      } else {
        router.push("/");
      }
    } catch (error) {
      console.error("Erro ao buscar dados:", error);
      router.push("/");
    } finally {
      setLoading(false);
    }
  };

  // Loading state
  if (loading || status === "loading") {
    return (
      <div
        className="min-h-screen flex flex-col"
        style={{ backgroundColor: barbershop?.backgroundColor || "#f9fafb" }}
      >
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div
              className="animate-spin rounded-2xl h-8 w-8 border-b-2 mx-auto mb-4"
              style={{ borderColor: barbershop?.primaryColor || "#000000" }}
            ></div>
            <p style={{ color: barbershop?.textColor || "#111827" }}>
              Carregando...
            </p>
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
        style={{ backgroundColor: barbershop?.backgroundColor || "#f9fafb" }}
      >
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p
              className="mb-4"
              style={{ color: barbershop?.textColor || "#111827" }}
            >
              Você precisa estar logado para acessar o app
            </p>
            <Button
              onClick={() => router.push("/api/auth/signin")}
              style={{
                backgroundColor: barbershop?.primaryColor || "#000000",
                color: barbershop?.secondaryColor || "#ffffff",
              }}
            >
              Entrar
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Função para agendar notificação de lembrete
  const scheduleReminder = async (bookingDate: Date, serviceName: string) => {
    if (!pwaStatus.hasNotifications) {
      const granted = await pwaStatus.requestNotificationPermission();
      if (!granted) return;
    }

    // Calcular tempo para o lembrete (1 hora antes)
    const reminderTime = new Date(bookingDate.getTime() - 60 * 60 * 1000);
    const now = new Date();

    if (reminderTime > now) {
      const timeUntilReminder = reminderTime.getTime() - now.getTime();

      setTimeout(() => {
        pwaStatus.sendNotification(`Lembrete: ${serviceName}`, {
          body: `Seu agendamento está marcado para daqui a 1 hora!`,
          tag: `reminder-${serviceName}`,
          requireInteraction: true,
        });
      }, timeUntilReminder);
    }
  };

  return (
    <ClientLayout barbershop={barbershop}>
      <div
        className="min-h-screen"
        style={{
          backgroundColor: barbershop.backgroundColor || "#f9fafb",
        }}
      >
        {/* Cabeçalho com Saudação e Data */}
        <div
          className="px-6 py-6"
          style={{
            backgroundColor: barbershop.backgroundColor || "#1f2937",
          }}
        >
          <div className="mb-2">
            <h1 className="text-2xl font-semibold mb-1 text-white">
              Olá{" "}
              <span
                style={{
                  color: barbershop.accentColor || "#60a5fa",
                }}
              >
                {session?.user?.name?.split(" ")[0]}
              </span>
            </h1>
            <p className="text-sm text-gray-200">
              {format(new Date(), "EEEE", { locale: ptBR })},{" "}
              {format(new Date(), "dd 'de' MMM yyyy", { locale: ptBR })}
            </p>
          </div>
        </div>

        {/* Linha separadora */}
        <div
          className="w-full h-0.5 mx-6"
          style={{
            backgroundColor: barbershop.backgroundColor
              ? `${barbershop.backgroundColor}40` // 25% de opacidade para ser mais sutil
              : "#4B5563", // Cor padrão mais visível
          }}
        />

        {/* Meus Agendamentos - Se houver agendamentos */}
        {userBookings.length > 0 && (
          <div className="px-6 py-4">
            <h2
              className="text-lg font-semibold mb-4 section-title"
              style={{
                color: "#ffffff",
                fontWeight: "600",
                fontSize: "1.125rem",
                lineHeight: "1.75rem",
                marginBottom: "1rem",
              }}
            >
              Meus agendamentos
            </h2>

            <div className="space-y-3">
              {userBookings.slice(0, 3).map((booking, index) => (
                <div
                  key={booking.id}
                  className="w-full rounded-2xl p-4 flex items-center bg-white border border-gray-200"
                >
                  <div className="w-12 h-12 rounded-full overflow-hidden mr-4 flex-shrink-0">
                    {barbershop.imageUrl ? (
                      <Image
                        src={barbershop.imageUrl}
                        alt={barbershop.name}
                        width={48}
                        height={48}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div
                        className="w-full h-full flex items-center justify-center"
                        style={{
                          backgroundColor: barbershop.accentColor || "#60a5fa",
                          color: "#ffffff",
                        }}
                      >
                        <span className="text-lg font-bold">
                          {barbershop.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-600 mb-1 font-semibold">
                      {booking.service?.name || "Serviço"}
                    </p>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-3 w-3 text-gray-500" />
                      <span className="text-xs text-gray-500">
                        {format(
                          new Date(booking.date),
                          "dd/MM/yyyy 'às' HH:mm",
                          { locale: ptBR },
                        )}
                      </span>
                    </div>
                  </div>

                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center"
                    style={{
                      backgroundColor: barbershop.accentColor || "#60a5fa",
                      color: "#ffffff",
                    }}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Último Agendamento - Se não houver agendamentos */}
        {userBookings.length === 0 && (
          <div className="px-6 py-4">
            <h2 className="text-lg font-semibold mb-4 text-white">
              Último agendamento
            </h2>

            <div className="w-full rounded-2xl p-4 flex items-center bg-white border border-gray-200">
              <div className="w-12 h-12 rounded-full overflow-hidden mr-4 flex-shrink-0">
                {barbershop.imageUrl ? (
                  <Image
                    src={barbershop.imageUrl}
                    alt={barbershop.name}
                    width={48}
                    height={48}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div
                    className="w-full h-full flex items-center justify-center"
                    style={{
                      backgroundColor: barbershop.accentColor || "#60a5fa",
                      color: "#ffffff",
                    }}
                  >
                    <span className="text-lg font-bold">
                      {barbershop.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-base mb-1 text-gray-900">
                  {barbershop.name}
                </h3>
                <p className="text-sm text-gray-600">
                  Nenhum agendamento ainda
                </p>
              </div>

              <div
                className="w-8 h-8 rounded-full flex items-center justify-center"
                style={{
                  backgroundColor: barbershop.accentColor || "#60a5fa",
                  color: "#ffffff",
                }}
              >
                <ChevronRight className="h-4 w-4" />
              </div>
            </div>
          </div>
        )}

        {/* Imagem da Barbearia */}
        <div className="px-6 py-4">
          <div className="w-full h-48 rounded-2xl overflow-hidden relative bg-gray-800">
            {barbershop.imageUrl ? (
              <Image
                src={barbershop.imageUrl}
                alt="Barbearia"
                width={400}
                height={200}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <div className="text-center">
                  <div
                    className="w-16 h-16 rounded-2xl mx-auto mb-3 flex items-center justify-center"
                    style={{
                      backgroundColor:
                        (barbershop.accentColor || "#60a5fa") + "30",
                    }}
                  >
                    <span className="text-2xl text-gray-400">✂️</span>
                  </div>
                  <p className="text-gray-400">Imagem da Barbearia</p>
                </div>
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
            <div className="absolute bottom-4 left-4 right-4">
              <p className="text-sm font-medium leading-tight text-white">
                Agende compromissos rapidamente pelo app, sem filas ou ligações
              </p>
            </div>
          </div>
        </div>

        {/* Serviços Disponíveis - Carrossel */}
        <div className="px-6 py-4">
          <h2 className="text-lg font-semibold mb-4 text-white">
            Serviços disponíveis
          </h2>

          <div className="flex gap-4 overflow-x-auto pb-2">
            {barbershop.services.slice(0, 3).map((service) => (
              <div
                key={service.id}
                className="flex-shrink-0 w-64 bg-white rounded-2xl p-4 shadow-lg border border-gray-200 flex flex-col"
              >
                {/* Imagem do Serviço */}
                <div
                  className="w-full h-32 rounded-xl overflow-hidden relative mb-3"
                  style={{
                    backgroundColor:
                      (barbershop.accentColor || "#60a5fa") + "20",
                  }}
                >
                  {service.imageUrl ? (
                    <Image
                      src={service.imageUrl}
                      alt={service.name}
                      width={256}
                      height={128}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div
                      className="w-full h-full flex items-center justify-center"
                      style={{
                        backgroundColor:
                          (barbershop.accentColor || "#60a5fa") + "30",
                      }}
                    >
                      <span className="text-2xl">✂️</span>
                    </div>
                  )}

                  {/* Badge de Preço */}
                  <div className="absolute top-2 right-2 bg-yellow-400 text-black text-xs font-bold px-2 py-1 rounded-lg">
                    {new Intl.NumberFormat("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    }).format(Number(service.price))}
                  </div>
                </div>

                {/* Informações do Serviço */}
                <div className="flex-1 space-y-2 mb-3">
                  <h4 className="font-bold text-lg text-gray-900">
                    {service.name}
                  </h4>

                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="h-4 w-4 text-blue-500" />
                    <span className="text-gray-600">
                      {service.duration || 30} min
                    </span>
                  </div>

                  <p className="text-sm text-gray-600 line-clamp-2 min-h-[2.5rem]">
                    {service.description ||
                      "Descrição do serviço não disponível"}
                  </p>
                </div>

                {/* Botões de Ação */}
                <div className="flex items-center gap-2 mt-auto">
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-10 w-10 p-0 rounded-xl flex-shrink-0"
                    style={{
                      borderColor: barbershop.primaryColor || "#000000",
                      color: barbershop.primaryColor || "#000000",
                      backgroundColor: barbershop.secondaryColor || "#ffffff",
                    }}
                  >
                    <Bookmark className="h-4 w-4" />
                  </Button>

                  <Button
                    size="sm"
                    className="flex-1 h-10 rounded-xl font-bold"
                    style={{
                      backgroundColor: barbershop.accentColor || "#60a5fa",
                      color: barbershop.secondaryColor || "#ffffff",
                    }}
                    onClick={() => {
                      router.push(
                        `/barber_app/client/book?barbershopId=${barbershop.id}&serviceId=${service.id}`,
                      );
                    }}
                  >
                    AGENDAR AGORA
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {/* Botão Outros Serviços */}
          {barbershop.services.length > 3 && (
            <div className="mt-4 text-center">
              <Button
                variant="outline"
                className="px-6 py-2 rounded-xl"
                style={{
                  borderColor: barbershop.accentColor || "#60a5fa",
                  color: barbershop.accentColor || "#60a5fa",
                  backgroundColor: "transparent",
                }}
                onClick={() => {
                  // Aqui você pode implementar a navegação para uma página de todos os serviços
                  router.push(
                    `/barber_app/client/services?barbershopId=${barbershop.id}`,
                  );
                }}
              >
                Ver outros serviços ({barbershop.services.length - 3})
              </Button>
            </div>
          )}
        </div>
      </div>
    </ClientLayout>
  );
}
