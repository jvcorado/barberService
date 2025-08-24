"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Plus, ChevronRight } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface Appointment {
  id: string;
  code: string;
  service: string;
  client: string;
  time: string;
  duration: string;
  status: "confirmed" | "pending" | "cancelled";
  avatar?: string;
}

const mockAppointments: Appointment[] = [
  {
    id: "1",
    code: "#0012",
    service: "Haircut",
    client: "João Silva",
    time: "09:00",
    duration: "1h",
    status: "confirmed",
  },
  {
    id: "2",
    code: "#0013",
    service: "Haircut",
    client: "Pedro Santos",
    time: "12:00",
    duration: "1h",
    status: "confirmed",
  },
  {
    id: "3",
    code: "#0016",
    service: "Beard Trim",
    client: "Lincoln Ekstrom",
    time: "11:00",
    duration: "1.5h",
    status: "pending",
  },
  {
    id: "4",
    code: "#0020",
    service: "Color",
    client: "Carlos Lima",
    time: "10:00",
    duration: "2h",
    status: "pending",
  },
  {
    id: "5",
    code: "#0024",
    service: "Waxing",
    client: "Roberto Costa",
    time: "12:00",
    duration: "45min",
    status: "cancelled",
  },
  {
    id: "6",
    code: "#0027",
    service: "Color",
    client: "Miguel Oliveira",
    time: "09:00",
    duration: "2h",
    status: "confirmed",
  },
  {
    id: "7",
    code: "#0028",
    service: "Haircut",
    client: "André Pereira",
    time: "13:00",
    duration: "1h",
    status: "confirmed",
  },
  {
    id: "8",
    code: "#0030",
    service: "Waxing",
    client: "Fernando Alves",
    time: "11:00",
    duration: "45min",
    status: "cancelled",
  },
];

const timeSlots = [
  "09:00",
  "10:00",
  "11:00",
  "12:00",
  "13:00",
  "14:00",
  "15:00",
];
const days = [
  { name: "Segunda", date: "24.05" },
  { name: "Terça", date: "25.05" },
  { name: "Quarta", date: "26.05" },
  { name: "Quinta", date: "27.05" },
  { name: "Sexta", date: "28.05" },
  { name: "Sábado", date: "29.05" },
  { name: "Domingo", date: "30.05" },
];

const getStatusColor = (status: string) => {
  switch (status) {
    case "confirmed":
      return "bg-emerald-200 text-emerald-900 border-emerald-300 shadow-sm";
    case "pending":
      return "bg-amber-200 text-amber-900 border-amber-300 shadow-sm";
    case "cancelled":
      return "bg-rose-200 text-rose-900 border-rose-300 shadow-sm";
    default:
      return "bg-gray-200 text-gray-900 border-gray-300 shadow-sm";
  }
};

const getStatusText = (status: string) => {
  switch (status) {
    case "confirmed":
      return "CONFIRMADO";
    case "pending":
      return "PENDENTE";
    case "cancelled":
      return "CANCELADO";
    default:
      return "PENDENTE";
  }
};

