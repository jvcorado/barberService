"use client";

import { useState, useEffect } from "react";
import { AddExpenseDialog } from "./add-expense-dialog";
import { ExpensesTable } from "./expenses-table";
import { ExpensesChart } from "./expenses-chart";

interface Expense {
  id: string;
  description: string;
  amount: number;
  category: string;
  date: string;
}

interface ExpensesSectionProps {
  barberShopId: string;
  initialExpenses: Expense[];
}

export function ExpensesSection({
  barberShopId,
  initialExpenses,
}: ExpensesSectionProps) {
  const [expenses, setExpenses] = useState<Expense[]>(initialExpenses);
  const [isLoading, setIsLoading] = useState(false);

  const fetchExpenses = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `/api/expenses?barberShopId=${barberShopId}`,
      );
      if (response.ok) {
        const data = await response.json();
        setExpenses(data);
      }
    } catch (error) {
      console.error("Erro ao buscar despesas:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleExpenseAdded = () => {
    fetchExpenses();
  };

  const handleExpenseDeleted = () => {
    fetchExpenses();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h3 className="text-xl font-semibold text-white">
          Controle de Despesas
        </h3>
        <AddExpenseDialog
          barberShopId={barberShopId}
          onExpenseAdded={handleExpenseAdded}
        />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
        <ExpensesChart expenses={expenses} />
        <div className="space-y-6">
          <h4 className="text-lg font-medium text-white">Lista de Despesas</h4>
          <ExpensesTable
            expenses={expenses}
            onExpenseDeleted={handleExpenseDeleted}
          />
        </div>
      </div>
    </div>
  );
}
