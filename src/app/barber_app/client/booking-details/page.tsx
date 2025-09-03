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
  AlertTriangle,
  Trash2,
  Bell,
  Plus,
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
}

export default function BookingDetailsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const bookingId = searchParams.get("bookingId");
  const barbershopId = searchParams.get("barbershopId");

  const [barbershop, setBarbershop] = useState<BarberShop | null>(null);
  const [booking, setBooking] = useState<Booking | null>(null);
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
      router.push(`/barber_app/client/login?id=${barbershopId}`);
      return;
    }

    if (!bookingId || !barbershopId) {
      router.push("/");
      return;
    }

    if (session?.user) {
      fetchData();
    }
  }, [session, status, bookingId, barbershopId, router]);

  const fetchData = async () => {
    try {
      // Buscar dados da barbearia
      const barbershopResponse = await fetch(
        `/api/barbershops/${barbershopId}`,
      );
      if (barbershopResponse.ok) {
        const barbershopData = await barbershopResponse.json();
        setBarbershop(barbershopData);

        // Buscar agendamentos do usuário para encontrar o específico
        const bookingsResponse = await fetch(
          `/api/bookings/user?barbershopId=${barbershopId}`,
        );
        if (bookingsResponse.ok) {
          const bookingsData = await bookingsResponse.json();
          const foundBooking = bookingsData.bookings.find(
            (b: Booking) => b.id === bookingId,
          );
          if (foundBooking) {
            setBooking(foundBooking);
          } else {
            toast.error("Agendamento não encontrado");
            router.push(
              `/barber_app/client/bookings?barbershopId=${barbershopId}`,
            );
          }
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

  const handleCancelBooking = () => {
    if (!booking) return;

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
        setBooking((prev) =>
          prev ? { ...prev, status: "CANCELLED" as const } : null,
        );
      } else {
        toast.error(data.error || "Erro ao cancelar agendamento");
      }
    } catch (error) {
      console.error("Erro ao cancelar agendamento:", error);
      toast.error("Erro ao cancelar agendamento");
    }
  };

  const handleConfirmBooking = async () => {
    if (!booking) return;

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
        setBooking((prev) =>
          prev ? { ...prev, status: "CONFIRMED" as const } : null,
        );
      } else {
        toast.error(data.error || "Erro ao confirmar agendamento");
      }
    } catch (error) {
      console.error("Erro ao confirmar agendamento:", error);
      toast.error("Erro ao confirmar agendamento");
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
  if (status === "unauthenticated" || !barbershop || !booking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-black">
        <div className="text-center text-white">
          <h2 className="text-2xl font-bold mb-4">Acesso Negado</h2>
          <p className="text-gray-300 mb-6">
            Você precisa estar logado para acessar o app
          </p>
          <Button
            onClick={() =>
              router.push(`/barber_app/client/login?id=${barbershopId}`)
            }
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl"
          >
            Entrar
          </Button>
        </div>
      </div>
    );
  }

  const bookingDate = new Date(booking.date);
  const canCancel =
    booking.status !== "CANCELLED" && booking.status !== "COMPLETED";
  const canConfirm = booking.status === "PENDING";
  const isSuccess = booking.status === "CONFIRMED";

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

            <h1 className="text-xl font-bold text-white">Meus itens</h1>

            <Button
              variant="ghost"
              size="icon"
              onClick={handleCancelBooking}
              disabled={!canCancel}
              className="w-12 h-12 rounded-full bg-white/10 text-white hover:bg-white/20 transition-all duration-200 disabled:opacity-50"
            >
              <Trash2 className="h-6 w-6" />
            </Button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Informações da Barbearia */}
          <div className="bg-gradient-to-r from-white/5 to-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/10">
            <div className="flex items-center gap-4">
              {/* Logo da Barbearia */}
              <div className="w-16 h-16 rounded-full overflow-hidden flex-shrink-0 bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
                {barbershop.imageUrl ? (
                  <Image
                    src={barbershop.imageUrl}
                    alt={barbershop.name}
                    width={64}
                    height={64}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-white text-xl font-bold">
                    {barbershop.name.charAt(0).toUpperCase()}
                  </span>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <h2 className="text-white font-bold text-lg mb-1">
                  {barbershop.name}
                </h2>
                <p className="text-gray-300 text-sm">{barbershop.address}</p>
              </div>

              <Button
                variant="ghost"
                size="icon"
                className="w-10 h-10 rounded-full bg-white/10 text-white hover:bg-white/20"
              >
                <MapPin className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Banner de Sucesso */}
          {isSuccess && (
            <div className="bg-green-500/20 border border-green-500/30 rounded-2xl p-4">
              <div className="flex items-center gap-3">
                <CheckCircle className="h-6 w-6 text-green-400" />
                <p className="text-green-400 font-semibold">
                  Seu horário foi agendado com sucesso!
                </p>
              </div>
            </div>
          )}

          {/* Opções de Lembrete */}
          <div className="space-y-3">
            <Button
              variant="outline"
              className="w-full justify-between h-12 rounded-xl border-white/20 text-white hover:bg-white/10"
            >
              <div className="flex items-center gap-3">
                <Bell className="h-5 w-5" />
                <span>Criar lembrete</span>
              </div>
              <ChevronLeft className="h-5 w-5 rotate-180" />
            </Button>

            <Button
              variant="outline"
              className="w-full justify-between h-12 rounded-xl border-white/20 text-white hover:bg-white/10"
            >
              <div className="flex items-center gap-3">
                <Plus className="h-5 w-5" />
                <span>Adicionar lembrete ao calendário do celular</span>
              </div>
              <ChevronLeft className="h-5 w-5 rotate-180" />
            </Button>
          </div>

          {/* Seção ITENS */}
          <div className="space-y-4">
            <h3 className="text-gray-400 text-sm font-medium uppercase tracking-wide">
              ITENS
            </h3>

            <div className="bg-gradient-to-r from-white/5 to-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/10">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h4 className="text-white font-semibold text-lg mb-1">
                    {booking.service?.name || "Serviço"}
                  </h4>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    <span className="text-gray-300 text-sm">
                      {format(bookingDate, "HH:mm")} -{" "}
                      {format(
                        new Date(
                          bookingDate.getTime() +
                            (booking.service?.duration || 30) * 60000,
                        ),
                        "HH:mm",
                      )}
                    </span>
                  </div>
                  <p className="text-gray-400 text-sm">
                    Profissional: {barbershop.name}
                  </p>
                </div>

                <div className="text-right">
                  <p className="text-gray-400 text-sm mb-1">
                    {format(bookingDate, "dd/MM/yyyy")}
                  </p>
                  <p className="text-white font-bold text-lg">
                    {new Intl.NumberFormat("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    }).format(Number(booking.service?.price || 0))}
                  </p>
                </div>
              </div>

              {/* Status do Agendamento */}
              <div className="flex items-center justify-between pt-3 border-t border-white/10">
                <span className="text-gray-400 text-sm">Status:</span>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    booking.status === "CONFIRMED"
                      ? "bg-green-500/20 text-green-400"
                      : booking.status === "PENDING"
                        ? "bg-yellow-500/20 text-yellow-400"
                        : booking.status === "CANCELLED"
                          ? "bg-red-500/20 text-red-400"
                          : "bg-blue-500/20 text-blue-400"
                  }`}
                >
                  {booking.status === "CONFIRMED"
                    ? "Confirmado"
                    : booking.status === "PENDING"
                      ? "Pendente"
                      : booking.status === "CANCELLED"
                        ? "Cancelado"
                        : "Finalizado"}
                </span>
              </div>
            </div>
          </div>

          {/* Total */}
          <div className="bg-gradient-to-r from-white/5 to-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/10">
            <div className="flex items-center justify-between">
              <span className="text-white font-semibold text-lg">Total</span>
              <span className="text-white font-bold text-xl">
                {new Intl.NumberFormat("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                }).format(Number(booking.service?.price || 0))}
              </span>
            </div>
          </div>

          {/* Informação de Pagamento */}
          <div className="bg-gray-800/50 rounded-2xl p-4 border border-gray-700/50">
            <p className="text-gray-400 text-sm text-center">
              Este estabelecimento não aceita pagamento online
            </p>
          </div>

          {/* Botões de Ação */}
          {canConfirm && (
            <Button
              onClick={handleConfirmBooking}
              className="w-full h-12 bg-green-600 hover:bg-green-700 text-white rounded-xl font-semibold"
            >
              <Check className="h-5 w-5 mr-2" />
              Confirmar Agendamento
            </Button>
          )}

          {canCancel && (
            <Button
              variant="outline"
              onClick={handleCancelBooking}
              className="w-full h-12 border-red-500/50 text-red-400 hover:bg-red-500/10 rounded-xl font-semibold"
            >
              <X className="h-5 w-5 mr-2" />
              Cancelar Agendamento
            </Button>
          )}
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
            cancelModal.booking
              ? new Date(cancelModal.booking.date)
              : new Date()
          }
          serviceName={cancelModal.booking?.service?.name || ""}
          isLessThan24Hours={cancelModal.isLessThan24Hours}
        />
      </div>
    </ClientLayout>
  );
}
