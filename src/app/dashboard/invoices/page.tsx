import { InvoicesDashboard } from "./components/invoices-dashboard";

import { authOptions } from "@/lib/auth";
import { db } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function Page() {
  const session = await getServerSession(authOptions);
  const now = new Date();

  if (!session?.user?.admin) {
    return redirect("/");
  }

  const barbershop = await db.barberShop.findUnique({
    where: { ownerId: session.user.id },
  });

  if (!barbershop) {
    return <p className="text-center mt-6">Nenhuma barbearia encontrada.</p>;
  }

  const bookings = await db.booking.findMany({
    where: {
      service: {
        barberShopId: barbershop.id,
      },
    },
    include: {
      service: true,
      user: true,
    },
    orderBy: {
      date: "desc",
    },
    distinct: ["id"], // Evitar duplicações
  });

  // Buscar despesas da barbearia
  const expenses = db.expense
    ? await db.expense.findMany({
        where: {
          barberShopId: barbershop.id,
        },
        orderBy: {
          date: "desc",
        },
      })
    : [];

  if (!db.expense) {
    console.warn(
      "Delegate `expense` não está disponível no Prisma Client. Rode `npx prisma generate` para sincronizar o schema ou verifique se o modelo Expense existe.",
    );
  }

  // Filtrar bookings únicos
  const uniqueBookings = bookings.filter(
    (booking, index, self) =>
      index === self.findIndex((b) => b.id === booking.id),
  );

  // Usar os dados já filtrados para evitar duplicações
  const futureBookings = uniqueBookings.filter(
    (booking) => new Date(booking.date) >= now,
  );

  const pastBookings = uniqueBookings.filter(
    (booking) => new Date(booking.date) < now,
  );

  const totalFuture = futureBookings.reduce(
    (acc, booking) => acc + Number(booking.service.price),
    0,
  );
  const totalPast = pastBookings.reduce(
    (acc, booking) => acc + Number(booking.service.price),
    0,
  );

  // Calcular métricas financeiras
  const grossRevenue = totalPast; // Faturamento bruto (receitas realizadas)

  // Transformar expenses para o formato esperado pelos componentes
  const formattedExpenses = expenses.map((expense) => ({
    id: expense.id,
    description: expense.description,
    amount: Number(expense.amount),
    category: expense.category,
    date: expense.date.toISOString().split("T")[0],
  }));

  const dailyRevenue = bookings.reduce(
    (acc, booking) => {
      const date = new Date(booking.date).toISOString().split("T")[0];
      const value = Number(booking.service.price);

      acc[date] = (acc[date] || 0) + value;
      return acc;
    },
    {} as Record<string, number>,
  );

  const chartData = Object.entries(dailyRevenue).map(([date, valor]) => ({
    date,
    valor,
  }));

  return (
    <InvoicesDashboard
      barberShopId={barbershop.id}
      initialExpenses={formattedExpenses}
      chartData={chartData}
      totalRevenue={totalPast + totalFuture}
      grossRevenue={grossRevenue}
    />
  );
}
