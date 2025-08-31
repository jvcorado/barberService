import { ChartAreaInteractive } from "@/components/chart-area-interactive";
import { DataTable } from "@/components/data-table";
import { SectionCards } from "@/components/section-cards";

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
  });

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

  const futureBookings = await db.booking.findMany({
    where: {
      service: {
        barberShopId: barbershop.id,
      },
      date: {
        gte: now,
      },
    },
    include: {
      service: true,
    },
  });

  const pastBookings = await db.booking.findMany({
    where: {
      service: {
        barberShopId: barbershop.id,
      },
      date: {
        lt: now,
      },
    },
    include: {
      service: true,
    },
  });

  const totalFuture = futureBookings.reduce(
    (acc, booking) => acc + Number(booking.service.price),
    0,
  );
  const totalPast = pastBookings.reduce(
    (acc, booking) => acc + Number(booking.service.price),
    0,
  );

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
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6  md:py-6">
          {/* Reaproveitamos os cards de resumo */}
          <SectionCards totalPast={totalPast} totalFuture={totalFuture} />

          {/* Gráfico de faturamento diário */}
          <div className="px-4 lg:px-6">
            <ChartAreaInteractive data={chartData} />
          </div>

          {/* Tabela detalhada de faturas */}
          <DataTable data={formattedData} />
        </div>
      </div>
    </div>
  );
}
