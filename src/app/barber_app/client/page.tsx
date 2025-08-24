"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import BarberAppLayout from "../components/barber-app-layout";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useBarbershopColors } from "@/hooks/use-barbershop-colors";
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
} from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { usePWAClient } from "@/src/hooks/use-pwa-client";

interface Service {
  id: string;
  name: string;
  description?: string | null;
  price: number;
  duration?: number | null;
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
  phones?: string[];
  services: Service[];
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
  const { colors } = useBarbershopColors();
  const pwaStatus = usePWAClient();

  const [barbershop, setBarbershop] = useState<BarberShop | null>(null);
  const [userBookings, setUserBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "loading") return;

    if (status === "unauthenticated") {
      router.push("/");
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
    <BarberAppLayout barbershop={barbershop}>
      <div
        className="min-h-screen"
        style={{
          backgroundColor: colors.backgroundColor,
          color: colors.textColor,
        }}
      >
        {/* Header com Status PWA */}
        <div
          className="border-b px-4 py-3"
          style={{
            backgroundColor: colors.secondaryColor,
            borderColor: colors.primaryColor,
          }}
        >
          <div className="flex items-center justify-between">
            <h1
              className="text-lg font-semibold"
              style={{
                color: colors.primaryColor,
              }}
            >
              {barbershop.name}
            </h1>

            {/* Status PWA */}
            <div className="flex items-center gap-2">
              {/* Status Online/Offline */}
              {pwaStatus.isOnline ? (
                <Wifi className="h-4 w-4 text-green-500" />
              ) : (
                <WifiOff className="h-4 w-4 text-red-500" />
              )}

              {/* Botão de Notificação */}
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => pwaStatus.requestNotificationPermission()}
                style={{
                  color: pwaStatus.hasNotifications
                    ? colors.accentColor
                    : colors.textColor,
                }}
              >
                <Bell className="h-4 w-4" />
              </Button>

