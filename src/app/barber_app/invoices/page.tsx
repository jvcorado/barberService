import { SectionCards } from "@/components/section-cards";
import { ChartAreaInteractive } from "@/components/chart-area-interactive";
import { DataTable } from "@/components/data-table";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function InvoicesPage() {
  const session = await getServerSession(authOptions);
  const now = new Date();

  if (!session?.user?.admin) {
    return redirect("/");
  }

  const barbershop = await db.barberShop.findUnique({
    where: { ownerId: session.user.id },
  });

  if (!barbershop) {
    return <p className="text-center mt-10">Nenhuma barbearia encontrada.</p>;
  }

  // Todos os agendamentos da barbearia
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
  });

  // Formatação p/ tabela
  const formattedData = bookings.map((booking) => ({
    id: booking.id,
    cliente: booking.user?.name ?? "Usuário",
    servico: booking.service.name,
    data: new Date(booking.date).toLocaleDateString("pt-BR"),
    hora: new Date(booking.date).toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    }),
    preco: `R$ ${Number(booking.service.price).toFixed(2).replace(".", ",")}`,
  }));

  // Futuros e passados para totals
  const [futureTotal, pastTotal] = bookings.reduce<[number, number]>(
    (acc, booking) => {
      const value = Number(booking.service.price);
      if (booking.date >= now) acc[0] += value;
      else acc[1] += value;
      return acc;
    },
    [0, 0],
  );

  // Dados para gráfico (lucro por dia)
  const dailyRevenue = bookings.reduce<Record<string, number>>(
    (acc, booking) => {
      const dateKey = new Date(booking.date).toISOString().split("T")[0];
      acc[dateKey] = (acc[dateKey] || 0) + Number(booking.service.price);
      return acc;
    },
    {},
  );

  const chartData = Object.entries(dailyRevenue).map(([date, valor]) => ({
    date,
    valor,
  }));

  return (
    <div className="flex flex-col gap-6 px-4  min-h-screen">
      {/* Content with top margin to account for fixed header */}
      <div className="pt-5 space-y-6 pb-6">
        {/* Cards Resumo */}
        <SectionCards totalPast={pastTotal} totalFuture={futureTotal} />

        {/* Gráfico */}
        <ChartAreaInteractive data={chartData} />

        {/* Tabela detalhada */}
        <DataTable data={formattedData} />
      </div>
    </div>
  );
}
