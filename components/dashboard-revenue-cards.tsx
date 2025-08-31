"use client";

import { motion } from "framer-motion";
import { Banknote, CalendarClock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface DashboardRevenueCardsProps {
  totalPast: number;
  totalFuture: number;
}

export const DashboardRevenueCards = ({
  totalPast,
  totalFuture,
}: DashboardRevenueCardsProps) => {
  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);

  const cardVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
      <motion.div
        variants={cardVariants}
        initial="initial"
        animate="animate"
        transition={{ duration: 0.6 }}
      >
        <Card className="bg-white border border-gray-200 shadow-sm">
          <CardContent className="flex flex-col gap-2 p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-600">
                  Faturamento Realizado
                </span>
              </div>
              <span className="text-xs text-green-600 font-medium">+R$</span>
            </div>
            <p className="text-3xl font-bold text-gray-900">
              {formatCurrency(totalPast)}
            </p>
            <div className="flex items-center gap-1 text-xs text-gray-500">
              <span>Lucro acumulado</span>
              <span className="text-green-600">📈</span>
            </div>
            <p className="text-xs text-gray-500">
              Somatória dos agendamentos anteriores a hoje
            </p>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div
        variants={cardVariants}
        initial="initial"
        animate="animate"
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <Card className="bg-white border border-gray-200 shadow-sm">
          <CardContent className="flex flex-col gap-2 p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-600">
                  Previsão de Faturamento
                </span>
              </div>
              <span className="text-xs text-blue-600 font-medium">Prev.</span>
            </div>
            <p className="text-3xl font-bold text-gray-900">
              {formatCurrency(totalFuture)}
            </p>
            <div className="flex items-center gap-1 text-xs text-gray-500">
              <span>Agendamentos futuros</span>
              <span className="text-blue-600">📈</span>
            </div>
            <p className="text-xs text-gray-500">
              Baseado nos serviços agendados após hoje
            </p>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};
