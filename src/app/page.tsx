import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import Image from "next/image";
import Link from "next/link";
import { quickSearchOptions } from "../constants/search";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/prisma";
import Header from "@/components/header";
import BarbershopItem from "@/components/barbershop-item";
import BookingItem from "@/components/booking-item";
import Search from "@/components/search";
import { Button } from "@/components/ui/button";
import { getConfirmedBookings } from "../data/get-confirmed-bookings";

export default async function Home() {
  const session = await getServerSession(authOptions);
  const barbershops = await db.barberShop.findMany({
    where: {
      isPremium: true,
    },
  });
  const popularBarbershops = await db.barberShop.findMany({});
  const confirmedBookings = await getConfirmedBookings();

  return (
    <div>
      <Header />
      <div className="p-5 container md:mx-auto">
        {/* TEXTO */}
        <h2 className="text-xl font-bold">
          {session?.user ? `Olá ${session.user.name} ` : "Seja Bem Vindo"} !
        </h2>
        <p>
          <span className="capitalize">
            {format(new Date(), "EEEE, dd", { locale: ptBR })}
          </span>
          <span>&nbsp;de&nbsp;</span>
          <span className="capitalize">
            {format(new Date(), "MMMM", { locale: ptBR })}
          </span>
        </p>

        {/* BUSCA */}
        <div className="mt-6">
          <Search />
        </div>

        {/* teste  sdsd */}

        {/* BUSCA RÁPIDA */}
        <div className="mt-6 flex gap-3 overflow-x-scroll [&::-webkit-scrollbar]:hidden">
          {quickSearchOptions.map((option) => (
            <Button
              className="gap-2"
              variant="secondary"
              key={option.title}
              asChild
            >
              <Link href={`/barbershops?service=${option.title}`}>
                <Image
                  src={option.imageUrl}
                  width={16}
                  height={16}
                  alt={option.title}
                />
                {option.title}
              </Link>
            </Button>
          ))}
        </div>

        {/* IMAGEM */}
        <div className="relative mt-6 h-[150px] w-full">
          <Image
            alt="Agende nos melhores com FSW Barber"
            src="/banner-01.png"
            fill
            className="rounded-xl object-cover"
          />
        </div>

        {confirmedBookings.length > 0 && (
          <>
            <h2 className="mb-3 mt-6 text-xs font-bold uppercase text-gray-400">
              Agendamentos
            </h2>

            {/* AGENDAMENTO */}
            <div className="flex gap-3 overflow-x-auto [&::-webkit-scrollbar]:hidden">
              {confirmedBookings.map((booking) => (
                <BookingItem
                  key={booking.id}
                  booking={JSON.parse(JSON.stringify(booking))}
                />
              ))}
            </div>
          </>
        )}
        <h2 className="mb-3 mt-6 text-xs font-bold uppercase text-gray-400">
          Recomendados
        </h2>
        <div className="flex gap-4 overflow-auto [&::-webkit-scrollbar]:hidden">
          {barbershops.map((barbershop) => (
            <BarbershopItem key={barbershop.id} barbershop={barbershop} />
          ))}
        </div>

        <h2 className="mb-3 mt-6 text-xs font-bold uppercase text-gray-400">
          Populares
        </h2>
        <div className="flex gap-4 overflow-auto [&::-webkit-scrollbar]:hidden">
          {popularBarbershops.map((barbershop) => (
            <BarbershopItem key={barbershop.id} barbershop={barbershop} />
          ))}
        </div>
      </div>
    </div>
  );
}
