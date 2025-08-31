import { db } from "@/lib/prisma";
import ClientsList, { Client } from "./clients-list";

export const dynamic = "force-dynamic";

export default async function ClientsPage() {
  // buscar usuários do prisma – podem ser clientes
  const users = await db.user.findMany({
    select: {
      id: true,
      name: true,
      image: true,
    },
    orderBy: { name: "asc" },
  });

  const clients: Client[] = users.map((u) => ({
    id: u.id,
    name: u.name || "Usuário sem nome",
    avatarUrl: u.image,
    role: "receiver", // placeholder – ajustar depois
    code: u.id.slice(0, 8).toUpperCase(),
  }));

  return <ClientsList clients={clients} />;
}
