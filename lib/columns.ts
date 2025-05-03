// components/bookings-table/columns.ts
import { ColumnDef } from "@tanstack/react-table";
import { z } from "zod";

export const schema = z.object({
  id: z.string(),
  cliente: z.string(),
  servico: z.string(),
  data: z.string(),
  hora: z.string(),
  preco: z.string(),
});

export const columns: ColumnDef<z.infer<typeof schema>>[] = [
  {
    accessorKey: "cliente",
    header: "Cliente",
  },
  {
    accessorKey: "servico",
    header: "Serviço",
  },
  {
    accessorKey: "data",
    header: "Data",
  },
  {
    accessorKey: "hora",
    header: "Hora",
  },
  {
    accessorKey: "preco",
    header: "Preço",
  },
];