export function CalendarView() {
  const [selectedAppointment, setSelectedAppointment] =
    useState<Appointment | null>(null);
  const [viewMode, setViewMode] = useState<"week" | "month">("week");

  const getAppointmentsForTimeSlot = (time: string, dayIndex: number) => {
    // Simulação de agendamentos distribuídos pelos dias
    const dayAppointments = mockAppointments.filter((apt, index) => {
      return apt.time === time && index % 7 === dayIndex;
    });
    return dayAppointments;
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header do Calendário */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <h2 className="text-2xl font-bold">Maio, 2024</h2>
          <div className="flex items-center bg-muted rounded-lg p-1">
            <Button
              variant={viewMode === "week" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("week")}
              className="h-8 px-3"
            >
              Semana
            </Button>
            <Button
              variant={viewMode === "month" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("month")}
              className="h-8 px-3"
            >
              Mês
            </Button>
          </div>
        </div>

        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add New
        </Button>
      </div>

      {/* Calendário - Full Height */}
      <Card className="flex-1 flex flex-col">
        <CardContent className="p-0 flex-1 flex flex-col">
          {/* Header dos dias */}
          <div className="grid grid-cols-8 border-b flex-shrink-0">
            <div className="p-3 border-r bg-muted/50"></div>
            {days.map((day, index) => (
              <div key={index} className="p-3 border-r text-center bg-muted/50">
                <div className="text-sm font-medium">{day.name}</div>
                <div className="text-xs text-muted-foreground">{day.date}</div>
              </div>
            ))}
          </div>

          {/* Grid de horários - Flexível para ocupar altura restante */}
          <div className="flex-1 grid grid-rows-[repeat(7,1fr)] grid-cols-8">
            {timeSlots.map((time, timeIndex) => (
              <>
                {/* Coluna de horário */}
                <div
                  key={`time-${time}`}
                  className="border-r bg-muted/30 flex items-center justify-center text-sm font-medium p-2"
                >
                  {time}
                </div>

                {/* Células dos dias para este horário */}
                {days.map((_, dayIndex) => (
                  <div
                    key={`${time}-${dayIndex}`}
                    className="border-r relative p-1"
                  >
                    {getAppointmentsForTimeSlot(time, dayIndex).map(
                      (appointment) => (
                        <div
                          key={appointment.id}
                          className={`absolute inset-1 rounded-lg p-2 cursor-pointer transition-all hover:scale-105 ${getStatusColor(
                            appointment.status,
                          )}`}
                          onClick={() => setSelectedAppointment(appointment)}
                        >
                          <div className="flex items-center gap-2">
                            <Avatar className="w-4 h-4 border border-white/50">
                              <AvatarImage src={appointment.avatar} />
                              <AvatarFallback className="text-xs bg-white/80 text-gray-700">
                                {appointment.client
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </AvatarFallback>
                            </Avatar>
                            <div className="text-xs">
                              <div className="font-bold">
                                {appointment.code}
                              </div>
                              <div className="font-medium">
                                {appointment.service}
                              </div>
                            </div>
                          </div>
                        </div>
                      ),
                    )}
                  </div>
                ))}
              </>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Navegação */}
      <div className="flex justify-end mt-4">
        <Button variant="outline" size="sm">
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      {/* Modal de Detalhes */}
      <Dialog
        open={!!selectedAppointment}
        onOpenChange={() => setSelectedAppointment(null)}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3">
              <Avatar className="w-8 h-8">
                <AvatarImage src={selectedAppointment?.avatar} />
                <AvatarFallback>
                  {selectedAppointment?.client
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div>
                <div className="font-medium">{selectedAppointment?.client}</div>
                <div className="text-sm text-muted-foreground">
                  {selectedAppointment?.code}
                </div>
              </div>
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <div className="text-sm font-medium">Serviço</div>
              <div className="text-sm text-muted-foreground">
                {selectedAppointment?.service}
              </div>
            </div>

            <div>
              <div className="text-sm font-medium">Status</div>
              <Badge
                className={getStatusColor(selectedAppointment?.status || "")}
              >
                {getStatusText(selectedAppointment?.status || "")}
              </Badge>
            </div>

            <div>
              <div className="text-sm font-medium">Data/Hora</div>
              <div className="text-sm text-muted-foreground">
                Maio 25, 2024 {selectedAppointment?.time} -{" "}
                {selectedAppointment?.duration}
              </div>
            </div>

            <div>
              <div className="text-sm font-medium">Cliente</div>
              <div className="text-sm text-muted-foreground">
                {selectedAppointment?.client}
              </div>
            </div>

            {selectedAppointment?.status === "pending" && (
              <Button className="w-full">Confirmar</Button>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