              {/* Botão de Instalação */}
              {pwaStatus.canInstall && !pwaStatus.isInstalled && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => pwaStatus.installApp()}
                  style={{
                    color: colors.accentColor,
                  }}
                >
                  <Download className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Perfil da Barbearia */}
        <div
          className="px-4 py-6"
          style={{
            backgroundColor: colors.secondaryColor,
          }}
        >
          <div className="flex items-start gap-4">
            <div
              className="w-20 h-20 rounded-full overflow-hidden"
              style={{ backgroundColor: colors.accentColor + "20" }}
            >
              {barbershop.imageUrl ? (
                <Image
                  src={barbershop.imageUrl}
                  alt={barbershop.name}
                  width={80}
                  height={80}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div
                  className="w-full h-full flex items-center justify-center"
                  style={{ backgroundColor: colors.accentColor + "30" }}
                >
                  <span
                    className="text-2xl font-bold"
                    style={{ color: colors.textColor }}
                  >
                    {barbershop.name.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
            </div>

            <div className="flex-1">
              <h2
                className="text-xl font-bold mb-1"
                style={{
                  color: colors.primaryColor,
                }}
              >
                {barbershop.name}
              </h2>
              <p
                className="mb-3"
                style={{
                  color: colors.textColor,
                }}
              >
                {barbershop.address}
              </p>

              <div className="flex items-center gap-4 mb-4">
                <Button
                  size="sm"
                  variant="outline"
                  className="gap-2"
                  style={{
                    borderColor: colors.primaryColor,
                    color: colors.primaryColor,
                  }}
                  onClick={() => {
                    if (barbershop.phones && barbershop.phones.length > 0) {
                      window.open(`tel:${barbershop.phones[0]}`, "_self");
                    }
                  }}
                >
                  <Phone className="h-4 w-4" />
                  Ligar
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="gap-2"
                  style={{
                    borderColor: colors.primaryColor,
                    color: colors.primaryColor,
                  }}
                  onClick={() => {
                    if (barbershop.phones && barbershop.phones.length > 0) {
                      window.open(
                        `https://wa.me/${barbershop.phones[0].replace(/\D/g, "")}`,
                        "_blank",
                      );
                    }
                  }}
                >
                  <MessageCircle className="h-4 w-4" />
                  WhatsApp
                </Button>
              </div>
            </div>
          </div>

          {/* Estatísticas */}
          <div className="grid grid-cols-2 gap-4 mt-6">
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <Star
                  className="h-4 w-4 fill-current"
                  style={{ color: colors.accentColor }}
                />
                <span
                  className="font-semibold"
                  style={{
                    color: colors.primaryColor,
                  }}
                >
                  4.6/5
                </span>
              </div>
              <p
                className="text-sm"
                style={{
                  color: colors.textColor,
                }}
              >
                (123 avaliações)
              </p>
            </div>

            <div className="text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <Calendar
                  className="h-4 w-4"
                  style={{ color: colors.accentColor }}
                />
                <span
                  className="font-semibold"
                  style={{
                    color: colors.primaryColor,
                  }}
                >
                  {userBookings.length}
                </span>
              </div>
              <p
                className="text-sm"
                style={{
                  color: colors.textColor,
                }}
              >
                Meus Agendamentos
              </p>
            </div>
          </div>
        </div>

        {/* Meus Agendamentos */}
        {userBookings.length > 0 && (
          <div
            className="mt-2 px-4 py-6"
            style={{
              backgroundColor: colors.secondaryColor,
            }}
          >
            <h3
              className="text-lg font-semibold mb-4"
              style={{
                color: colors.primaryColor,
              }}
            >
              Meus Agendamentos
            </h3>

            <div className="space-y-3">
              {userBookings.map((booking) => (
                <div
                  key={booking.id}
                  className="border rounded-lg p-4"
                  style={{
                    borderColor: colors.primaryColor,
                  }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h4
                      className="font-semibold"
                      style={{
                        color: colors.primaryColor,
                      }}
                    >
                      {booking.service.name}
                    </h4>
                    <span
                      className="text-sm font-medium px-2 py-1 rounded-full"
                      style={{
                        backgroundColor: colors.primaryColor,
                        color: colors.secondaryColor,
                      }}
                    >
                      Confirmado
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-sm mb-2">
                    <Calendar
                      className="h-4 w-4"
                      style={{
                        color: colors.textColor,
                      }}
                    />
                    <span
                      style={{
                        color: colors.textColor,
                      }}
                    >
                      {format(
                        new Date(booking.date),
                        "EEEE, dd 'de' MMMM 'às' HH:mm",
                        {
                          locale: ptBR,
                        },
                      )}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span
                      className="text-sm"
                      style={{
                        color: colors.textColor,
                      }}
                    >
                      Duração: {booking.service.duration || 30} min
                    </span>
                    <span
                      className="font-semibold"
                      style={{
                        color: colors.primaryColor,
                      }}
                    >
                      {new Intl.NumberFormat("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                      }).format(Number(booking.service.price))}
                    </span>
                  </div>

                  {/* Botão para agendar lembrete */}
                  <div
                    className="mt-3 pt-3 border-t"
                    style={{ borderColor: colors.primaryColor + "30" }}
                  >
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full gap-2"
                      onClick={() =>
                        scheduleReminder(
                          new Date(booking.date),
                          booking.service.name,
                        )
                      }
                      style={{
                        borderColor: colors.primaryColor,
                        color: colors.primaryColor,
                      }}
                    >
                      <Bell className="h-4 w-4" />
                      Agendar Lembrete
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Serviços Disponíveis */}
        <div
          className="mt-2 px-4 py-6"
          style={{
            backgroundColor: colors.secondaryColor,
          }}
        >
          <h3
            className="text-lg font-semibold mb-4"
            style={{
              color: colors.primaryColor,
            }}
          >
            Serviços Disponíveis
          </h3>

          <div className="space-y-3">
            {barbershop.services.map((service) => (
              <div
                key={service.id}
                className="border rounded-lg p-4"
                style={{
                  borderColor: colors.primaryColor,
                }}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <h4
                      className="font-semibold"
                      style={{
                        color: colors.primaryColor,
                      }}
                    >
                      {service.name}
                    </h4>
                    {service.description && (
                      <p
                        className="text-sm mt-1"
                        style={{
                          color: colors.textColor,
                        }}
                      >
                        {service.description}
                      </p>
                    )}
                  </div>
                  <span
                    className="font-bold text-lg"
                    style={{
                      color: colors.primaryColor,
                    }}
                  >
                    {new Intl.NumberFormat("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    }).format(Number(service.price))}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm">
                    <Clock
                      className="h-4 w-4"
                      style={{
                        color: colors.textColor,
                      }}
                    />
                    <span
                      style={{
                        color: colors.textColor,
                      }}
                    >
                      {service.duration || 30} min
                    </span>
                  </div>

                  <Button
                    size="sm"
                    style={{
                      backgroundColor: colors.primaryColor,
                      color: colors.secondaryColor,
                    }}
                    onClick={() => {
                      // Redirecionar para página de agendamento
                      window.location.href = `/barber_app/client/book?serviceId=${service.id}&barbershopId=${barbershop.id}`;
                    }}
                  >
                    Agendar
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Informações da Barbearia */}
        <div
          className="mt-2 px-4 py-6"
          style={{
            backgroundColor: colors.secondaryColor,
          }}
        >
          <h3
            className="text-lg font-semibold mb-4"
            style={{
              color: colors.primaryColor,
            }}
          >
            Sobre a Barbearia
          </h3>

          <div
            className="aspect-video rounded-lg overflow-hidden mb-4"
            style={{ backgroundColor: colors.accentColor + "20" }}
          >
            {barbershop.imageUrl ? (
              <Image
                src={barbershop.imageUrl}
                alt="Barbearia"
                width={400}
                height={225}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <div className="text-center">
                  <div
                    className="w-16 h-16 rounded-full mx-auto mb-3 flex items-center justify-center"
                    style={{ backgroundColor: colors.accentColor + "30" }}
                  >
                    <span
                      className="text-2xl"
                      style={{ color: colors.textColor }}
                    >
                      🏪
                    </span>
                  </div>
                  <p
                    style={{
                      color: colors.textColor,
                    }}
                  >
                    Imagem da Barbearia
                  </p>
                </div>
              </div>
            )}
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <Clock
                className="h-5 w-5"
                style={{
                  color: colors.textColor,
                }}
              />
              <span
                style={{
                  color: colors.textColor,
                }}
              >
                Seg a Sáb - 9h às 18h
              </span>
            </div>

            <div className="flex items-center gap-3">
              <MapPin
                className="h-5 w-5"
                style={{
                  color: colors.textColor,
                }}
              />
              <span
                style={{
                  color: colors.textColor,
                }}
              >
                {barbershop.address}
              </span>
            </div>

            <Button
              variant="outline"
              className="w-full gap-2"
              style={{
                borderColor: colors.primaryColor,
                color: colors.primaryColor,
              }}
            >
              <MapPin
                className="h-4 w-4"
                style={{
                  color: colors.primaryColor,
                }}
              />
              Mostrar no mapa
            </Button>
          </div>
        </div>

        {/* Botão de Agendamento Rápido */}
        <div
          className="fixed bottom-0 left-0 right-0 border-t p-4"
          style={{
            backgroundColor: colors.secondaryColor,
            borderColor: colors.primaryColor,
          }}
        >
          <Button
            className="w-full py-3 text-lg font-semibold"
            style={{
              backgroundColor: colors.primaryColor,
              color: colors.secondaryColor,
            }}
            onClick={() => {
              // Sincronizar dados antes de navegar
              pwaStatus.syncInBackground("pre-navigation");

              // Redirecionar para página de agendamento
              window.location.href = `/barber_app/client/book?barbershopId=${barbershop.id}`;
            }}
          >
            Agendar Serviço
          </Button>
        </div>

        {/* Espaço para o botão fixo */}
        <div className="h-20"></div>
      </div>
    </BarberAppLayout>
  );
}
