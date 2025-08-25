import { useState, useEffect, useCallback } from "react";
import { startOfWeek, endOfWeek, format, addDays, subDays } from "date-fns";
import { ptBR } from "date-fns/locale";

interface Booking {
  id: string;
  date: string;
  service: {
    id: string;
    name: string;
    duration: number;
    price: number;
  };
  user: {
    id: string;
    name: string;
    email: string;
  };
}

interface CalendarData {
  bookings: Booking[];
  services: any[];
  dateRange: {
    start: string;
    end: string;
  };
}

interface UseCalendarDataProps {
  barbershopId: string;
  selectedDate: Date;
}

export function useCalendarData({
  barbershopId,
  selectedDate,
}: UseCalendarDataProps) {
  const [calendarData, setCalendarData] = useState<CalendarData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCalendarData = useCallback(
    async (date: Date) => {
      if (!barbershopId) {
        console.log("❌ Sem ID da barbearia");
        return;
      }

      console.log("🔄 Buscando dados do calendário para:", date);
      setLoading(true);
      setError(null);

      try {
        const formattedDate = format(date, "yyyy-MM-dd");
        const url = `/api/bookings/calendar?date=${formattedDate}&barbershopId=${barbershopId}`;
        console.log("🌐 URL da API:", url);

        const response = await fetch(url);

        if (!response.ok) {
          throw new Error("Erro ao buscar dados do calendário");
        }

        const data = await response.json();
        console.log("✅ Dados recebidos:", data);
        setCalendarData(data);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Erro desconhecido";
        console.error("❌ Erro ao buscar dados do calendário:", errorMessage);
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    },
    [barbershopId],
  );

  // Buscar dados quando a data selecionada mudar
  useEffect(() => {
    fetchCalendarData(selectedDate);
  }, [selectedDate, fetchCalendarData]);

  // Funções auxiliares para navegação
  const getWeekDays = () => {
    const start = startOfWeek(selectedDate, { weekStartsOn: 0 });
    const days = [];

    for (let i = 0; i < 7; i++) {
      const day = addDays(start, i);
      days.push({
        date: day,
        dayName: format(day, "EEE", { locale: ptBR }).toUpperCase(),
        dayNumber: format(day, "d"),
        isToday: format(day, "yyyy-MM-dd") === format(new Date(), "yyyy-MM-dd"),
        isSelected:
          format(day, "yyyy-MM-dd") === format(selectedDate, "yyyy-MM-dd"),
      });
    }

    return days;
  };

  const getMonthName = (date: Date) => {
    return format(date, "MMMM yyyy", { locale: ptBR });
  };

  const goToPreviousWeek = () => {
    const newDate = subDays(selectedDate, 7);
    return newDate;
  };

  const goToNextWeek = () => {
    const newDate = addDays(selectedDate, 7);
    return newDate;
  };

  const goToToday = () => {
    return new Date();
  };

  // Agrupar agendamentos por data e hora
  const getBookingsByDate = (date: Date) => {
    if (!calendarData?.bookings) return [];

    const formattedDate = format(date, "yyyy-MM-dd");
    console.log("🔍 Buscando agendamentos para data:", formattedDate);

    const filteredBookings = calendarData.bookings.filter((booking) => {
      const bookingDate = new Date(booking.date);
      const bookingFormattedDate = format(bookingDate, "yyyy-MM-dd");

      console.log("📅 Comparando:", {
        selected: formattedDate,
        booking: bookingFormattedDate,
        bookingFull: booking.date,
        isMatch: bookingFormattedDate === formattedDate,
      });

      return bookingFormattedDate === formattedDate;
    });

    console.log("✅ Agendamentos filtrados:", filteredBookings.length);
    return filteredBookings;
  };

  // Calcular posição e altura dos agendamentos
  const getTimePosition = (date: Date) => {
    const hour = date.getHours();
    const minute = date.getMinutes();
    const totalMinutes = (hour - 9) * 60 + minute;
    return (totalMinutes / 15) * 20; // 20px por intervalo de 15min
  };

  const getTimeHeight = (duration: number) => {
    return (duration / 15) * 20; // 20px por intervalo de 15min
  };

  // Obter horário atual para linha vermelha
  const getCurrentTimePosition = () => {
    const now = new Date();
    const hour = now.getHours();
    const minute = now.getMinutes();
    const totalMinutes = (hour - 9) * 60 + minute;
    return (totalMinutes / 15) * 20;
  };

  const isCurrentTimeVisible = () => {
    const now = new Date();
    const hour = now.getHours();
    return hour >= 9 && hour <= 19;
  };

  return {
    calendarData,
    loading,
    error,
    fetchCalendarData,
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
  };
}
