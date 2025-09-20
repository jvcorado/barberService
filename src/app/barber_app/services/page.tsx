import { SectionCards } from "@/components/section-cards";
import { ChartAreaInteractive } from "@/components/chart-area-interactive";
import { DataTable } from "@/components/data-table";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import ServiceItem from "@/components/service-item";
import CreateServiceDrawer from "./components/create-service-drawer";
import ServicesPageClient from "./components/services-page-client";
import { Plus } from "lucide-react";

export default async function ServicesPage() {
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

  // Todos os serviços da barbearia
  const services = await db.barbershopService.findMany({
    where: {
      barberShopId: barbershop.id,
    },
  });

  // Todos os agendamentos dos serviços para análise
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

  // Formatação para tabela de agendamentos por serviço
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

  // Análise de performance dos serviços
  const serviceStats = services.map((service) => {
    const serviceBookings = bookings.filter((b) => b.service.id === service.id);
    const totalRevenue = serviceBookings.reduce(
      (acc, booking) => acc + Number(booking.service.price),
      0,
    );
    const futureBookings = serviceBookings.filter((b) => b.date >= now).length;
    const pastBookings = serviceBookings.filter((b) => b.date < now).length;

    return {
      ...service,
      totalBookings: serviceBookings.length,
      totalRevenue,
      futureBookings,
      pastBookings,
    };
  });

  // Totais para cards (agendamentos futuros vs passados)
  const [futureTotal, pastTotal] = bookings.reduce<[number, number]>(
    (acc, booking) => {
      const value = Number(booking.service.price);
      if (booking.date >= now) acc[0] += value;
      else acc[1] += value;
      return acc;
    },
    [0, 0],
  );

  // Dados para gráfico (receita por serviço nos últimos 30 dias)
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const recentBookings = bookings.filter((b) => b.date >= thirtyDaysAgo);
  const serviceRevenue = services.map((service) => {
    const serviceRecentBookings = recentBookings.filter(
      (b) => b.service.id === service.id,
    );
    const revenue = serviceRecentBookings.reduce(
      (acc, booking) => acc + Number(booking.service.price),
      0,
    );

    return {
      date: service.name,
      valor: revenue,
    };
  });

  return (
    <ServicesPageClient>
      {/* Cards Resumo */}
      {/* <SectionCards totalPast={pastTotal} totalFuture={futureTotal} /> */}

      {/* Gráfico de receita por serviço */}
      {/* {serviceRevenue.length > 0 && (
        <div className="bg-white border rounded-lg p-4">
          <h2 className="text-lg font-semibold mb-4">
            Receita por Serviço (Últimos 30 dias)
          </h2>
          <ChartAreaInteractive data={serviceRevenue} />
        </div>
      )} */}

      {/* Lista de serviços cadastrados */}
      <div className="space-y-6">
        {services.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-white/10 flex items-center justify-center">
              <Plus className="w-8 h-8 text-white/50" />
            </div>
            <p className="text-white/70 text-lg mb-2">
              Nenhum serviço cadastrado
            </p>
            <p className="text-white/50 text-sm">
              Crie seu primeiro serviço para começar
            </p>
          </div>
        ) : (
          <div className="grid gap-4">
            {serviceStats.map((service) => (
              <div
                key={service.id}
                className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-colors"
              >
                <ServiceItem
                  barbershop={JSON.parse(JSON.stringify(barbershop))}
                  service={JSON.parse(JSON.stringify(service))}
                  showStats={false}
                  className="!bg-transparent !p-0"
                />
                <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div className="text-center p-3 bg-white/5 rounded-lg">
                    <p className="text-white/60 text-xs uppercase tracking-wide">
                      Total Agendamentos
                    </p>
                    <p className="font-semibold text-white text-lg">
                      {service.totalBookings}
                    </p>
                  </div>
                  <div className="text-center p-3 bg-white/5 rounded-lg">
                    <p className="text-white/60 text-xs uppercase tracking-wide">
                      Receita Total
                    </p>
                    <p className="font-semibold text-white text-lg">
                      R$ {service.totalRevenue.toFixed(2).replace(".", ",")}
                    </p>
                  </div>
                  <div className="text-center p-3 bg-white/5 rounded-lg">
                    <p className="text-white/60 text-xs uppercase tracking-wide">
                      Futuros
                    </p>
                    <p className="font-semibold text-white text-lg">
                      {service.futureBookings}
                    </p>
                  </div>
                  <div className="text-center p-3 bg-white/5 rounded-lg">
                    <p className="text-white/60 text-xs uppercase tracking-wide">
                      Passados
                    </p>
                    <p className="font-semibold text-white text-lg">
                      {service.pastBookings}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Tabela detalhada de agendamentos */}
      {/* {formattedData.length > 0 && (
        <div className="bg-white border rounded-lg p-4">
          <h2 className="text-lg font-semibold mb-4">
            Agendamentos por Serviço
          </h2>
          <DataTable data={formattedData} />
        </div>
      )} */}
    </ServicesPageClient>
  );
}
