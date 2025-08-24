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
              className="animate-spin rounded-full h-8 w-8 border-b-2 mx-auto mb-4"
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
          color: barbershop.textColor || "#111827",
        }}
      >
        {/* Header com Status PWA */}
        <div
          className="border-b px-4 py-3"
          style={{
            backgroundColor: barbershop.secondaryColor || "#ffffff",
            borderColor: barbershop.primaryColor || "#000000",
          }}
        >
          <div className="flex items-center justify-between">
            <h1
              className="text-lg font-semibold"
              style={{
                color: barbershop.primaryColor || "#000000",
              }}
            >
              App do Cliente
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
                    ? barbershop.accentColor || "#3b82f6"
                    : barbershop.textColor || "#111827",
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
                    color: barbershop.accentColor || "#3b82f6",
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
            backgroundColor: barbershop.secondaryColor || "#ffffff",
          }}
        >
          <div className="flex items-start gap-4">
            <div
              className="w-20 h-20 rounded-full overflow-hidden"
              style={{
                backgroundColor: (barbershop.accentColor || "#3b82f6") + "20",
              }}
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
                  style={{
                    backgroundColor:
                      (barbershop.accentColor || "#3b82f6") + "30",
                  }}
                >
                  <span
                    className="text-2xl font-bold"
                    style={{ color: barbershop.textColor || "#111827" }}
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
                  color: barbershop.primaryColor || "#000000",
                }}
              >
                {barbershop.name}
              </h2>
              <p
                className="mb-3"
                style={{
                  color: barbershop.textColor || "#111827",
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
                    borderColor: barbershop.primaryColor || "#000000",
                    color: barbershop.primaryColor || "#000000",
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
                    borderColor: barbershop.primaryColor || "#000000",
                    color: barbershop.primaryColor || "#000000",
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
                  style={{ color: barbershop.accentColor || "#3b82f6" }}
                />
                <span
                  className="font-semibold"
                  style={{
                    color: barbershop.primaryColor || "#000000",
                  }}
                >
                  4.6/5
                </span>
              </div>
              <p
                className="text-sm"
                style={{
                  color: barbershop.textColor || "#111827",
                }}
              >
                (123 avaliações)
              </p>
            </div>

            <div className="text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <Calendar
                  className="h-4 w-4"
                  style={{ color: barbershop.accentColor || "#3b82f6" }}
                />
                <span
                  className="font-semibold"
                  style={{
                    color: barbershop.primaryColor || "#000000",
                  }}
                >
                  {userBookings.length}
                </span>
              </div>
              <p
                className="text-sm"
                style={{
                  color: barbershop.textColor || "#111827",
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
              backgroundColor: barbershop.secondaryColor || "#ffffff",
            }}
          >
            <h3
              className="text-lg font-semibold mb-4"
              style={{
                color: barbershop.primaryColor || "#000000",
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
                    borderColor: barbershop.primaryColor || "#000000",
                  }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h4
                      className="font-semibold"
                      style={{
                        color: barbershop.primaryColor || "#000000",
                      }}
                    >
                      {booking.service.name}
                    </h4>
                    <span
                      className="text-sm font-medium px-2 py-1 rounded-full"
                      style={{
                        backgroundColor: barbershop.primaryColor || "#000000",
                        color: barbershop.secondaryColor || "#ffffff",
                      }}
                    >
                      Confirmado
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-sm mb-2">
                    <Calendar
                      className="h-4 w-4"
                      style={{
                        color: barbershop.textColor || "#111827",
                      }}
                    />
                    <span
                      style={{
                        color: barbershop.textColor || "#111827",
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
                        color: barbershop.textColor || "#111827",
                      }}
                    >
                      Duração: {booking.service.duration || 30} min
                    </span>
                    <span
                      className="font-semibold"
                      style={{
                        color: barbershop.primaryColor || "#000000",
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
                    style={{
                      borderColor:
                        (barbershop.primaryColor || "#000000") + "30",
                    }}
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
                        borderColor: barbershop.primaryColor || "#000000",
                        color: barbershop.primaryColor || "#000000",
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
            backgroundColor: barbershop.secondaryColor || "#ffffff",
          }}
        >
          <h3
            className="text-lg font-semibold mb-4"
            style={{
              color: barbershop.primaryColor || "#000000",
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
                  borderColor: barbershop.primaryColor || "#000000",
                }}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <h4
                      className="font-semibold"
                      style={{
                        color: barbershop.primaryColor || "#000000",
                      }}
                    >
                      {service.name}
                    </h4>
                    {service.description && (
                      <p
                        className="text-sm mt-1"
                        style={{
                          color: barbershop.textColor || "#111827",
                        }}
                      >
                        {service.description}
                      </p>
                    )}
                  </div>
                  <span
                    className="font-bold text-lg"
                    style={{
                      color: barbershop.primaryColor || "#000000",
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
                        color: barbershop.textColor || "#111827",
                      }}
                    />
                    <span
                      style={{
                        color: barbershop.textColor || "#111827",
                      }}
                    >
                      {service.duration || 30} min
                    </span>
                  </div>

                  <Button
                    size="sm"
                    style={{
                      backgroundColor: barbershop.primaryColor || "#000000",
                      color: barbershop.secondaryColor || "#ffffff",
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
            backgroundColor: barbershop.secondaryColor || "#ffffff",
          }}
        >
          <h3
            className="text-lg font-semibold mb-4"
            style={{
              color: barbershop.primaryColor || "#000000",
            }}
          >
            Sobre a Barbearia
          </h3>

          <div
            className="aspect-video rounded-lg overflow-hidden mb-4"
            style={{
              backgroundColor: (barbershop.accentColor || "#3b82f6") + "20",
            }}
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
                    style={{
                      backgroundColor:
                        (barbershop.accentColor || "#3b82f6") + "30",
                    }}
                  >
                    <span
                      className="text-2xl"
                      style={{ color: barbershop.textColor || "#111827" }}
                    >
                      🏪
                    </span>
                  </div>
                  <p
                    style={{
                      color: barbershop.textColor || "#111827",
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
                  color: barbershop.textColor || "#111827",
                }}
              />
              <span
                style={{
                  color: barbershop.textColor || "#111827",
                }}
              >
                Seg a Sáb - 9h às 18h
              </span>
            </div>

            <div className="flex items-center gap-3">
              <MapPin
                className="h-5 w-5"
                style={{
                  color: barbershop.textColor || "#111827",
                }}
              />
              <span
                style={{
                  color: barbershop.textColor || "#111827",
                }}
              >
                {barbershop.address}
              </span>
            </div>

            <Button
              variant="outline"
              className="w-full gap-2"
              style={{
                borderColor: barbershop.primaryColor || "#000000",
                color: barbershop.primaryColor || "#000000",
              }}
            >
              <MapPin
                className="h-4 w-4"
                style={{
                  color: barbershop.primaryColor || "#000000",
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
            backgroundColor: barbershop.secondaryColor || "#ffffff",
            borderColor: barbershop.primaryColor || "#000000",
          }}
        >
          <Button
            className="w-full py-3 text-lg font-semibold"
            style={{
              backgroundColor: barbershop.primaryColor || "#000000",
              color: barbershop.secondaryColor || "#ffffff",
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
    </ClientLayout>
  );
}
