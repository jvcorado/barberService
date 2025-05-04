import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import Image from "next/image";
import Link from "next/link";
import { quickSearchOptions } from "../constants/search";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/prisma";
import Header from "@/components/header";
import BarbershopItem from "@/components/barbershop-item";
import BookingItem from "@/components/booking-item";
import { Button } from "@/components/ui/button";
import { getConfirmedBookings } from "../data/get-confirmed-bookings";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default async function Home() {
  const session = await getServerSession(authOptions);
  const barbershops = await db.barberShop.findMany({
    where: {
      isPremium: true,
    },
  });
  const popularBarbershops = await db.barberShop.findMany({});
  const confirmedBookings = await getConfirmedBookings();

  if (session?.user?.admin === true) {
    redirect("/dashboard");
  }

  return (
    <div>
      <Header />
      <div className="p-5 container md:mx-auto">
        <div className="mt-0 lg:mt-6 flex gap-3 overflow-x-scroll [&::-webkit-scrollbar]:hidden">
          {quickSearchOptions.map((option) => (
            <Button
              className="gap-2"
              variant="outline"
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

        {/* TEXTO */}

        <div className="flex items-center gap-2 mt-6">
          <Avatar className="h-14 w-14 rounded-full opacity-80 transition-all ease-in-out duration-300">
            <AvatarImage
              className=""
              src={session?.user?.image ?? ""}
              alt={session?.user?.name ?? "U"}
            />
            <AvatarFallback>
              {session?.user?.name?.charAt(0).toUpperCase() ?? "U"}
            </AvatarFallback>
          </Avatar>

          <div className="flex flex-col gap-0">
            <h2 className="text-xl  font-bold">
              {session?.user ? `${session.user.name} ` : "Faça seu login"}!
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
          </div>
        </div>

        {/* BUSCA RÁPIDA */}

        {/* IMAGEM */}
        {/*    <div className="relative mt-6 max-lg:h-[150px] lg:h-[300px] w-full">
          <Image
            alt="Agende nos melhores com FSW Barber"
            src="/banner-01.png"
            fill
            className="rounded-xl object-cover"
          />
        </div> */}

        {confirmedBookings.length > 0 && (
          <>
            <h2 className="mb-3 mt-6 text-xs font-bold uppercase text-gray-300">
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
        <h2 className="mb-3 mt-6 text-xs font-bold uppercase text-gray-300">
          Recomendados
        </h2>
        <div className="flex gap-4 overflow-auto [&::-webkit-scrollbar]:hidden">
          {barbershops.map((barbershop) => (
            <BarbershopItem key={barbershop.id} barbershop={barbershop} />
          ))}
        </div>

        <h2 className="mb-3 mt-6 text-xs font-bold uppercase text-gray-300">
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
