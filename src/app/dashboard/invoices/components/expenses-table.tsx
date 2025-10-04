"use client";

import { useState } from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Trash2, Edit } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";

interface Expense {
  id: string;
  description: string;
  amount: number;
  category: string;
  date: string;
}

interface ExpensesTableProps {
  expenses: Expense[];
  onExpenseDeleted?: () => void;
}

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

export function ExpensesTable({
  expenses,
  onExpenseDeleted,
}: ExpensesTableProps) {
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  const handleDeleteExpense = async (expenseId: string) => {
    setIsDeleting(expenseId);
    try {
      const response = await fetch(`/api/expenses/${expenseId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Erro ao deletar despesa");
      }

      toast.success("Despesa removida com sucesso!");
      onExpenseDeleted?.();
    } catch (error) {
      console.error("Erro ao deletar despesa:", error);
      toast.error("Erro ao remover despesa");
    } finally {
      setIsDeleting(null);
    }
  };

  if (expenses.length === 0) {
    return (
      <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-8 text-center">
        <p className="text-gray-400">Nenhuma despesa registrada ainda.</p>
        <p className="text-gray-500 text-sm mt-1">
          Adicione sua primeira despesa usando o botão acima.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="border-white/10 hover:bg-white/5">
            <TableHead className="text-white">Descrição</TableHead>
            <TableHead className="text-white">Categoria</TableHead>
            <TableHead className="text-white">Data</TableHead>
            <TableHead className="text-white text-right">Valor</TableHead>
            <TableHead className="text-white text-center">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {expenses.map((expense) => (
            <TableRow
              key={expense.id}
              className="border-white/10 hover:bg-white/5"
            >
              <TableCell className="text-white font-medium">
                {expense.description}
              </TableCell>
              <TableCell className="text-gray-300">
                <span className="px-2 py-1 bg-white/10 rounded-full text-xs">
                  {categoryLabels[expense.category] || expense.category}
                </span>
              </TableCell>
              <TableCell className="text-gray-300">
                {format(new Date(expense.date), "dd/MM/yyyy", { locale: ptBR })}
              </TableCell>
              <TableCell className="text-red-400 font-medium text-right">
                -{formatCurrency(expense.amount)}
              </TableCell>
              <TableCell className="text-center">
                <div className="flex items-center justify-center gap-2">
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                        disabled={isDeleting === expense.id}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent className="bg-gray-900 border-white/10">
                      <AlertDialogHeader>
                        <AlertDialogTitle className="text-white">
                          Confirmar exclusão
                        </AlertDialogTitle>
                        <AlertDialogDescription className="text-gray-300">
                          Tem certeza que deseja remover esta despesa? Esta ação
                          não pode ser desfeita.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel className="border-white/20 text-white hover:bg-white/10">
                          Cancelar
                        </AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDeleteExpense(expense.id)}
                          className="bg-red-600 hover:bg-red-700 text-white"
                        >
                          Remover
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
