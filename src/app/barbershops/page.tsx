import BarbershopItem from "@/components/barbershop-item";
import Header from "@/components/header";
import Search from "@/components/search";
import { db } from "@/lib/prisma";

export interface BarbershopsPageProps {
  searchParams: {
    id: string;
    title: string;
    service: string;
  };
}

const BarbershopsPage = async ({ searchParams }: BarbershopsPageProps) => {
  const barbershops = await db.barberShop.findMany({
    where: {
      OR: [
        searchParams?.title
          ? {
              name: {
                contains: searchParams?.title,
                mode: "insensitive",
              },
            }
          : {},
        searchParams.service
          ? {
              services: {
                some: {
                  name: {
                    contains: searchParams.service,
                    mode: "insensitive",
                  },
                },
              },
            }
          : {},
      ],
    },
  });

  return (
    <div>
      <Header />
      <div className="my-6 px-5">
        <Search />
      </div>
      <div className="px-5">
        <h2 className="mb-3 mt-6 text-xs font-bold uppercase text-gray-400">
          Resultados para &quot;{searchParams?.title || searchParams?.service}
          &quot;
        </h2>

        {barbershops.length === 0 ? (
          <p className="text-center space-y-3">Nenhum resultado encontrado.</p>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            {barbershops.map((barbershop) => (
              <BarbershopItem key={barbershop.id} barbershop={barbershop} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BarbershopsPage;
