"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { updateWorkingHours } from "@/src/actions/update-working-hours";
import { toast } from "sonner";
import { useTransition } from "react";
import { Clock, Calendar, Settings } from "lucide-react";

const formSchema = z.object({
  workingDays: z.array(z.number()).min(1, "Selecione pelo menos um dia"),
  openingTime: z.string().min(1, "Horário de abertura obrigatório"),
  closingTime: z.string().min(1, "Horário de fechamento obrigatório"),
  appointmentInterval: z.coerce
    .number()
    .min(15, "Intervalo mínimo de 15 minutos"),
});

interface WorkingHoursFormProps {
  barbershop: {
    id: string;
    name: string;
    workingDays: number[];
    openingTime: string;
    closingTime: string;
    appointmentInterval: number;
  };
  onScheduleUpdated?: () => void;
}

const DAYS_OF_WEEK = [
  { value: 1, label: "Segunda-feira", short: "Seg" },
  { value: 2, label: "Terça-feira", short: "Ter" },
  { value: 3, label: "Quarta-feira", short: "Qua" },
  { value: 4, label: "Quinta-feira", short: "Qui" },
  { value: 5, label: "Sexta-feira", short: "Sex" },
  { value: 6, label: "Sábado", short: "Sáb" },
  { value: 0, label: "Domingo", short: "Dom" },
];

const TIME_INTERVALS = [
  { value: 15, label: "15 minutos" },
  { value: 30, label: "30 minutos" },
  { value: 45, label: "45 minutos" },
  { value: 60, label: "1 hora" },
];

export default function WorkingHoursForm({
  barbershop,
  onScheduleUpdated,
}: WorkingHoursFormProps) {
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      workingDays: barbershop.workingDays,
      openingTime: barbershop.openingTime,
      closingTime: barbershop.closingTime,
      appointmentInterval: barbershop.appointmentInterval,
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    startTransition(() => {
      updateWorkingHours({
        barbershopId: barbershop.id,
        workingDays: values.workingDays,
        openingTime: values.openingTime,
        closingTime: values.closingTime,
        appointmentInterval: values.appointmentInterval,
      })
        .then(() => {
          toast.success("Horários atualizados com sucesso!");
          onScheduleUpdated?.();
        })
        .catch((error) => {
          console.error("Erro ao atualizar horários:", error);
          toast.error("Erro ao atualizar horários");
        });
    });
  };

  return (
    <div className="space-y-3">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
          {/* Dias de Funcionamento */}
          <Card className="bg-white/5 backdrop-blur-sm border-white/10">
            <CardHeader className="pb-2">
              <CardTitle className="text-white flex items-center gap-2 text-base">
                <Calendar className="w-4 h-4" />
                Dias de Funcionamento
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <FormField
                control={form.control}
                name="workingDays"
                render={() => (
                  <FormItem>
                    <FormLabel className="text-white text-xs font-medium">
                      Selecione os dias da semana
                    </FormLabel>
                    <div className="grid grid-cols-7 gap-2 mt-3">
                      {DAYS_OF_WEEK.map((day) => (
                        <FormField
                          key={day.value}
                          control={form.control}
                          name="workingDays"
                          render={({ field }) => {
                            return (
                              <FormItem
                                key={day.value}
                                className="flex flex-col items-center space-y-2"
                              >
                                <FormControl>
                                  <Checkbox
                                    checked={field.value?.includes(day.value)}
                                    onCheckedChange={(checked) => {
                                      return checked
                                        ? field.onChange([
                                            ...field.value,
                                            day.value,
                                          ])
                                        : field.onChange(
                                            field.value?.filter(
                                              (value) => value !== day.value,
                                            ),
                                          );
                                    }}
                                    className="border-white/20 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                                  />
                                </FormControl>
                                <FormLabel className="text-white text-xs text-center">
                                  {day.short}
                                </FormLabel>
                              </FormItem>
                            );
                          }}
                        />
                      ))}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Horários de Funcionamento */}
          <Card className="bg-white/5 backdrop-blur-sm border-white/10">
            <CardHeader className="pb-2">
              <CardTitle className="text-white flex items-center gap-2 text-base">
                <Clock className="w-4 h-4" />
                Horários de Funcionamento
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="grid grid-cols-2 gap-3">
                <FormField
                  control={form.control}
                  name="openingTime"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white text-xs font-medium">
                        Abertura
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="time"
                          {...field}
                          className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 text-sm"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="closingTime"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white text-xs font-medium">
                        Fechamento
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="time"
                          {...field}
                          className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 text-sm"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          {/* Intervalo entre Agendamentos */}
          <Card className="bg-white/5 backdrop-blur-sm border-white/10">
            <CardHeader className="pb-2">
              <CardTitle className="text-white flex items-center gap-2 text-base">
                <Settings className="w-4 h-4" />
                Intervalo entre Agendamentos
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <FormField
                control={form.control}
                name="appointmentInterval"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white text-xs font-medium">
                      Intervalo em minutos
                    </FormLabel>
                    <FormControl>
                      <div className="grid grid-cols-2 gap-2 mt-3">
                        {TIME_INTERVALS.map((interval) => (
                          <Button
                            key={interval.value}
                            type="button"
                            variant={
                              field.value === interval.value
                                ? "default"
                                : "outline"
                            }
                            onClick={() => field.onChange(interval.value)}
                            className={
                              field.value === interval.value
                                ? "bg-blue-600 hover:bg-blue-700 text-white text-xs"
                                : "border-white/20 text-white hover:bg-white/10 text-xs"
                            }
                          >
                            {interval.label}
                          </Button>
                        ))}
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Botão de Salvar */}
          <div className="pt-2">
            <Button
              type="submit"
              disabled={isPending}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 text-sm font-medium rounded-lg transition-all duration-200 disabled:opacity-50"
            >
              {isPending ? "Salvando..." : "Salvar Configurações"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
