// app/[slug]/page.tsx
import { db } from "@/lib/prisma";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function LinkPage({ params }: { params: { id: string } }) {
  const barbershop = await db.barberShop.findUnique({
    where: { id: params.id },
  });

  if (!barbershop) return notFound();

  return (
    <div className="container mx-auto flex flex-col items-center  py-10 h-[90vh] ">
      <div className="text-center">
        <Image
          src={barbershop.imageUrl}
          alt={barbershop.name}
          width={100}
          height={100}
          className="rounded-full object-cover border-2 border-primary h-28 w-28 mx-auto mb-4"
        />

        <h1 className="text-3xl font-bold">{barbershop.name}</h1>
        <p>Horário de funcionamento:{/*  {barbershop.openingHours} */}</p>
      </div>

      <div className="flex flex-col gap-4 mt-10  w-full max-w-[400px]">
        <Link
          target="_blank"
          rel="noopener noreferrer"
          href={`/barbershops/${params.id}`}
          className="text-center bg-secondary h-10 text-white flex items-center justify-center  border rounded-3xl"
        >
          Agendar Horário
        </Link>

        {barbershop.phones && (
          <Link
            href={barbershop.name}
            target="_blank"
            className="text-center bg-secondary h-10 text-white flex items-center justify-center  border rounded-3xl"
            rel="noopener noreferrer"
          >
            Instagram
          </Link>
        )}

        {barbershop.name && (
          <Link
            href={barbershop.name}
            target="_blank"
            className="text-center bg-secondary h-10 text-white flex items-center justify-center  border rounded-3xl"
            rel="noopener noreferrer"
          >
            Instagram
          </Link>
        )}
        {barbershop.name && (
          <Link
            href={barbershop.name}
            target="_blank"
            className="text-center bg-secondary h-10 text-white flex items-center justify-center  border rounded-3xl"
            rel="noopener noreferrer"
          >
            Facebook
          </Link>
        )}

        {barbershop.name && (
          <Link
            href={barbershop.name}
            target="_blank"
            className="text-center bg-secondary h-10 text-white flex items-center justify-center  border rounded-3xl"
            rel="noopener noreferrer"
          >
            TikTok
          </Link>
        )}
      </div>
    </div>
  );
}
