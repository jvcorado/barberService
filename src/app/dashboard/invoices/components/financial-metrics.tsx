"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown, DollarSign, Calculator } from "lucide-react";

interface FinancialMetricsProps {
  totalRevenue: number;
  totalExpenses: number;
  grossRevenue: number;
  netRevenue: number;
}

export function FinancialMetrics({
  totalRevenue,
  totalExpenses,
  grossRevenue,
  netRevenue,
}: FinancialMetricsProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  const profitMargin = grossRevenue > 0 ? (netRevenue / grossRevenue) * 100 : 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
      {/* Faturamento Bruto */}
      <Card className="bg-transparent text-white border border-white/10">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-white">
            Faturamento Bruto
          </CardTitle>
          <DollarSign className="h-4 w-4 text-green-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-500">
            {formatCurrency(grossRevenue)}
          </div>
          <p className="text-xs text-white/60">Total de receitas realizadas</p>
        </CardContent>
      </Card>

      {/* Total de Despesas */}
      <Card className="bg-transparent text-white border border-white/10">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-white">
            Total de Despesas
          </CardTitle>
          <TrendingDown className="h-4 w-4 text-red-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-red-500">
            {formatCurrency(totalExpenses)}
          </div>
          <p className="text-xs text-white/60">Gastos totais registrados</p>
        </CardContent>
      </Card>

      {/* Faturamento Líquido */}
      <Card className="bg-transparent text-white border border-white/10">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-white">
            Faturamento Líquido
          </CardTitle>
          <Calculator className="h-4 w-4 text-blue-500" />
        </CardHeader>
        <CardContent>
          <div
            className={`text-2xl font-bold ${netRevenue >= 0 ? "text-green-500" : "text-red-500"}`}
          >
            {formatCurrency(netRevenue)}
          </div>
          <p className="text-xs text-white/60">
            {netRevenue >= 0 ? "Lucro" : "Prejuízo"} líquido
          </p>
        </CardContent>
      </Card>

      {/* Margem de Lucro */}
      <Card className="bg-transparent text-white border border-white/10">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-white">
            Margem de Lucro
          </CardTitle>
          <TrendingUp className="h-4 w-4 text-green-500" />
        </CardHeader>
        <CardContent>
          <div
            className={`text-2xl font-bold ${profitMargin >= 0 ? "text-green-500" : "text-red-500"}`}
          >
            {profitMargin.toFixed(1)}%
          </div>
          <p className="text-xs text-white/60">Percentual de lucratividade</p>
        </CardContent>
      </Card>
    </div>
  );
}
