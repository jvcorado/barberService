"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";

import {
  Clock,
  Calendar as CalendarIcon,
  ArrowLeft,
  Check,
  ChevronLeft,
  X,
} from "lucide-react";
import {
  format,
  addDays,
  startOfDay,
  endOfDay,
  isSameDay,
  addDays as addDaysFn,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameMonth,
} from "date-fns";
import { ptBR } from "date-fns/locale";
import { createBooking } from "../../../../actions/create-booking";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Service {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  price: number;
  duration?: number | null;
}

interface BarberShop {
  id: string;
  name: string;
  address: string;
  description: string;
  imageUrl: string;
  primaryColor?: string | null;
  secondaryColor?: string | null;
  openingTime: string;
  closingTime: string;
  appointmentInterval: number;
  backgroundColor?: string | null;
  textColor?: string | null;
  services: Service[];
}

export default function BookPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session, status } = useSession();
  const serviceId = searchParams.get("serviceId");
  const barbershopId = searchParams.get("barbershopId");

  const [barbershop, setBarbershop] = useState<BarberShop | null>(null);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [availableTimes, setAvailableTimes] = useState<string[]>([]);
  const [existingBookings, setExistingBookings] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingBarbershop, setIsLoadingBarbershop] = useState(true);
  const [showFullCalendar, setShowFullCalendar] = useState(false);

  // Gerar horários disponíveis baseados nas configurações da barbearia
  const generateTimeSlots = () => {
    if (!barbershop) return [];

    const slots = [];
    const [openingHour, openingMinute] = barbershop.openingTime
      .split(":")
      .map(Number);
    const [closingHour, closingMinute] = barbershop.closingTime
      .split(":")
      .map(Number);
    const interval = barbershop.appointmentInterval || 10; // Default 10 minutos

    const openingMinutes = openingHour * 60 + openingMinute;
    const closingMinutes = closingHour * 60 + closingMinute;

    for (
      let minutes = openingMinutes;
      minutes < closingMinutes;
      minutes += interval
    ) {
      const hour = Math.floor(minutes / 60);
      const minute = minutes % 60;
      slots.push(
        `${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`,
      );
    }

    return slots;
  };

  const timeSlots = generateTimeSlots();

  // Datas para a próxima semana (incluindo hoje)
  const getNextWeekDates = () => {
    const dates = [];
    const today = new Date();
    for (let i = 0; i <= 6; i++) {
      dates.push(addDaysFn(today, i));
    }
    return dates;
  };

  // Gerar calendário completo para 12 meses
  const getFullCalendarMonths = () => {
    const months = [];
    const today = new Date();

    for (let i = 0; i < 12; i++) {
      const monthStart = startOfMonth(addDaysFn(today, i * 30));
      const monthEnd = endOfMonth(monthStart);
      const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

      months.push({
        month: monthStart,
        days: days,
      });
    }

    return months;
  };

  useEffect(() => {
    if (barbershopId) {
      fetchBarbershop();
    }
  }, [barbershopId]);

  useEffect(() => {
    if (serviceId && barbershop?.services) {
      const service = barbershop.services.find((s) => s.id === serviceId);
      setSelectedService(service || null);
    }
  }, [serviceId, barbershop]);

  useEffect(() => {
    if (selectedDate) {
      generateAvailableTimes();
      fetchExistingBookings();
    }
  }, [selectedDate]);

  const fetchBarbershop = async () => {
    try {
      setIsLoadingBarbershop(true);
      const response = await fetch(`/api/barbershops/${barbershopId}`);
      if (!response.ok) {
        throw new Error("Erro ao buscar barbearia");
      }
      const barbershop = await response.json();
      setBarbershop(barbershop);
    } catch (error) {
      console.error("Erro ao buscar barbearia:", error);
    } finally {
      setIsLoadingBarbershop(false);
    }
  };

  const fetchExistingBookings = async () => {
    if (!selectedDate || !barbershopId) return;

    try {
      const dateStr = format(selectedDate, "yyyy-MM-dd");
      const response = await fetch(
        `/api/bookings/calendar?barbershopId=${barbershopId}&date=${dateStr}`,
      );

      if (response.ok) {
        const data = await response.json();
        setExistingBookings(data.bookings || []);
      }
    } catch (error) {
      console.error("Erro ao buscar agendamentos:", error);
      setExistingBookings([]);
    }
  };

  const generateAvailableTimes = () => {
    if (!selectedDate) return;

    // Sempre mostrar todos os horários
    setAvailableTimes([...timeSlots]);
    setSelectedTime("");
  };

  // Função para verificar se um horário está disponível
  const isTimeAvailable = (time: string) => {
    const today = new Date();
    const isToday = isSameDay(selectedDate, today);
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();

    // Verificar se é hoje e se o horário é muito próximo
    if (isToday) {
      const [hour, minute] = time.split(":").map(Number);
      const isTooSoon = !(
        hour > currentHour + 1 ||
        (hour === currentHour + 1 && minute > currentMinute)
      );
      if (isTooSoon) return false;
    }

    // Verificar se já existe agendamento neste horário
    const isBooked = existingBookings.some((booking) => {
      const bookingTime = format(new Date(booking.date), "HH:mm");
      return bookingTime === time && booking.status !== "CANCELLED";
    });

    return !isBooked;
  };

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    setShowFullCalendar(false);
  };

  const handleTimeSelect = (time: string) => {
    if (isTimeAvailable(time)) {
      setSelectedTime(time);
    }
  };

  const handleConfirmBooking = async () => {
    if (!selectedService || !selectedDate || !selectedTime || !barbershop) {
      toast.error("Por favor, preencha todos os campos");
      return;
    }

    if (!session?.user) {
      toast.error("Você precisa estar logado para fazer um agendamento");
      return;
    }

    setIsLoading(true);

    try {
      console.log("Iniciando confirmação do agendamento...");
      console.log("Serviço:", selectedService);
      console.log("Data:", selectedDate);
      console.log("Horário:", selectedTime);
      console.log("Barbearia:", barbershop.id);
      console.log("Usuário:", session.user);

      const [hours, minutes] = selectedTime.split(":").map(Number);
      const bookingDate = new Date(selectedDate);
      bookingDate.setHours(hours, minutes, 0, 0);

      console.log("Data do agendamento:", bookingDate);

      const result = await createBooking({
        serviceId: selectedService.id,
        date: bookingDate,
        barberShopId: barbershop.id,
      });

      console.log("Resultado da criação:", result);

      if (result.success) {
        toast.success("Agendamento realizado com sucesso!");
        router.push(`/barber_app/client?id=${barbershop.id}`);
      } else {
        toast.error(result.error || "Erro ao realizar agendamento");
      }
    } catch (error) {
      console.error("Erro na confirmação:", error);
      toast.error("Erro ao realizar agendamento");
    } finally {
      setIsLoading(false);
    }
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-black">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
      </div>
    );
  }

  if (status === "unauthenticated") {
    router.push(`/barber_app/client/login?id=${barbershopId}`);
    return null;
  }

  if (isLoadingBarbershop) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-black">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
      </div>
    );
  }

  if (!barbershop) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-black">
        <div className="text-center text-white">
          <h2 className="text-2xl font-bold mb-4">Barbearia não encontrada</h2>
          <p className="text-gray-300 mb-6">
            Não foi possível carregar as informações da barbearia
          </p>
          <Button
            onClick={() => router.back()}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl"
          >
            Voltar
          </Button>
        </div>
      </div>
    );
  }

  if (!selectedService) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-black">
        <div className="text-center text-white">
          <h2 className="text-2xl font-bold mb-4">Serviço não selecionado</h2>
          <p className="text-gray-300 mb-6">
            Por favor, selecione um serviço primeiro
          </p>
          <Button
            onClick={() => router.back()}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl"
          >
            Voltar
          </Button>
        </div>
      </div>
    );
  }

  // Calendário completo
  if (showFullCalendar) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white">
        {/* Header */}
        <div className="sticky top-0 z-10">
          <div className="flex items-center justify-between p-6">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowFullCalendar(false)}
              className="w-12 h-12 rounded-full bg-white/10 text-white hover:bg-white/20 transition-all"
            >
              <ChevronLeft className="h-6 w-6" />
            </Button>

            <div className="w-12"></div>
          </div>
        </div>

        {/* Calendário Completo - Iniciando do topo */}
        <div className="p-6 space-y-12">
          {getFullCalendarMonths().map((monthData, monthIndex) => (
            <div key={monthIndex} className="space-y-6">
              <h2 className="text-2xl font-bold text-white text-center bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
                {format(monthData.month, "MMMM yyyy", {
                  locale: ptBR,
                }).toUpperCase()}
              </h2>

              {/* Dias da semana */}
              <div className="grid grid-cols-7 gap-2 mb-4">
                {["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"].map(
                  (day) => (
                    <div
                      key={day}
                      className="text-center text-sm font-semibold text-gray-400 py-3"
                    >
                      {day}
                    </div>
                  ),
                )}
              </div>

              {/* Grid de datas */}
              <div className="grid grid-cols-7 gap-2">
                {monthData.days.map((day, dayIndex) => {
                  const isSelected = isSameDay(day, selectedDate);
                  const isToday = isSameDay(day, new Date());
                  const isPast = day < startOfDay(new Date());

                  return (
                    <div
                      key={dayIndex}
                      className={`aspect-square flex items-center justify-center text-sm font-semibold rounded-xl cursor-pointer transition-all duration-200 ${
                        isSelected
                          ? "bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/25"
                          : isToday
                            ? "bg-white/20 text-white ring-2 ring-white/40"
                            : isPast
                              ? "text-gray-600 cursor-not-allowed"
                              : "text-white hover:bg-white/10 hover:scale-105"
                      }`}
                      onClick={() => !isPast && handleDateSelect(day)}
                    >
                      {format(day, "d")}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
      {/* Header Moderno */}
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

          <h1 className="text-xl font-bold text-white">
            {format(selectedDate, "MMMM yyyy", { locale: ptBR }).toUpperCase()}
          </h1>

          <Button
            variant="ghost"
            size="icon"
            className="w-12 h-12 rounded-full bg-white/10 text-white hover:bg-white/20 transition-all duration-200"
            onClick={() => setShowFullCalendar(true)}
          >
            <CalendarIcon className="h-6 w-6" />
          </Button>
        </div>
      </div>

      {/* Seleção de Datas Moderna */}
      <div className="px-6 py-8">
        <div className="flex space-x-3 overflow-x-auto pb-4">
          {getNextWeekDates().map((date, index) => (
            <div
              key={index}
              className={`flex flex-col items-center min-w-[70px] cursor-pointer transition-all duration-200 ${
                isSameDay(date, selectedDate)
                  ? "text-blue-400"
                  : "text-gray-400"
              }`}
              onClick={() => handleDateSelect(date)}
            >
              <span className="text-xs font-medium mb-2 text-gray-500">
                {format(date, "EEE", { locale: ptBR })
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
                  )
                  .substring(0, 3)
                  .toUpperCase()}
              </span>
              <div
                className={`w-14 h-14 rounded-2xl flex items-center justify-center text-lg font-bold transition-all duration-200 ${
                  isSameDay(date, selectedDate)
                    ? "bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/25 scale-110"
                    : "bg-white/5 text-white hover:bg-white/10 hover:scale-105"
                }`}
              >
                {format(date, "d")}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="px-6 space-y-8">
        {/* Card do Serviço Moderno */}
        <div className="bg-gradient-to-r from-white/5 to-white/10 backdrop-blur-sm rounded-3xl p-6 border border-white/10 shadow-xl">
          <div className="flex items-center justify-between">
            <div className="space-y-3">
              <h3 className="text-2xl font-bold text-white">
                {selectedService.name}
              </h3>
              <div className="flex items-center gap-3">
                <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30 px-3 py-1 rounded-full">
                  <Clock className="h-4 w-4 mr-2" />
                  {selectedService.duration || 30} min
                </Badge>
              </div>
            </div>
            <div className="text-right">
              <p className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                {new Intl.NumberFormat("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                }).format(Number(selectedService.price))}
              </p>
            </div>
          </div>
        </div>

        {/* Horários Disponíveis - Só aparece após seleção de data */}
        {selectedDate && (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-2xl font-bold text-white mb-2">
                Horários disponíveis
              </h3>
              <p className="text-gray-400">
                {format(selectedDate, "EEEE, dd 'de' MMMM", { locale: ptBR })
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

            <div className="grid grid-cols-3 gap-4">
              {availableTimes.map((time) => {
                const isAvailable = isTimeAvailable(time);
                const isSelected = selectedTime === time;

                return (
                  <Button
                    key={time}
                    variant={isSelected ? "default" : "outline"}
                    disabled={!isAvailable}
                    className={`h-16 rounded-2xl text-lg font-semibold transition-all duration-200 ${
                      isSelected
                        ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white border-0 shadow-lg shadow-blue-500/25 scale-105"
                        : isAvailable
                          ? "bg-white/5 text-white border-white/20 hover:bg-white/10 hover:scale-105 hover:border-white/40 cursor-pointer"
                          : "bg-gray-800/50 text-gray-500 border-gray-600/30 cursor-not-allowed opacity-60"
                    }`}
                    onClick={() => handleTimeSelect(time)}
                  >
                    {time}
                  </Button>
                );
              })}
            </div>
          </div>
        )}

        {/* Botão de Confirmação Moderno */}
        {selectedDate && selectedTime && (
          <div className="pt-8 pb-24">
            {/* Espaçamento para o botão flutuante */}
          </div>
        )}
      </div>

      {/* Botão Flutuante de Confirmação */}
      {selectedDate && selectedTime && (
        <div className="fixed bottom-6 left-6 right-6 z-50">
          <Button
            className="w-full h-16 text-xl font-bold rounded-2xl bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-2xl shadow-blue-500/25 transition-all duration-200 hover:scale-105 border-2 border-white/20"
            onClick={handleConfirmBooking}
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="flex items-center gap-3">
                <div className="animate-spin rounded-full h-6 w-6 border-2 border-white border-t-transparent"></div>
                Confirmando...
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Check className="h-6 w-6" />
                Confirmar Agendamento
              </div>
            )}
          </Button>
        </div>
      )}
    </div>
  );
}
