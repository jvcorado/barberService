import { db } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import Link from "next/link";
import Header from "@/components/header";

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
      <Header />

      <div className="space-y-3 p-5 container mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Serviços cadastrados</h1>
          <Link
            href="/dashboard/services/new"
            className="text-blue-600 underline"
          >
            ➕ Novo serviço
          </Link>
        </div>

        {services.length === 0 ? (
          <p>Nenhum serviço cadastrado ainda.</p>
        ) : (
          <ul className="space-y-4">
            {services.map((service) => (
              <li key={service.id} className="p-4  rounded-lg shadow-sm">
                <h2 className="text-lg font-semibold">{service.name}</h2>
                <p>{service.description}</p>
                <p className="text-sm text-primary">
                  R$ {service.price.toFixed(2)}
                </p>
                <div className="mt-2 flex gap-4">
                  <Link
                    href={`/dashboard/services/${service.id}/edit`}
                    className="text-primary hover:underline"
                  >
                    ✏️ Editar
                  </Link>
                  {/* Botão de deletar será adicionado depois com ação */}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
};

export default ServicesPage;
