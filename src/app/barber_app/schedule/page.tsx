import { authOptions } from "@/lib/auth";
import { db } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import SchedulePageClient from "./components/schedule-page-client";

export default async function SchedulePage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.admin) {
    return redirect("/");
  }

  const barbershop = await db.barberShop.findUnique({
    where: { ownerId: session.user.id },
  });

  if (!barbershop) {
    return <p className="text-center mt-10">Nenhuma barbearia encontrada.</p>;
  }

  return (
    <SchedulePageClient
      barbershop={{
        id: barbershop.id,
        name: barbershop.name,
        workingDays: barbershop.workingDays || [1, 2, 3, 4, 5],
        openingTime: barbershop.openingTime || "08:00",
        closingTime: barbershop.closingTime || "18:00",
        appointmentInterval: barbershop.appointmentInterval || 30,
      }}
    />
  );
}
