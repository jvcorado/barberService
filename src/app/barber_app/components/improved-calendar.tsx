"use client";

import { useState, useCallback, useEffect } from "react";
import { format, addDays, subDays, startOfWeek } from "date-fns";
import { ptBR } from "date-fns/locale";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SafeImage } from "@/components/safe-image";
import { useBarbershopColors } from "@/hooks/use-barbershop-colors";
import { useCalendarData } from "../hooks/use-calendar-data";

interface Barber {
  id: string;
  name: string;
  imageUrl?: string;
  workingHours: string;
}

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

interface ImprovedCalendarProps {
  barbershopId: string;
  barbers: Barber[];
  onAddBooking?: () => void;
}

export default function ImprovedCalendar({
  barbershopId,
  barbers,
  onAddBooking,
}: ImprovedCalendarProps) {
  const { colors } = useBarbershopColors();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isMobile, setIsMobile] = useState(false);
  const [currentDayIndex, setCurrentDayIndex] = useState(0);

  const {
    calendarData,
    loading: calendarLoading,
    getWeekDays,
    getMonthName,
    goToPreviousWeek,
    goToNextWeek,
    getBookingsByDate,
  } = useCalendarData({
    barbershopId,
    selectedDate,
  });

  // Generate time slots from 8:00 to 20:00 with 30min intervals
  const timeSlots = Array.from({ length: 25 }, (_, i) => {
    const hour = Math.floor(i / 2) + 8;
    const minute = i % 2 === 0 ? 0 : 30;
    return `${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`;
  });

  const handlePreviousWeek = useCallback(() => {
    const newDate = goToPreviousWeek();
    setSelectedDate(newDate);
  }, [goToPreviousWeek]);

  const handleNextWeek = useCallback(() => {
    const newDate = goToNextWeek();
    setSelectedDate(newDate);
  }, [goToNextWeek]);

  const handlePreviousDay = useCallback(() => {
    const newDate = subDays(selectedDate, 1);
    setSelectedDate(newDate);
  }, [selectedDate]);

  const handleNextDay = useCallback(() => {
    const newDate = addDays(selectedDate, 1);
    setSelectedDate(newDate);
  }, [selectedDate]);

  const goToToday = useCallback(() => {
    setSelectedDate(new Date());
  }, []);

  const selectDay = useCallback((date: Date) => {
    setSelectedDate(date);
  }, []);

  // Mobile detection
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Get days for mobile carousel (7 days centered on selected date)
  const getMobileDays = () => {
    const days = [];
    for (let i = -3; i <= 3; i++) {
      const day = addDays(selectedDate, i);
      days.push({
        date: day,
        dayName: format(day, "EEE", { locale: ptBR })
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
          .toUpperCase(),
        dayNumber: format(day, "d"),
        isToday: format(day, "yyyy-MM-dd") === format(new Date(), "yyyy-MM-dd"),
        isSelected: i === 0,
        index: i + 3,
      });
    }
    return days;
  };

  // Handle swipe navigation
  const handleSwipeLeft = () => {
    const nextDate = addDays(selectedDate, 1);
    setSelectedDate(nextDate);
  };

  const handleSwipeRight = () => {
    const prevDate = subDays(selectedDate, 1);
    setSelectedDate(prevDate);
  };

  return (
    <div className="flex flex-col h-full bg-white overflow-hidden relative">
      {/* Header */}
      <div className="flex flex-col gap-4 bg-white pt-6 pb-4 px-6 border-b border-gray-100 fixed top-0 left-0 right-0 z-30">
        {isMobile ? (
          // Mobile Header - Simple and clean like clients page
          <div className="flex flex-col gap-4">
            <div className="text-center">
              <h1 className="text-2xl font-semibold text-gray-900">
                {format(selectedDate, "dd/MM", { locale: ptBR })}
              </h1>
              <div className="text-sm text-gray-600">
                {format(selectedDate, "EEEE", { locale: ptBR })
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
              </div>
              <div className="text-xs text-gray-500 mt-1">
                ← Deslize para navegar →
              </div>
            </div>
          </div>
        ) : (
          // Desktop Header - Clean like clients page
          <div className="flex flex-col gap-4">
            <div className="text-center">
              <h1 className="text-2xl font-semibold text-gray-900">
                {getMonthName(selectedDate)}
              </h1>
              <div className="text-sm text-gray-600">
                {format(selectedDate, "dd/MM", { locale: ptBR })} -{" "}
                {format(selectedDate, "EEEE", { locale: ptBR })
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
              </div>
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-center gap-2">
              <button
                onClick={handlePreviousDay}
                className="px-3 py-1 text-sm bg-gray-500 hover:bg-gray-400 text-white rounded-lg transition-colors"
                title="Dia anterior"
              >
                ← Anterior
              </button>
              <button
                onClick={goToToday}
                className="px-3 py-1 text-sm bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
              >
                Hoje
              </button>
              <button
                onClick={handleNextDay}
                className="px-3 py-1 text-sm bg-gray-500 hover:bg-gray-400 text-white rounded-lg transition-colors"
                title="Próximo dia"
              >
                Próximo →
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Calendar Grid */}
      {isMobile ? (
        // Mobile: Swipeable single day view
        <div
          className="flex-1 overflow-hidden w-full"
          style={{ touchAction: "pan-y", marginTop: "140px" }}
          onTouchStart={(e) => {
            const touch = e.touches[0];
            e.currentTarget.setAttribute(
              "data-start-x",
              touch.clientX.toString(),
            );
            e.currentTarget.setAttribute(
              "data-start-y",
              touch.clientY.toString(),
            );
          }}
          onTouchMove={(e) => {
            // Prevent horizontal scrolling by blocking horizontal pan gestures
            const startX = parseFloat(
              e.currentTarget.getAttribute("data-start-x") || "0",
            );
            const startY = parseFloat(
              e.currentTarget.getAttribute("data-start-y") || "0",
            );
            const currentX = e.touches[0].clientX;
            const currentY = e.touches[0].clientY;
            const diffX = Math.abs(currentX - startX);
            const diffY = Math.abs(currentY - startY);

            // If horizontal movement is greater than vertical, prevent default to avoid scroll
            if (diffX > diffY && diffX > 10) {
              e.preventDefault();
            }
          }}
          onTouchEnd={(e) => {
            const startX = parseFloat(
              e.currentTarget.getAttribute("data-start-x") || "0",
            );
            const endX = e.changedTouches[0].clientX;
            const diffX = startX - endX;

            if (Math.abs(diffX) > 50) {
              // Minimum swipe distance
              if (diffX > 0) {
                handleSwipeLeft(); // Swipe left = next day
              } else {
                handleSwipeRight(); // Swipe right = previous day
              }
            }
          }}
        >
          <div className="h-full overflow-y-auto overflow-x-hidden w-full">
            <div className="relative">
              {/* Time slots for selected day */}
              {timeSlots.map((time, timeIndex) => {
                const dayBookings = getBookingsByDate(selectedDate);
                const [hour, minute] = time.split(":").map(Number);
                const currentTimeInMinutes = hour * 60 + minute;

                const bookingAtThisTime = dayBookings.find(
                  (booking: Booking) => {
                    const bookingDate = new Date(booking.date);
                    const bookingStartTime =
                      bookingDate.getHours() * 60 + bookingDate.getMinutes();
                    const bookingDuration = booking.service.duration || 60;
                    const bookingEndTime = bookingStartTime + bookingDuration;
                    const slotEndTime = currentTimeInMinutes + 30;
                    const overlaps =
                      currentTimeInMinutes < bookingEndTime &&
                      slotEndTime > bookingStartTime;
                    return overlaps;
                  },
                );

                const isStartSlot =
                  bookingAtThisTime &&
                  (() => {
                    const bookingDate = new Date(bookingAtThisTime.date);
                    return (
                      bookingDate.getHours() === hour &&
                      bookingDate.getMinutes() === minute
                    );
                  })();

                return (
                  <div
                    key={time}
                    className="flex border-b border-gray-100 min-h-[60px]"
                  >
                    {/* Time column */}
                    <div className="w-16 flex-shrink-0 p-2 text-xs text-gray-500 text-right border-r border-gray-200">
                      {time}
                    </div>

                    {/* Day column */}
                    <div
                      className={`flex-1 relative transition-colors cursor-pointer min-h-[44px] ${
                        bookingAtThisTime ? "" : "hover:bg-gray-50"
                      }`}
                      onClick={() => onAddBooking && onAddBooking()}
                    >
                      {isStartSlot && (
                        <div
                          className="absolute inset-1 rounded-lg p-2 text-xs shadow-sm"
                          style={{
                            backgroundColor: "#5B9BF5" + "20",
                            borderLeft: `3px solid #5B60F5`,
                            height: `${Math.max((bookingAtThisTime.service.duration || 60) / 30, 1) * 60 - 8}px`,
                            zIndex: 10,
                          }}
                        >
                          <div className="font-medium text-gray-900 text-sm">
                            {bookingAtThisTime.user.name}
                          </div>
                          <div className="text-gray-600 text-xs">
                            {bookingAtThisTime.service.name}
                          </div>
                          <div className="text-gray-500 text-xs">
                            {format(new Date(bookingAtThisTime.date), "HH:mm")}{" "}
                            -{" "}
                            {format(
                              new Date(
                                new Date(bookingAtThisTime.date).getTime() +
                                  (bookingAtThisTime.service.duration || 60) *
                                    60000,
                              ),
                              "HH:mm",
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      ) : (
        // Desktop: Single day view like mobile (cleaner)
        <div className="flex-1 overflow-auto mt-36">
          <div className="relative">
            {/* Time slots for selected day */}
            {timeSlots.map((time, timeIndex) => {
              const dayBookings = getBookingsByDate(selectedDate);
              const [hour, minute] = time.split(":").map(Number);
              const currentTimeInMinutes = hour * 60 + minute;

              const bookingAtThisTime = dayBookings.find((booking: Booking) => {
                const bookingDate = new Date(booking.date);
                const bookingStartTime =
                  bookingDate.getHours() * 60 + bookingDate.getMinutes();
                const bookingDuration = booking.service.duration || 60;
                const bookingEndTime = bookingStartTime + bookingDuration;
                const slotEndTime = currentTimeInMinutes + 30;
                const overlaps =
                  currentTimeInMinutes < bookingEndTime &&
                  slotEndTime > bookingStartTime;
                return overlaps;
              });

              const isStartSlot =
                bookingAtThisTime &&
                (() => {
                  const bookingDate = new Date(bookingAtThisTime.date);
                  return (
                    bookingDate.getHours() === hour &&
                    bookingDate.getMinutes() === minute
                  );
                })();

              return (
                <div
                  key={time}
                  className="flex border-b border-gray-100 min-h-[60px]"
                >
                  {/* Time column */}
                  <div className="w-16 flex-shrink-0 p-2 text-xs text-gray-500 text-right border-r border-gray-200">
                    {time}
                  </div>

                  {/* Day column */}
                  <div
                    className={`flex-1 relative transition-colors cursor-pointer min-h-[44px] ${
                      bookingAtThisTime ? "" : "hover:bg-gray-50"
                    }`}
                    onClick={() => onAddBooking && onAddBooking()}
                  >
                    {isStartSlot && (
                      <div
                        className="absolute inset-1 rounded-lg p-2 text-xs shadow-sm"
                        style={{
                          backgroundColor: "#5B9BF5" + "20",
                          borderLeft: `3px solid #5B60F5`,
                          height: `${Math.max((bookingAtThisTime.service.duration || 60) / 30, 1) * 60 - 8}px`,
                          zIndex: 10,
                        }}
                      >
                        <div className="font-medium text-gray-900 text-sm">
                          {bookingAtThisTime.user.name}
                        </div>
                        <div className="text-gray-600 text-xs">
                          {bookingAtThisTime.service.name}
                        </div>
                        <div className="text-gray-500 text-xs">
                          {format(new Date(bookingAtThisTime.date), "HH:mm")} -{" "}
                          {format(
                            new Date(
                              new Date(bookingAtThisTime.date).getTime() +
                                (bookingAtThisTime.service.duration || 60) *
                                  60000,
                            ),
                            "HH:mm",
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Add Event Button */}
      {/* <div
        className={`absolute ${isMobile ? "bottom-4 right-4" : "bottom-6 right-6"}`}
      >
        <Button
          onClick={onAddBooking}
          className={`${isMobile ? "w-14 h-14" : "w-12 h-12"} rounded-full shadow-lg min-w-[44px] min-h-[44px]`}
          style={{
            backgroundColor: colors.primaryColor,
            color: "white",
          }}
        >
          <Plus className={`${isMobile ? "h-7 w-7" : "h-6 w-6"}`} />
        </Button>
      </div> */}
    </div>
  );
}
