import { db } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { format } from "date-fns";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const BookingsTable = async () => {
  const session = await getServerSession(authOptions);

  if (!session?.user?.admin) {
    return <p className="text-center mt-6">Você não tem permissão.</p>;
  }

  const barbershop = await db.barberShop.findUnique({
    where: { ownerId: session.user.id },
  });

  if (!barbershop) {
    return <p className="text-center mt-6">Barbearia não encontrada.</p>;
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

  return (
    <div className="border rounded-xl p-6 mt-10">
      <h2 className="text-2xl font-bold mb-4">Agendamentos</h2>

      {bookings.length === 0 ? (
        <p className="text-gray-500">Nenhum agendamento encontrado.</p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Cliente</TableHead>
              <TableHead>Serviço</TableHead>
              <TableHead>Data</TableHead>
              <TableHead>Hora</TableHead>
              <TableHead>Duração</TableHead>
              <TableHead>Valor</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {bookings.map((booking) => (
              <TableRow key={booking.id}>
                <TableCell>{booking.user.name ?? "Usuário"}</TableCell>
                <TableCell>{booking.service.name}</TableCell>
                <TableCell>
                  {format(new Date(booking.date), "dd/MM/yyyy")}
                </TableCell>
                <TableCell>{format(new Date(booking.date), "HH:mm")}</TableCell>
                <TableCell>
                  {booking.service.duration
                    ? `${booking.service.duration} min`
                    : "—"}
                </TableCell>
                <TableCell>
                  {new Intl.NumberFormat("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  }).format(Number(booking.service.price))}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
};

export default BookingsTable;
