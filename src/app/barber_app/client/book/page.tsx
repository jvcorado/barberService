"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";

import {
  Clock,
  Calendar as CalendarIcon,
  ArrowLeft,
  Check,
} from "lucide-react";
import { format, addDays, startOfDay, endOfDay, isSameDay } from "date-fns";
import { ptBR } from "date-fns/locale";
import { createBooking } from "../../../../actions/create-booking";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";

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
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [availableTimes, setAvailableTimes] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingBarbershop, setIsLoadingBarbershop] = useState(true);
  const [step, setStep] = useState(1);

  // Horários disponíveis (9h às 18h)
  const timeSlots = [
    "09:00",
    "09:30",
    "10:00",
    "10:30",
    "11:00",
    "11:30",
    "12:00",
    "12:30",
    "13:00",
    "13:30",
    "14:00",
    "14:30",
    "15:00",
    "15:30",
    "16:00",
    "16:30",
    "17:00",
    "17:30",
  ];

  useEffect(() => {
    if (barbershopId) {
      fetchBarbershop();
    }
  }, [barbershopId]);

  useEffect(() => {
    if (serviceId && barbershop?.services) {
      const service = barbershop.services.find((s) => s.id === serviceId);
      setSelectedService(service || null);
    } else if (barbershop?.services && barbershop.services.length > 0) {
      // Se não há serviceId, seleciona o primeiro serviço
      setSelectedService(barbershop.services[0]);
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

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
    setStep(3);
  };

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
    setStep(4);
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

  const goBack = () => {
    if (step > 1) {
      setStep(step - 1);
      if (step === 2) {
        setSelectedDate(undefined);
      } else if (step === 3) {
        setSelectedTime("");
      }
    } else {
      router.back();
    }
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (status === "unauthenticated") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Acesso Negado
          </h2>
          <p className="text-gray-600 mb-4">
            Você precisa estar logado para fazer um agendamento
          </p>
          <Button onClick={() => router.push("/")}>Ir para Login</Button>
        </div>
      </div>
    );
  }

  if (isLoadingBarbershop) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!barbershop) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Barbearia não encontrada
          </h2>
          <p className="text-gray-600 mb-4">
            Não foi possível carregar as informações da barbearia
          </p>
          <Button onClick={() => router.back()}>Voltar</Button>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen p-4"
      style={{
        backgroundColor: barbershop.backgroundColor || "#f9fafb",
        color: barbershop.textColor || "#111827",
      }}
    >
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Button
          variant="ghost"
          size="icon"
          onClick={goBack}
          style={{
            color: barbershop.primaryColor || "#000000",
          }}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-xl font-bold text-gray-900">Agendar Serviço</h1>
          <p className="text-sm text-gray-600">{barbershop.name}</p>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="flex items-center justify-center mb-8">
        <div className="flex items-center space-x-2">
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
              step >= 1 ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-600"
            }`}
          >
            1
          </div>
          <div
            className={`w-16 h-1 ${step >= 2 ? "bg-blue-600" : "bg-gray-200"}`}
          ></div>
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
              step >= 2 ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-600"
            }`}
          >
            2
          </div>
          <div
            className={`w-16 h-1 ${step >= 3 ? "bg-blue-600" : "bg-gray-200"}`}
          ></div>
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
              step >= 3 ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-600"
            }`}
          >
            3
          </div>
        </div>
      </div>

      {/* Step 1: Seleção de Serviço */}
      {step === 1 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CalendarIcon className="h-5 w-5" />
              Escolha o Serviço
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {barbershop.services.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-600 mb-4">
                  Nenhum serviço disponível nesta barbearia
                </p>
                <Button onClick={() => router.back()}>Voltar</Button>
              </div>
            ) : (
              barbershop.services.map((service) => (
                <div
                  key={service.id}
                  className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                    selectedService?.id === service.id
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                  onClick={() => setSelectedService(service)}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {service.name}
                      </h3>
                      {service.description && (
                        <p className="text-sm text-gray-600 mt-1">
                          {service.description}
                        </p>
                      )}
                      <div className="flex items-center gap-4 mt-2">
                        <Badge variant="outline" className="gap-1">
                          <Clock className="h-3 w-3" />
                          {service.duration || 30} min
                        </Badge>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-gray-900">
                        {new Intl.NumberFormat("pt-BR", {
                          style: "currency",
                          currency: "BRL",
                        }).format(Number(service.price))}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}

            {selectedService && (
              <Button
                className="w-full mt-6"
                onClick={() => setStep(2)}
                style={{
                  backgroundColor: barbershop.primaryColor || "#000000",
                  color: barbershop.secondaryColor || "#ffffff",
                }}
              >
                Continuar
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      {/* Step 2: Seleção de Data */}
      {step === 2 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CalendarIcon className="h-5 w-5" />
              Escolha a Data
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={handleDateSelect}
              disabled={(date) => {
                const today = new Date();
                const tomorrow = addDays(today, 1);
                return date < startOfDay(tomorrow);
              }}
              className="rounded-md border"
            />

            <div className="mt-4 text-sm text-gray-600">
              <p>• Selecione uma data para continuar</p>
              <p>• Não é possível agendar para hoje</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 3: Seleção de Horário */}
      {step === 3 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Escolha o Horário
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-3">
              {availableTimes.map((time) => (
                <Button
                  key={time}
                  variant={selectedTime === time ? "default" : "outline"}
                  className="h-12"
                  onClick={() => handleTimeSelect(time)}
                  style={{
                    backgroundColor:
                      selectedTime === time
                        ? barbershop.primaryColor || "#000000"
                        : "transparent",
                    color:
                      selectedTime === time
                        ? barbershop.secondaryColor || "#ffffff"
                        : barbershop.primaryColor || "#000000",
                    borderColor: barbershop.primaryColor || "#000000",
                  }}
                >
                  {time}
                </Button>
              ))}
            </div>

            {selectedTime && (
              <Button
                className="w-full mt-6"
                onClick={() => setStep(4)}
                style={{
                  backgroundColor: barbershop.primaryColor || "#000000",
                  color: barbershop.secondaryColor || "#ffffff",
                }}
              >
                Continuar
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      {/* Step 4: Confirmação */}
      {step === 4 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Check className="h-5 w-5" />
              Confirme o Agendamento
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-2">
                Resumo do Agendamento
              </h3>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Serviço:</span>
                  <span className="font-medium">{selectedService?.name}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-600">Data:</span>
                  <span className="font-medium">
                    {selectedDate &&
                      format(selectedDate, "EEEE, dd 'de' MMMM", {
                        locale: ptBR,
                      })}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-600">Horário:</span>
                  <span className="font-medium">{selectedTime}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-600">Duração:</span>
                  <span className="font-medium">
                    {selectedService?.duration || 30} min
                  </span>
                </div>

                <div className="flex justify-between pt-2 border-t">
                  <span className="text-gray-600 font-medium">Valor:</span>
                  <span className="text-lg font-bold text-gray-900">
                    {selectedService &&
                      new Intl.NumberFormat("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                      }).format(Number(selectedService.price))}
                  </span>
                </div>
              </div>
            </div>

            <Button
              className="w-full"
              onClick={handleConfirmBooking}
              disabled={isLoading}
              style={{
                backgroundColor: barbershop.primaryColor || "#000000",
                color: barbershop.secondaryColor || "#ffffff",
              }}
            >
              {isLoading ? "Confirmando..." : "Confirmar Agendamento"}
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
