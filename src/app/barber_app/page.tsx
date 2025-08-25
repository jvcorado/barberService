"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import BarberAppLayout from "./components/barber-app-layout";
import { Button } from "@/components/ui/button";
import { SafeImage } from "@/components/safe-image";
import { usePWA } from "@/hooks/use-pwa";
import { PWAToast } from "@/components/pwa-toast";
import { useBarbershopColors } from "@/hooks/use-barbershop-colors";
import { useCalendarData } from "./hooks/use-calendar-data";
import { format, addDays, subDays } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  Star,
  ThumbsUp,
  MapPin,
  Phone,
  MessageCircle,
  Clock,
  ChevronRight,
  Download,
  Wifi,
  WifiOff,
  Plus,
  Filter,
  MoreVertical,
  Bell,
  ChevronDown,
  ChevronLeft,
  MessageCircle as ChatIcon,
  Heart,
  CheckCircle,
  Sparkles,
  Calendar,
  Users,
  FileText,
  Zap,
  ShoppingBag,
  ChevronsUpDown,
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
  const {
    isInstallable,
    isInstalled,
    isOnline,
    installApp,
    requestNotificationPermission,
    sendNotification,
  } = usePWA();
  const { colors } = useBarbershopColors();
  const [barbershop, setBarbershop] = useState<Barbershop | null>(null);
  const [barbers, setBarbers] = useState<Barber[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showCalendar, setShowCalendar] = useState(false);

  // Hook do calendário
  const {
    calendarData,
    loading: calendarLoading,
    error: calendarError,
    getWeekDays,
    getMonthName,
    goToPreviousWeek,
    goToNextWeek,
    goToToday,
    getBookingsByDate,
    getTimePosition,
    getTimeHeight,
    getCurrentTimePosition,
    isCurrentTimeVisible,
  } = useCalendarData({
    barbershopId: barbershop?.id || "",
    selectedDate,
  });

  // Debug: verificar dados do calendário
  useEffect(() => {
    console.log("🏪 Barbearia:", barbershop);
    console.log("📅 Dados do calendário:", calendarData);
    console.log(
      "📅 Agendamentos para data selecionada:",
      getBookingsByDate(selectedDate),
    );
  }, [barbershop, calendarData, selectedDate, getBookingsByDate]);

  // Horários de trabalho (9h às 19h)
  const workingHours = Array.from({ length: 41 }, (_, i) => {
    const hour = Math.floor(i / 4) + 9;
    const minute = (i % 4) * 15;
    return `${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`;
  });

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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "favorite":
        return <Heart className="h-3 w-3 text-red-500" />;
      case "completed":
        return <CheckCircle className="h-3 w-3 text-green-500" />;
      case "premium":
        return <Sparkles className="h-3 w-3 text-purple-500" />;
      default:
        return <ChatIcon className="h-3 w-3 text-blue-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "favorite":
        return "bg-pink-200 border-pink-300";
      case "completed":
        return "bg-green-200 border-green-300";
      case "premium":
        return "bg-purple-200 border-purple-300";
      default:
        return "bg-blue-200 border-blue-300";
    }
  };

  // Funções de navegação do calendário
  const handlePreviousWeek = () => {
    const newDate = goToPreviousWeek();
    setSelectedDate(newDate);
  };

  const handleNextWeek = () => {
    const newDate = goToNextWeek();
    setSelectedDate(newDate);
  };

  const handleToday = () => {
    const today = goToToday();
    setSelectedDate(today);
  };

  const selectDate = (date: Date) => {
    console.log("📅 Selecionando nova data:", date);
    setSelectedDate(date);
    setShowCalendar(false);
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
        className="min-h-screen"
        style={{
          backgroundColor: colors.backgroundColor || "#f9fafb",
          color: colors.textColor || "#111827",
        }}
      >
        {/* Header */}
        <div
          className="border-b px-4 py-3"
          style={{
            backgroundColor: colors.secondaryColor,
          }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div
                className="text-sm font-medium"
                style={{ color: colors.textColor }}
              >
                {new Date().toLocaleTimeString("pt-BR", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </div>
              <Bell className="h-5 w-5" style={{ color: colors.textColor }} />
            </div>

            <div className="flex items-center gap-2">
              <div className="text-center relative">
                <button
                  onClick={() => setShowCalendar(!showCalendar)}
                  className="flex items-center gap-1"
                >
                  <span
                    className="font-semibold"
                    style={{ color: colors.primaryColor }}
                  >
                    {formatSelectedDate()}
                  </span>
                  <ChevronDown
                    className="h-4 w-4"
                    style={{ color: colors.textColor }}
                  />
                </button>
                <div className="text-sm" style={{ color: colors.textColor }}>
                  10:00-19:00
                </div>

                {/* Calendário Dropdown */}
                {showCalendar && (
                  <div
                    className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 bg-white border rounded-lg shadow-lg z-50 p-4 min-w-[280px]"
                    style={{ borderColor: colors.primaryColor + "20" }}
                  >
                    {/* Header do Calendário */}
                    <div className="flex items-center justify-between mb-4">
                      <button
                        onClick={handlePreviousWeek}
                        className="p-1 hover:bg-gray-100 rounded"
                      >
                        <ChevronLeft
                          className="h-4 w-4"
                          style={{ color: colors.textColor }}
                        />
                      </button>
                      <div
                        className="font-medium"
                        style={{ color: colors.primaryColor }}
                      >
                        {getMonthName(selectedDate)}
                      </div>
                      <button
                        onClick={handleNextWeek}
                        className="p-1 hover:bg-gray-100 rounded"
                      >
                        <ChevronRight
                          className="h-4 w-4"
                          style={{ color: colors.textColor }}
                        />
                      </button>
                    </div>

                    {/* Botão Hoje */}
                    <div className="mb-4">
                      <button
                        onClick={handleToday}
                        className="w-full py-2 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                      >
                        Hoje
                      </button>
                    </div>

                    {/* Dias da Semana */}
                    <div className="grid grid-cols-7 gap-1 mb-2">
                      {["DOM", "SEG", "TER", "QUA", "QUI", "SEX", "SAB"].map(
                        (day) => (
                          <div
                            key={day}
                            className="text-xs font-medium text-center py-1"
                            style={{ color: colors.textColor }}
                          >
                            {day}
                          </div>
                        ),
                      )}
                    </div>

                    {/* Dias da Semana */}
                    <div className="grid grid-cols-7 gap-1">
                      {getWeekDays().map((day: any, index: number) => (
                        <button
                          key={index}
                          onClick={() => selectDate(day.date)}
                          className={`h-8 w-8 rounded-full text-sm font-medium transition-colors ${
                            day.isToday
                              ? "bg-red-500 text-white"
                              : day.isSelected
                                ? "bg-blue-500 text-white"
                                : "hover:bg-gray-100"
                          }`}
                          style={{
                            color:
                              day.isToday || day.isSelected
                                ? "white"
                                : colors.textColor,
                          }}
                        >
                          {day.dayNumber}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Filter className="h-5 w-5" style={{ color: colors.textColor }} />
              <MoreVertical
                className="h-5 w-5"
                style={{ color: colors.textColor }}
              />
              {/* Botão de Debug */}
              <Button
                size="sm"
                variant="outline"
                onClick={async () => {
                  try {
                    const response = await fetch("/api/debug/bookings");
                    const data = await response.json();
                    console.log("🔍 Debug completo:", data);
                    alert(
                      `Debug: ${data.debug.totalBookings} agendamentos encontrados`,
                    );
                  } catch (error) {
                    console.error("Erro no debug:", error);
                    alert("Erro ao fazer debug");
                  }
                }}
                className="text-xs"
              >
                Debug
              </Button>
            </div>
          </div>
        </div>

        {/* Seletor de Data */}
        <div
          className="px-4 py-3 border-b"
          style={{
            backgroundColor: colors.secondaryColor,
          }}
        >
          <div className="flex justify-between items-center">
            {getWeekDays().map((day: any, index: number) => (
              <div
                key={index}
                className="text-center cursor-pointer group"
                onClick={() => selectDate(day.date)}
              >
                <div
                  className="text-xs font-medium mb-1 transition-colors"
                  style={{
                    color: day.isSelected
                      ? colors.primaryColor
                      : colors.textColor,
                  }}
                >
                  {day.dayName}
                </div>
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-200 hover:scale-110 ${
                    day.isToday
                      ? "bg-red-500 text-white shadow-lg"
                      : day.isSelected
                        ? "bg-blue-500 text-white shadow-lg"
                        : "hover:bg-gray-100 hover:shadow-md"
                  }`}
                  style={{
                    color:
                      day.isToday || day.isSelected
                        ? "white"
                        : colors.textColor,
                  }}
                >
                  {day.dayNumber}
                </div>
                {day.isSelected && (
                  <div
                    className="w-2 h-2 rounded-full mx-auto mt-1"
                    style={{ backgroundColor: colors.primaryColor }}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Calendário de Agendamentos */}
        <div className="flex-1 relative overflow-x-auto">
          <div className="min-w-max">
            {/* Cabeçalho dos Barbeiros */}
            <div
              className="flex border-b"
              style={{ borderColor: colors.primaryColor + "20" }}
            >
              <div className="w-20 flex-shrink-0"></div>
              {barbers.map((barber) => (
                <div
                  key={barber.id}
                  className="w-48 flex-shrink-0 p-3 border-l text-center"
                  style={{ borderColor: colors.primaryColor + "20" }}
                >
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-12 h-12 rounded-full overflow-hidden">
                      <SafeImage
                        src={barber.imageUrl || "/logo.png"}
                        alt={barber.name}
                        width={48}
                        height={48}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <div
                        className="font-medium"
                        style={{ color: colors.primaryColor }}
                      >
                        {barber.name}
                      </div>
                      <div
                        className="text-xs"
                        style={{ color: colors.textColor }}
                      >
                        {barber.workingHours}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Grade de Horários */}
            <div className="relative">
              {/* Linha do tempo atual */}
              {isCurrentTimeVisible() && (
                <div
                  className="absolute left-0 right-0 z-10 flex items-center"
                  style={{ top: getCurrentTimePosition() }}
                >
                  <div className="w-20 flex-shrink-0 flex items-center justify-center">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  </div>
                  <div className="flex-1 h-px bg-red-500"></div>
                </div>
              )}

              {/* Horários e Agendamentos */}
              {workingHours.map((time, index) => (
                <div
                  key={time}
                  className="flex border-b relative"
                  style={{ borderColor: colors.primaryColor + "10" }}
                >
                  {/* Coluna de Horários */}
                  <div className="w-20 flex-shrink-0 p-2 text-xs font-medium flex items-center justify-center">
                    {index % 4 === 0 ? (
                      <span className="font-semibold">{time}</span>
                    ) : (
                      <span className="text-gray-400">
                        {time.split(":")[1]}
                      </span>
                    )}
                  </div>

                  {/* Colunas dos Barbeiros */}
                  {barbers.map((barber) => (
                    <div
                      key={barber.id}
                      className="w-48 flex-shrink-0 border-l relative"
                      style={{ borderColor: colors.primaryColor + "10" }}
                    >
                      {/* Agendamentos para este barbeiro neste horário */}
                      {(() => {
                        const bookingsForDate = getBookingsByDate(selectedDate);

                        if (bookingsForDate.length === 0) {
                          return null;
                        }

                        // Renderizar agendamentos que devem aparecer neste horário
                        return bookingsForDate
                          .filter((booking: any) => {
                            const bookingDate = new Date(booking.date);
                            const [currentHour, currentMinute] = time
                              .split(":")
                              .map(Number);
                            const currentTime =
                              currentHour * 60 + currentMinute;
                            const bookingStartTime =
                              bookingDate.getHours() * 60 +
                              bookingDate.getMinutes();
                            const bookingEndTime =
                              bookingStartTime +
                              (booking.service.duration || 60);

                            // Verifica se o horário atual está dentro do agendamento
                            return (
                              currentTime >= bookingStartTime &&
                              currentTime < bookingEndTime
                            );
                          })
                          .map((booking: any) => {
                            const bookingDate = new Date(booking.date);
                            const startTime = format(bookingDate, "HH:mm");
                            const endTime = format(
                              new Date(
                                bookingDate.getTime() +
                                  (booking.service.duration || 60) * 60000,
                              ),
                              "HH:mm",
                            );

                            // Calcular posição baseada na data real do agendamento
                            const topPosition = getTimePosition(bookingDate);
                            const height = getTimeHeight(
                              booking.service.duration || 60,
                            );

                            console.log("🎯 Renderizando agendamento:", {
                              id: booking.id,
                              user: booking.user.name,
                              service: booking.service.name,
                              startTime,
                              endTime,
                              date: booking.date,
                              duration: booking.service.duration,
                              position: {
                                top: topPosition,
                                height: height,
                              },
                              timeSlot: time,
                            });

                            return (
                              <div
                                key={booking.id}
                                className="absolute left-1 right-1 rounded-lg border p-2 text-xs bg-blue-200 border-blue-300 z-10"
                                style={{
                                  top: topPosition,
                                  height: height,
                                  minHeight: "40px", // Altura mínima para agendamentos curtos
                                }}
                              >
                                <div className="flex items-start justify-between h-full">
                                  <div className="flex-1">
                                    <div
                                      className="font-medium text-xs"
                                      style={{ color: colors.textColor }}
                                    >
                                      {booking.user.name}
                                    </div>
                                    <div
                                      className="text-xs opacity-75"
                                      style={{ color: colors.textColor }}
                                    >
                                      {booking.service.name}
                                    </div>
                                    <div
                                      className="text-xs opacity-75"
                                      style={{ color: colors.textColor }}
                                    >
                                      {startTime} - {endTime}
                                    </div>
                                  </div>
                                  <div className="ml-1">
                                    {getStatusIcon("confirmed")}
                                  </div>
                                </div>
                              </div>
                            );
                          });
                      })()}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Botão de Ação Flutuante */}
        <div className="fixed bottom-6 right-6 z-20">
          <Button
            className="w-14 h-14 rounded-full shadow-lg"
            style={{
              backgroundColor: colors.primaryColor,
              color: colors.secondaryColor,
            }}
            onClick={() => {
              // Ação para adicionar novo agendamento
              console.log("Adicionar agendamento");
            }}
          >
            <Plus className="h-6 w-6" />
          </Button>
        </div>

        {/* Navegação Inferior */}
        <div
          className="fixed bottom-0 left-0 right-0 border-t p-3"
          style={{
            backgroundColor: colors.secondaryColor,
            borderColor: colors.primaryColor + "20",
          }}
        >
          <div className="flex justify-around">
            <div className="flex flex-col items-center">
              <Calendar
                className="h-6 w-6"
                style={{ color: colors.primaryColor }}
              />
              <span
                className="text-xs mt-1"
                style={{ color: colors.primaryColor }}
              >
                Agenda
              </span>
            </div>
            <div className="flex flex-col items-center">
              <Users className="h-6 w-6" style={{ color: colors.textColor }} />
              <span
                className="text-xs mt-1"
                style={{ color: colors.textColor }}
              >
                Clientes
              </span>
            </div>
            <div className="flex flex-col items-center">
              <FileText
                className="h-6 w-6"
                style={{ color: colors.textColor }}
              />
              <span
                className="text-xs mt-1"
                style={{ color: colors.textColor }}
              >
                Faturas
              </span>
            </div>
            <div className="flex flex-col items-center">
              <Zap className="h-6 w-6" style={{ color: colors.textColor }} />
              <span
                className="text-xs mt-1"
                style={{ color: colors.textColor }}
              >
                Serviços
              </span>
            </div>
            <div className="flex flex-col items-center">
              <ShoppingBag
                className="h-6 w-6"
                style={{ color: colors.textColor }}
              />
              <span
                className="text-xs mt-1"
                style={{ color: colors.textColor }}
              >
                Loja
              </span>
            </div>
          </div>
        </div>

        {/* Espaço para a navegação inferior */}
        <div className="h-20"></div>
      </div>

      {/* Toast PWA */}
      {calendarError && (
        <div className="fixed top-4 right-4 bg-red-500 text-white px-4 py-2 rounded-lg z-50">
          {calendarError}
        </div>
      )}
    </BarberAppLayout>
  );
}
