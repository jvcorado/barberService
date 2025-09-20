"use client";

import { useState, useCallback, useEffect } from "react";
import { format, addDays, subDays, startOfWeek } from "date-fns";
import { ptBR } from "date-fns/locale";
import { ChevronLeft, ChevronRight, Calendar } from "lucide-react";
import { useBarbershopColors } from "@/hooks/use-barbershop-colors";
import { useCalendarData } from "../hooks/use-calendar-data";
import { useDate } from "../contexts/date-context";
import { Button } from "@/components/ui/button";

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
  const { selectedDate, setSelectedDate } = useDate();
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
        dayName: format(day, "EEE", { locale: ptBR }).toUpperCase(),
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
    <div className="flex flex-col h-full overflow-hidden relative">
      {/* Fixed Header with Date and Navigation */}
      <div className="bg-transparent border-b border-white/10 px-4 pb-4">
        <div className="flex items-center justify-between">
          {/* Date Display */}
          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-white" />
            <div>
              <h2 className="text-lg font-semibold text-white capitalize">
                {format(selectedDate, "dd 'de' MMMM", { locale: ptBR })}
              </h2>
              <p className="text-sm text-white capitalize">
                {format(selectedDate, "EEEE", { locale: ptBR })}
              </p>
            </div>
          </div>

          {/* Navigation Buttons */}
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handlePreviousDay}
              className="h-8 w-8 p-0"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={goToToday}
              className="text-xs px-3 h-8"
            >
              Hoje
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={handleNextDay}
              className="h-8 w-8 p-0"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="flex-1 overflow-hidden">
        {isMobile ? (
          // Mobile: Swipeable single day view
          <div
            className="flex-1 overflow-hidden w-full"
            style={{ touchAction: "pan-y" }}
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
                      className="flex border border-white/10 min-h-[60px]"
                    >
                      {/* Time column */}
                      <div className="w-16 flex-shrink-0 p-2 text-xs text-slate-500 text-right border-r border-white/10">
                        {time}
                      </div>

                      {/* Day column */}
                      <div
                        className={`flex-1 relative transition-colors cursor-pointer min-h-[44px] ${
                          bookingAtThisTime ? "" : ""
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
                            <div className="font-medium text-slate-900 text-sm">
                              {bookingAtThisTime.user.name}
                            </div>
                            <div className="text-slate-600 text-xs">
                              {bookingAtThisTime.service.name}
                            </div>
                            <div className="text-slate-500 text-xs">
                              {format(
                                new Date(bookingAtThisTime.date),
                                "HH:mm",
                              )}{" "}
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
          <div className="flex-1 overflow-auto">
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
                    className="flex border-b border-white/10 min-h-[60px]"
                  >
                    {/* Time column */}
                    <div className="w-16 flex-shrink-0 p-2 text-xs text-slate-500 text-right border-r border-white/10">
                      {time}
                    </div>

                    {/* Day column */}
                    <div
                      className={`flex-1 relative transition-colors cursor-pointer min-h-[44px] ${
                        bookingAtThisTime ? "" : ""
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
                          <div className="font-medium text-slate-900 text-sm">
                            {bookingAtThisTime.user.name}
                          </div>
                          <div className="text-slate-600 text-xs">
                            {bookingAtThisTime.service.name}
                          </div>
                          <div className="text-slate-500 text-xs">
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
        )}
      </div>

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
