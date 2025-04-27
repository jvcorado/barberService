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
        <Card className="bg-green-100 dark:bg-green-900 border-none shadow-md">
          <CardContent className="flex flex-col gap-2 p-6">
            <div className="flex items-center gap-2 text-green-800 dark:text-green-300">
              <Banknote className="w-6 h-6" />
              <span className="text-lg font-semibold">Lucro Realizado</span>
            </div>
            <p className="text-3xl font-bold text-green-700 dark:text-green-200">
              {formatCurrency(totalPast)}
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
        <Card className="bg-blue-100 dark:bg-blue-900 border-none shadow-md">
          <CardContent className="flex flex-col gap-2 p-6">
            <div className="flex items-center gap-2 text-blue-800 dark:text-blue-300">
              <CalendarClock className="w-6 h-6" />
              <span className="text-lg font-semibold">
                Previsão de Faturamento
              </span>
            </div>
            <p className="text-3xl font-bold text-blue-700 dark:text-blue-200">
              {formatCurrency(totalFuture)}
            </p>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};
