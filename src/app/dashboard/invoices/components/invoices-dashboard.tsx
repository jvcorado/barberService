"use client";

import { useMemo, useState } from "react";

import { ChartAreaInteractive } from "@/components/chart-area-interactive";

import { ExpensesSection } from "./expenses-section";
import { FinancialMetrics } from "./financial-metrics";

interface Expense {
  id: string;
  description: string;
  amount: number;
  category: string;
  date: string;
}

interface ChartDataItem {
  date: string;
  valor: number;
}

interface InvoicesDashboardProps {
  barberShopId: string;
  initialExpenses: Expense[];
  chartData: ChartDataItem[];
  totalRevenue: number;
  grossRevenue: number;
}

export function InvoicesDashboard({
  barberShopId,
  initialExpenses,
  chartData,
  totalRevenue,
  grossRevenue,
}: InvoicesDashboardProps) {
  const [expenses, setExpenses] = useState<Expense[]>(initialExpenses);

  const totalExpenses = useMemo(
    () => expenses.reduce((acc, expense) => acc + expense.amount, 0),
    [expenses],
  );
  const netRevenue = grossRevenue - totalExpenses;

  const handleExpensesUpdated = (updatedExpenses: Expense[]) => {
    setExpenses(updatedExpenses);
  };

  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-6 py-4 md:gap-8 md:py-6">
          <div className="px-4 lg:px-6">
            <FinancialMetrics
              totalRevenue={totalRevenue}
              totalExpenses={totalExpenses}
              grossRevenue={grossRevenue}
              netRevenue={netRevenue}
            />
          </div>

          <div className="px-4 lg:px-6">
            <ChartAreaInteractive data={chartData} />
          </div>

          <div className="px-4 lg:px-6">
            <ExpensesSection
              barberShopId={barberShopId}
              initialExpenses={expenses}
              onExpensesUpdated={handleExpensesUpdated}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
