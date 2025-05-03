import { db } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import Link from "next/link";
import ServiceItem from "@/components/service-item";
import { PlusCircleIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

const ServicesPage = async () => {
  const session = await getServerSession(authOptions);

  if (!session?.user?.admin) {
    return <p className="text-center mt-20 text-red-600">Acesso negado</p>;
  }

  const barbershop = await db.barberShop.findUnique({
    where: { ownerId: session.user.id },
  });

  if (!barbershop) {
    return <p className="text-center mt-20">Nenhuma barbearia encontrada.</p>;
  }

  const services = await db.barbershopService.findMany({
    where: {
      barberShopId: barbershop.id,
    },
  });

  return (
    <>
      <div className="space-y-3 p-5">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">Serviços cadastrados</h2>

          <Button variant={"default"} asChild>
            <Link href="/dashboard/services/new" className="">
              <PlusCircleIcon />
              <span>Criar Serviço</span>
            </Link>
          </Button>
        </div>

        {services.length === 0 ? (
          <p>Nenhum serviço cadastrado ainda.</p>
        ) : (
          <ul className="space-y-4">
            {services.map((service) => (
              <ServiceItem
                key={service.id}
                barbershop={JSON.parse(JSON.stringify(barbershop))}
                service={JSON.parse(JSON.stringify(service))}
              />
            ))}
          </ul>
        )}
      </div>
    </>
  );
};

export default ServicesPage;
