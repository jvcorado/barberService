import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/prisma";
import BarberAppLayout from "./components/barber-app-layout";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import {
  Star,
  ThumbsUp,
  Calendar,
  MapPin,
  Phone,
  MessageCircle,
  Clock,
  ChevronRight,
} from "lucide-react";

interface BookingWithDetails {
  id: string;
  date: Date;
  user?: {
    name?: string | null;
  };
  service?: {
    name?: string | null;
  };
}

export default async function BarberAppPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/");
  }

  const barbershop = await db.barberShop.findFirst({
    where: {
      ownerId: session.user.id,
    },
    include: {
      services: true,
    },
  });

  if (!barbershop) {
    redirect("/register");
  }

  // Buscar agendamentos separadamente
  const bookings: BookingWithDetails[] = await db.booking.findMany({
    where: {
      barberShopId: barbershop.id,
      date: {
        gte: new Date(new Date().setHours(0, 0, 0, 0)),
      },
    },
    orderBy: {
      date: "asc",
    },
    take: 10,
    include: {
      service: true,
      user: true,
    },
  });

  return (
    <BarberAppLayout barbershop={barbershop}>
      <div
        className="min-h-screen"
        style={{
          backgroundColor: (barbershop as any).backgroundColor || "#f9fafb",
          color: (barbershop as any).textColor || "#111827",
        }}
      >
        {/* Header */}
        <div
          className="border-b px-4 py-3"
          style={{
            backgroundColor: (barbershop as any).secondaryColor || "#ffffff",
            borderColor: (barbershop as any).primaryColor || "#000000",
          }}
        >
          <div className="flex items-center justify-center">
            <h1
              className="text-lg font-semibold"
              style={{
                color: (barbershop as any).primaryColor || "#000000",
              }}
            >
              {barbershop.name}
            </h1>
          </div>
        </div>

        {/* Perfil do Barbeiro */}
        <div
          className="px-4 py-6"
          style={{
            backgroundColor: (barbershop as any).secondaryColor || "#ffffff",
          }}
        >
          <div className="flex items-start gap-4">
            <div className="w-20 h-20 rounded-full overflow-hidden bg-gray-200">
              {barbershop.imageUrl ? (
                <Image
                  src={barbershop.imageUrl}
                  alt={barbershop.name}
                  width={80}
                  height={80}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-300">
                  <span className="text-gray-600 text-2xl font-bold">
                    {barbershop.name.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
            </div>

            <div className="flex-1">
              <h2 className="text-xl font-bold text-gray-900">
                {barbershop.name}
              </h2>
              <p className="text-gray-600 mb-3">{barbershop.address}</p>

              <div className="flex items-center gap-4 mb-4">
                <Button
                  size="sm"
                  variant="outline"
                  className="gap-2"
                  style={{
                    borderColor: (barbershop as any).primaryColor || "#000000",
                    color: (barbershop as any).primaryColor || "#000000",
                  }}
                >
                  <Phone className="h-4 w-4" />
                  Ligar
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="gap-2"
                  style={{
                    borderColor: (barbershop as any).primaryColor || "#000000",
                    color: (barbershop as any).primaryColor || "#000000",
                  }}
                >
                  <MessageCircle className="h-4 w-4" />
                  Mensagem
                </Button>
              </div>
            </div>
          </div>

          {/* Avaliações e Estatísticas */}
          <div className="grid grid-cols-3 gap-4 mt-6">
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <Star className="h-4 w-4 text-yellow-400 fill-current" />
                <span className="font-semibold">4.6/5</span>
              </div>
              <p className="text-sm text-gray-600">(123)</p>
            </div>

            <div className="text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <ThumbsUp className="h-4 w-4 text-green-500" />
                <span className="font-semibold">46%</span>
              </div>
              <p className="text-sm text-gray-600">Recomendado</p>
            </div>

            <div className="text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <Calendar className="h-4 w-4 text-blue-500" />
                <span className="font-semibold">{bookings.length}</span>
              </div>
              <p className="text-sm text-gray-600">Agendamentos</p>
            </div>
          </div>
        </div>

        {/* Galeria de Fotos */}
        <div
          className="mt-2 px-4 py-6"
          style={{
            backgroundColor: (barbershop as any).secondaryColor || "#ffffff",
          }}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Galeria de Fotos
            </h3>
            <Button variant="ghost" className="text-blue-600 p-0 h-auto">
              Ver mais <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>

          <div className="grid grid-cols-3 gap-3">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="aspect-square bg-gray-200 rounded-lg overflow-hidden flex items-center justify-center"
              >
                <div className="text-center">
                  <div className="w-12 h-12 bg-gray-300 rounded-full mx-auto mb-2 flex items-center justify-center">
                    <span className="text-gray-600 text-lg">📷</span>
                  </div>
                  <p className="text-sm text-gray-500">Foto {i}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Barbearia */}
        <div
          className="mt-2 px-4 py-6"
          style={{
            backgroundColor: (barbershop as any).secondaryColor || "#ffffff",
          }}
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Barbearia
          </h3>

          <div className="aspect-video bg-gray-200 rounded-lg overflow-hidden mb-4">
            {barbershop.imageUrl ? (
              <Image
                src={barbershop.imageUrl}
                alt="Barbearia"
                width={400}
                height={225}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gray-300 rounded-full mx-auto mb-3 flex items-center justify-center">
                    <span className="text-gray-600 text-2xl">🏪</span>
                  </div>
                  <p className="text-gray-600">Imagem da Barbearia</p>
                </div>
              </div>
            )}
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <Clock className="h-5 w-5 text-gray-600" />
              <span className="text-gray-900">Seg a Sáb - 9h às 18h</span>
            </div>

            <div className="flex items-center gap-3">
              <MapPin className="h-5 w-5 text-gray-600" />
              <span className="text-gray-900">{barbershop.address}</span>
            </div>

            <Button variant="outline" className="w-full gap-2">
              <MapPin className="h-4 w-4" />
              Mostrar no mapa
            </Button>
          </div>
        </div>

        {/* Avaliações */}
        <div
          className="mt-2 px-4 py-6"
          style={{
            backgroundColor: (barbershop as any).secondaryColor || "#ffffff",
          }}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Avaliações</h3>
            <Button variant="ghost" className="text-blue-600 p-0 h-auto">
              Ver todas <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>

          <div className="space-y-4">
            {bookings.slice(0, 3).map((booking) => (
              <div key={booking.id} className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                  <span className="text-sm font-medium text-gray-600">
                    {booking.user?.name?.charAt(0) || "C"}
                  </span>
                </div>

                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-gray-900">
                      {booking.user?.name || "Cliente"}
                    </span>
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <span className="text-sm text-gray-600">5/5</span>
                    </div>
                  </div>
                  <p className="text-gray-600 text-sm">Excelente serviço!</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Botão de Agendamento */}
        <div
          className="fixed bottom-0 left-0 right-0 border-t p-4"
          style={{
            backgroundColor: (barbershop as any).secondaryColor || "#ffffff",
            borderColor: (barbershop as any).primaryColor || "#000000",
          }}
        >
          <Button
            className="w-full py-3 text-lg font-semibold"
            style={{
              backgroundColor: (barbershop as any).primaryColor || "#000000",
              color: (barbershop as any).secondaryColor || "#ffffff",
            }}
          >
            Agendar Agora
          </Button>
        </div>

        {/* Espaço para o botão fixo */}
        <div className="h-20"></div>
      </div>
    </BarberAppLayout>
  );
}
