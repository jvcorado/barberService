"use client";

import { useEffect, useState } from "react";
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

type ExpenseResponse = Omit<Expense, "amount"> & { amount: number | string };

interface ExpensesSectionProps {
  barberShopId: string;
  initialExpenses: Expense[];
  onExpensesUpdated?: (expenses: Expense[]) => void;
}

export function ExpensesSection({
  barberShopId,
  initialExpenses,
  onExpensesUpdated,
}: ExpensesSectionProps) {
  const [expenses, setExpenses] = useState<Expense[]>(initialExpenses);

  useEffect(() => {
    setExpenses(initialExpenses);
  }, [initialExpenses]);

  const fetchExpenses = async () => {
    try {
      const response = await fetch(
        `/api/expenses?barberShopId=${barberShopId}`,
      );
      if (response.ok) {
        const data: ExpenseResponse[] = await response.json();
        const normalizedExpenses: Expense[] = data.map((expense) => ({
          ...expense,
          amount: Number(expense.amount),
        }));
        setExpenses(normalizedExpenses);
        onExpensesUpdated?.(normalizedExpenses);
      }
    } catch (error) {
      console.error("Erro ao buscar despesas:", error);
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
