"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import {
  Calendar,
  Clock,
  ChevronLeft,
  CheckCircle,
  XCircle,
  MapPin,
  Phone,
  X,
  Check,
  ChevronRight,
  Menu,
} from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import ClientLayout from "../components/client-layout";
import CancelBookingModal from "../components/cancel-booking-modal";
import { toast } from "sonner";

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
  createdAt: Date;
  updatedAt: Date;
}

export default function BookingsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const barbershopId = searchParams.get("barbershopId");

  const [barbershop, setBarbershop] = useState<BarberShop | null>(null);
  const [userBookings, setUserBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [cancelModal, setCancelModal] = useState<{
    isOpen: boolean;
    booking: Booking | null;
    isLessThan24Hours: boolean;
  }>({
    isOpen: false,
    booking: null,
    isLessThan24Hours: false,
  });

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

  const handleCancelBooking = (booking: Booking) => {
    const now = new Date();
    const bookingDate = new Date(booking.date);
    const timeDifference = bookingDate.getTime() - now.getTime();
    const hoursDifference = timeDifference / (1000 * 60 * 60);
    const isLessThan24Hours = hoursDifference < 24;

    setCancelModal({
      isOpen: true,
      booking,
      isLessThan24Hours,
    });
  };

  const confirmCancelBooking = async () => {
    if (!cancelModal.booking) return;

    try {
      const response = await fetch("/api/bookings/cancel", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          bookingId: cancelModal.booking.id,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success(data.message);
        // Atualizar a lista de agendamentos
        setUserBookings((prev) =>
          prev.map((booking) =>
            booking.id === cancelModal.booking!.id
              ? { ...booking, status: "CANCELLED" as const }
              : booking,
          ),
        );
      } else {
        toast.error(data.error || "Erro ao cancelar agendamento");
      }
    } catch (error) {
      console.error("Erro ao cancelar agendamento:", error);
      toast.error("Erro ao cancelar agendamento");
    }
  };

  const handleConfirmBooking = async (booking: Booking) => {
    try {
      const response = await fetch("/api/bookings/confirm", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          bookingId: booking.id,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success(data.message);
        // Atualizar a lista de agendamentos
        setUserBookings((prev) =>
          prev.map((b) =>
            b.id === booking.id ? { ...b, status: "CONFIRMED" as const } : b,
          ),
        );
      } else {
        toast.error(data.error || "Erro ao confirmar agendamento");
      }
    } catch (error) {
      console.error("Erro ao confirmar agendamento:", error);
      toast.error("Erro ao confirmar agendamento");
    }
  };

  // Separar agendamentos por status
  const upcomingBookings = userBookings.filter(
    (booking) =>
      new Date(booking.date) > new Date() &&
      (booking.status === "PENDING" || booking.status === "CONFIRMED"),
  );

  const completedBookings = userBookings.filter(
    (booking) =>
      new Date(booking.date) <= new Date() || booking.status === "COMPLETED",
  );

  const cancelledBookings = userBookings.filter(
    (booking) => booking.status === "CANCELLED",
  );

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

  const BookingCard = ({
    booking,
    isCompleted = false,
  }: {
    booking: Booking;
    isCompleted?: boolean;
  }) => {
    const bookingDate = new Date(booking.date);
    const isPast = bookingDate < new Date();
    const isCompletedOrPast =
      isCompleted || isPast || booking.status === "COMPLETED";
    const canCancel = !isCompletedOrPast && booking.status !== "CANCELLED";
    const canConfirm = !isCompletedOrPast && booking.status === "PENDING";
    const canViewDetails = !isCompletedOrPast;

    return (
      <div className="w-full rounded-2xl p-4 bg-gradient-to-r from-white/5 to-white/10 backdrop-blur-sm border border-white/10 shadow-lg hover:shadow-xl transition-all duration-200">
        <div className="flex items-start gap-4">
          {/* Service Icon */}
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 bg-blue-500/20 text-blue-400">
            <Calendar className="h-6 w-6" />
          </div>

          {/* Booking Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-white font-bold text-lg">
                {booking.service?.name || "Serviço"}
              </h3>
              <span
                className={`px-3 py-1 rounded-full text-xs font-medium ${
                  booking.status === "CONFIRMED"
                    ? "bg-green-500/20 text-green-400"
                    : booking.status === "PENDING"
                      ? "bg-yellow-500/20 text-yellow-400"
                      : booking.status === "CANCELLED"
                        ? "bg-red-500/20 text-red-400"
                        : isCompleted
                          ? "bg-green-500/20 text-green-400"
                          : isPast
                            ? "bg-gray-500/20 text-gray-400"
                            : "bg-blue-500/20 text-blue-400"
                }`}
              >
                {booking.status === "CONFIRMED"
                  ? "Confirmado"
                  : booking.status === "PENDING"
                    ? "Pendente"
                    : booking.status === "CANCELLED"
                      ? "Cancelado"
                      : isCompleted
                        ? "Finalizado"
                        : isPast
                          ? "Passado"
                          : "Agendado"}
              </span>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-gray-400" />
                <span className="text-sm text-gray-300">
                  {format(bookingDate, "EEEE, dd 'de' MMMM 'de' yyyy", {
                    locale: ptBR,
                  })
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

              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-gray-400" />
                <span className="text-sm text-gray-300">
                  {format(bookingDate, "HH:mm")}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-400">Valor:</span>
                <span className="text-sm font-bold text-white">
                  {new Intl.NumberFormat("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  }).format(Number(booking.service?.price || 0))}
                </span>
              </div>
            </div>

            {/* Botões de Ação - Apenas para agendamentos futuros */}
            {!isCompletedOrPast && (
              <div className="flex gap-2 mt-3">
                {canConfirm && (
                  <Button
                    size="sm"
                    onClick={() => handleConfirmBooking(booking)}
                    className="h-8 px-2 bg-green-600 hover:bg-green-700 text-white text-xs font-medium rounded-lg flex-1"
                  >
                    <Check className="h-3 w-3 mr-1" />
                    Confirmar
                  </Button>
                )}
                {canCancel && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleCancelBooking(booking)}
                    className="h-8 px-2 border-red-500/50 text-red-400 hover:bg-red-500/10 text-xs font-medium rounded-lg flex-1"
                  >
                    <X className="h-3 w-3 mr-1" />
                    Cancelar
                  </Button>
                )}
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() =>
                    router.push(
                      `/barber_app/client/booking-details?bookingId=${booking.id}&barbershopId=${barbershopId}`,
                    )
                  }
                  className="h-8 px-2 border-blue-500/50 text-blue-400 hover:bg-blue-500/10 text-xs font-medium rounded-lg flex-1"
                >
                  Ver Detalhes
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <ClientLayout barbershop={barbershop}>
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
        {/* Header */}
        <div className="sticky top-0 z-10 backdrop-blur-md border-b border-white/10">
          <div className="flex items-center justify-between p-6">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => router.back()}
              className="w-12 h-12 rounded-full bg-white/10 text-white hover:bg-white/20 transition-all duration-200"
            >
              <ChevronLeft className="h-6 w-6" />
            </Button>

            <h1 className="text-xl font-bold text-white">Meus Agendamentos</h1>

            <Button
              variant="ghost"
              size="icon"
              className="w-12 h-12 rounded-full bg-white/10 text-white hover:bg-white/20 transition-all duration-200"
            >
              <Menu className="h-6 w-6" />
            </Button>
          </div>
        </div>

        <div className="p-6 space-y-8">
          {/* Próximos Agendamentos */}
          {upcomingBookings.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center">
                  <Calendar className="h-4 w-4 text-blue-400" />
                </div>
                <h2 className="text-xl font-bold text-white">
                  Próximos Agendamentos
                </h2>
                <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center">
                  <span className="text-white text-xs font-bold">
                    {upcomingBookings.length}
                  </span>
                </div>
              </div>

              <div className="space-y-3">
                {upcomingBookings.map((booking) => (
                  <BookingCard key={booking.id} booking={booking} />
                ))}
              </div>
            </div>
          )}

          {/* Agendamentos Finalizados */}
          {completedBookings.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center">
                  <CheckCircle className="h-4 w-4 text-green-400" />
                </div>
                <h2 className="text-xl font-bold text-white">
                  Agendamentos Finalizados
                </h2>
                <span className="px-3 py-1 rounded-full bg-green-500/20 text-green-400 text-sm font-medium">
                  {completedBookings.length}
                </span>
              </div>

              <div className="space-y-3">
                {completedBookings.map((booking) => (
                  <BookingCard
                    key={booking.id}
                    booking={booking}
                    isCompleted={true}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Agendamentos Cancelados */}
          {cancelledBookings.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-red-500/20 flex items-center justify-center">
                  <XCircle className="h-4 w-4 text-red-400" />
                </div>
                <h2 className="text-xl font-bold text-white">
                  Agendamentos Cancelados
                </h2>
                <span className="px-3 py-1 rounded-full bg-red-500/20 text-red-400 text-sm font-medium">
                  {cancelledBookings.length}
                </span>
              </div>

              <div className="space-y-3">
                {cancelledBookings.map((booking) => (
                  <BookingCard
                    key={booking.id}
                    booking={booking}
                    isCompleted={false}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Estado Vazio */}
          {userBookings.length === 0 && (
            <div className="text-center py-12">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-white/5 flex items-center justify-center">
                <Calendar className="h-10 w-10 text-gray-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">
                Nenhum agendamento encontrado
              </h3>
              <p className="text-gray-400 mb-6">
                Você ainda não possui agendamentos nesta barbearia
              </p>
              <Button
                onClick={() =>
                  router.push(
                    `/barber_app/client/services?barbershopId=${barbershop.id}`,
                  )
                }
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-6 py-3 rounded-xl"
              >
                Agendar Serviço
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Modal de Cancelamento */}
      <CancelBookingModal
        isOpen={cancelModal.isOpen}
        onClose={() =>
          setCancelModal({
            isOpen: false,
            booking: null,
            isLessThan24Hours: false,
          })
        }
        onConfirm={confirmCancelBooking}
        bookingDate={
          cancelModal.booking ? new Date(cancelModal.booking.date) : new Date()
        }
        serviceName={cancelModal.booking?.service?.name || ""}
        isLessThan24Hours={cancelModal.isLessThan24Hours}
      />
    </ClientLayout>
  );
}
