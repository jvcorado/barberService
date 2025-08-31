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
  const [selectedDate, setSelectedDate] = useState<Date>(
    addDaysFn(new Date(), 1),
  );
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [availableTimes, setAvailableTimes] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingBarbershop, setIsLoadingBarbershop] = useState(true);
  const [showFullCalendar, setShowFullCalendar] = useState(false);

  // Horários disponíveis (8h às 18h)
  const timeSlots = [
    "08:00",
    "08:10",
    "08:20",
    "08:30",
    "08:40",
    "08:50",
    "09:00",
    "09:10",
    "09:20",
    "09:30",
    "09:40",
    "09:50",
    "10:00",
    "10:10",
    "10:20",
    "10:30",
    "10:40",
    "10:50",
    "11:00",
    "11:10",
    "11:20",
    "11:30",
    "11:40",
    "11:50",
    "12:00",
    "12:10",
    "12:20",
    "12:30",
    "12:40",
    "12:50",
    "13:00",
    "13:10",
    "13:20",
    "13:30",
    "13:40",
    "13:50",
    "14:00",
    "14:10",
    "14:20",
    "14:30",
    "14:40",
    "14:50",
    "15:00",
    "15:10",
    "15:20",
    "15:30",
    "15:40",
    "15:50",
    "16:00",
    "16:10",
    "16:20",
    "16:30",
    "16:40",
    "16:50",
    "17:00",
    "17:10",
    "17:20",
    "17:30",
    "17:40",
    "17:50",
  ];

  // Datas para a próxima semana
  const getNextWeekDates = () => {
    const dates = [];
    const today = new Date();
    for (let i = 1; i <= 7; i++) {
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

  const generateAvailableTimes = () => {
    if (!selectedDate) return;

    const today = new Date();
    const isToday = isSameDay(selectedDate, today);
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();

    let times = [...timeSlots];

    if (isToday) {
      times = times.filter((time) => {
        const [hour, minute] = time.split(":").map(Number);
        return (
          hour > currentHour ||
          (hour === currentHour && minute > currentMinute + 30)
        );
      });
    }

    setAvailableTimes(times);
    setSelectedTime("");
  };

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    setShowFullCalendar(false);
  };

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
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
        <div className="sticky top-0 z-10 bg-black/80 backdrop-blur-md border-b border-white/10">
          <div className="flex items-center justify-between p-6">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowFullCalendar(false)}
              className="w-12 h-12 rounded-full bg-white/10 text-white hover:bg-white/20 transition-all"
            >
              <X className="h-6 w-6" />
            </Button>

            <h1 className="text-xl font-bold text-white">
              Calendário Completo
            </h1>

            <div className="w-12"></div>
          </div>
        </div>

        {/* Calendário Completo */}
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
      <div className="sticky top-0 z-10 bg-black/80 backdrop-blur-md border-b border-white/10">
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
                {selectedService.description && (
                  <p className="text-gray-300 text-sm max-w-xs">
                    {selectedService.description}
                  </p>
                )}
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
                {format(selectedDate, "EEEE, dd 'de' MMMM", { locale: ptBR })}
              </p>
            </div>

            <div className="grid grid-cols-3 gap-4">
              {availableTimes.map((time) => (
                <Button
                  key={time}
                  variant={selectedTime === time ? "default" : "outline"}
                  className={`h-16 rounded-2xl text-lg font-semibold transition-all duration-200 ${
                    selectedTime === time
                      ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white border-0 shadow-lg shadow-blue-500/25 scale-105"
                      : "bg-white/5 text-white border-white/20 hover:bg-white/10 hover:scale-105 hover:border-white/40"
                  }`}
                  onClick={() => handleTimeSelect(time)}
                >
                  {time}
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* Botão de Confirmação Moderno */}
        {selectedDate && selectedTime && (
          <div className="pt-8 pb-8">
            <Button
              className="w-full h-16 text-xl font-bold rounded-2xl bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-xl shadow-blue-500/25 transition-all duration-200 hover:scale-105"
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
    </div>
  );
}
