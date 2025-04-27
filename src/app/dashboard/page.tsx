// app/dashboard/page.tsx

import BookingsTable from "@/components/booking-table";
import { DashboardRevenueCards } from "@/components/dashboard-revenue-cards";
import Header from "@/components/header";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import Link from "next/link";

const Dashboard = async () => {
  const session = await getServerSession(authOptions);
  const now = new Date();

  if (!session) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-lg text-gray-700">Faça login para acessar</p>
      </div>
    );
  }

  if (!session.user.admin) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-lg text-red-600">
          Você não tem permissão para acessar esta página.
        </p>
      </div>
    );
  }

  const barbershop = await db.barberShop.findUnique({
    where: {
      ownerId: session.user.id,
    },
  });

  const futureBookings = await db.booking.findMany({
    where: {
      service: {
        barberShopId: barbershop?.id,
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
        barberShopId: barbershop?.id,
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

  return (
    <>
      <Header />
      <div className="space-y-3 p-5 container mx-auto">
        {barbershop ? (
          <>
            <h2 className="text-xl font-bold">{`Olá ${barbershop.name} `}!</h2>

            <DashboardRevenueCards
              totalPast={totalPast}
              totalFuture={totalFuture}
            />

            <div className="mt-8">
              <BookingsTable />
            </div>
          </>
        ) : (
          <div className="mt-6 p-4 bg-yellow-100 dark:bg-yellow-900 rounded-lg">
            <p className="text-yellow-800 dark:text-yellow-200">
              Você ainda não cadastrou uma barbearia.
            </p>
            <Link
              href="/barbershop/new"
              className="mt-2 inline-block text-blue-600 hover:underline"
            >
              ➕ Cadastrar agora
            </Link>
          </div>
        )}
      </div>
    </>
  );
};

export default Dashboard;
