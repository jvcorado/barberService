"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";

interface Expense {
  id: string;
  description: string;
  amount: number;
  category: string;
  date: Date;
}

interface ExpensesChartProps {
  expenses: Expense[];
}

const COLORS = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#8884D8",
  "#82CA9D",
  "#FFC658",
  "#FF7C7C",
  "#8DD1E1",
  "#D084D0",
];

export function ExpensesChart({ expenses }: ExpensesChartProps) {
  // Agrupar despesas por categoria
  const expensesByCategory = expenses.reduce(
    (acc, expense) => {
      const category = expense.category;
      if (!acc[category]) {
        acc[category] = 0;
      }
      acc[category] += Number(expense.amount);
      return acc;
    },
    {} as Record<string, number>,
  );

  // Converter para formato do gráfico
  const chartData = Object.entries(expensesByCategory).map(
    ([category, amount], index) => ({
      name: category,
      value: amount,
      color: COLORS[index % COLORS.length],
    }),
  );

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  const categoryLabels: { [key: string]: string } = {
    aluguel: "Aluguel",
    salarios: "Salários",
    produtos: "Produtos",
    equipamentos: "Equipamentos",
    marketing: "Marketing",
    utilities: "Contas",
    manutencao: "Manutenção",
    outros: "Outros",
  };

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-gray-900 p-3 border border-white/20 rounded-lg shadow-lg text-white">
          <p className="font-medium">
            {categoryLabels[payload[0].name] || payload[0].name}
          </p>
          <p className="text-sm text-red-400">
            {formatCurrency(payload[0].value)}
          </p>
        </div>
      );
    }
    return null;
  };

  if (expenses.length === 0) {
    return (
      <Card className="bg-white/5 backdrop-blur-sm border border-white/10 text-white">
        <CardHeader>
          <CardTitle className="text-white">Despesas por Categoria</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-gray-400">
              Nenhuma despesa registrada para exibir o gráfico.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-white/5 backdrop-blur-sm border border-white/10 text-white">
      <CardHeader>
        <CardTitle className="text-white">Despesas por Categoria</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) =>
                  `${categoryLabels[name] || name} (${(percent * 100).toFixed(0)}%)`
                }
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
