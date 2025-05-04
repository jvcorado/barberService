// app/[slug]/page.tsx
import SocialLinks from "@/components/social-links";
import { Button } from "@/components/ui/button";
import { db } from "@/lib/prisma";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  Scissors,
  MapPin,
  Phone,
  Calendar,
  Clock,
  Menu,
  Star,
  Image as Images,
} from "lucide-react";
import LinkCard from "@/components/link-card";

export default async function LinkPage({ params }: { params: { id: string } }) {
  const barbershop = await db.barberShop.findUnique({
    where: { id: params.id },
  });

  if (!barbershop) return notFound();

  return (
    <div className="container mx-auto flex flex-col items-center  py-10 h-[90vh] ">
      <header className="mb-8 text-center">
        <div className="flex items-center justify-center w-24 h-24 mx-auto mb-2 overflow-hidden border-4 rounded-full border-primary">
          <div className="flex flex-col items-center justify-center w-full h-full ">
            <Image
              src={barbershop.imageUrl}
              alt={barbershop.name}
              width={100}
              height={100}
              className="rounded-full object-cover border-2 border-primary h-28 w-28 mx-auto mb-4"
            />
          </div>
        </div>
        <h1 className="mb-1 text-3xl font-bold tracking-tight text-primary ">
          {barbershop.name}
        </h1>
        <p className="text-muted-foreground">{barbershop.description}</p>
        <SocialLinks
          facebookUrl={barbershop.facebook ?? "/"}
          tiktokUrl={barbershop.tiktok ?? "/"}
          whatsappUrl={`https://wa.me/${barbershop.phones[0].replace(/\D/g, "")}?text=Olá,%20gostaria%20de%20agendar%20um%20horário`}
          instagramUrl={barbershop.instagram ?? "/"}
        />
      </header>

      <main className="space-y-6">
        <Button
          asChild
          className="w-full py-6 text-lg font-bold bg-primary hover:opacity-90 text-secondary"
        >
          <Link
            target="_blank"
            rel="noopener noreferrer"
            href={`/barbershops/${params.id}`}
          >
            <Calendar className="mr-2" size={20} />
            Agendar Horário
          </Link>
        </Button>

        <div className="space-y-3">
          <LinkCard href="/servicos" icon={<Scissors size={20} />}>
            Nossos Serviços
          </LinkCard>

          <LinkCard href="/galeria" icon={<Images size={20} />}>
            Galeria de Cortes
          </LinkCard>

          <LinkCard
            href="https://maps.google.com"
            external
            icon={<MapPin size={20} />}
          >
            Como Chegar
          </LinkCard>

          <LinkCard href="/horarios" icon={<Clock size={20} />}>
            Horários de Funcionamento
          </LinkCard>

          <LinkCard href="/menu" icon={<Menu size={20} />}>
            Cardápio Bar
          </LinkCard>

          <LinkCard href="/avaliacoes" icon={<Star size={20} />}>
            Avaliações
          </LinkCard>

          <LinkCard
            href="tel:+5500000000000"
            external
            icon={<Phone size={20} />}
          >
            Contato
          </LinkCard>
        </div>
      </main>

      {/*   <footer className="pt-10 mt-10 text-center text-sm text-muted-foreground border-t border-muted">
        <p>
          &copy; {new Date().getFullYear()}
          {barbershop.name}
        </p>
        <p className="mt-1">Todos os direitos reservados</p>
      </footer> */}
    </div>
  );
}
