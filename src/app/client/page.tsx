"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import {
  Calendar,
  ChevronRight,
  Clock,
  MapPin,
  Phone,
  MessageCircle,
  Star,
  ThumbsUp,
} from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { usePWAClient } from "@/src/hooks/use-pwa-client";
import ClientLayout from "./components/client-layout";

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
  status: "PENDING" | "CONFIRMED" | "CANCELLED" | "COMPLETED";
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

  // Filtrar agendamentos futuros (independente do status, exceto cancelados)
  const activeBookings = userBookings.filter(
    (booking) =>
      booking.status !== "CANCELLED" && new Date(booking.date) >= new Date(),
  );

  // Se não há agendamentos ativos, pegar o último agendamento (excluindo cancelados)
  const lastBooking =
    userBookings.length > 0 && activeBookings.length === 0
      ? userBookings
          .filter((booking) => booking.status !== "CANCELLED")
          .sort(
            (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
          )[0]
      : null;

  // Agendamentos para mostrar (ativos ou último)
  const bookingsToShow =
    activeBookings.length > 0
      ? activeBookings
      : lastBooking
        ? [lastBooking]
        : [];

  useEffect(() => {
    if (status === "loading") return;

    if (status === "unauthenticated") {
      router.push(`/client/login?id=${barbershopId}`);
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
            onClick={() => router.push(`/client/login?id=${barbershopId}`)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl"
          >
            Entrar
          </Button>
        </div>
      </div>
    );
  }

  return (
    <ClientLayout barbershop={barbershop}>
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
        {/* Cabeçalho com Saudação e Data */}
        <div className="px-6 pt-6">
          <div className="flex items-center justify-between mb-4 border-b border-white/10 pb-4">
            <div>
              <h1 className="text-2xl font-semibold text-white mb-1">
                Olá{" "}
                <span className="text-blue-400">
                  {session?.user?.name?.split(" ")[0]}
                </span>
              </h1>
              <p className="text-gray-300 text-sm">
                {format(new Date(), "EEEE, dd 'de' MMM yyyy", { locale: ptBR })
                  .replace(/^\w/, (c) => c.toUpperCase())
                  .replace(
                    /(segunda|terça|quarta|quinta|sexta|sábado|domingo)-feira/g,
                    (match) => {
                      const dayMap: { [key: string]: string } = {
                        "segunda-feira": "Segunda",
                        "terça-feira": "Terça",
                        "quarta-feira": "Quarta",
                        "quinta-feira": "Quinta",
                        "sexta-feira": "Sexta",
                        sábado: "Sábado",
                        domingo: "Domingo",
                      };
                      return dayMap[match.toLowerCase()] || match;
                    },
                  )}
              </p>
            </div>
          </div>
        </div>

        {/* Seção de Agendamentos */}
        {bookingsToShow.length > 0 && (
          <div className="px-6 py-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center">
                <Calendar className="h-4 w-4 text-blue-400" />
              </div>
              <h2 className="text-lg font-semibold text-white">
                {activeBookings.length > 0
                  ? "Meus agendamentos"
                  : "Último agendamento"}
              </h2>
              {activeBookings.length > 0 && (
                <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center">
                  <span className="text-white text-xs font-bold">
                    {activeBookings.length}
                  </span>
                </div>
              )}
            </div>

            <div className="space-y-3">
              {bookingsToShow.slice(0, 3).map((booking, index) => (
                <div
                  key={booking.id}
                  className="w-full rounded-2xl p-4 flex items-center bg-gradient-to-r from-white/5 to-white/10 backdrop-blur-sm border border-white/10 shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  {/* Logo da Barbearia */}
                  <div className="w-12 h-12 rounded-full overflow-hidden mr-4 flex-shrink-0 bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
                    {barbershop.imageUrl ? (
                      <Image
                        src={barbershop.imageUrl}
                        alt={barbershop.name}
                        width={48}
                        height={48}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-white text-lg font-bold">
                        {barbershop.name.charAt(0).toUpperCase()}
                      </span>
                    )}
                  </div>

                  {/* Informações do Agendamento */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-white font-semibold">
                        {booking.service?.name || "Serviço"}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <Calendar className="h-3 w-3 text-gray-400" />
                      <span className="text-xs text-gray-400">
                        {format(
                          new Date(booking.date),
                          "EEE, dd/MM/yyyy 'às' HH:mm",
                          {
                            locale: ptBR,
                          },
                        )
                          .replace(/^\w/, (c) => c.toUpperCase())
                          .replace(
                            /(segunda|terça|quarta|quinta|sexta|sábado|domingo)-feira/g,
                            (match) => {
                              const dayMap: { [key: string]: string } = {
                                "segunda-feira": "Segunda",
                                "terça-feira": "Terça",
                                "quarta-feira": "Quarta",
                                "quinta-feira": "Quinta",
                                "sexta-feira": "Sexta",
                                sábado: "Sábado",
                                domingo: "Domingo",
                              };
                              return dayMap[match.toLowerCase()] || match;
                            },
                          )}
                      </span>
                    </div>
                  </div>

                  {/* Botão de Ação */}
                  <div
                    className="w-8 h-8 rounded-full bg-green-600 flex items-center justify-center cursor-pointer hover:bg-green-700 transition-colors"
                    onClick={() => {
                      if (activeBookings.length === 0 && lastBooking) {
                        // Se é o último agendamento, navegar para reagendamento
                        router.push(
                          `/client/book?barbershopId=${barbershop.id}&serviceId=${booking.service.id}&rebook=true`,
                        );
                      } else {
                        // Se é agendamento ativo, navegar para detalhes
                        router.push(
                          `/clientbooking-details?bookingId=${booking.id}&barbershopId=${barbershop.id}`,
                        );
                      }
                    }}
                  >
                    <ChevronRight className="h-4 w-4 text-white" />
                  </div>
                </div>
              ))}
            </div>

            {/* Botão para ver todos os agendamentos */}
            {bookingsToShow.length > 3 && (
              <div className="mt-4 text-center">
                <Button
                  variant="outline"
                  className="px-4 py-2 rounded-xl text-white border-white/20 hover:bg-white/10"
                  onClick={() => {
                    router.push(
                      `/clientbookings?barbershopId=${barbershop.id}`,
                    );
                  }}
                >
                  Ver todos os agendamentos ({userBookings.length})
                </Button>
              </div>
            )}
          </div>
        )}

        {/* Banner Promocional */}
        <div className="px-6 py-4">
          <div className="w-full h-48 rounded-2xl overflow-hidden relative bg-gradient-to-br from-gray-800 to-gray-900 border border-white/10">
            {/* Imagem de fundo ou ícone */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                  <div className="text-4xl">✂️</div>
                </div>
              </div>
            </div>

            {/* Overlay gradiente */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>

            {/* Texto promocional */}
            <div className="absolute bottom-4 left-4 right-4">
              <p className="text-sm font-medium leading-tight text-white">
                Agende compromissos rapidamente pelo app, sem filas ou ligações
              </p>
            </div>
          </div>
        </div>

        {/* Seção "Serviços disponíveis" */}
        <div className="px-6 py-4 pb-24">
          <h2 className="text-lg font-semibold text-white mb-4">
            Serviços disponíveis
          </h2>

          <div className="flex gap-4 overflow-x-auto pb-2">
            {barbershop.services.slice(0, 3).map((service) => (
              <div
                key={service.id}
                className="flex-shrink-0 w-64 bg-gradient-to-r from-white/5 to-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/10 shadow-lg hover:shadow-xl transition-all duration-200"
              >
                {/* Imagem do Serviço */}
                <div className="w-full h-32 rounded-xl overflow-hidden relative mb-3 bg-gray-800">
                  {service.imageUrl ? (
                    <Image
                      src={service.imageUrl}
                      alt={service.name}
                      width={256}
                      height={128}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
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
                  <h4 className="font-bold text-lg text-white">
                    {service.name}
                  </h4>

                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="h-4 w-4 text-blue-400" />
                    <span className="text-gray-300">
                      {service.duration || 30} min
                    </span>
                  </div>

                  <p className="text-sm text-gray-300 line-clamp-2 min-h-[2.5rem]">
                    {service.description ||
                      "Descrição do serviço não disponível"}
                  </p>
                </div>

                {/* Botão de Agendamento */}
                <Button
                  className="w-full h-10 rounded-xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-lg shadow-blue-500/25 transition-all duration-200 hover:scale-105"
                  onClick={() => {
                    router.push(
                      `/client/book?barbershopId=${barbershop.id}&serviceId=${service.id}`,
                    );
                  }}
                >
                  AGENDAR AGORA
                </Button>
              </div>
            ))}
          </div>

          {/* Botão Outros Serviços */}
          {barbershop.services.length > 3 && (
            <div className="mt-4 text-center">
              <Button
                variant="outline"
                className="px-6 py-2 rounded-xl text-white border-white/20 hover:bg-white/10"
                onClick={() => {
                  router.push(`/clientservices?barbershopId=${barbershop.id}`);
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
